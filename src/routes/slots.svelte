<script>
  import { onMount } from 'svelte'
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

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  async function spin() {
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
      }, 2100)
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }


</script>

<div class="content">
  <h1 class='combination'>YOU WON: {combination}</h1>
  <div class="doors">
    {#each Array(5) as _, index}
      <div class="door">
        <div class="boxes" bind:this={boxes[index]}></div>
      </div>
    {/each}
  </div>
  <button on:click={spin} class='spinBtn'>Spin!</button>
</div>

<style>
  @media (max-width: 1200px) {
    .content {
      display: block;
    }
  }
  .doors {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
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
  .spinBtn {
    background: #fafafa;
    border: 1px solid #fafafa;
    border-radius: 40px;
    padding: 20px;
    font-size: 50px;
    cursor:grabbing;
  }
</style>
