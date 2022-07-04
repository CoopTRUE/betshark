<script>
  import { onMount } from 'svelte';
  import { Router, link } from 'svelte-routing'
  import betshark from '../assets/betshark-logo.png'
  const routes = [
    'LOGO',
    'slots',
    'dice',
    'coinflip'
  ]
  let selected = [
    false,
    false,
    false,
    false
  ]

  const updateSelected = index => {
    selected = selected.map((_, i) => i === index)
  }

  onMount(() => {
    selected[routes.indexOf(window.location.pathname.substring(1))] = true
  })
</script>

<Router>
  <div class="navbar">
    <div class="nav-container">
      <div class="nav-menu">
        <a href="/" use:link>
          <img src={betshark} alt="Betshark logo" class="betshark-logo" on:click={()=>{updateSelected(0)}}>
        </a>
        {#each routes.slice(1) as page, index}
          <a
            href={"/"+page}
            use:link
            class:clicked={selected[index+1]}
            on:click={() => updateSelected(index+1)}
          >
            {page.charAt(0).toUpperCase()+page.substring(1)}
          </a>
        {/each}
      </div>
    </div>
  </div>
</Router>

<style>
  .navbar {
    background-color: #28a6fa;
    font-size: 40px;
  }
  .nav-container {
    display: flex;
    justify-content: center;
    align-items: stretch;
    padding: 10px;
  }
  .nav-menu {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  @media (max-width: 768px) {
    .nav-menu {
      flex-direction: column;
    }
    .nav-menu a {
      margin: 5px;
    }
  }
  .nav-menu a {
    color: white;
    margin-left: 20px;
    margin-right: 20px;
    padding: 5px;
    text-decoration: none;
  }
  .betshark-logo {
    height: 40px;
  }
  a:hover {
    transform: translateY(-5px);
  }
  .clicked {
    color: blue !important;
  }
</style>