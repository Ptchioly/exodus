<script lang="ts">
  import AlphaLabel from './items/AlphaLabel.svelte';
  import TelegramLink from './items/TelegramLink.svelte';
  import UpdateButton from './items/UpdateButton.svelte';
  import UserProfile from './items/UserProfile.svelte';
  import HeaderContainer from './HeaderContainer.svelte';
  import InfoButton from './items/InfoButton.svelte';

  export let username: string;
  const tgBotLink = 'https://t.me/exodus_MonobankBudgetBot';


  let dark: boolean = document.querySelector('html').classList.contains('dark');
  const toggleTheme = () => {
    const html = document.querySelector('html');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'light' : 'dark');
    html.classList.toggle('dark');
    dark = document.querySelector('html').classList.contains('dark');
  }
</script>

<HeaderContainer>
  <div slot="left" class="flex">
    <AlphaLabel label="alpha" />
  </div>
  <div slot="right" class="reight flex">
    <div
    class="h-8 w-8 rounded-2xl cursor-pointer mx-2 flex justify-center"
    on:click={toggleTheme}
    >
      {#if dark}
        <img src="images/sun.svg" alt="info" />
      {:else}
        <img src="images/mode_night.svg" alt="info" />
      {/if}
    </div>  
    <UpdateButton on:update />
    <InfoButton on:openFAQ />
    <TelegramLink href={tgBotLink} />
    <UserProfile on:settings on:logout {username} />
  </div>
</HeaderContainer>
