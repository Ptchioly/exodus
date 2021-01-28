<script lang="ts">
  const currentMonthWidth = 65;
  const previousMonthValue = 15;
</script>

<div class="category">
  <span>Taxi</span>
  <div class="bar">
    <div class="current-month" style="--curr-width:{currentMonthWidth}%" />
    <div class="previous-month" style="--prev-width:{previousMonthValue}%" />
    <div class="remaining-bar" />
    <div class="limit-indicator" />
  </div>
  <div class="limit-input">50</div>
</div>

<style>
  .category {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .bar {
    width: 90%;
    height: 2em;

    display: inline-flex;
    flex-flow: row nowrap;
    justify-content: left;
    align-items: left;
  }
  .current-month {
    width: var(--curr-width);
    background-color: green;
  }
  .previous-month {
    width: var(--prev-width);
    opacity: 0.4;
    background-color: green;
  }
  .remaining-bar {
    opacity: 0.2;
    flex: 1;
    background: linear-gradient(to right, green 0%, #ffffff 100%);
  }
  .span {
    /* display: inline-block;
    text-align: left; */
  }
  .limit-input {
  }
</style>
