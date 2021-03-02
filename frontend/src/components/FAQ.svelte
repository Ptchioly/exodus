<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<div
  id="bg"
  class="bg-white w-4/5 h-3/4 md:w-3/5 m-auto shadow-2xl rounded-xl overflow-scroll"
>
  <div class="flex flex-col relative justify-between px-5 pt-5 text-left">
    <div class="flex justify-between flex-row mb-5">
      <div class="text-lg font-bold">FAQ</div>
      <div
        class="flex text-lg font-bold p-3 mr-5 rounded-3xl bg-red-600 w-3 h-3 justify-center items-center text-white cursor-pointer"
        on:click={() => dispatch('closeFAQ')}
      >
        x
      </div>
    </div>
    <div class="faq-structure">
      <div class="question">Q: What this service is about?</div>
      <div class="answer">
        A: Here you can do multiple things such as monitoring your monobank
        spendings, setting limits for each spending category and much more!
      </div>
    </div>
    <div class="faq-structure">
      <div class="question">Q: Is my information private?</div>
      <div class="answer">
        A: Yes of course! Your information is 100% secure and will not be handed
        over to any 3-rd parties.
      </div>
    </div>
    <div class="faq-structure">
      <div class="question">Q: How do I start working with the service?</div>
      <div class="answer">
        A: In order to do so, you need to register with your phone number and
        provide an X-Token than Monobank gives you.
      </div>
    </div>
    <div class="faq-structure">
      <div class="question">Q: Where do I get Monobank token?</div>
      <div class="answer">
        A: You can get it by visiting <a href="https://api.monobank.ua">this</a>
        link or by clicking on Mono logo on sign-up page.
      </div>
    </div>
    <div class="faq-structure">
      <div class="question">
        Q: What is the point of setting limits for categories?
      </div>
      <div class="answer">
        A: If you set a limit and then exceed it, you will get a notification on
        Telegram (if you have set up notifications before).
      </div>
    </div>
    <div class="faq-structure">
      <div class="question">Q: How to set up Telegram notifications?</div>
      <div class="answer">
        A: Just click Telegram link at the top after entering and follow the
        insructions.
      </div>
    </div>
    <div class="faq-structure">
      <div class="question">Q: How to set a limit?</div>
      <div class="answer">
        A: Click on '+' sign on the left of the catefory bar and then type the
        amount you want. You can also drag the limit without typing but that
        feature is currently unavailable on mobile devices.
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  #bg {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 4000;
    user-select: none;
  }

  .question {
    @apply pb-2 font-semibold;
  }

  .faq-structure {
    @apply pb-7;
  }
</style>
