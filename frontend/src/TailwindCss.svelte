<!-- 
    If you're adding your styles to this file when testing, the compile time may increase dramaticaly
    It happens because svelte preprocess runs whole tailwind code through which takes some time since it's codebase is kinda large
-->

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities; 
</style>