<template>
<div class="flex-row flex-item-center check_item">
  <img v-if="check" class="check_item-logo" src="../../assets/icon/icon_check.png"/>
  <img v-else class="check_item-logo" src="../../assets/icon/icon_uncheck.png"/>
  <div class="check_item-"><slot></slot></div>
</div>
</template>

<script>
  export default {
    name: 'CheckItem',
    props:{
      index:[Number],
      check:{
        type:Boolean,
        default:false
      }
    },

  };
</script>

<style scoped lang="less">
  @import "../../assets/base";
  .check_item{
    &:hover{
      cursor: pointer;
    }
  }
  .check_item-logo{
    width: 24px;
    height: 24px;
  }
  .check_item-{
    font-size: 16px;
    color: #000000;
    padding-left: 7px;
    font-weight: 400;
  }

</style>
