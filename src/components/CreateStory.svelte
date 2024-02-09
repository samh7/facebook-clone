<script>
  import PlusIcon from "./PlusIcon.svelte";
</script>

<div class="md:w-rem40 w create_story flex flex-row items-center mt space-x-5 border rounded-md">
  <PlusIcon />
  <div class="flex flex-col">
    <span class="d font-bold">Create Story</span>
    <span class="font-light" >Share a photo or write something.</span>
  </div>
</div>
<style>
  .w{
    width: 38rem;
  }
.create_story{
/* width: 0rem; */
height: 5rem;
background-color: white;
}
.mt{
  margin-top: 3rem;
}
</style>