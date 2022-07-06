<script>
  import { onMount } from 'svelte'
  import { address, tickets } from '../stores'
  import MetaButton from './Login.svelte'
  import axios from 'axios'

  export let needTickets = false

  onMount(() => {
    if ($tickets !== null || $address === null) {
      return
    }
    console.log('hii')
    axios.get('http://localhost:2000/tickets/' + $address)
      .then(res => {
        tickets.set(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  })
</script>

<div class="tickets">
  {$tickets ?? ''}🎟️
  {#if needTickets}
    <a href="tickets">Need tickets?</a>
  {/if}
</div>

<style>
  .tickets {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px
  }
</style>