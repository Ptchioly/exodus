<script lang="ts">
</script>

<div class="graph-cont">
  <div class="bar bar1">60%</div>
  <div class="bar bar2">72%</div>
  <div class="bar bar3">47%</div>
  <div class="bar bar4">20%</div>
</div>

<style>
  .bar {
    height: 30px;
    max-width: 800px;
    margin: 0 auto 10px auto;
    line-height: 30px;
    font-size: 16px;
    color: white;
    padding: 0 0 0 10px;
    position: relative;
  }
  .bar::before {
    content: "";
    width: 100%;
    position: absolute;
    left: 0;
    height: 30px;
    top: 0;
    z-index: -2;
    background: #ecf0f1;
  }
  .bar::after {
    content: "";
    background: #2ecc71;
    height: 30px;
    transition: 0.7s;
    display: block;
    width: 100%;
    -webkit-animation: bar-before 1 1.8s;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .bar1::after {
    max-width: 60%;
  }
  .bar2::after {
    max-width: 72%;
  }
  .bar3::after {
    max-width: 47%;
  }
  .bar4::after {
    max-width: 20%;
  }
  @-webkit-keyframes bar-before {
    0% {
      width: 0px;
    }
    100% {
      width: 100%;
    }
  }
</style>
