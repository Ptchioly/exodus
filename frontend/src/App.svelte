<script lang="ts">
	import TailwindCss from './TailwindCss.svelte'
	import SignIn from './signInPage/SignIn.svelte'
</script>
<TailwindCss/>
<main>
	<h1 class="text-gray-500 font-extralight text-5xl">Hello!</h1>
	<SignIn/>
</main>

<style global lang="postcss">
	main {
		text-align: center;
		padding: 1em;
		max-width: 576px;
		margin: 0 auto;
	}

	.big-text {
		    color: #2F9E9E;
        }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>