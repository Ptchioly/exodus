<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

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
        class="flex text-lg font-bold p-3 mr-5 rounded-3xl bg-red-600 w-3 h-3 justify-center text-center align-center items-center text-white cursor-pointer"
        on:click={() => dispatch('closeFAQ')}
      >
        x
      </div>
    </div>
    <div class="faq-structure">
      <div class="question">{$_('faq.about.q')}</div>
      <div class="answer">{$_('faq.about.a')}</div>
    </div>
    <div class="faq-structure">
      <div class="question">{$_('faq.privacy.q')}</div>
      <div class="answer">{$_('faq.privacy.a')}</div>
    </div>
    <div class="faq-structure">
      <div class="question">{$_('faq.start.q')}</div>
      <div class="answer">{$_('faq.start.a')}</div>
    </div>
    <div class="faq-structure">
      <div class="question">{$_('faq.token.q')}</div>
      <div class="answer">
        {$_('faq.token.a-before')}<a
          href="https://api.monobank.ua"
          class="text-blue-500">{$_('faq.token.link-title')}</a
        >{$_('faq.token.a-after')}
      </div>
    </div>
    <div class="faq-structure">
      <div class="question">{$_('faq.limits-point.q')}</div>
      <div class="answer">{$_('faq.limits-point.a')}</div>
    </div>
    <div class="faq-structure">
      <div class="question">{$_('faq.telegram.q')}</div>
      <div class="answer">{$_('faq.telegram.a')}</div>
    </div>
    <div class="faq-structure">
      <div class="question">{$_('faq.limits-set.q')}</div>
      <div class="answer">{$_('faq.limits-set.a')}</div>
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
