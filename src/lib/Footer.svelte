<script>
  import octocat from '../assets/octocat.svg'
  import rickroll from '../assets/rickroll.svg'
</script>

<footer>
  <div class="footer-inner">
    <p>© Betshark {(new Date()).getFullYear()}. Made with ❤️ in SF</p>
    <div class="links">
      <a href="https://github.com/CoopTRUE/betshark" target="_blank"><img src={octocat} alt="Github link" class="octocat"></a>
      <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank"><img src={rickroll} alt="Click to find out :D" class="rickroll"></a>
    </div>
  <div/>
</footer>

<style>
  .footer-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .footer-inner * {
    margin: 0;
  }
  img {
    width: 50px;
    height: 50px;
  }
  p {
    font-family: 'Catamaran', sans-serif;
  }
</style>
