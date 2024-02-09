<script>
  import SearchIcon from "./TopBar/SearchIcon.svelte";
  import VideoPlay from "./TopBar/VideoPlay.svelte";
  import Friends from "./TopBar/Friends.svelte";
  import Groups from "./TopBar/Groups.svelte";
  import Home from "./TopBar/Home.svelte";
  import Marketplace from "./TopBar/Marketplace.svelte";
  import MessengerIcon from "./TopBar/MessengerIcon.svelte";
</script>

<div class="topbar flex flex-row space-x-20 mt-4 z-50">
  <div class="flex flex-row ml-4">
    <img class="w-7 h-7 mr-3 mt" src="images/logo.png" alt="" />
    <img class="w-6 h-6 mt-2" src="images/search.png" alt="" />
  </div>
  <span class="w-36"></span>
  <Home />
  <Friends />
  <VideoPlay />
  <Marketplace />
  <Groups />
  <div class="flex flex-row space-x-5 w justify-end">
    <img src="images/menu.png" class="w-6 h-6 mt-2" alt="" />
    <MessengerIcon />
    <img class="w-6 h-6 mt-1.5" src="images/plus.png" alt="" />
    <img
      src="images/mkbhg_pfpicture.jpg"
      class="w-6 h-6 mt-2 rounded-full"
      alt=""
    />
  </div>
</div>
<div class="shadow"></div>

<style>
  .w {
    width: 31rem;
  }
  .mt {
    margin-top: 0.3rem;
  }
  .topbar {
    background: white;
    position: fixed;
    width: 100%;
  }
  .shadow {
    z-index: 0;
    position: relative;
    height: 10px;
    margin-top: -17px;
    box-shadow: 0 20px 40px black;
  }
</style>
