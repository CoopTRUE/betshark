<script>
  import { Router, Route, Link, link } from 'svelte-routing'
  import Home from './routes/home.svelte'
  import Dice from './routes/dice.svelte'
  import Coinflip from './routes/coinflip.svelte'
  import betshark from './assets/betshark-logo.png'
</script>

<Router>
  <div class="navbar">
    <div class="nav-container">
      <div class="nav-menu">
        <a href="/" use:link><img src={betshark} alt="Betshark logo" class="betshark-logo"></a>
        <a href="dice" use:link>Dice</a>
        <a href="coinflip" use:link>Coinflip</a>
      </div>
    </div>
  </div>
  <Route path="/"><Home /></Route>
  <Route path="/dice"><Dice /></Route>
  <Route path="/coinflip"><Coinflip /></Route>
</Router>

<style>
  :global(body) {
    margin: 0;
    background-color: black;
    color: white;
  }
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
</style>