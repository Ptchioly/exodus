<script lang="ts">
  import AlphaLabel from './items/AlphaLabel.svelte';
  import TelegramLink from './items/TelegramLink.svelte';
  import UpdateButton from './items/UpdateButton.svelte';
  import UserProfile from './items/UserProfile.svelte';
  import HearedBar from './HeaderContainer.svelte';

  export let username: string;
  const tgBotLink = 'https://t.me/exodus_MonobankBudgetBot';
</script>

<HearedBar>
  <div slot="left" class="flex">
    <AlphaLabel label="alpha" />
  </div>
  <div slot="right" class="reight flex">
    <UpdateButton on:update />
    <TelegramLink href={tgBotLink} />
    <UserProfile on:settings on:logout {username} />
  </div>
</HearedBar>
