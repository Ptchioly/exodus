<script lang="ts">
  import TailwindCss from './TailwindCss.svelte';
  import SignIn from './routes/SignIn.svelte';
  import SignUp from './routes/SignUp.svelte';
  import { Router, Route } from 'svelte-routing';

  export let url = '';
</script>

<TailwindCss />
<main class="font-main m-auto text-center">
  <Router {url}>
    <Route path="signIn" component={SignIn} />
    <Route path="signUp" component={SignUp} />
    <Route path="/" component={SignIn} pathName="/signIn" />
  </Router>
</main>

<svelte:head>
  <link rel="icon" type="image/png" href="images/favicon.png" />
</svelte:head>

<!-- Probably should be placed in html tag with tailwind and using 'rem' instead of 'px' -->
<style global lang="postcss">
  @media only screen and (min-width: 600px) {
    html {
      font-size: 12px;
    }
  }
  @media only screen and (min-width: 768px) {
    html {
      font-size: 18px;
    }
  }
  @media only screen and (min-width: 992px) {
    html {
      font-size: 22px;
    }
  }

  @media only screen and (min-width: 1200px) {
    html {
      font-size: 24px;
    }
  }
</style>
