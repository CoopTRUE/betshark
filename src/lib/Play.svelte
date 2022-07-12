<script>
  import { uuid, tickets, apiUrl } from '../stores'
  import axios from 'axios'
  import { toast } from '@zerodevx/svelte-toast'
  import GAMES from '../../constants/games'

  export let game = ''
  export let click = (..._)=>{}
  export let precheck = ()=>true
  export let onfail = ()=>{}
  export let time = 0
  const gameInfo = GAMES[game]

  const play = async() => {
    if (!precheck()) return
    if ($tickets < gameInfo.cost) {
      toast.push('Not enough tickets!', { classes: ['error'] })
      return onfail()
    }
    axios.post($apiUrl+'/play', {
      uuid: $uuid,
      game: game,
    })
    .then(response => {
      click(response.data)
      setTimeout(() => {
        $tickets = response.data.tickets
        if (response.data.win) {
          toast.push('You won!', { classes: ['success'] })
        } else {
          toast.push('You lost!', { classes: ['error'] })
        }
      }, time)
    })
    .catch(error => {
      console.log(error)
    })
  }
</script>

<div class="main">
  <button on:click={play}>
    <slot />
  </button>
  <div>Costs {gameInfo.cost}🎟️</div>
</div>
<h5>{Math.round((gameInfo.odds*100 + Number.EPSILON)*100)/100}% win {gameInfo.edge*100}% edge{gameInfo.edge*100>0 ? ' rounded' : ''}</h5>

<style>
  .main {
    display: flex;
    align-items: center;
    gap: 50px;
  }
  button:hover {
    cursor: pointer;
  }
</style>