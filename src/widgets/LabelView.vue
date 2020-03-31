<template>
<div class="label_view">
  <div class="label_view-label">{{label}}</div>
  <slot></slot>
</div>
</template>

<script>
  export default {
    name: 'LabelView',
    props:{
      label:''
    }
  };
</script>

<style scoped lang="less">
  @import "../assets/base";
  .label_view{
  }
  .label_view-label{
    color: #181818;
    font-size: 14px;
    font-weight: bold;
    .padding-y-14;
    .padding-x-14;

  }

</style>
