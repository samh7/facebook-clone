<script>
  import TopBar from "./components/TopBar.svelte";
  import SideBar from "./components/SideBar.svelte";
  import CreateStory from "./components/CreateStory.svelte";
  import Status from "./components/Status.svelte";
  import Post from "./components/post.svelte";
  import SponseredContent from './components/SponseredContent.svelte'
</script>

<main class="">
  <header class="">
    <TopBar />
  </header>
  <div>
    <SideBar />
  </div>

  <div class="sm2:ml-16 sm3:ml-36 md:ml-80">
    <CreateStory />
    <Status />
    <Post />
    <Post />
  </div>

  <div><SponseredContent/></div>
</main>

<style>
</style>
