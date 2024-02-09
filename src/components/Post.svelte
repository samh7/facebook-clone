<script>
  import LikeIcon from "./LikdIcon.svelte";
  import MessagesIcon from "./MessagesIcon.svelte";
  import ShareIcon from "./ShareIcon.svelte";
  export let user_profile;
  export let user_name;
  export let message_post;
  export let image_post;
  export let likes;
  export let comments = [];
  export let shares;
</script>

<div class="post-container flex flex-col mt-10 ml-20 rounded-md">
  <div class="flex flex-row max-w ml-4 mt-4">
    <img class="w-12 h-12 rounded-md" src="images/mkbhg_pfpicture.jpg" alt="" />
    <div class="flex flex-col ml-4">
      <div class="flex flex-row space-x-1">
        <span> MARQUES BROWNLEE </span>
        <span>·</span>
        <span class="text-blue-600">Join</span>
      </div>
      <div class="flex flex-row space-x-1">
        <span class="font-light">Suggest for you</span>
        <span class="font-light">·</span>
        <span class="font-light">John Doe</span>
        <span class="font-light">·</span>
        <span class="font-light">6 February at 15:54 </span>
      </div>
    </div>
  </div>
  <div class="flex flex-row max-w mt-4 mb-5 ml-4">
    <span>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat minima
      libero reiciendis enim fugit! Autem quaerat.
    </span>
  </div>
  <img class="image_post" src="images/image-1.jpg" alt="" />
  <div class="flex flex-row mt-3">
    <div class="flex flex-row liked-icon-div">
      <LikeIcon class_="" />
      <span class="-mt-1 ml-2">2.7K</span>
    </div>
    <div class="flex flex-row space-x-3">
      <span class="-mt-1">1.1K</span>
      <MessagesIcon />
      <span class="ml-4 -mt-1">8</span>
      <ShareIcon />
    </div>
  </div>
  <div class="separator"></div>
  <div class="flex flex-row space-x-40 ml-8 mb-4">
    <img class="w-7" src="images/like.png"/>
    <img class="w-7" src="images/chat.png"/>    
    <img class="w-7" src="images/forward.png"/>
</div>
  <!-- <div class="separator"></div> -->

</div>

<style>
   .liked-icon-div{
        width: 22rem;
    }
.separator {
    width: 28rem;
    margin-top: 0.4rem;
    margin-bottom: 1rem;
    margin-left: 1.5rem;
    height: 1px;
    border: 1px solid #ced0d4;
  }
  .post-container {
    background-color: white;
    float: left;
  }
  .image_post {
    width: 30rem;
    max-width: 30rem;
  }
  .max-w {
    max-width: 30rem;
  }
</style>
