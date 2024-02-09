var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function s(e){e.forEach(t)}function r(e){return"function"==typeof e}function a(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let l,i;function o(e,t){return l||(l=document.createElement("a")),l.href=t,e===l.href}function c(e,t){e.appendChild(t)}function d(e,t,n){e.insertBefore(t,n||null)}function x(e){e.parentNode&&e.parentNode.removeChild(e)}function p(e){return document.createElement(e)}function u(){return e=" ",document.createTextNode(e);var e}function f(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function m(e,t,n,s){null==n?e.style.removeProperty(t):e.style.setProperty(t,n,s?"important":"")}function g(e){i=e}const h=[],v=[];let $=[];const w=[],b=Promise.resolve();let k=!1;function y(e){$.push(e)}const _=new Set;let C=0;function q(){if(0!==C)return;const e=i;do{try{for(;C<h.length;){const e=h[C];C++,g(e),j(e.$$)}}catch(e){throw h.length=0,C=0,e}for(g(null),h.length=0,C=0;v.length;)v.pop()();for(let e=0;e<$.length;e+=1){const t=$[e];_.has(t)||(_.add(t),t())}$.length=0}while(h.length);for(;w.length;)w.pop()();k=!1,_.clear(),g(e)}function j(e){if(null!==e.fragment){e.update(),s(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(y)}}const M=new Set;let z;function A(e,t){e&&e.i&&(M.delete(e),e.i(t))}function E(e,t,n,s){if(e&&e.o){if(M.has(e))return;M.add(e),z.c.push((()=>{M.delete(e),s&&(n&&e.d(1),s())})),e.o(t)}else s&&s()}function H(e){e&&e.c()}function F(e,n,a,l){const{fragment:i,after_update:o}=e.$$;i&&i.m(n,a),l||y((()=>{const n=e.$$.on_mount.map(t).filter(r);e.$$.on_destroy?e.$$.on_destroy.push(...n):s(n),e.$$.on_mount=[]})),o.forEach(y)}function L(e,t){const n=e.$$;null!==n.fragment&&(!function(e){const t=[],n=[];$.forEach((s=>-1===e.indexOf(s)?t.push(s):n.push(s))),n.forEach((e=>e())),$=t}(n.after_update),s(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function G(e,t){-1===e.$$.dirty[0]&&(h.push(e),k||(k=!0,b.then(q)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function S(t,r,a,l,o,c,d,p=[-1]){const u=i;g(t);const f=t.$$={fragment:null,ctx:[],props:c,update:e,not_equal:o,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(r.context||(u?u.$$.context:[])),callbacks:n(),dirty:p,skip_bound:!1,root:r.target||u.$$.root};d&&d(f.root);let m=!1;if(f.ctx=a?a(t,r.props||{},((e,n,...s)=>{const r=s.length?s[0]:n;return f.ctx&&o(f.ctx[e],f.ctx[e]=r)&&(!f.skip_bound&&f.bound[e]&&f.bound[e](r),m&&G(t,e)),n})):[],f.update(),m=!0,s(f.before_update),f.fragment=!!l&&l(f.ctx),r.target){if(r.hydrate){const e=function(e){return Array.from(e.childNodes)}(r.target);f.fragment&&f.fragment.l(e),e.forEach(x)}else f.fragment&&f.fragment.c();r.intro&&A(t.$$.fragment),F(t,r.target,r.anchor,r.customElement),q()}g(u)}class T{$destroy(){L(this,1),this.$destroy=e}$on(t,n){if(!r(n))return e;const s=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return s.push(n),()=>{const e=s.indexOf(n);-1!==e&&s.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function Z(t){let n;return{c(){n=p("div"),n.innerHTML='<a aria-label="Video" class="x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x78zum5 xdt5ytf x5yr21d xl56j7k x1n2onr6 xh8yej3" href="/watch/?ref=tab" role="link" tabindex="0"><span class="x1n2onr6"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq" style="--color:var(--secondary-icon)"><path d="M10.996 8.132A1 1 0 0 0 9.5 9v4a1 1 0 0 0 1.496.868l3.5-2a1 1 0 0 0 0-1.736l-3.5-2z"></path><path d="M14.573 2H9.427c-1.824 0-3.293 0-4.45.155-1.2.162-2.21.507-3.013 1.31C1.162 4.266.817 5.277.655 6.477.5 7.634.5 9.103.5 10.927v.146c0 1.824 0 3.293.155 4.45.162 1.2.507 2.21 1.31 3.012.802.803 1.813 1.148 3.013 1.31C6.134 20 7.603 20 9.427 20h5.146c1.824 0 3.293 0 4.45-.155 1.2-.162 2.21-.507 3.012-1.31.803-.802 1.148-1.813 1.31-3.013.155-1.156.155-2.625.155-4.449v-.146c0-1.824 0-3.293-.155-4.45-.162-1.2-.507-2.21-1.31-3.013-.802-.802-1.813-1.147-3.013-1.309C17.866 2 16.397 2 14.573 2zM3.38 4.879c.369-.37.887-.61 1.865-.741C6.251 4.002 7.586 4 9.5 4h5c1.914 0 3.249.002 4.256.138.978.131 1.496.372 1.865.74.37.37.61.888.742 1.866.135 1.007.137 2.342.137 4.256 0 1.914-.002 3.249-.137 4.256-.132.978-.373 1.496-.742 1.865-.369.37-.887.61-1.865.742-1.007.135-2.342.137-4.256.137h-5c-1.914 0-3.249-.002-4.256-.137-.978-.132-1.496-.373-1.865-.742-.37-.369-.61-.887-.741-1.865C2.502 14.249 2.5 12.914 2.5 11c0-1.914.002-3.249.138-4.256.131-.978.372-1.496.74-1.865zM8 21.5a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2H8z"></path></svg><span class="x10l6tqk x11f4b5y x1v4kod4"></span></span><div class="x1ey2m1c xds687c x17qophe xg01cxk x47corl x10l6tqk x13vifvy x1ebt8du x19991ni x1dhq9h x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1wpzbip" role="none" data-visualcompletion="ignore" style="border-radius: 8px; inset: 4px 0px;"></div></a>',f(n,"class","hidden md:flex flex-row items-center")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class N extends T{constructor(e){super(),S(this,e,null,Z,a,{})}}function R(t){let n;return{c(){n=p("div"),n.innerHTML='<i data-visualcompletion="css-img" class="" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb&quot;); background-position: 0px -304px; background-size: 38px 570px; width: 36px; height: 36px; background-repeat: no-repeat; display: inline-block;"></i>',f(n,"class","hidden md:flex flex-row items-center")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}let O=class extends T{constructor(e){super(),S(this,e,null,R,a,{})}};function W(t){let n;return{c(){n=p("div"),n.innerHTML='<i data-visualcompletion="css-img" class="" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb&quot;); background-position: 0px -38px; background-size: 38px 570px; width: 36px; height: 36px; background-repeat: no-repeat; display: inline-block;"></i>',f(n,"class","hidden md:flex flex-row items-center")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}let K=class extends T{constructor(e){super(),S(this,e,null,W,a,{})}};function U(t){let n;return{c(){n=p("div"),n.innerHTML='<div class="flex flex-column items-center"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq" style="--color: var(--secondary-icon);"><path d="M8.99 23H7.93c-1.354 0-2.471 0-3.355-.119-.928-.125-1.747-.396-2.403-1.053-.656-.656-.928-1.475-1.053-2.403C1 18.541 1 17.425 1 16.07v-4.3c0-1.738-.002-2.947.528-4.006.53-1.06 1.497-1.784 2.888-2.826L6.65 3.263c1.114-.835 2.02-1.515 2.815-1.977C10.294.803 11.092.5 12 .5c.908 0 1.707.303 2.537.786.795.462 1.7 1.142 2.815 1.977l2.232 1.675c1.391 1.042 2.359 1.766 2.888 2.826.53 1.059.53 2.268.528 4.006v4.3c0 1.355 0 2.471-.119 3.355-.124.928-.396 1.747-1.052 2.403-.657.657-1.476.928-2.404 1.053-.884.119-2 .119-3.354.119H8.99zM7.8 4.9l-2 1.5C4.15 7.638 3.61 8.074 3.317 8.658 3.025 9.242 3 9.937 3 12v4c0 1.442.002 2.424.101 3.159.095.706.262 1.033.485 1.255.223.223.55.39 1.256.485.734.099 1.716.1 3.158.1V14.5a2.5 2.5 0 0 1 2.5-2.5h3a2.5 2.5 0 0 1 2.5 2.5V21c1.443 0 2.424-.002 3.159-.101.706-.095 1.033-.262 1.255-.485.223-.222.39-.55.485-1.256.099-.734.101-1.716.101-3.158v-4c0-2.063-.025-2.758-.317-3.342-.291-.584-.832-1.02-2.483-2.258l-2-1.5c-1.174-.881-1.987-1.489-2.67-1.886C12.87 2.63 12.425 2.5 12 2.5c-.425 0-.87.13-1.53.514-.682.397-1.495 1.005-2.67 1.886zM14 21v-6.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V21h4z"></path></svg></div>',f(n,"class","hidden md:flex flex-row items-center")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class P extends T{constructor(e){super(),S(this,e,null,U,a,{})}}function D(t){let n;return{c(){n=p("div"),n.innerHTML='<a aria-label="Marketplace" class="x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x78zum5 xdt5ytf x5yr21d xl56j7k x1n2onr6 xh8yej3" href="/marketplace/?ref=app_tab" role="link" tabindex="0"><span class="x1n2onr6"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq" style="--color:var(--secondary-icon)"><path d="M1.588 3.227A3.125 3.125 0 0 1 4.58 1h14.84c1.38 0 2.597.905 2.993 2.227l.816 2.719a6.47 6.47 0 0 1 .272 1.854A5.183 5.183 0 0 1 22 11.455v4.615c0 1.355 0 2.471-.119 3.355-.125.928-.396 1.747-1.053 2.403-.656.657-1.475.928-2.403 1.053-.884.12-2 .119-3.354.119H8.929c-1.354 0-2.47 0-3.354-.119-.928-.125-1.747-.396-2.403-1.053-.657-.656-.929-1.475-1.053-2.403-.12-.884-.119-2-.119-3.354V11.5l.001-.045A5.184 5.184 0 0 1 .5 7.8c0-.628.092-1.252.272-1.854l.816-2.719zM10 21h4v-3.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V21zm6-.002c.918-.005 1.608-.025 2.159-.099.706-.095 1.033-.262 1.255-.485.223-.222.39-.55.485-1.255.099-.735.101-1.716.101-3.159v-3.284a5.195 5.195 0 0 1-1.7.284 5.18 5.18 0 0 1-3.15-1.062A5.18 5.18 0 0 1 12 13a5.18 5.18 0 0 1-3.15-1.062A5.18 5.18 0 0 1 5.7 13a5.2 5.2 0 0 1-1.7-.284V16c0 1.442.002 2.424.1 3.159.096.706.263 1.033.486 1.255.222.223.55.39 1.255.485.551.074 1.24.094 2.159.1V17.5a2.5 2.5 0 0 1 2.5-2.5h3a2.5 2.5 0 0 1 2.5 2.5v3.498zM4.581 3c-.497 0-.935.326-1.078.802l-.815 2.72A4.45 4.45 0 0 0 2.5 7.8a3.2 3.2 0 0 0 5.6 2.117 1 1 0 0 1 1.5 0A3.19 3.19 0 0 0 12 11a3.19 3.19 0 0 0 2.4-1.083 1 1 0 0 1 1.5 0A3.2 3.2 0 0 0 21.5 7.8c0-.434-.063-.865-.188-1.28l-.816-2.72A1.125 1.125 0 0 0 19.42 3H4.58z"></path></svg><span class="x10l6tqk x11f4b5y x1v4kod4"></span></span><div class="x1ey2m1c xds687c x17qophe xg01cxk x47corl x10l6tqk x13vifvy x1ebt8du x19991ni x1dhq9h x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1wpzbip" role="none" data-visualcompletion="ignore" style="border-radius: 8px; inset: 4px 0px;"></div></a>',f(n,"class","hidden md:flex flex-row items-center")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}let V=class extends T{constructor(e){super(),S(this,e,null,D,a,{})}};function B(t){let n;return{c(){n=p("div"),n.innerHTML='<div aria-label="Messenger" class="x1i10hfl x1ejq31n xd10rxx x1sy0etr x17r0tee x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x16tdsg8 x1hl2dhg xggy1nq x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x14yjl9h xudhj91 x18nykt9 xww2gxu x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x78zum5 xl56j7k xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x1vqgdyp x100vrsf x1qhmfi1" role="button" tabindex="0"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq" style="--color:var(--primary-icon)"><path d="M.5 12C.5 5.649 5.649.5 12 .5S23.5 5.649 23.5 12 18.351 23.5 12 23.5c-1.922 0-3.736-.472-5.33-1.308a.63.63 0 0 0-.447-.069l-3.4.882a1.5 1.5 0 0 1-1.828-1.829l.882-3.4a.63.63 0 0 0-.07-.445A11.454 11.454 0 0 1 .5 12zm17.56-1.43a.819.819 0 0 0-1.125-1.167L14 11.499l-3.077-2.171a1.5 1.5 0 0 0-2.052.308l-2.93 3.793a.819.819 0 0 0 1.123 1.167L10 12.5l3.076 2.172a1.5 1.5 0 0 0 2.052-.308l2.931-3.793z"></path></svg><div class="x1ey2m1c xds687c x17qophe xg01cxk x47corl x10l6tqk x13vifvy x1ebt8du x19991ni x1dhq9h x1wpzbip xzolkzo x12go9s9 x1rnf11y xprq8jg" role="none" data-visualcompletion="ignore" style="inset: 0px;"></div></div>',f(n,"class","flex flex-row items-center")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class J extends T{constructor(e){super(),S(this,e,null,B,a,{})}}function X(t){let n,s,r,a,l,i,m,g,h,v,$,w,b,k,y,_,C,q,j,M,z,G,S,T,Z,R,W,U,D;return i=new P({}),g=new O({}),v=new N({}),w=new V({}),k=new K({}),M=new J({}),{c(){n=p("div"),s=p("div"),s.innerHTML='<img class="w-7 h-7 mr-3 mt svelte-s8hjgs" src="images/logo.png" alt=""/> \n    <img class="w-6 h-6 mt-2" src="images/search.png" alt=""/>',r=u(),a=p("span"),l=u(),H(i.$$.fragment),m=u(),H(g.$$.fragment),h=u(),H(v.$$.fragment),$=u(),H(w.$$.fragment),b=u(),H(k.$$.fragment),y=u(),_=p("div"),C=p("img"),j=u(),H(M.$$.fragment),z=u(),G=p("img"),T=u(),Z=p("img"),W=u(),U=p("div"),f(s,"class","flex flex-row ml-4"),f(a,"class","w-36"),o(C.src,q="images/menu.png")||f(C,"src","images/menu.png"),f(C,"class","w-6 h-6 mt-2"),f(C,"alt",""),f(G,"class","w-6 h-6 mt-1.5"),o(G.src,S="images/plus.png")||f(G,"src","images/plus.png"),f(G,"alt",""),o(Z.src,R="images/mkbhg_pfpicture.jpg")||f(Z,"src","images/mkbhg_pfpicture.jpg"),f(Z,"class","w-6 h-6 mt-2 rounded-full"),f(Z,"alt",""),f(_,"class","flex flex-row space-x-5 w justify-end svelte-s8hjgs"),f(n,"class","topbar flex flex-row space-x-20 mt-4 z-50 svelte-s8hjgs"),f(U,"class","shadow svelte-s8hjgs")},m(e,t){d(e,n,t),c(n,s),c(n,r),c(n,a),c(n,l),F(i,n,null),c(n,m),F(g,n,null),c(n,h),F(v,n,null),c(n,$),F(w,n,null),c(n,b),F(k,n,null),c(n,y),c(n,_),c(_,C),c(_,j),F(M,_,null),c(_,z),c(_,G),c(_,T),c(_,Z),d(e,W,t),d(e,U,t),D=!0},p:e,i(e){D||(A(i.$$.fragment,e),A(g.$$.fragment,e),A(v.$$.fragment,e),A(w.$$.fragment,e),A(k.$$.fragment,e),A(M.$$.fragment,e),D=!0)},o(e){E(i.$$.fragment,e),E(g.$$.fragment,e),E(v.$$.fragment,e),E(w.$$.fragment,e),E(k.$$.fragment,e),E(M.$$.fragment,e),D=!1},d(e){e&&x(n),L(i),L(g),L(v),L(w),L(k),L(M),e&&x(W),e&&x(U)}}}class Y extends T{constructor(e){super(),S(this,e,null,X,a,{})}}function I(t){let n;return{c(){n=p("div"),n.innerHTML='<i data-visualcompletion="css-img" class="mr-2" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb&quot;); background-position: 0px -304px; background-size: 38px 570px; width: 36px; height: 36px; background-repeat: no-repeat; display: inline-block;"></i>\n    Find Friends',f(n,"class","flex flex-row")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class Q extends T{constructor(e){super(),S(this,e,null,I,a,{})}}function ee(t){let n;return{c(){n=p("div"),n.innerHTML='<i data-visualcompletion="css-img" class="mr-2" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb&quot;); background-position: 0px -38px; background-size: 38px 570px; width: 36px; height: 36px; background-repeat: no-repeat; display: inline-block;"></i>\nGroups',f(n,"class","flex flex-row")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class te extends T{constructor(e){super(),S(this,e,null,ee,a,{})}}function ne(t){let n;return{c(){n=p("div"),n.innerHTML='<i data-visualcompletion="css-img" class="mr-2" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb&quot;); background-position: 0px -418px; background-size: 38px 570px; width: 36px; height: 36px; background-repeat: no-repeat; display: inline-block;"></i>\nMarketplace',f(n,"class","flex flex-row")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class se extends T{constructor(e){super(),S(this,e,null,ne,a,{})}}function re(t){let n;return{c(){n=p("div"),n.innerHTML='<i data-visualcompletion="css-img" class="mr-2" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb&quot;); background-position: 0px -532px; background-size: 38px 570px; width: 36px; height: 36px; background-repeat: no-repeat; display: inline-block;"></i>\nVideo',f(n,"class","flex flex-row")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class ae extends T{constructor(e){super(),S(this,e,null,re,a,{})}}function le(t){let n;return{c(){n=p("div"),n.innerHTML='<i data-visualcompletion="css-img" class="mr-2" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb&quot;); background-position: 0px -456px; background-size: 38px 570px; width: 36px; height: 36px; background-repeat: no-repeat; display: inline-block;"></i>\nMemories',f(n,"class","flex flex-row")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class ie extends T{constructor(e){super(),S(this,e,null,le,a,{})}}function oe(t){let n;return{c(){n=p("div"),n.innerHTML='<i data-visualcompletion="css-img" class="mr-2" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/MXx87JcFKzH.png?_nc_eui2=AeHAvcPCdWZO2soE1kNsYf3lpjWidniF_5qmNaJ2eIX_mjrDUku9RrPd7tRkGAZK-7soS1gM6ji9azRA7o4GdnEb&quot;); background-position: 0px -190px; background-size: 38px 570px; width: 36px; height: 36px; background-repeat: no-repeat; display: inline-block;"></i>\nSaved',f(n,"class","flex flex-row")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class ce extends T{constructor(e){super(),S(this,e,null,oe,a,{})}}function de(t){let n;return{c(){n=p("div"),n.innerHTML='<img draggable="false" height="36" width="36" alt="" class="xz74otr mr-2" referrerpolicy="origin-when-cross-origin" src="https://static.xx.fbcdn.net/rsrc.php/v3/yT/r/3dN1QwOLden.png?_nc_eui2=AeHMBN_307Bi0vChBjJzVhbe9As6vsZg84r0Czq-xmDzisA2WZRuYB7QKF2ihQaPofdCKrhSRGJwWXW7W6whIcPP"/>\n    Feeds',f(n,"class","flex flex-row items-center")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class xe extends T{constructor(e){super(),S(this,e,null,de,a,{})}}function pe(t){let n;return{c(){n=p("div"),n.innerHTML='<i data-visualcompletion="css-img" class="mr-2" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yH/r/vWSUA-u7jLw.png?_nc_eui2=AeH8i-pgbHa0qrPk1wTaP86kqH6dSHmssQ2ofp1IeayxDSn8TheBjYfrYrgKjORtCyy7KjwJ717WKbqTduj6OI9u&quot;); background-position: 0px -38px; background-size: 38px 76px; width: 36px; height: 36px; background-repeat: no-repeat; display: inline-block;"></i>\nEvents',f(n,"class","flex flex-row items-center")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class ue extends T{constructor(e){super(),S(this,e,null,pe,a,{})}}function fe(t){let n;return{c(){n=p("div"),n.innerHTML='<img draggable="false" height="36" width="36" alt="" class="xz74otr mr-2" referrerpolicy="origin-when-cross-origin" src="https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/tx2VFwUKc-K.png?_nc_eui2=AeGvOUsA83sp_Ji1OV3bygbXql6KcToA1eWqXopxOgDV5UrryaOatN57v7veaHR3u8n6tX3voUMOSNQwuHJ-Bo7P"/>\n    Ads Manager',f(n,"class","flex flex-row")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class me extends T{constructor(e){super(),S(this,e,null,fe,a,{})}}function ge(t){let n;return{c(){n=p("div"),n.innerHTML='<img draggable="false" height="36" width="36" alt="" class="xz74otr mr-2" referrerpolicy="origin-when-cross-origin" src="https://static.xx.fbcdn.net/rsrc.php/v3/yi/r/eChFgZ345zp.png?_nc_eui2=AeE9N-KWHhS--qwEAyokrWNwNHvznuQKK_U0e_Oe5Aor9fGD_uz65-6OiN-Vh1oKBsNzHWVodsulsfY3y9X3_9JW"/>\n    Crisis Response',f(n,"class","flex flex-row items-center ")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class he extends T{constructor(e){super(),S(this,e,null,ge,a,{})}}function ve(t){let n;return{c(){n=p("div"),n.innerHTML='<div class="ml-2.5 mr-2"><div class="x14yjl9h xudhj91 x18nykt9 xww2gxu x6s0dn4 x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x3nfvp2 xl56j7k x1n2onr6 x1qhmfi1 xc9qbxq x14qfxbe"><svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true" class="x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq" style="--color: var(--primary-icon);"><g fill-rule="evenodd" transform="translate(-448 -544)"><path fill-rule="nonzero" d="M452.707 549.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L456 552.586l-3.293-3.293z"></path></g></svg></div></div>\n  See More',f(n,"class","flex flex-row")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class $e extends T{constructor(e){super(),S(this,e,null,ve,a,{})}}function we(t){let n,s,r,a,l,i,o,m,g,h,v,$,w,b,k,y,_,C,q,j,M,z,G,S,T;return a=new Q({}),i=new ie({}),m=new ce({}),h=new xe({}),$=new te({}),b=new ae({}),y=new se({}),C=new ue({}),j=new me({}),z=new he({}),S=new $e({}),{c(){n=p("div"),s=p("div"),s.innerHTML='<img class="w-7 rounded-full ml-1.5 mr-2" src="images/mkbhg_pfpicture.jpg" alt=""/>\n  Marques Brownlee',r=u(),H(a.$$.fragment),l=u(),H(i.$$.fragment),o=u(),H(m.$$.fragment),g=u(),H(h.$$.fragment),v=u(),H($.$$.fragment),w=u(),H(b.$$.fragment),k=u(),H(y.$$.fragment),_=u(),H(C.$$.fragment),q=u(),H(j.$$.fragment),M=u(),H(z.$$.fragment),G=u(),H(S.$$.fragment),f(s,"class","flex flex-row mt-8"),f(n,"class","hidden lg:flex sidebar flex-col space-y-2.5 pl-3 w-72 z-0 mt svelte-1kekyfu")},m(e,t){d(e,n,t),c(n,s),c(n,r),F(a,n,null),c(n,l),F(i,n,null),c(n,o),F(m,n,null),c(n,g),F(h,n,null),c(n,v),F($,n,null),c(n,w),F(b,n,null),c(n,k),F(y,n,null),c(n,_),F(C,n,null),c(n,q),F(j,n,null),c(n,M),F(z,n,null),c(n,G),F(S,n,null),T=!0},p:e,i(e){T||(A(a.$$.fragment,e),A(i.$$.fragment,e),A(m.$$.fragment,e),A(h.$$.fragment,e),A($.$$.fragment,e),A(b.$$.fragment,e),A(y.$$.fragment,e),A(C.$$.fragment,e),A(j.$$.fragment,e),A(z.$$.fragment,e),A(S.$$.fragment,e),T=!0)},o(e){E(a.$$.fragment,e),E(i.$$.fragment,e),E(m.$$.fragment,e),E(h.$$.fragment,e),E($.$$.fragment,e),E(b.$$.fragment,e),E(y.$$.fragment,e),E(C.$$.fragment,e),E(j.$$.fragment,e),E(z.$$.fragment,e),E(S.$$.fragment,e),T=!1},d(e){e&&x(n),L(a),L(i),L(m),L(h),L($),L(b),L(y),L(C),L(j),L(z),L(S)}}}class be extends T{constructor(e){super(),S(this,e,null,we,a,{})}}function ke(t){let n;return{c(){n=p("div"),n.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" class="x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq" style="--color:var(--accent)"><path d="M18 11h-5V6a1 1 0 0 0-2 0v5H6a1 1 0 0 0 0 2h5v5a1 1 0 0 0 2 0v-5h5a1 1 0 0 0 0-2z"></path></svg>',f(n,"class","w ml-4")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class ye extends T{constructor(e){super(),S(this,e,null,ke,a,{})}}function _e(t){let n,s,r,a,l;return s=new ye({}),{c(){n=p("div"),H(s.$$.fragment),r=u(),a=p("div"),a.innerHTML='<span class="d font-bold">Create Story</span> \n    <span class="font-light">Share a photo or write something.</span>',f(a,"class","flex flex-col"),f(n,"class","md:w-rem40 w create_story flex flex-row items-center mt space-x-5 border rounded-md svelte-voibo7")},m(e,t){d(e,n,t),F(s,n,null),c(n,r),c(n,a),l=!0},p:e,i(e){l||(A(s.$$.fragment,e),l=!0)},o(e){E(s.$$.fragment,e),l=!1},d(e){e&&x(n),L(s)}}}class Ce extends T{constructor(e){super(),S(this,e,null,_e,a,{})}}function qe(t){let n;return{c(){n=p("div"),n.innerHTML='<div class="status ml-20 flex flex-col mt-4 border rounded-md space-y-3 pt-3 pl-4 pb-2 svelte-xjox92"><div class="flex flex-row"><img class="profile-pic rounded-full ml-1.5 mr-2 h-9 w-7 mt-0.5 svelte-xjox92" src="images/mkbhg_pfpicture.jpg" alt=""/> \n      <div class="flex flex-col justify-center on-mind rounded-full svelte-xjox92">What&#39;s on you mind, Marques?</div></div> \n    <div class="separator svelte-xjox92"></div> \n    <div class="flex flex-row ml-1.5 space-x-8"><div class="flex flex-row"><img class="w-6 h-6 mr-3" src="images/live.png" alt=""/>\n        Live Video</div> \n      <div class="flex flex-row"><img class="w-6 h-6 mr-3" src="images/photo_video.png" alt=""/>\n        Photo/Video</div> \n      <div class="flex flex-row"><img class="w-6 h-6 mr-3" src="images/feeling.png" alt=""/>\n        Feeling/Activity</div></div></div>',f(n,"class","flex flex-row")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class je extends T{constructor(e){super(),S(this,e,null,qe,a,{})}}function Me(t){let n,s,r,a;return{c(){n=p("div"),s=p("img"),f(s,"class","x16dsc37"),f(s,"height","18"),f(s,"role","presentation"),o(s.src,r="data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint2_radial_15251_63610)' fill-opacity='.5'/%3E%3Cpath d='M7.3014 3.8662a.6974.6974 0 0 1 .6974-.6977c.6742 0 1.2207.5465 1.2207 1.2206v1.7464a.101.101 0 0 0 .101.101h1.7953c.992 0 1.7232.9273 1.4917 1.892l-.4572 1.9047a2.301 2.301 0 0 1-2.2374 1.764H6.9185a.5752.5752 0 0 1-.5752-.5752V7.7384c0-.4168.097-.8278.2834-1.2005l.2856-.5712a3.6878 3.6878 0 0 0 .3893-1.6509l-.0002-.4496ZM4.367 7a.767.767 0 0 0-.7669.767v3.2598a.767.767 0 0 0 .767.767h.767a.3835.3835 0 0 0 .3835-.3835V7.3835A.3835.3835 0 0 0 5.134 7h-.767Z' fill='%23fff'/%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(90 .0005 8) scale(7.99958)'%3E%3Cstop offset='.5618' stop-color='%230866FF' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%230866FF' stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient id='paint2_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(45 -4.5257 10.9237) scale(10.1818)'%3E%3Cstop offset='.3143' stop-color='%2302ADFC'/%3E%3Cstop offset='1' stop-color='%2302ADFC' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.3989' y1='2.3999' x2='13.5983' y2='13.5993' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2302ADFC'/%3E%3Cstop offset='.5' stop-color='%230866FF'/%3E%3Cstop offset='1' stop-color='%232B7EFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E")||f(s,"src","data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint2_radial_15251_63610)' fill-opacity='.5'/%3E%3Cpath d='M7.3014 3.8662a.6974.6974 0 0 1 .6974-.6977c.6742 0 1.2207.5465 1.2207 1.2206v1.7464a.101.101 0 0 0 .101.101h1.7953c.992 0 1.7232.9273 1.4917 1.892l-.4572 1.9047a2.301 2.301 0 0 1-2.2374 1.764H6.9185a.5752.5752 0 0 1-.5752-.5752V7.7384c0-.4168.097-.8278.2834-1.2005l.2856-.5712a3.6878 3.6878 0 0 0 .3893-1.6509l-.0002-.4496ZM4.367 7a.767.767 0 0 0-.7669.767v3.2598a.767.767 0 0 0 .767.767h.767a.3835.3835 0 0 0 .3835-.3835V7.3835A.3835.3835 0 0 0 5.134 7h-.767Z' fill='%23fff'/%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(90 .0005 8) scale(7.99958)'%3E%3Cstop offset='.5618' stop-color='%230866FF' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%230866FF' stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient id='paint2_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(45 -4.5257 10.9237) scale(10.1818)'%3E%3Cstop offset='.3143' stop-color='%2302ADFC'/%3E%3Cstop offset='1' stop-color='%2302ADFC' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.3989' y1='2.3999' x2='13.5983' y2='13.5993' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2302ADFC'/%3E%3Cstop offset='.5' stop-color='%230866FF'/%3E%3Cstop offset='1' stop-color='%232B7EFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E"),f(s,"width","18"),f(n,"class",a=t[0]+" ml-2 svelte-1gjdw0p")},m(e,t){d(e,n,t),c(n,s)},p(e,[t]){1&t&&a!==(a=e[0]+" ml-2 svelte-1gjdw0p")&&f(n,"class",a)},i:e,o:e,d(e){e&&x(n)}}}function ze(e,t,n){let{class_:s}=t;return e.$$set=e=>{"class_"in e&&n(0,s=e.class_)},[s]}class Ae extends T{constructor(e){super(),S(this,e,ze,Me,a,{class_:0})}}function Ee(t){let n;return{c(){n=p("i"),f(n,"data-visualcompletion","css-img"),f(n,"class","x1b0d499 x1d69dk1"),m(n,"background-image",'url("https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/hskDM76yLzF.png?_nc_eui2=AeEihYC8LOfUi3d8xmA7b-WGTZMbXvHMA9tNkxte8cwD2xSrvya0nRszYAaMZDnq1BpdxkIdGCVAFc3n-drvqQok")'),m(n,"background-position","0px -1478px"),m(n,"background-size","26px 1556px"),m(n,"width","16px"),m(n,"height","16px"),m(n,"background-repeat","no-repeat"),m(n,"display","inline-block")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class He extends T{constructor(e){super(),S(this,e,null,Ee,a,{})}}function Fe(t){let n;return{c(){n=p("i"),f(n,"data-visualcompletion","css-img"),f(n,"class","x1b0d499 x1d69dk1"),m(n,"background-image",'url("https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/hskDM76yLzF.png?_nc_eui2=AeEihYC8LOfUi3d8xmA7b-WGTZMbXvHMA9tNkxte8cwD2xSrvya0nRszYAaMZDnq1BpdxkIdGCVAFc3n-drvqQok")'),m(n,"background-position","0px -1496px"),m(n,"background-size","26px 1556px"),m(n,"width","16px"),m(n,"height","16px"),m(n,"background-repeat","no-repeat"),m(n,"display","inline-block")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class Le extends T{constructor(e){super(),S(this,e,null,Fe,a,{})}}function Ge(t){let n,s,r,a,l,i,m,g,h,v,$,w,b,k,y,_,C,q,j,M,z,G,S,T,Z,N,R;return $=new Ae({props:{class_:""}}),q=new He({}),G=new Le({}),{c(){n=p("div"),s=p("div"),s.innerHTML='<img class="w-12 h-12 rounded-md" src="images/mkbhg_pfpicture.jpg" alt=""/> \n    <div class="flex flex-col ml-4"><div class="flex flex-row space-x-1"><span>MARQUES BROWNLEE</span> \n        <span>·</span> \n        <span class="text-blue-600">Join</span></div> \n      <div class="flex flex-row space-x-1"><span class="font-light">Suggest for you</span> \n        <span class="font-light">·</span> \n        <span class="font-light">John Doe</span> \n        <span class="font-light">·</span> \n        <span class="font-light">6 February at 15:54</span></div></div>',r=u(),a=p("div"),a.innerHTML="<span>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat minima\n      libero reiciendis enim fugit! Autem quaerat.</span>",l=u(),i=p("img"),g=u(),h=p("div"),v=p("div"),H($.$$.fragment),w=u(),b=p("span"),b.textContent="2.7K",k=u(),y=p("div"),_=p("span"),_.textContent="1.1K",C=u(),H(q.$$.fragment),j=u(),M=p("span"),M.textContent="8",z=u(),H(G.$$.fragment),S=u(),T=p("div"),Z=u(),N=p("div"),N.innerHTML='<img class="w-7" src="images/like.png"/> \n    <img class="w-7" src="images/chat.png"/>     \n    <img class="w-7" src="images/forward.png"/>',f(s,"class","flex flex-row max-w ml-4 mt-4 svelte-143o6bk"),f(a,"class","flex flex-row max-w mt-4 mb-5 ml-4 svelte-143o6bk"),f(i,"class","image_post svelte-143o6bk"),o(i.src,m="images/image-1.jpg")||f(i,"src","images/image-1.jpg"),f(i,"alt",""),f(b,"class","-mt-1 ml-2"),f(v,"class","flex flex-row liked-icon-div svelte-143o6bk"),f(_,"class","-mt-1"),f(M,"class","ml-4 -mt-1"),f(y,"class","flex flex-row space-x-3"),f(h,"class","flex flex-row mt-3"),f(T,"class","separator svelte-143o6bk"),f(N,"class","flex flex-row space-x-40 ml-8 mb-4"),f(n,"class","post-container flex flex-col mt-10 ml-20 rounded-md svelte-143o6bk")},m(e,t){d(e,n,t),c(n,s),c(n,r),c(n,a),c(n,l),c(n,i),c(n,g),c(n,h),c(h,v),F($,v,null),c(v,w),c(v,b),c(h,k),c(h,y),c(y,_),c(y,C),F(q,y,null),c(y,j),c(y,M),c(y,z),F(G,y,null),c(n,S),c(n,T),c(n,Z),c(n,N),R=!0},p:e,i(e){R||(A($.$$.fragment,e),A(q.$$.fragment,e),A(G.$$.fragment,e),R=!0)},o(e){E($.$$.fragment,e),E(q.$$.fragment,e),E(G.$$.fragment,e),R=!1},d(e){e&&x(n),L($),L(q),L(G)}}}function Se(e,t,n){let{user_profile:s}=t,{user_name:r}=t,{message_post:a}=t,{image_post:l}=t,{likes:i}=t,{comments:o=[]}=t,{shares:c}=t;return e.$$set=e=>{"user_profile"in e&&n(0,s=e.user_profile),"user_name"in e&&n(1,r=e.user_name),"message_post"in e&&n(2,a=e.message_post),"image_post"in e&&n(3,l=e.image_post),"likes"in e&&n(4,i=e.likes),"comments"in e&&n(5,o=e.comments),"shares"in e&&n(6,c=e.shares)},[s,r,a,l,i,o,c]}class Te extends T{constructor(e){super(),S(this,e,Se,Ge,a,{user_profile:0,user_name:1,message_post:2,image_post:3,likes:4,comments:5,shares:6})}}function Ze(t){let n;return{c(){n=p("div"),n.innerHTML='<h3>Sponsered</h3> \n\n  <div class="flex flex-row w-52"><img class="rounded-md w-16 h-16" src="images/shoe_pic.jpg" alt=""/> \n    <div class="flex flex-col ml-2"><h1 class="text-md">Best shoes from Bungoma</h1> \n      <span class="font-light text-xs">shoesfrombungoma.com</span></div></div> \n  <div class="flex flex-row mt-5 w-5212rem"><img class="rounded-md w-16 h-16" src="images/vlc.jpg" alt=""/> \n    <div class="flex flex-col ml-2"><h1 class="text-sm">VLC player now 50% off</h1> \n      <span class="font-light text-xs">vlc.com</span></div></div> \n  <div class="separator svelte-ipwwyb"></div> \n  <div class="flex flex-col"><h2>Group conversations</h2> \n    <div class="flex flex-row mt-4"><img class="w-6 h-6 mr-4" src="images/plus.png" alt=""/> \n        <span>Create New Group</span></div></div>',f(n,"class","sponsered-content svelte-ipwwyb")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&x(n)}}}class Ne extends T{constructor(e){super(),S(this,e,null,Ze,a,{})}}function Re(t){let n,s,r,a,l,i,o,m,g,h,v,$,w,b,k,y,_,C,q;return r=new Y({}),i=new be({}),g=new Ce({}),v=new je({}),w=new Te({}),k=new Te({}),C=new Ne({}),{c(){n=p("main"),s=p("header"),H(r.$$.fragment),a=u(),l=p("div"),H(i.$$.fragment),o=u(),m=p("div"),H(g.$$.fragment),h=u(),H(v.$$.fragment),$=u(),H(w.$$.fragment),b=u(),H(k.$$.fragment),y=u(),_=p("div"),H(C.$$.fragment),f(s,"class",""),f(m,"class","sm2:ml-16 sm3:ml-36 md:ml-80"),f(n,"class","")},m(e,t){d(e,n,t),c(n,s),F(r,s,null),c(n,a),c(n,l),F(i,l,null),c(n,o),c(n,m),F(g,m,null),c(m,h),F(v,m,null),c(m,$),F(w,m,null),c(m,b),F(k,m,null),c(n,y),c(n,_),F(C,_,null),q=!0},p:e,i(e){q||(A(r.$$.fragment,e),A(i.$$.fragment,e),A(g.$$.fragment,e),A(v.$$.fragment,e),A(w.$$.fragment,e),A(k.$$.fragment,e),A(C.$$.fragment,e),q=!0)},o(e){E(r.$$.fragment,e),E(i.$$.fragment,e),E(g.$$.fragment,e),E(v.$$.fragment,e),E(w.$$.fragment,e),E(k.$$.fragment,e),E(C.$$.fragment,e),q=!1},d(e){e&&x(n),L(r),L(i),L(g),L(v),L(w),L(k),L(C)}}}return new class extends T{constructor(e){super(),S(this,e,null,Re,a,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
