<template>
<div class="title_view">
  <div class="title_view-label">
  {{label}}<slot></slot>
  </div>
  <div v-show="tips" class="title_view-tip">{{tips}}</div>
</div>
</template>

<script>
  export default {
    name: 'TitleView',
    props:{
      label:"",
      tips:''
    }
  };
</script>

<style scoped lang="less">
  @import "../assets/base";
  .title_view{
    .flex-row;
    .flex-item-center;
    .padding-y-7;
    .padding-x-14;
  }
  .title_view-label{
    color: black;
    font-size: 18px;
    .flex-1;
    font-weight: bold;

  }
  .title_view-tip{
    font-size: 14px;
    color: @yellow100;
    padding-left: 7px;
  }


</style>
