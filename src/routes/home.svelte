<script>
  import { link, Router } from 'svelte-routing'
  const randomPage = () => {
    const pages = ['dice', 'coinflip']
    return pages[Math.floor(Math.random() * pages.length)]
  }
</script>

<div class="content">
  <h1 class="welcome-text">
    Welcome to <span class="rainbow-text">Bet$hark</span>
  </h1>
  <Router>
  <h2 class="welcome-subtext">
    Pick a game from the navagation bar to start playing or
    <a href={randomPage()} class="surprise" use:link>
      <span>s</span><span>u</span><span>r</span><span>p</span><span>r</span><span>i</span><span>s</span><span>e</span>
      me
    </a>
  </h2>
  </Router>

</div>

<style>
  .welcome-text {
    font-size: 115px;
    margin: 0;
  }
  .welcome-subtext {
    font-size: 20px;
    margin: 0;
  }
  .surprise {
    margin:0;
    text-decoration: none;
    color: #28a6fa;
  }
  .surprise span {
    display: inline-block;
  }
  .surprise:hover span{
    animation: jump 0.5s ease;
  }
  .surprise span:nth-child(8) {
    animation-delay: .7s;
  }
  .surprise span:nth-child(7) {
    animation-delay: .6s;
  }
  .surprise span:nth-child(6) {
    animation-delay: .5s;
  }
  .surprise span:nth-child(5) {
    animation-delay: .4s;
  }
  .surprise span:nth-child(4) {
    animation-delay: .3s;
  }
  .surprise span:nth-child(3) {
    animation-delay: .2s;
  }
  .surprise span:nth-child(2) {
    animation-delay: .1s;
  }
  @keyframes jump {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
  }
  .rainbow-text {
    color: #0099ff;
    text-shadow: 0 0 10px;
  }

</style>