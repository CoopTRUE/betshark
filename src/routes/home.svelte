<script>
  import { onMount, onDestroy } from 'svelte'
  import { link, Router } from 'svelte-routing'

  const randomPage = () => {
    const pages = ['dice', 'coinflip', 'slots']
    return pages[Math.floor(Math.random() * pages.length)]
  }

  // thx https://stackoverflow.com/questions/37140792/how-to-change-the-color-of-the-background-based-on-mouse-position-specific-colo
  const average = function(a, b) {
    return [0.5 * (a[0] + b[0]), 0.5 * (a[1] + b[1]), 0.5 * (a[1] + b[1])];
  }
  let betsharkName

  const center = [255, 255, 255]; // white
  const topMiddle = [0, 0, 0]; // black
  const leftMiddle = [255, 0, 0]; // red
  const rightMiddle = [0, 255, 0]; // green;
  const bottomMiddle = [0, 0, 255]; // blue;


  const topLeft = average(leftMiddle, topMiddle);
  const topRight = average(topMiddle, rightMiddle);
  const bottomLeft = average(leftMiddle, bottomMiddle);
  const bottomRight = average(bottomMiddle, rightMiddle);


  const interpolate2D = function(x00, x01, x10, x11, x, y) {
    return x00 * (1 - x) * (1 - y) + x10 * x * (1 - y) + x01 * (1 - x) * y + x11 * x * y;
  }

  const interpolateArray = function(x00, x01, x10, x11, x, y) {
    const result = [0, 0, 0];
    for (let i = 0; i < 3; ++i) {
      result[i] = Math.floor(interpolate2D(x00[i], x01[i], x10[i], x11[i], x, y));
    }
    return result;
  }

  const handleMove = move => {
      let positionX = move.pageX / window.innerWidth;
      let positionY = move.pageY / window.innerHeight;
      let x00, x01, x11, x10;

      if (positionX > 0.5 && positionY > 0.5) {
        x00 = center;
        x01 = bottomMiddle;
        x10 = rightMiddle;
        x11 = bottomRight;
        positionX = 2.0 * (positionX - 0.5); // scale position back to [0, 1]
        positionY = 2.0 * (positionY - 0.5);
      } else if (positionX > 0.5 && positionY <= 0.5) {
        x00 = topMiddle;
        x01 = center;
        x10 = topRight;
        x11 = rightMiddle;
        positionX = 2.0 * (positionX - 0.5);
        positionY = 2.0 * (positionY);
      } else if (positionX <= 0.5 && positionY <= 0.5) {
        x00 = topLeft;
        x01 = leftMiddle;
        x10 = topMiddle;
        x11 = center;
        positionX = 2.0 * (positionX);
        positionY = 2.0 * (positionY);
      } else if (positionX <= 0.5 && positionY > 0.5) {
        x00 = leftMiddle;
        x01 = bottomLeft;
        x10 = center;
        x11 = bottomMiddle;
        positionX = 2.0 * (positionX);
        positionY = 2.0 * (positionY - 0.5);
      } else {
        // can't happen
      }
      const rgb = interpolateArray(x00, x01, x10, x11, positionX, positionY)

      betsharkName.style.color = 'rgb(' + rgb.join(',') + ')'
    }

  onMount(() => {
    if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
      window.addEventListener('mousemove', handleMove)
    }
  })
  onDestroy(() => {
    if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
      removeEventListener('mousemove', handleMove)
    }
  })
</script>

<div class="content">
  <h1 class="welcome-text">
    Welcome to <span class="betsharkName" bind:this={betsharkName}>Bet$hark</span>
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
  .content {
    animation: flyin 1.7s ease;
  }
  @keyframes flyin {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0);
    }
  }
  .welcome-text {
    font-size: 115px;
    margin: 0;
  }
  .welcome-subtext {
    font-size: 20px;
    margin: 0;
  }
  @media (max-width: 560px) {
    .welcome-text {
      font-size: 20vw;
      text-align: left;
    }
  }
  .surprise {
    margin:0;
    text-decoration: none;
    color: #28a6fa;
  }
  .surprise span {
    display: inline-block;
  }
  .surprise:hover span {
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
  .betsharkName {
    /* color: #0099ff; */
    text-shadow: 0 0 15px;
    letter-spacing: -5px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bolder;
  }
  .betsharkName:not(:hover) {
    background: linear-gradient(90deg,
            rgba(255, 0, 0, 1) 0%,
            rgba(255, 154, 0, 1) 10%,
            rgba(208, 222, 33, 1) 20%,
            rgba(79, 220, 74, 1) 30%,
            rgba(63, 218, 216, 1) 40%,
            rgba(47, 201, 226, 1) 50%,
            rgba(28, 127, 238, 1) 60%,
            rgba(95, 21, 242, 1) 70%,
            rgba(186, 12, 248, 1) 80%,
            rgba(251, 7, 217, 1) 90%,
            rgba(255, 0, 0, 1) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    background-size: 300% auto;
    color: transparent;
    animation: rainbow_animation 140s linear infinite;
  }
  @keyframes rainbow_animation {
    to {
        background-position: 20000vh 0;
    }
  }

</style>