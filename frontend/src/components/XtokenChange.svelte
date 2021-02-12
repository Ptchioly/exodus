<script lang="ts">
  let xToken = '';
</script>

<div class="flex flex-col">
  <div class="flex flex-row mt-2">
    <div>X-Token</div>
    <input
      bind:value={xToken}
      placeholder="X-Token"
      class="ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5"
    />
  </div>
  <button
    class="mt-4 self-start bg-coolGreen-default py-1 px-3 rounded-md text-white"
    >Send</button
  >
</div>
