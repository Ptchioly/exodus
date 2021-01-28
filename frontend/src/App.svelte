<script lang="ts">
	import TailwindCss from './TailwindCss.svelte'
	import SignIn from './signInPage/SignIn.svelte'
</script>
<TailwindCss/>
<main class="font-main">
	<h1 class="text-gray-500 text-coolGreen-default font-extralight text-5xl py-14">Hello!</h1>
	<SignIn/>
</main>

<style global lang="postcss">
	main {
		text-align: center;
		padding: 1em;
		max-width: 576px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>