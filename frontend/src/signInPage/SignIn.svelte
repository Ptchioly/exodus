<script lang="ts">
    import {signIn} from './loginApi'

    let phoneNumber;
    let pwd;
</script>
<div class="max-w-sm bg-gray-signIn m-auto bg-opacity-50 lg:mt-20">
<h1 class="containter text-3xl text-coolGreen-default font-bold big-text pt-11 pb-7 leading-9">
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
    <button type="button" on:click={() => signIn(phoneNumber, pwd)}
        class="text-gray-50 bg-coolGreen-default py-1 px-5 text-2xl uppercase font-medium"
        >Sign In</button>
</form>
<div class="joinwrapper">
<div class="grid grid-cols-2 col-auto mt-9 pb-14">
    <p>New to Exodus?</p>
    <button>Join Now</button>
</div>
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
