
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\TopBar\SearchIcon.svelte generated by Svelte v3.59.2 */

    const file$s = "src\\components\\TopBar\\SearchIcon.svelte";

    function create_fragment$s(ctx) {
    	let div;
    	let svg;
    	let g1;
    	let g0;
    	let path0;
    	let path1;
    	let path2;
    	let path3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			attr_dev(path0, "d", "M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z");
    			attr_dev(path0, "transform", "translate(448 544)");
    			add_location(path0, file$s, 8, 9, 302);
    			attr_dev(path1, "d", "M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z");
    			attr_dev(path1, "transform", "translate(448 544)");
    			add_location(path1, file$s, 11, 16, 505);
    			attr_dev(path2, "d", "M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z");
    			attr_dev(path2, "transform", "translate(448 544)");
    			add_location(path2, file$s, 14, 16, 822);
    			attr_dev(path3, "d", "m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z");
    			attr_dev(path3, "transform", "translate(448 544)");
    			add_location(path3, file$s, 17, 16, 1147);
    			attr_dev(g0, "fill-rule", "nonzero");
    			add_location(g0, file$s, 7, 7, 269);
    			attr_dev(g1, "fill-rule", "evenodd");
    			attr_dev(g1, "transform", "translate(-448 -544)");
    			add_location(g1, file$s, 6, 5, 205);
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "class", "x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq");
    			set_style(svg, "--color", "var(--secondary-icon)");
    			add_location(svg, file$s, 1, 2, 44);
    			attr_dev(div, "class", "flex flex-row items-center");
    			add_location(div, file$s, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, path0);
    			append_dev(g0, path1);
    			append_dev(g0, path2);
    			append_dev(g0, path3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchIcon', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchIcon> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SearchIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchIcon",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    /* src\components\TopBar\VideoPlay.svelte generated by Svelte v3.59.2 */

    const file$r = "src\\components\\TopBar\\VideoPlay.svelte";

    function create_fragment$r(ctx) {
    	let div1;
    	let a;
    	let span1;
    	let svg;
    	let path0;
    	let path1;
    	let span0;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			a = element("a");
    			span1 = element("span");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			span0 = element("span");
    			div0 = element("div");
    			attr_dev(path0, "d", "M10.996 8.132A1 1 0 0 0 9.5 9v4a1 1 0 0 0 1.496.868l3.5-2a1 1 0 0 0 0-1.736l-3.5-2z");
    			add_location(path0, file$r, 2, 582, 636);
    			attr_dev(path1, "d", "M14.573 2H9.427c-1.824 0-3.293 0-4.45.155-1.2.162-2.21.507-3.013 1.31C1.162 4.266.817 5.277.655 6.477.5 7.634.5 9.103.5 10.927v.146c0 1.824 0 3.293.155 4.45.162 1.2.507 2.21 1.31 3.012.802.803 1.813 1.148 3.013 1.31C6.134 20 7.603 20 9.427 20h5.146c1.824 0 3.293 0 4.45-.155 1.2-.162 2.21-.507 3.012-1.31.803-.802 1.148-1.813 1.31-3.013.155-1.156.155-2.625.155-4.449v-.146c0-1.824 0-3.293-.155-4.45-.162-1.2-.507-2.21-1.31-3.013-.802-.802-1.813-1.147-3.013-1.309C17.866 2 16.397 2 14.573 2zM3.38 4.879c.369-.37.887-.61 1.865-.741C6.251 4.002 7.586 4 9.5 4h5c1.914 0 3.249.002 4.256.138.978.131 1.496.372 1.865.74.37.37.61.888.742 1.866.135 1.007.137 2.342.137 4.256 0 1.914-.002 3.249-.137 4.256-.132.978-.373 1.496-.742 1.865-.369.37-.887.61-1.865.742-1.007.135-2.342.137-4.256.137h-5c-1.914 0-3.249-.002-4.256-.137-.978-.132-1.496-.373-1.865-.742-.37-.369-.61-.887-.741-1.865C2.502 14.249 2.5 12.914 2.5 11c0-1.914.002-3.249.138-4.256.131-.978.372-1.496.74-1.865zM8 21.5a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2H8z");
    			add_location(path1, file$r, 2, 683, 737);
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "class", "x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq");
    			set_style(svg, "--color", "var(--secondary-icon)");
    			add_location(svg, file$r, 2, 424, 478);
    			attr_dev(span0, "class", "x10l6tqk x11f4b5y x1v4kod4");
    			add_location(span0, file$r, 2, 1720, 1774);
    			attr_dev(span1, "class", "x1n2onr6");
    			add_location(span1, file$r, 2, 401, 455);
    			attr_dev(div0, "class", "x1ey2m1c xds687c x17qophe xg01cxk x47corl x10l6tqk x13vifvy x1ebt8du x19991ni x1dhq9h x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1wpzbip");
    			attr_dev(div0, "role", "none");
    			attr_dev(div0, "data-visualcompletion", "ignore");
    			set_style(div0, "border-radius", "8px");
    			set_style(div0, "inset", "4px 0px");
    			add_location(div0, file$r, 2, 1784, 1838);
    			attr_dev(a, "aria-label", "Video");
    			attr_dev(a, "class", "x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x78zum5 xdt5ytf x5yr21d xl56j7k x1n2onr6 xh8yej3");
    			attr_dev(a, "href", "/watch/?ref=tab");
    			attr_dev(a, "role", "link");
    			attr_dev(a, "tabindex", "0");
    			add_location(a, file$r, 2, 4, 58);
    			attr_dev(div1, "class", "hidden md:flex flex-row items-center");
    			add_location(div1, file$r, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, a);
    			append_dev(a, span1);
    			append_dev(span1, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(span1, span0);
    			append_dev(a, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VideoPlay', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VideoPlay> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class VideoPlay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VideoPlay",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* src\components\TopBar\Friends.svelte generated by Svelte v3.59.2 */

    const file$q = "src\\components\\TopBar\\Friends.svelte";

    function create_fragment$q(ctx) {
    	let div;
    	let i;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			attr_dev(i, "data-visualcompletion", "css-img");
    			attr_dev(i, "class", "");
    			set_style(i, "background-image", "url(\"https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb\")");
    			set_style(i, "background-position", "0px -304px");
    			set_style(i, "background-size", "38px 570px");
    			set_style(i, "width", "36px");
    			set_style(i, "height", "36px");
    			set_style(i, "background-repeat", "no-repeat");
    			set_style(i, "display", "inline-block");
    			add_location(i, file$q, 1, 4, 56);
    			attr_dev(div, "class", "hidden md:flex flex-row items-center");
    			add_location(div, file$q, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Friends', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Friends> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    let Friends$1 = class Friends extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Friends",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    };

    /* src\components\TopBar\Groups.svelte generated by Svelte v3.59.2 */

    const file$p = "src\\components\\TopBar\\Groups.svelte";

    function create_fragment$p(ctx) {
    	let div;
    	let i;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			attr_dev(i, "data-visualcompletion", "css-img");
    			attr_dev(i, "class", "");
    			set_style(i, "background-image", "url(\"https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb\")");
    			set_style(i, "background-position", "0px -38px");
    			set_style(i, "background-size", "38px 570px");
    			set_style(i, "width", "36px");
    			set_style(i, "height", "36px");
    			set_style(i, "background-repeat", "no-repeat");
    			set_style(i, "display", "inline-block");
    			add_location(i, file$p, 2, 4, 58);
    			attr_dev(div, "class", "hidden md:flex flex-row items-center");
    			add_location(div, file$p, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Groups', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Groups> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    let Groups$1 = class Groups extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Groups",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    };

    /* src\components\TopBar\Home.svelte generated by Svelte v3.59.2 */

    const file$o = "src\\components\\TopBar\\Home.svelte";

    function create_fragment$o(ctx) {
    	let div1;
    	let div0;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M8.99 23H7.93c-1.354 0-2.471 0-3.355-.119-.928-.125-1.747-.396-2.403-1.053-.656-.656-.928-1.475-1.053-2.403C1 18.541 1 17.425 1 16.07v-4.3c0-1.738-.002-2.947.528-4.006.53-1.06 1.497-1.784 2.888-2.826L6.65 3.263c1.114-.835 2.02-1.515 2.815-1.977C10.294.803 11.092.5 12 .5c.908 0 1.707.303 2.537.786.795.462 1.7 1.142 2.815 1.977l2.232 1.675c1.391 1.042 2.359 1.766 2.888 2.826.53 1.059.53 2.268.528 4.006v4.3c0 1.355 0 2.471-.119 3.355-.124.928-.396 1.747-1.052 2.403-.657.657-1.476.928-2.404 1.053-.884.119-2 .119-3.354.119H8.99zM7.8 4.9l-2 1.5C4.15 7.638 3.61 8.074 3.317 8.658 3.025 9.242 3 9.937 3 12v4c0 1.442.002 2.424.101 3.159.095.706.262 1.033.485 1.255.223.223.55.39 1.256.485.734.099 1.716.1 3.158.1V14.5a2.5 2.5 0 0 1 2.5-2.5h3a2.5 2.5 0 0 1 2.5 2.5V21c1.443 0 2.424-.002 3.159-.101.706-.095 1.033-.262 1.255-.485.223-.222.39-.55.485-1.256.099-.734.101-1.716.101-3.158v-4c0-2.063-.025-2.758-.317-3.342-.291-.584-.832-1.02-2.483-2.258l-2-1.5c-1.174-.881-1.987-1.489-2.67-1.886C12.87 2.63 12.425 2.5 12 2.5c-.425 0-.87.13-1.53.514-.682.397-1.495 1.005-2.67 1.886zM14 21v-6.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V21h4z");
    			add_location(path, file$o, 9, 7, 313);
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "class", "x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq");
    			set_style(svg, "--color", "var(--secondary-icon)");
    			add_location(svg, file$o, 2, 4, 103);
    			attr_dev(div0, "class", "flex flex-column items-center");
    			add_location(div0, file$o, 1, 2, 54);
    			attr_dev(div1, "class", "hidden md:flex flex-row items-center");
    			add_location(div1, file$o, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, svg);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src\components\TopBar\Marketplace.svelte generated by Svelte v3.59.2 */

    const file$n = "src\\components\\TopBar\\Marketplace.svelte";

    function create_fragment$n(ctx) {
    	let div1;
    	let a;
    	let span1;
    	let svg;
    	let path;
    	let span0;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			a = element("a");
    			span1 = element("span");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			span0 = element("span");
    			div0 = element("div");
    			attr_dev(path, "d", "M1.588 3.227A3.125 3.125 0 0 1 4.58 1h14.84c1.38 0 2.597.905 2.993 2.227l.816 2.719a6.47 6.47 0 0 1 .272 1.854A5.183 5.183 0 0 1 22 11.455v4.615c0 1.355 0 2.471-.119 3.355-.125.928-.396 1.747-1.053 2.403-.656.657-1.475.928-2.403 1.053-.884.12-2 .119-3.354.119H8.929c-1.354 0-2.47 0-3.354-.119-.928-.125-1.747-.396-2.403-1.053-.657-.656-.929-1.475-1.053-2.403-.12-.884-.119-2-.119-3.354V11.5l.001-.045A5.184 5.184 0 0 1 .5 7.8c0-.628.092-1.252.272-1.854l.816-2.719zM10 21h4v-3.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V21zm6-.002c.918-.005 1.608-.025 2.159-.099.706-.095 1.033-.262 1.255-.485.223-.222.39-.55.485-1.255.099-.735.101-1.716.101-3.159v-3.284a5.195 5.195 0 0 1-1.7.284 5.18 5.18 0 0 1-3.15-1.062A5.18 5.18 0 0 1 12 13a5.18 5.18 0 0 1-3.15-1.062A5.18 5.18 0 0 1 5.7 13a5.2 5.2 0 0 1-1.7-.284V16c0 1.442.002 2.424.1 3.159.096.706.263 1.033.486 1.255.222.223.55.39 1.255.485.551.074 1.24.094 2.159.1V17.5a2.5 2.5 0 0 1 2.5-2.5h3a2.5 2.5 0 0 1 2.5 2.5v3.498zM4.581 3c-.497 0-.935.326-1.078.802l-.815 2.72A4.45 4.45 0 0 0 2.5 7.8a3.2 3.2 0 0 0 5.6 2.117 1 1 0 0 1 1.5 0A3.19 3.19 0 0 0 12 11a3.19 3.19 0 0 0 2.4-1.083 1 1 0 0 1 1.5 0A3.2 3.2 0 0 0 21.5 7.8c0-.434-.063-.865-.188-1.28l-.816-2.72A1.125 1.125 0 0 0 19.42 3H4.58z");
    			add_location(path, file$n, 2, 598, 652);
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "class", "x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq");
    			set_style(svg, "--color", "var(--secondary-icon)");
    			add_location(svg, file$n, 2, 440, 494);
    			attr_dev(span0, "class", "x10l6tqk x11f4b5y x1v4kod4");
    			add_location(span0, file$n, 2, 1858, 1912);
    			attr_dev(span1, "class", "x1n2onr6");
    			add_location(span1, file$n, 2, 417, 471);
    			attr_dev(div0, "class", "x1ey2m1c xds687c x17qophe xg01cxk x47corl x10l6tqk x13vifvy x1ebt8du x19991ni x1dhq9h x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1wpzbip");
    			attr_dev(div0, "role", "none");
    			attr_dev(div0, "data-visualcompletion", "ignore");
    			set_style(div0, "border-radius", "8px");
    			set_style(div0, "inset", "4px 0px");
    			add_location(div0, file$n, 2, 1922, 1976);
    			attr_dev(a, "aria-label", "Marketplace");
    			attr_dev(a, "class", "x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x78zum5 xdt5ytf x5yr21d xl56j7k x1n2onr6 xh8yej3");
    			attr_dev(a, "href", "/marketplace/?ref=app_tab");
    			attr_dev(a, "role", "link");
    			attr_dev(a, "tabindex", "0");
    			add_location(a, file$n, 2, 4, 58);
    			attr_dev(div1, "class", "hidden md:flex flex-row items-center");
    			add_location(div1, file$n, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, a);
    			append_dev(a, span1);
    			append_dev(span1, svg);
    			append_dev(svg, path);
    			append_dev(span1, span0);
    			append_dev(a, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Marketplace', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Marketplace> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    let Marketplace$1 = class Marketplace extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Marketplace",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    };

    /* src\components\TopBar\MessengerIcon.svelte generated by Svelte v3.59.2 */

    const file$m = "src\\components\\TopBar\\MessengerIcon.svelte";

    function create_fragment$m(ctx) {
    	let div2;
    	let div1;
    	let svg;
    	let path;
    	let div0;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			div0 = element("div");
    			attr_dev(path, "d", "M.5 12C.5 5.649 5.649.5 12 .5S23.5 5.649 23.5 12 18.351 23.5 12 23.5c-1.922 0-3.736-.472-5.33-1.308a.63.63 0 0 0-.447-.069l-3.4.882a1.5 1.5 0 0 1-1.828-1.829l.882-3.4a.63.63 0 0 0-.07-.445A11.454 11.454 0 0 1 .5 12zm17.56-1.43a.819.819 0 0 0-1.125-1.167L14 11.499l-3.077-2.171a1.5 1.5 0 0 0-2.052.308l-2.93 3.793a.819.819 0 0 0 1.123 1.167L10 12.5l3.076 2.172a1.5 1.5 0 0 0 2.052-.308l2.931-3.793z");
    			add_location(path, file$m, 2, 536, 580);
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "class", "x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq");
    			set_style(svg, "--color", "var(--primary-icon)");
    			add_location(svg, file$m, 2, 380, 424);
    			attr_dev(div0, "class", "x1ey2m1c xds687c x17qophe xg01cxk x47corl x10l6tqk x13vifvy x1ebt8du x19991ni x1dhq9h x1wpzbip xzolkzo x12go9s9 x1rnf11y xprq8jg");
    			attr_dev(div0, "role", "none");
    			attr_dev(div0, "data-visualcompletion", "ignore");
    			set_style(div0, "inset", "0px");
    			add_location(div0, file$m, 2, 957, 1001);
    			attr_dev(div1, "aria-label", "Messenger");
    			attr_dev(div1, "class", "x1i10hfl x1ejq31n xd10rxx x1sy0etr x17r0tee x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x16tdsg8 x1hl2dhg xggy1nq x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x14yjl9h xudhj91 x18nykt9 xww2gxu x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x78zum5 xl56j7k xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x1vqgdyp x100vrsf x1qhmfi1");
    			attr_dev(div1, "role", "button");
    			attr_dev(div1, "tabindex", "0");
    			add_location(div1, file$m, 2, 4, 48);
    			attr_dev(div2, "class", "flex flex-row items-center");
    			add_location(div2, file$m, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, svg);
    			append_dev(svg, path);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MessengerIcon', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MessengerIcon> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class MessengerIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessengerIcon",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src\components\TopBar.svelte generated by Svelte v3.59.2 */
    const file$l = "src\\components\\TopBar.svelte";

    function create_fragment$l(ctx) {
    	let div2;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let span;
    	let t2;
    	let home;
    	let t3;
    	let friends;
    	let t4;
    	let videoplay;
    	let t5;
    	let marketplace;
    	let t6;
    	let groups;
    	let t7;
    	let div1;
    	let img2;
    	let img2_src_value;
    	let t8;
    	let messengericon;
    	let t9;
    	let img3;
    	let img3_src_value;
    	let t10;
    	let img4;
    	let img4_src_value;
    	let t11;
    	let div3;
    	let current;
    	home = new Home({ $$inline: true });
    	friends = new Friends$1({ $$inline: true });
    	videoplay = new VideoPlay({ $$inline: true });
    	marketplace = new Marketplace$1({ $$inline: true });
    	groups = new Groups$1({ $$inline: true });
    	messengericon = new MessengerIcon({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			img1 = element("img");
    			t1 = space();
    			span = element("span");
    			t2 = space();
    			create_component(home.$$.fragment);
    			t3 = space();
    			create_component(friends.$$.fragment);
    			t4 = space();
    			create_component(videoplay.$$.fragment);
    			t5 = space();
    			create_component(marketplace.$$.fragment);
    			t6 = space();
    			create_component(groups.$$.fragment);
    			t7 = space();
    			div1 = element("div");
    			img2 = element("img");
    			t8 = space();
    			create_component(messengericon.$$.fragment);
    			t9 = space();
    			img3 = element("img");
    			t10 = space();
    			img4 = element("img");
    			t11 = space();
    			div3 = element("div");
    			attr_dev(img0, "class", "w-7 h-7 mr-3 mt svelte-s8hjgs");
    			if (!src_url_equal(img0.src, img0_src_value = "images/logo.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			add_location(img0, file$l, 12, 4, 492);
    			attr_dev(img1, "class", "w-6 h-6 mt-2");
    			if (!src_url_equal(img1.src, img1_src_value = "images/search.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			add_location(img1, file$l, 13, 4, 558);
    			attr_dev(div0, "class", "flex flex-row ml-4");
    			add_location(div0, file$l, 11, 2, 454);
    			attr_dev(span, "class", "w-36");
    			add_location(span, file$l, 15, 2, 631);
    			if (!src_url_equal(img2.src, img2_src_value = "images/menu.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "w-6 h-6 mt-2");
    			attr_dev(img2, "alt", "");
    			add_location(img2, file$l, 22, 4, 795);
    			attr_dev(img3, "class", "w-6 h-6 mt-1.5");
    			if (!src_url_equal(img3.src, img3_src_value = "images/plus.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "");
    			add_location(img3, file$l, 24, 4, 881);
    			if (!src_url_equal(img4.src, img4_src_value = "images/mkbhg_pfpicture.jpg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "w-6 h-6 mt-2 rounded-full");
    			attr_dev(img4, "alt", "");
    			add_location(img4, file$l, 25, 4, 946);
    			attr_dev(div1, "class", "flex flex-row space-x-5 w justify-end svelte-s8hjgs");
    			add_location(div1, file$l, 21, 2, 738);
    			attr_dev(div2, "class", "topbar flex flex-row space-x-20 mt-4 z-50 svelte-s8hjgs");
    			add_location(div2, file$l, 10, 0, 395);
    			attr_dev(div3, "class", "shadow svelte-s8hjgs");
    			add_location(div3, file$l, 32, 0, 1073);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t0);
    			append_dev(div0, img1);
    			append_dev(div2, t1);
    			append_dev(div2, span);
    			append_dev(div2, t2);
    			mount_component(home, div2, null);
    			append_dev(div2, t3);
    			mount_component(friends, div2, null);
    			append_dev(div2, t4);
    			mount_component(videoplay, div2, null);
    			append_dev(div2, t5);
    			mount_component(marketplace, div2, null);
    			append_dev(div2, t6);
    			mount_component(groups, div2, null);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, img2);
    			append_dev(div1, t8);
    			mount_component(messengericon, div1, null);
    			append_dev(div1, t9);
    			append_dev(div1, img3);
    			append_dev(div1, t10);
    			append_dev(div1, img4);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div3, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			transition_in(friends.$$.fragment, local);
    			transition_in(videoplay.$$.fragment, local);
    			transition_in(marketplace.$$.fragment, local);
    			transition_in(groups.$$.fragment, local);
    			transition_in(messengericon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			transition_out(friends.$$.fragment, local);
    			transition_out(videoplay.$$.fragment, local);
    			transition_out(marketplace.$$.fragment, local);
    			transition_out(groups.$$.fragment, local);
    			transition_out(messengericon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(home);
    			destroy_component(friends);
    			destroy_component(videoplay);
    			destroy_component(marketplace);
    			destroy_component(groups);
    			destroy_component(messengericon);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopBar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SearchIcon,
    		VideoPlay,
    		Friends: Friends$1,
    		Groups: Groups$1,
    		Home,
    		Marketplace: Marketplace$1,
    		MessengerIcon
    	});

    	return [];
    }

    class TopBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopBar",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\components\SideBar\Friends.svelte generated by Svelte v3.59.2 */

    const file$k = "src\\components\\SideBar\\Friends.svelte";

    function create_fragment$k(ctx) {
    	let div;
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t = text("\r\n    Find Friends");
    			attr_dev(i, "data-visualcompletion", "css-img");
    			attr_dev(i, "class", "mr-2");
    			set_style(i, "background-image", "url(\"https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb\")");
    			set_style(i, "background-position", "0px -304px");
    			set_style(i, "background-size", "38px 570px");
    			set_style(i, "width", "36px");
    			set_style(i, "height", "36px");
    			set_style(i, "background-repeat", "no-repeat");
    			set_style(i, "display", "inline-block");
    			add_location(i, file$k, 1, 4, 33);
    			attr_dev(div, "class", "flex flex-row");
    			add_location(div, file$k, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Friends', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Friends> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Friends extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Friends",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\components\SideBar\Groups.svelte generated by Svelte v3.59.2 */

    const file$j = "src\\components\\SideBar\\Groups.svelte";

    function create_fragment$j(ctx) {
    	let div;
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t = text("\r\nGroups");
    			attr_dev(i, "data-visualcompletion", "css-img");
    			attr_dev(i, "class", "mr-2");
    			set_style(i, "background-image", "url(\"https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb\")");
    			set_style(i, "background-position", "0px -38px");
    			set_style(i, "background-size", "38px 570px");
    			set_style(i, "width", "36px");
    			set_style(i, "height", "36px");
    			set_style(i, "background-repeat", "no-repeat");
    			set_style(i, "display", "inline-block");
    			add_location(i, file$j, 1, 0, 29);
    			attr_dev(div, "class", "flex flex-row");
    			add_location(div, file$j, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Groups', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Groups> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Groups extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Groups",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\components\SideBar\Marketplace.svelte generated by Svelte v3.59.2 */

    const file$i = "src\\components\\SideBar\\Marketplace.svelte";

    function create_fragment$i(ctx) {
    	let div;
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t = text("\r\nMarketplace");
    			attr_dev(i, "data-visualcompletion", "css-img");
    			attr_dev(i, "class", "mr-2");
    			set_style(i, "background-image", "url(\"https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb\")");
    			set_style(i, "background-position", "0px -418px");
    			set_style(i, "background-size", "38px 570px");
    			set_style(i, "width", "36px");
    			set_style(i, "height", "36px");
    			set_style(i, "background-repeat", "no-repeat");
    			set_style(i, "display", "inline-block");
    			add_location(i, file$i, 1, 0, 29);
    			attr_dev(div, "class", "flex flex-row");
    			add_location(div, file$i, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Marketplace', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Marketplace> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Marketplace extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Marketplace",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\components\SideBar\Video.svelte generated by Svelte v3.59.2 */

    const file$h = "src\\components\\SideBar\\Video.svelte";

    function create_fragment$h(ctx) {
    	let div;
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t = text("\r\nVideo");
    			attr_dev(i, "data-visualcompletion", "css-img");
    			attr_dev(i, "class", "mr-2");
    			set_style(i, "background-image", "url(\"https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb\")");
    			set_style(i, "background-position", "0px -532px");
    			set_style(i, "background-size", "38px 570px");
    			set_style(i, "width", "36px");
    			set_style(i, "height", "36px");
    			set_style(i, "background-repeat", "no-repeat");
    			set_style(i, "display", "inline-block");
    			add_location(i, file$h, 1, 0, 29);
    			attr_dev(div, "class", "flex flex-row");
    			add_location(div, file$h, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Video', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Video> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Video extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Video",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\components\SideBar\Memories.svelte generated by Svelte v3.59.2 */

    const file$g = "src\\components\\SideBar\\Memories.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t = text("\r\nMemories");
    			attr_dev(i, "data-visualcompletion", "css-img");
    			attr_dev(i, "class", "mr-2");
    			set_style(i, "background-image", "url(\"https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb\")");
    			set_style(i, "background-position", "0px -456px");
    			set_style(i, "background-size", "38px 570px");
    			set_style(i, "width", "36px");
    			set_style(i, "height", "36px");
    			set_style(i, "background-repeat", "no-repeat");
    			set_style(i, "display", "inline-block");
    			add_location(i, file$g, 1, 0, 29);
    			attr_dev(div, "class", "flex flex-row");
    			add_location(div, file$g, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Memories', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Memories> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Memories extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Memories",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\components\SideBar\Saved.svelte generated by Svelte v3.59.2 */

    const file$f = "src\\components\\SideBar\\Saved.svelte";

    function create_fragment$f(ctx) {
    	let div;
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t = text("\r\nSaved");
    			attr_dev(i, "data-visualcompletion", "css-img");
    			attr_dev(i, "class", "mr-2");
    			set_style(i, "background-image", "url(\"https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb\")");
    			set_style(i, "background-position", "0px -190px");
    			set_style(i, "background-size", "38px 570px");
    			set_style(i, "width", "36px");
    			set_style(i, "height", "36px");
    			set_style(i, "background-repeat", "no-repeat");
    			set_style(i, "display", "inline-block");
    			add_location(i, file$f, 1, 0, 29);
    			attr_dev(div, "class", "flex flex-row");
    			add_location(div, file$f, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Saved', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Saved> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Saved extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Saved",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\components\SideBar\Feeds.svelte generated by Svelte v3.59.2 */

    const file$e = "src\\components\\SideBar\\Feeds.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = text("\r\n    Feeds");
    			attr_dev(img, "draggable", "false");
    			attr_dev(img, "height", "36");
    			attr_dev(img, "width", "36");
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "xz74otr mr-2");
    			attr_dev(img, "referrerpolicy", "origin-when-cross-origin");
    			if (!src_url_equal(img.src, img_src_value = "https://static.xx.fbcdn.net/rsrc.php/v3/yT/r/3dN1QwOLden.png?_nc_eui2=AeHMBN_307Bi0vChBjJzVhbe9As6vsZg84r0Czq-xmDzisA2WZRuYB7QKF2ihQaPofdCKrhSRGJwWXW7W6whIcPP")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$e, 1, 4, 46);
    			attr_dev(div, "class", "flex flex-row items-center");
    			add_location(div, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Feeds', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Feeds> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Feeds extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Feeds",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\components\SideBar\Events.svelte generated by Svelte v3.59.2 */

    const file$d = "src\\components\\SideBar\\Events.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t = text("\r\nEvents");
    			attr_dev(i, "data-visualcompletion", "css-img");
    			attr_dev(i, "class", "mr-2");
    			set_style(i, "background-image", "url(\"https://static.xx.fbcdn.net/rsrc.php/v3/yH/r/vWSUA-u7jLw.png?_nc_eui2=AeH8i-pgbHa0qrPk1wTaP86kqH6dSHmssQ2ofp1IeayxDSn8TheBjYfrYrgKjORtCyy7KjwJ717WKbqTduj6OI9u\")");
    			set_style(i, "background-position", "0px -38px");
    			set_style(i, "background-size", "38px 76px");
    			set_style(i, "width", "36px");
    			set_style(i, "height", "36px");
    			set_style(i, "background-repeat", "no-repeat");
    			set_style(i, "display", "inline-block");
    			add_location(i, file$d, 1, 4, 46);
    			attr_dev(div, "class", "flex flex-row items-center");
    			add_location(div, file$d, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Events', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Events> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Events extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Events",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\components\SideBar\AdsManager.svelte generated by Svelte v3.59.2 */

    const file$c = "src\\components\\SideBar\\AdsManager.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = text("\r\n    Ads Manager");
    			attr_dev(img, "draggable", "false");
    			attr_dev(img, "height", "36");
    			attr_dev(img, "width", "36");
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "xz74otr mr-2");
    			attr_dev(img, "referrerpolicy", "origin-when-cross-origin");
    			if (!src_url_equal(img.src, img_src_value = "https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/tx2VFwUKc-K.png?_nc_eui2=AeGvOUsA83sp_Ji1OV3bygbXql6KcToA1eWqXopxOgDV5UrryaOatN57v7veaHR3u8n6tX3voUMOSNQwuHJ-Bo7P")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$c, 1, 4, 33);
    			attr_dev(div, "class", "flex flex-row");
    			add_location(div, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AdsManager', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AdsManager> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class AdsManager extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AdsManager",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\components\SideBar\CrisisResponce.svelte generated by Svelte v3.59.2 */

    const file$b = "src\\components\\SideBar\\CrisisResponce.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = text("\r\n    Crisis Response");
    			attr_dev(img, "draggable", "false");
    			attr_dev(img, "height", "36");
    			attr_dev(img, "width", "36");
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "xz74otr mr-2");
    			attr_dev(img, "referrerpolicy", "origin-when-cross-origin");
    			if (!src_url_equal(img.src, img_src_value = "https://static.xx.fbcdn.net/rsrc.php/v3/yi/r/eChFgZ345zp.png?_nc_eui2=AeE9N-KWHhS--qwEAyokrWNwNHvznuQKK_U0e_Oe5Aor9fGD_uz65-6OiN-Vh1oKBsNzHWVodsulsfY3y9X3_9JW")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$b, 1, 4, 47);
    			attr_dev(div, "class", "flex flex-row items-center ");
    			add_location(div, file$b, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CrisisResponce', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CrisisResponce> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class CrisisResponce extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CrisisResponce",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\SideBar\SeeMore.svelte generated by Svelte v3.59.2 */

    const file$a = "src\\components\\SideBar\\SeeMore.svelte";

    function create_fragment$a(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let svg;
    	let g;
    	let path;
    	let t;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path = svg_element("path");
    			t = text("\r\n  See More");
    			attr_dev(path, "fill-rule", "nonzero");
    			attr_dev(path, "d", "M452.707 549.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L456 552.586l-3.293-3.293z");
    			add_location(path, file$a, 14, 11, 547);
    			attr_dev(g, "fill-rule", "evenodd");
    			attr_dev(g, "transform", "translate(-448 -544)");
    			add_location(g, file$a, 13, 9, 479);
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "class", "x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq");
    			set_style(svg, "--color", "var(--primary-icon)");
    			add_location(svg, file$a, 5, 6, 229);
    			attr_dev(div0, "class", "x14yjl9h xudhj91 x18nykt9 xww2gxu x6s0dn4 x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x3nfvp2 xl56j7k x1n2onr6 x1qhmfi1 xc9qbxq x14qfxbe");
    			add_location(div0, file$a, 2, 4, 62);
    			attr_dev(div1, "class", "ml-2.5 mr-2");
    			add_location(div1, file$a, 1, 2, 31);
    			attr_dev(div2, "class", "flex flex-row");
    			add_location(div2, file$a, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, svg);
    			append_dev(svg, g);
    			append_dev(g, path);
    			append_dev(div2, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SeeMore', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SeeMore> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SeeMore extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SeeMore",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\SideBar.svelte generated by Svelte v3.59.2 */
    const file$9 = "src\\components\\SideBar.svelte";

    function create_fragment$9(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let t1;
    	let friends;
    	let t2;
    	let memories;
    	let t3;
    	let saved;
    	let t4;
    	let feeds;
    	let t5;
    	let groups;
    	let t6;
    	let videoplay;
    	let t7;
    	let marketplace;
    	let t8;
    	let events;
    	let t9;
    	let adsmanager;
    	let t10;
    	let crisisresponce;
    	let t11;
    	let seemore;
    	let current;
    	friends = new Friends({ $$inline: true });
    	memories = new Memories({ $$inline: true });
    	saved = new Saved({ $$inline: true });
    	feeds = new Feeds({ $$inline: true });
    	groups = new Groups({ $$inline: true });
    	videoplay = new Video({ $$inline: true });
    	marketplace = new Marketplace({ $$inline: true });
    	events = new Events({ $$inline: true });
    	adsmanager = new AdsManager({ $$inline: true });
    	crisisresponce = new CrisisResponce({ $$inline: true });
    	seemore = new SeeMore({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = text("\r\n  Marques Brownlee");
    			t1 = space();
    			create_component(friends.$$.fragment);
    			t2 = space();
    			create_component(memories.$$.fragment);
    			t3 = space();
    			create_component(saved.$$.fragment);
    			t4 = space();
    			create_component(feeds.$$.fragment);
    			t5 = space();
    			create_component(groups.$$.fragment);
    			t6 = space();
    			create_component(videoplay.$$.fragment);
    			t7 = space();
    			create_component(marketplace.$$.fragment);
    			t8 = space();
    			create_component(events.$$.fragment);
    			t9 = space();
    			create_component(adsmanager.$$.fragment);
    			t10 = space();
    			create_component(crisisresponce.$$.fragment);
    			t11 = space();
    			create_component(seemore.$$.fragment);
    			attr_dev(img, "class", "w-7 rounded-full ml-1.5 mr-2");
    			if (!src_url_equal(img.src, img_src_value = "images/mkbhg_pfpicture.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$9, 15, 2, 715);
    			attr_dev(div0, "class", "flex flex-row mt-8");
    			add_location(div0, file$9, 14, 2, 679);
    			attr_dev(div1, "class", "hidden lg:flex sidebar flex-col space-y-2.5 pl-3 w-72 z-0 mt svelte-1kekyfu");
    			add_location(div1, file$9, 13, 0, 599);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			mount_component(friends, div1, null);
    			append_dev(div1, t2);
    			mount_component(memories, div1, null);
    			append_dev(div1, t3);
    			mount_component(saved, div1, null);
    			append_dev(div1, t4);
    			mount_component(feeds, div1, null);
    			append_dev(div1, t5);
    			mount_component(groups, div1, null);
    			append_dev(div1, t6);
    			mount_component(videoplay, div1, null);
    			append_dev(div1, t7);
    			mount_component(marketplace, div1, null);
    			append_dev(div1, t8);
    			mount_component(events, div1, null);
    			append_dev(div1, t9);
    			mount_component(adsmanager, div1, null);
    			append_dev(div1, t10);
    			mount_component(crisisresponce, div1, null);
    			append_dev(div1, t11);
    			mount_component(seemore, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(friends.$$.fragment, local);
    			transition_in(memories.$$.fragment, local);
    			transition_in(saved.$$.fragment, local);
    			transition_in(feeds.$$.fragment, local);
    			transition_in(groups.$$.fragment, local);
    			transition_in(videoplay.$$.fragment, local);
    			transition_in(marketplace.$$.fragment, local);
    			transition_in(events.$$.fragment, local);
    			transition_in(adsmanager.$$.fragment, local);
    			transition_in(crisisresponce.$$.fragment, local);
    			transition_in(seemore.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(friends.$$.fragment, local);
    			transition_out(memories.$$.fragment, local);
    			transition_out(saved.$$.fragment, local);
    			transition_out(feeds.$$.fragment, local);
    			transition_out(groups.$$.fragment, local);
    			transition_out(videoplay.$$.fragment, local);
    			transition_out(marketplace.$$.fragment, local);
    			transition_out(events.$$.fragment, local);
    			transition_out(adsmanager.$$.fragment, local);
    			transition_out(crisisresponce.$$.fragment, local);
    			transition_out(seemore.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(friends);
    			destroy_component(memories);
    			destroy_component(saved);
    			destroy_component(feeds);
    			destroy_component(groups);
    			destroy_component(videoplay);
    			destroy_component(marketplace);
    			destroy_component(events);
    			destroy_component(adsmanager);
    			destroy_component(crisisresponce);
    			destroy_component(seemore);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SideBar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SideBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Friends,
    		Groups,
    		Marketplace,
    		VideoPlay: Video,
    		Memories,
    		Saved,
    		Feeds,
    		Events,
    		AdsManager,
    		CrisisResponce,
    		SeeMore
    	});

    	return [];
    }

    class SideBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideBar",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\PlusIcon.svelte generated by Svelte v3.59.2 */

    const file$8 = "src\\components\\PlusIcon.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M18 11h-5V6a1 1 0 0 0-2 0v5H6a1 1 0 0 0 0 2h5v5a1 1 0 0 0 2 0v-5h5a1 1 0 0 0 0-2z");
    			add_location(path, file$8, 1, 173, 195);
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "class", "x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq");
    			set_style(svg, "--color", "var(--accent)");
    			add_location(svg, file$8, 1, 4, 26);
    			attr_dev(div, "class", "w ml-4");
    			add_location(div, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlusIcon', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlusIcon> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class PlusIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlusIcon",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\CreateStory.svelte generated by Svelte v3.59.2 */
    const file$7 = "src\\components\\CreateStory.svelte";

    function create_fragment$7(ctx) {
    	let div1;
    	let plusicon;
    	let t0;
    	let div0;
    	let span0;
    	let t2;
    	let span1;
    	let current;
    	plusicon = new PlusIcon({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(plusicon.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "Create Story";
    			t2 = space();
    			span1 = element("span");
    			span1.textContent = "Share a photo or write something.";
    			attr_dev(span0, "class", "d font-bold");
    			add_location(span0, file$7, 7, 4, 218);
    			attr_dev(span1, "class", "font-light");
    			add_location(span1, file$7, 8, 4, 269);
    			attr_dev(div0, "class", "flex flex-col");
    			add_location(div0, file$7, 6, 2, 185);
    			attr_dev(div1, "class", "md:w-rem40 w create_story flex flex-row items-center mt space-x-5 border rounded-md svelte-voibo7");
    			add_location(div1, file$7, 4, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(plusicon, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t2);
    			append_dev(div0, span1);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(plusicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(plusicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(plusicon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CreateStory', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CreateStory> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ PlusIcon });
    	return [];
    }

    class CreateStory extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CreateStory",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\Status.svelte generated by Svelte v3.59.2 */

    const file$6 = "src\\components\\Status.svelte";

    function create_fragment$6(ctx) {
    	let div8;
    	let div7;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div0;
    	let t2;
    	let div2;
    	let t3;
    	let div6;
    	let div3;
    	let img1;
    	let img1_src_value;
    	let t4;
    	let t5;
    	let div4;
    	let img2;
    	let img2_src_value;
    	let t6;
    	let t7;
    	let div5;
    	let img3;
    	let img3_src_value;
    	let t8;

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div7 = element("div");
    			div1 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "What's on you mind, Marques?";
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div6 = element("div");
    			div3 = element("div");
    			img1 = element("img");
    			t4 = text("\r\n        Live Video");
    			t5 = space();
    			div4 = element("div");
    			img2 = element("img");
    			t6 = text("\r\n        Photo/Video");
    			t7 = space();
    			div5 = element("div");
    			img3 = element("img");
    			t8 = text("\r\n        Feeling/Activity");
    			attr_dev(img0, "class", "profile-pic rounded-full ml-1.5 mr-2 h-9 w-7 mt-0.5 svelte-xjox92");
    			if (!src_url_equal(img0.src, img0_src_value = "images/mkbhg_pfpicture.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			add_location(img0, file$6, 9, 6, 195);
    			attr_dev(div0, "class", "flex flex-col justify-center on-mind rounded-full svelte-xjox92");
    			add_location(div0, file$6, 14, 6, 344);
    			attr_dev(div1, "class", "flex flex-row");
    			add_location(div1, file$6, 8, 4, 160);
    			attr_dev(div2, "class", "separator svelte-xjox92");
    			add_location(div2, file$6, 18, 4, 478);
    			attr_dev(img1, "class", "w-6 h-6 mr-3");
    			if (!src_url_equal(img1.src, img1_src_value = "images/live.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			add_location(img1, file$6, 21, 8, 602);
    			attr_dev(div3, "class", "flex flex-row");
    			add_location(div3, file$6, 20, 6, 565);
    			attr_dev(img2, "class", "w-6 h-6 mr-3");
    			if (!src_url_equal(img2.src, img2_src_value = "images/photo_video.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "");
    			add_location(img2, file$6, 25, 8, 738);
    			attr_dev(div4, "class", "flex flex-row");
    			add_location(div4, file$6, 24, 6, 701);
    			attr_dev(img3, "class", "w-6 h-6 mr-3");
    			if (!src_url_equal(img3.src, img3_src_value = "images/feeling.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "");
    			add_location(img3, file$6, 29, 8, 882);
    			attr_dev(div5, "class", "flex flex-row");
    			add_location(div5, file$6, 28, 6, 845);
    			attr_dev(div6, "class", "flex flex-row ml-1.5 space-x-8");
    			add_location(div6, file$6, 19, 4, 513);
    			attr_dev(div7, "class", "status ml-20 flex flex-col mt-4 border rounded-md space-y-3 pt-3 pl-4 pb-2 svelte-xjox92");
    			add_location(div7, file$6, 4, 2, 54);
    			attr_dev(div8, "class", "flex flex-row");
    			add_location(div8, file$6, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div7);
    			append_dev(div7, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div7, t2);
    			append_dev(div7, div2);
    			append_dev(div7, t3);
    			append_dev(div7, div6);
    			append_dev(div6, div3);
    			append_dev(div3, img1);
    			append_dev(div3, t4);
    			append_dev(div6, t5);
    			append_dev(div6, div4);
    			append_dev(div4, img2);
    			append_dev(div4, t6);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div5, img3);
    			append_dev(div5, t8);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Status', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Status> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Status extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Status",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\LikdIcon.svelte generated by Svelte v3.59.2 */

    const file$5 = "src\\components\\LikdIcon.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			attr_dev(img, "class", "x16dsc37");
    			attr_dev(img, "height", "18");
    			attr_dev(img, "role", "presentation");
    			if (!src_url_equal(img.src, img_src_value = "data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint2_radial_15251_63610)' fill-opacity='.5'/%3E%3Cpath d='M7.3014 3.8662a.6974.6974 0 0 1 .6974-.6977c.6742 0 1.2207.5465 1.2207 1.2206v1.7464a.101.101 0 0 0 .101.101h1.7953c.992 0 1.7232.9273 1.4917 1.892l-.4572 1.9047a2.301 2.301 0 0 1-2.2374 1.764H6.9185a.5752.5752 0 0 1-.5752-.5752V7.7384c0-.4168.097-.8278.2834-1.2005l.2856-.5712a3.6878 3.6878 0 0 0 .3893-1.6509l-.0002-.4496ZM4.367 7a.767.767 0 0 0-.7669.767v3.2598a.767.767 0 0 0 .767.767h.767a.3835.3835 0 0 0 .3835-.3835V7.3835A.3835.3835 0 0 0 5.134 7h-.767Z' fill='%23fff'/%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(90 .0005 8) scale(7.99958)'%3E%3Cstop offset='.5618' stop-color='%230866FF' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%230866FF' stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient id='paint2_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(45 -4.5257 10.9237) scale(10.1818)'%3E%3Cstop offset='.3143' stop-color='%2302ADFC'/%3E%3Cstop offset='1' stop-color='%2302ADFC' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.3989' y1='2.3999' x2='13.5983' y2='13.5993' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2302ADFC'/%3E%3Cstop offset='.5' stop-color='%230866FF'/%3E%3Cstop offset='1' stop-color='%232B7EFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "18");
    			add_location(img, file$5, 4, 4, 78);
    			attr_dev(div, "class", div_class_value = "" + /*class_*/ ctx[0] + " ml-2" + " svelte-1gjdw0p");
    			add_location(div, file$5, 3, 0, 44);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*class_*/ 1 && div_class_value !== (div_class_value = "" + /*class_*/ ctx[0] + " ml-2" + " svelte-1gjdw0p")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LikdIcon', slots, []);
    	let { class_ } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (class_ === undefined && !('class_' in $$props || $$self.$$.bound[$$self.$$.props['class_']])) {
    			console.warn("<LikdIcon> was created without expected prop 'class_'");
    		}
    	});

    	const writable_props = ['class_'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LikdIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class_' in $$props) $$invalidate(0, class_ = $$props.class_);
    	};

    	$$self.$capture_state = () => ({ class_ });

    	$$self.$inject_state = $$props => {
    		if ('class_' in $$props) $$invalidate(0, class_ = $$props.class_);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [class_];
    }

    class LikdIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { class_: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LikdIcon",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get class_() {
    		throw new Error("<LikdIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class_(value) {
    		throw new Error("<LikdIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\MessagesIcon.svelte generated by Svelte v3.59.2 */

    const file$4 = "src\\components\\MessagesIcon.svelte";

    function create_fragment$4(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "data-visualcompletion", "css-img");
    			attr_dev(i, "class", "x1b0d499 x1d69dk1");
    			set_style(i, "background-image", "url(\"https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/hskDM76yLzF.png?_nc_eui2=AeEihYC8LOfUi3d8xmA7b-WGTZMbXvHMA9tNkxte8cwD2xSrvya0nRszYAaMZDnq1BpdxkIdGCVAFc3n-drvqQok\")");
    			set_style(i, "background-position", "0px -1478px");
    			set_style(i, "background-size", "26px 1556px");
    			set_style(i, "width", "16px");
    			set_style(i, "height", "16px");
    			set_style(i, "background-repeat", "no-repeat");
    			set_style(i, "display", "inline-block");
    			add_location(i, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MessagesIcon', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MessagesIcon> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class MessagesIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessagesIcon",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\ShareIcon.svelte generated by Svelte v3.59.2 */

    const file$3 = "src\\components\\ShareIcon.svelte";

    function create_fragment$3(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "data-visualcompletion", "css-img");
    			attr_dev(i, "class", "x1b0d499 x1d69dk1");
    			set_style(i, "background-image", "url(\"https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/hskDM76yLzF.png?_nc_eui2=AeEihYC8LOfUi3d8xmA7b-WGTZMbXvHMA9tNkxte8cwD2xSrvya0nRszYAaMZDnq1BpdxkIdGCVAFc3n-drvqQok\")");
    			set_style(i, "background-position", "0px -1496px");
    			set_style(i, "background-size", "26px 1556px");
    			set_style(i, "width", "16px");
    			set_style(i, "height", "16px");
    			set_style(i, "background-repeat", "no-repeat");
    			set_style(i, "display", "inline-block");
    			add_location(i, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ShareIcon', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ShareIcon> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class ShareIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ShareIcon",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\post.svelte generated by Svelte v3.59.2 */
    const file$2 = "src\\components\\post.svelte";

    function create_fragment$2(ctx) {
    	let div10;
    	let div3;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div2;
    	let div0;
    	let span0;
    	let t2;
    	let span1;
    	let t4;
    	let span2;
    	let t6;
    	let div1;
    	let span3;
    	let t8;
    	let span4;
    	let t10;
    	let span5;
    	let t12;
    	let span6;
    	let t14;
    	let span7;
    	let t16;
    	let div4;
    	let span8;
    	let t18;
    	let img1;
    	let img1_src_value;
    	let t19;
    	let div7;
    	let div5;
    	let likeicon;
    	let t20;
    	let span9;
    	let t22;
    	let div6;
    	let span10;
    	let t24;
    	let messagesicon;
    	let t25;
    	let span11;
    	let t27;
    	let shareicon;
    	let t28;
    	let div8;
    	let t29;
    	let div9;
    	let img2;
    	let img2_src_value;
    	let t30;
    	let img3;
    	let img3_src_value;
    	let t31;
    	let img4;
    	let img4_src_value;
    	let current;
    	likeicon = new LikdIcon({ props: { class_: "" }, $$inline: true });
    	messagesicon = new MessagesIcon({ $$inline: true });
    	shareicon = new ShareIcon({ $$inline: true });

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div3 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "MARQUES BROWNLEE";
    			t2 = space();
    			span1 = element("span");
    			span1.textContent = "·";
    			t4 = space();
    			span2 = element("span");
    			span2.textContent = "Join";
    			t6 = space();
    			div1 = element("div");
    			span3 = element("span");
    			span3.textContent = "Suggest for you";
    			t8 = space();
    			span4 = element("span");
    			span4.textContent = "·";
    			t10 = space();
    			span5 = element("span");
    			span5.textContent = "John Doe";
    			t12 = space();
    			span6 = element("span");
    			span6.textContent = "·";
    			t14 = space();
    			span7 = element("span");
    			span7.textContent = "6 February at 15:54";
    			t16 = space();
    			div4 = element("div");
    			span8 = element("span");
    			span8.textContent = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat minima\r\n      libero reiciendis enim fugit! Autem quaerat.";
    			t18 = space();
    			img1 = element("img");
    			t19 = space();
    			div7 = element("div");
    			div5 = element("div");
    			create_component(likeicon.$$.fragment);
    			t20 = space();
    			span9 = element("span");
    			span9.textContent = "2.7K";
    			t22 = space();
    			div6 = element("div");
    			span10 = element("span");
    			span10.textContent = "1.1K";
    			t24 = space();
    			create_component(messagesicon.$$.fragment);
    			t25 = space();
    			span11 = element("span");
    			span11.textContent = "8";
    			t27 = space();
    			create_component(shareicon.$$.fragment);
    			t28 = space();
    			div8 = element("div");
    			t29 = space();
    			div9 = element("div");
    			img2 = element("img");
    			t30 = space();
    			img3 = element("img");
    			t31 = space();
    			img4 = element("img");
    			attr_dev(img0, "class", "w-12 h-12 rounded-md");
    			if (!src_url_equal(img0.src, img0_src_value = "images/mkbhg_pfpicture.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			add_location(img0, file$2, 15, 4, 465);
    			add_location(span0, file$2, 18, 8, 634);
    			add_location(span1, file$2, 19, 8, 675);
    			attr_dev(span2, "class", "text-blue-600");
    			add_location(span2, file$2, 20, 8, 699);
    			attr_dev(div0, "class", "flex flex-row space-x-1");
    			add_location(div0, file$2, 17, 6, 587);
    			attr_dev(span3, "class", "font-light");
    			add_location(span3, file$2, 23, 8, 807);
    			attr_dev(span4, "class", "font-light");
    			add_location(span4, file$2, 24, 8, 864);
    			attr_dev(span5, "class", "font-light");
    			add_location(span5, file$2, 25, 8, 907);
    			attr_dev(span6, "class", "font-light");
    			add_location(span6, file$2, 26, 8, 957);
    			attr_dev(span7, "class", "font-light");
    			add_location(span7, file$2, 27, 8, 1000);
    			attr_dev(div1, "class", "flex flex-row space-x-1");
    			add_location(div1, file$2, 22, 6, 760);
    			attr_dev(div2, "class", "flex flex-col ml-4");
    			add_location(div2, file$2, 16, 4, 547);
    			attr_dev(div3, "class", "flex flex-row max-w ml-4 mt-4 svelte-143o6bk");
    			add_location(div3, file$2, 14, 2, 416);
    			add_location(span8, file$2, 32, 4, 1146);
    			attr_dev(div4, "class", "flex flex-row max-w mt-4 mb-5 ml-4 svelte-143o6bk");
    			add_location(div4, file$2, 31, 2, 1092);
    			attr_dev(img1, "class", "image_post svelte-143o6bk");
    			if (!src_url_equal(img1.src, img1_src_value = "images/image-1.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			add_location(img1, file$2, 37, 2, 1311);
    			attr_dev(span9, "class", "-mt-1 ml-2");
    			add_location(span9, file$2, 41, 6, 1491);
    			attr_dev(div5, "class", "flex flex-row liked-icon-div svelte-143o6bk");
    			add_location(div5, file$2, 39, 4, 1411);
    			attr_dev(span10, "class", "-mt-1");
    			add_location(span10, file$2, 44, 6, 1590);
    			attr_dev(span11, "class", "ml-4 -mt-1");
    			add_location(span11, file$2, 46, 6, 1653);
    			attr_dev(div6, "class", "flex flex-row space-x-3");
    			add_location(div6, file$2, 43, 4, 1545);
    			attr_dev(div7, "class", "flex flex-row mt-3");
    			add_location(div7, file$2, 38, 2, 1373);
    			attr_dev(div8, "class", "separator svelte-143o6bk");
    			add_location(div8, file$2, 50, 2, 1733);
    			attr_dev(img2, "class", "w-7");
    			if (!src_url_equal(img2.src, img2_src_value = "images/like.png")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file$2, 52, 4, 1820);
    			attr_dev(img3, "class", "w-7");
    			if (!src_url_equal(img3.src, img3_src_value = "images/chat.png")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file$2, 53, 4, 1866);
    			attr_dev(img4, "class", "w-7");
    			if (!src_url_equal(img4.src, img4_src_value = "images/forward.png")) attr_dev(img4, "src", img4_src_value);
    			add_location(img4, file$2, 54, 4, 1916);
    			attr_dev(div9, "class", "flex flex-row space-x-40 ml-8 mb-4");
    			add_location(div9, file$2, 51, 2, 1766);
    			attr_dev(div10, "class", "post-container flex flex-col mt-10 ml-20 rounded-md svelte-143o6bk");
    			add_location(div10, file$2, 13, 0, 347);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div3);
    			append_dev(div3, img0);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t2);
    			append_dev(div0, span1);
    			append_dev(div0, t4);
    			append_dev(div0, span2);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div1, span3);
    			append_dev(div1, t8);
    			append_dev(div1, span4);
    			append_dev(div1, t10);
    			append_dev(div1, span5);
    			append_dev(div1, t12);
    			append_dev(div1, span6);
    			append_dev(div1, t14);
    			append_dev(div1, span7);
    			append_dev(div10, t16);
    			append_dev(div10, div4);
    			append_dev(div4, span8);
    			append_dev(div10, t18);
    			append_dev(div10, img1);
    			append_dev(div10, t19);
    			append_dev(div10, div7);
    			append_dev(div7, div5);
    			mount_component(likeicon, div5, null);
    			append_dev(div5, t20);
    			append_dev(div5, span9);
    			append_dev(div7, t22);
    			append_dev(div7, div6);
    			append_dev(div6, span10);
    			append_dev(div6, t24);
    			mount_component(messagesicon, div6, null);
    			append_dev(div6, t25);
    			append_dev(div6, span11);
    			append_dev(div6, t27);
    			mount_component(shareicon, div6, null);
    			append_dev(div10, t28);
    			append_dev(div10, div8);
    			append_dev(div10, t29);
    			append_dev(div10, div9);
    			append_dev(div9, img2);
    			append_dev(div9, t30);
    			append_dev(div9, img3);
    			append_dev(div9, t31);
    			append_dev(div9, img4);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(likeicon.$$.fragment, local);
    			transition_in(messagesicon.$$.fragment, local);
    			transition_in(shareicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(likeicon.$$.fragment, local);
    			transition_out(messagesicon.$$.fragment, local);
    			transition_out(shareicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_component(likeicon);
    			destroy_component(messagesicon);
    			destroy_component(shareicon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Post', slots, []);
    	let { user_profile } = $$props;
    	let { user_name } = $$props;
    	let { message_post } = $$props;
    	let { image_post } = $$props;
    	let { likes } = $$props;
    	let { comments = [] } = $$props;
    	let { shares } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (user_profile === undefined && !('user_profile' in $$props || $$self.$$.bound[$$self.$$.props['user_profile']])) {
    			console.warn("<Post> was created without expected prop 'user_profile'");
    		}

    		if (user_name === undefined && !('user_name' in $$props || $$self.$$.bound[$$self.$$.props['user_name']])) {
    			console.warn("<Post> was created without expected prop 'user_name'");
    		}

    		if (message_post === undefined && !('message_post' in $$props || $$self.$$.bound[$$self.$$.props['message_post']])) {
    			console.warn("<Post> was created without expected prop 'message_post'");
    		}

    		if (image_post === undefined && !('image_post' in $$props || $$self.$$.bound[$$self.$$.props['image_post']])) {
    			console.warn("<Post> was created without expected prop 'image_post'");
    		}

    		if (likes === undefined && !('likes' in $$props || $$self.$$.bound[$$self.$$.props['likes']])) {
    			console.warn("<Post> was created without expected prop 'likes'");
    		}

    		if (shares === undefined && !('shares' in $$props || $$self.$$.bound[$$self.$$.props['shares']])) {
    			console.warn("<Post> was created without expected prop 'shares'");
    		}
    	});

    	const writable_props = [
    		'user_profile',
    		'user_name',
    		'message_post',
    		'image_post',
    		'likes',
    		'comments',
    		'shares'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Post> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('user_profile' in $$props) $$invalidate(0, user_profile = $$props.user_profile);
    		if ('user_name' in $$props) $$invalidate(1, user_name = $$props.user_name);
    		if ('message_post' in $$props) $$invalidate(2, message_post = $$props.message_post);
    		if ('image_post' in $$props) $$invalidate(3, image_post = $$props.image_post);
    		if ('likes' in $$props) $$invalidate(4, likes = $$props.likes);
    		if ('comments' in $$props) $$invalidate(5, comments = $$props.comments);
    		if ('shares' in $$props) $$invalidate(6, shares = $$props.shares);
    	};

    	$$self.$capture_state = () => ({
    		LikeIcon: LikdIcon,
    		MessagesIcon,
    		ShareIcon,
    		user_profile,
    		user_name,
    		message_post,
    		image_post,
    		likes,
    		comments,
    		shares
    	});

    	$$self.$inject_state = $$props => {
    		if ('user_profile' in $$props) $$invalidate(0, user_profile = $$props.user_profile);
    		if ('user_name' in $$props) $$invalidate(1, user_name = $$props.user_name);
    		if ('message_post' in $$props) $$invalidate(2, message_post = $$props.message_post);
    		if ('image_post' in $$props) $$invalidate(3, image_post = $$props.image_post);
    		if ('likes' in $$props) $$invalidate(4, likes = $$props.likes);
    		if ('comments' in $$props) $$invalidate(5, comments = $$props.comments);
    		if ('shares' in $$props) $$invalidate(6, shares = $$props.shares);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [user_profile, user_name, message_post, image_post, likes, comments, shares];
    }

    class Post extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			user_profile: 0,
    			user_name: 1,
    			message_post: 2,
    			image_post: 3,
    			likes: 4,
    			comments: 5,
    			shares: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Post",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get user_profile() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set user_profile(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get user_name() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set user_name(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message_post() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message_post(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image_post() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image_post(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get likes() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set likes(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get comments() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set comments(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shares() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shares(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\SponseredContent.svelte generated by Svelte v3.59.2 */

    const file$1 = "src\\components\\SponseredContent.svelte";

    function create_fragment$1(ctx) {
    	let div7;
    	let h3;
    	let t1;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let div0;
    	let h10;
    	let t4;
    	let span0;
    	let t6;
    	let div3;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let div2;
    	let h11;
    	let t9;
    	let span1;
    	let t11;
    	let div4;
    	let t12;
    	let div6;
    	let h2;
    	let t14;
    	let div5;
    	let img2;
    	let img2_src_value;
    	let t15;
    	let span2;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Sponsered";
    			t1 = space();
    			div1 = element("div");
    			img0 = element("img");
    			t2 = space();
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Best shoes from Bungoma";
    			t4 = space();
    			span0 = element("span");
    			span0.textContent = "shoesfrombungoma.com";
    			t6 = space();
    			div3 = element("div");
    			img1 = element("img");
    			t7 = space();
    			div2 = element("div");
    			h11 = element("h1");
    			h11.textContent = "VLC player now 50% off";
    			t9 = space();
    			span1 = element("span");
    			span1.textContent = "vlc.com";
    			t11 = space();
    			div4 = element("div");
    			t12 = space();
    			div6 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Group conversations";
    			t14 = space();
    			div5 = element("div");
    			img2 = element("img");
    			t15 = space();
    			span2 = element("span");
    			span2.textContent = "Create New Group";
    			add_location(h3, file$1, 4, 2, 58);
    			attr_dev(img0, "class", "rounded-md w-16 h-16");
    			if (!src_url_equal(img0.src, img0_src_value = "images/shoe_pic.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			add_location(img0, file$1, 7, 4, 120);
    			attr_dev(h10, "class", "text-md");
    			add_location(h10, file$1, 9, 6, 235);
    			attr_dev(span0, "class", "font-light text-xs");
    			add_location(span0, file$1, 10, 6, 291);
    			attr_dev(div0, "class", "flex flex-col ml-2");
    			add_location(div0, file$1, 8, 4, 195);
    			attr_dev(div1, "class", "flex flex-row w-52");
    			add_location(div1, file$1, 6, 2, 82);
    			attr_dev(img1, "class", "rounded-md w-16 h-16");
    			if (!src_url_equal(img1.src, img1_src_value = "images/vlc.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			add_location(img1, file$1, 14, 4, 425);
    			attr_dev(h11, "class", "text-sm");
    			add_location(h11, file$1, 16, 6, 535);
    			attr_dev(span1, "class", "font-light text-xs");
    			add_location(span1, file$1, 17, 6, 590);
    			attr_dev(div2, "class", "flex flex-col ml-2");
    			add_location(div2, file$1, 15, 4, 495);
    			attr_dev(div3, "class", "flex flex-row mt-5 w-5212rem");
    			add_location(div3, file$1, 13, 2, 377);
    			attr_dev(div4, "class", "separator svelte-1drepa1");
    			add_location(div4, file$1, 20, 2, 663);
    			add_location(h2, file$1, 22, 4, 729);
    			attr_dev(img2, "class", "w-6 h-6 mr-4");
    			if (!src_url_equal(img2.src, img2_src_value = "images/plus.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "");
    			add_location(img2, file$1, 24, 8, 805);
    			add_location(span2, file$1, 25, 8, 870);
    			attr_dev(div5, "class", "flex flex-row mt-4");
    			add_location(div5, file$1, 23, 4, 763);
    			attr_dev(div6, "class", "flex flex-col");
    			add_location(div6, file$1, 21, 2, 696);
    			attr_dev(div7, "class", "sponsered-content svelte-1drepa1");
    			add_location(div7, file$1, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, h3);
    			append_dev(div7, t1);
    			append_dev(div7, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, h10);
    			append_dev(div0, t4);
    			append_dev(div0, span0);
    			append_dev(div7, t6);
    			append_dev(div7, div3);
    			append_dev(div3, img1);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, h11);
    			append_dev(div2, t9);
    			append_dev(div2, span1);
    			append_dev(div7, t11);
    			append_dev(div7, div4);
    			append_dev(div7, t12);
    			append_dev(div7, div6);
    			append_dev(div6, h2);
    			append_dev(div6, t14);
    			append_dev(div6, div5);
    			append_dev(div5, img2);
    			append_dev(div5, t15);
    			append_dev(div5, span2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SponseredContent', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SponseredContent> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SponseredContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SponseredContent",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let topbar;
    	let t0;
    	let div0;
    	let sidebar;
    	let t1;
    	let div1;
    	let createstory;
    	let t2;
    	let status;
    	let t3;
    	let post0;
    	let t4;
    	let post1;
    	let t5;
    	let div2;
    	let sponseredcontent;
    	let current;
    	topbar = new TopBar({ $$inline: true });
    	sidebar = new SideBar({ $$inline: true });
    	createstory = new CreateStory({ $$inline: true });
    	status = new Status({ $$inline: true });
    	post0 = new Post({ $$inline: true });
    	post1 = new Post({ $$inline: true });
    	sponseredcontent = new SponseredContent({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			create_component(topbar.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			create_component(sidebar.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(createstory.$$.fragment);
    			t2 = space();
    			create_component(status.$$.fragment);
    			t3 = space();
    			create_component(post0.$$.fragment);
    			t4 = space();
    			create_component(post1.$$.fragment);
    			t5 = space();
    			div2 = element("div");
    			create_component(sponseredcontent.$$.fragment);
    			attr_dev(header, "class", "");
    			add_location(header, file, 10, 2, 371);
    			add_location(div0, file, 13, 2, 418);
    			attr_dev(div1, "class", "sm2:ml-16 sm3:ml-36 md:ml-80");
    			add_location(div1, file, 17, 2, 452);
    			add_location(div2, file, 24, 2, 568);
    			attr_dev(main, "class", "");
    			add_location(main, file, 9, 0, 353);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			mount_component(topbar, header, null);
    			append_dev(main, t0);
    			append_dev(main, div0);
    			mount_component(sidebar, div0, null);
    			append_dev(main, t1);
    			append_dev(main, div1);
    			mount_component(createstory, div1, null);
    			append_dev(div1, t2);
    			mount_component(status, div1, null);
    			append_dev(div1, t3);
    			mount_component(post0, div1, null);
    			append_dev(div1, t4);
    			mount_component(post1, div1, null);
    			append_dev(main, t5);
    			append_dev(main, div2);
    			mount_component(sponseredcontent, div2, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topbar.$$.fragment, local);
    			transition_in(sidebar.$$.fragment, local);
    			transition_in(createstory.$$.fragment, local);
    			transition_in(status.$$.fragment, local);
    			transition_in(post0.$$.fragment, local);
    			transition_in(post1.$$.fragment, local);
    			transition_in(sponseredcontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topbar.$$.fragment, local);
    			transition_out(sidebar.$$.fragment, local);
    			transition_out(createstory.$$.fragment, local);
    			transition_out(status.$$.fragment, local);
    			transition_out(post0.$$.fragment, local);
    			transition_out(post1.$$.fragment, local);
    			transition_out(sponseredcontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(topbar);
    			destroy_component(sidebar);
    			destroy_component(createstory);
    			destroy_component(status);
    			destroy_component(post0);
    			destroy_component(post1);
    			destroy_component(sponseredcontent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		TopBar,
    		SideBar,
    		CreateStory,
    		Status,
    		Post,
    		SponseredContent
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
