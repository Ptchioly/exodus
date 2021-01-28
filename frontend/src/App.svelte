<script lang="ts">
	import TailwindCss from './TailwindCss.svelte'
</script>
<TailwindCss></TailwindCss>
<main>
	<h1 class="text-gray-500 font-extralight text-5xl">Hello!</h1>
	<h1 class="font-black italic tracking-wide text-indigo-600 text-5xl">SOBAKA</h1>
</main>

<style global lang="postcss">
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>