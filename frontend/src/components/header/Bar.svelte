<script lang="ts">
  import AlphaLabel from './items/AlphaLabel.svelte';
  import TelegramLink from './items/TelegramLink.svelte';
  import UpdateButton from './items/UpdateButton.svelte';
  import UserProfile from './items/UserProfile.svelte';
  import HeaderContainer from './HeaderContainer.svelte';
  import InfoButton from './items/InfoButton.svelte';
  import ThemeSwitcher from './items/ThemeSwitcher.svelte';

  export let username: string;
  const tgBotLink = 'https://t.me/exodus_MonobankBudgetBot';
</script>

{#if username}
  <HeaderContainer>
    <div slot="left" class="flex transform scale-100">
      <AlphaLabel label="beta" />
    </div>
    <div
      slot="right"
      class="flex transform md:scale-100 xs:scale-150 md:mr-0 xs:mr-10"
    >
      <ThemeSwitcher />
      <UpdateButton on:update />
      <InfoButton on:openFAQ />
      <TelegramLink href={tgBotLink} />
      <UserProfile on:settings on:logout {username} />
    </div>
  </HeaderContainer>
{/if}
