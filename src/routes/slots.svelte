<script>
  import MetaButton from '../lib/Login.svelte';
  import slotSpinning from '../audio/slot-spinning.mp3'

  const items = [
    "🍇",
    "🍉",
    "🍋",
    "🍌",
    "🍍",
    "🍎",
    "🍐",
    "🍑",
    "🍒",
    "🍓"
  ]
  let boxes = []
  let combination = ''
  let slotSpinningAudio

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  async function spin() {
    let completed = 0
    slotSpinningAudio.currentTime = 0;
    slotSpinningAudio.play();
    combination = ''
    for (const boxesElem of boxes) {
      const door = boxesElem.parentElement
      boxesElem.style.transitionDuration = '0s'
      boxesElem.style.transform = `translateY(-${door.clientHeight * (items.length - 1)}px)`
      boxesElem.innerHTML = ''
      for (const item of shuffle(items)) {
        const box = document.createElement('div')
        box.style.display = 'flex'
        box.style.justifyContent = 'center'
        box.style.alignItems = 'center'
        box.style.fontSize = '10rem'
        box.style.width = door.clientWidth + 'px'
        box.style.height = door.clientHeight + 'px'
        box.textContent = item
        boxesElem.appendChild(box)
      }
      boxesElem.style.transitionDuration = '2.5s'
      boxesElem.style.transform = 'translateY(0px)'
      setTimeout(() => {
        combination += boxesElem.children[0].textContent
        if (++completed === boxes.length) {
          slotSpinningAudio.pause();
        }
      }, 2200)
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }


</script>

<audio src={slotSpinning} preload="auto" bind:this={slotSpinningAudio}></audio>
<MetaButton />
<div class="content">
  <div class="doors">
    {#each Array(5) as _, index}
      <div class="door">
        <div class="boxes" bind:this={boxes[index]}></div>
      </div>
    {/each}
  </div>
  <h1 class="combination">YOU WON: {combination}</h1>
  <button on:click={spin} class="spinBtn">Spin!</button>
</div>

<style>
  @media (max-width: 1199.5px) {
    .content {
      height: fit-content;
    }
  }
  .doors {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    overflow: hidden;
  }
  .door {
    background: #fafafa;
    width: 200px;
    height: 220px;
    overflow: hidden;
    border-radius: 20px;
    margin: 20px;
    color: orange;
    /* border: 10px solid orange; */
  }
  .combination {
    margin: 15px;
  }
  .spinBtn {
    background: #fafafa;
    border: 1px solid #fafafa;
    border-radius: 40px;
    padding: 20px;
    font-size: 50px;
    cursor: grabbing;
    margin-bottom: 50px;
  }
</style>
