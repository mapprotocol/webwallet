<template>
  <div class="coin-item" @click="actionOnClick">
    <div class="coin-item-name">{{name}}</div>
    <div class="flex-column flex-justify-center padding-left-14">
      <div class="coin-item-amount">{{amount}}</div>
      <div class="coin-item-currency padding-top-7">{{currency}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CoinItem',
    props:{
      name:'',
      amount:[String,Number],
      currency:''
    },
    methods:{
      actionOnClick(){
        this.$emit('onclick')
      }
    }
  };
</script>

<style scoped lang="less">
  @import "../assets/base";

  .coin-item {
    .flex-row;
    .padding-y-14;
    .padding-x-28;
    width: 100%;
    &:hover{
      cursor: pointer;
      background-color: white;
    }

  }
  .coin-item-name{
    .flex-column;
    .flex-justify-center;
    .flex-item-center;
    width:58px;
    height:58px;
    background:rgba(255,255,255,1);
    border-radius:50%;
    font-size:12px;
    font-family:Microsoft YaHei;
    font-weight:bold;
    color:rgba(0,0,0,1);
    text-align: center;
    padding-left: 4px;
    padding-right: 4px;
    word-break: break-word;
  }

  .coin-item-amount{
    font-size:18px;
    font-family:Arial;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:18px;
  }
  .coin-item-currency{
    width:35px;
    font-size:14px;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:14px;
  }

</style>
