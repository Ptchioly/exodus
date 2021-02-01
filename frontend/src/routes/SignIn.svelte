<script lang="ts">
  import LoginForm from '../components/LoginForm.svelte';

  let phoneNumber: string;
  let pwd: string;
  let monoToken: string;

  const baseUrl =
    'http://ec2-18-195-116-110.eu-central-1.compute.amazonaws.com';
  const loginEndpoint = baseUrl.concat('/login');

  const signInButton = {
    label: 'Sign In',
    onclick: () => signIn(phoneNumber, pwd),
  };
  const signUpButton = {
    prefix: 'New to Exodus?',
    label: 'Join Now',
    href: '/signUp',
  };

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
<LoginForm
  title="Sign in to Exodus"
  linkButton={signUpButton}
  actionButton={signInButton}
>
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
  <!-- <input
    class="sobaka-input mt-5"
    type="password"
    placeholder="Monobank token"
    required
    bind:value={monoToken}
  /> -->
  <!-- <img src="images/show-password.svg" alt="show"/> -->
  <!-- <p class="my-6 text-gray-700 font-medium text-lg">Forgot your password?</p> -->
</LoginForm>

<style global lang="postcss">
  .sobaka-input {
    @apply w-3/4 text-sm text-black placeholder-gray-500 border border-gray-200 py-4 pl-5;
  }
</style>
