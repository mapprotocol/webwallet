<template>
  <div class="main-content">
    <div class="main-content-inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MainContent'
  };
</script>

<style scoped lang="less">
  @import "../assets/base";

  .main-content {
    min-width: 1200px;
    .flex-row;
    .flex-justify-center;
  }
  .main-content-inner{
    width: 1200px;
    min-height: 100px;
  }


</style>
