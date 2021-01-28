<script lang="ts">
	import TailwindCss from './TailwindCss.svelte'
</script>
<TailwindCss/>
<main>
	<h1 class="text-gray-500 font-extralight text-5xl">Hello!</h1>
	<h1 class="containter text-5xl font-bold font-main big-text">Sign in to</h1>
	<form>
		<input class="nice" placeholder="Phone number">
		<input class="nice" placeholder="Password">
		<p>Forgot your password?</p>
		<button>Sign in</button>
		<p>New to?</p><button>Join Now</button>
	</form>
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