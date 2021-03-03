<script lang="ts">
  import AlphaLabel from './items/AlphaLabel.svelte';
  import TelegramLink from './items/TelegramLink.svelte';
  import UpdateButton from './items/UpdateButton.svelte';
  import UserProfile from './items/UserProfile.svelte';
  import HeaderContainer from './HeaderContainer.svelte';
  import InfoButton from './items/InfoButton.svelte';

  export let username: string;
  const tgBotLink = 'https://t.me/exodus_MonobankBudgetBot';
</script>

<HeaderContainer>
  <div slot="left" class="flex transform md:scale-100 xs:scale-125">
    <AlphaLabel label="alpha" />
  </div>
  <div
    slot="right"
    class="flex transform md:scale-100 xs:scale-150 md:mr-0 xs:mr-10"
  >
    <InfoButton on:openFAQ />
    <UpdateButton on:update />
    <TelegramLink href={tgBotLink} />
    <UserProfile on:settings on:logout {username} />
  </div>
</HeaderContainer>
