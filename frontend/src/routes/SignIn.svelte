<script lang="ts">
  import { Link } from 'svelte-routing';

  let phoneNumber: string;
  let pwd: string;

  const baseUrl =
    'http://ec2-18-195-116-110.eu-central-1.compute.amazonaws.com';
  const loginEndpoint = baseUrl.concat('/login');

  export const signIn = async (
    phoneNumber: string,
    pwd: string
  ): Promise<any> => {
    const token = await fetch(loginEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: phoneNumber,
        password: pwd,
      }),
    }).then((el) => el.json());
    localStorage.setItem('token', token.token);

    const statementEndpoint = baseUrl.concat('/auth');

    const code = await fetch(statementEndpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((res) => res.status);
    if (code === 200)
      window.location.href = window.location.href
        .slice(0, window.location.href.lastIndexOf('/'))
        .concat('/home');
    else {
      alert('Ti ne Ptchiola');
      location.reload();
    }
  };
</script>

<!-- TODO: Make template more responsive.
     This should be done by implementing mobile design first
     Also I think that bg-color should fill the whole space on small screens
-->
<div
  class="max-w-none h-screen md:max-w-sm  bg-gray-signIn m-auto bg-opacity-50 lg:mt-20 lg:h-4/6"
>
  <h1
    class="containter text-3xl text-coolGreen-default font-bold big-text pt-20 lg:pt-11 pb-7 leading-9"
  >
    Sign in to Exodus
  </h1>
  <form class="m-auto">
    <input
      class="sobaka-input"
      type="text"
      placeholder="Phone number"
      required
      bind:value={phoneNumber}
    />
    <div>
      <input
        class="sobaka-input mt-12"
        type="password"
        placeholder="Password"
        required
        bind:value={pwd}
      />
      <!-- <img src="images/show-password.svg" alt="show"/> -->
    </div>
    <p class="my-6 text-gray-700 font-medium text-lg">Forgot your password?</p>
    <button
      type="button"
      on:click={() => signIn(phoneNumber, pwd)}
      class="text-gray-50 bg-coolGreen-default py-1 px-5 text-2xl uppercase font-medium"
      >Sign In</button
    >
  </form>
  <div class="grid grid-cols-2 col-auto mt-9 lg:pb-14">
    <p>New to Exodus?</p>
    <Link to="signUp">
      <a href="/signUp">Join Now</a>
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
