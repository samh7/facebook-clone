<script>
  import Friends from "./SideBar/Friends.svelte";
  import Groups from "./SideBar/Groups.svelte";
  import Marketplace from "./SideBar/Marketplace.svelte";
  import VideoPlay from "./SideBar/Video.svelte";
  import Memories from "./SideBar/Memories.svelte";
  import Saved from "./SideBar/Saved.svelte";
  import Feeds from "./SideBar/Feeds.svelte";
  import Events from "./SideBar/Events.svelte";
  import AdsManager from "./SideBar/AdsManager.svelte";
  import CrisisResponce from "./SideBar/CrisisResponce.svelte";
  import SeeMore from "./SideBar/SeeMore.svelte"
</script>
<div class="hidden lg:flex sidebar  flex-col  space-y-2.5 pl-3 w-72 z-0 mt">
  <div class="flex flex-row mt-8">
  <img class="w-7 rounded-full ml-1.5 mr-2" src="images/mkbhg_pfpicture.jpg" alt=""/>
  Marques Brownlee
</div>
  <Friends />
  <Memories />
  <Saved />
  <Feeds />
  <Groups />
  <VideoPlay />
  <Marketplace />
  <Events />
  <AdsManager />
  <CrisisResponce />
  <SeeMore/>
</div>

<style>
.sidebar{
  background-color: #f0f2f5;
  /* flex-basis: 25%; */
 position:fixed;
 float: left;
 height: 97vh;
 /* max-height: 101vh; */
overflow-y: scroll;
}
.mt{
  margin-top: 1.5rem;
}
</style>