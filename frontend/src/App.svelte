<script lang="ts">
  import TailwindCss from './TailwindCss.svelte';
  import SignIn from './signInPage/SignIn.svelte';
  import SignUp from './signInPage/SignUp.svelte';
  import { Router, Route } from 'svelte-routing';

  export let url = '';
</script>

<TailwindCss />
<main class="font-main">
  <Router {url}>
    <Route path="signIn" component={SignIn} />
    <Route path="signUp" component={SignUp} />
    <Route path="/" component={SignIn} pathName="/signIn" />
  </Router>
</main>

<style global lang="postcss">
  main {
    text-align: center;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  /* Small devices (portrait tablets and large phones, 600px and up) */
  @media only screen and (min-width: 600px) {
    html {
      font-size: 12px;
    }
  }

  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (min-width: 768px) {
    html {
      font-size: 18px;
    }
  }

  /* Large devices (laptops/desktops, 992px and up) */
  @media only screen and (min-width: 992px) {
    html {
      font-size: 22px;
    }
  }

  /* Extra large devices (large laptops and desktops, 1200px and up) */
  @media only screen and (min-width: 1200px) {
    html {
      font-size: 24px;
    }
  }
</style>
