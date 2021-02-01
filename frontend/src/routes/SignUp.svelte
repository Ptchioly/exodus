<script lang="ts">
  import { signIn } from '../endpointApi';
  import { Link } from 'svelte-routing';

  let phoneNumber;
  let pwd;
</script>

<div
  class="max-w-none max-h-none md:max-w-sm bg-gray-signIn m-auto bg-opacity-50 lg:mt-20 lg:h-4/6"
>
  <h1
    class="containter text-3xl text-coolGreen-default font-bold big-text pt-20 lg:pt-11 pb-7 leading-9"
  >
    Sign UP
  </h1>
  <form class="m-auto">
    <input
      class="sobaka-input"
      type="text"
      placeholder="Phone number"
      required
      bind:value={phoneNumber}
    />
    <input
      class="sobaka-input mt-5"
      type="password"
      placeholder="Password"
      required
      bind:value={pwd}
    />
    <input
      class="sobaka-input mt-5"
      type="password"
      placeholder="Confirm Password"
      required
      bind:value={pwd}
    />
    <!-- <img src="images/show-password.svg" alt="show"/> -->
    <button
      type="button"
      on:click={() => signIn(phoneNumber, pwd)}
      class="text-gray-50 bg-coolGreen-default py-1 px-5 text-2xl uppercase font-medium mt-12"
      >Sign Up</button
    >
  </form>
  <div class="grid grid-cols-2 col-auto mt-9 pb-32 lg:pb-14">
    <p>Have an account?</p>
    <Link to="signIn">
      <button>Sign In</button>
    </Link>
  </div>
</div>

<style global lang="postcss">
  button {
    border-radius: 34px;
  }
  .sobaka-input {
    @apply w-3/4 text-sm text-black placeholder-gray-500 border border-gray-200 py-4 pl-5;
  }
</style>
