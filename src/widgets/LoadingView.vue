<template>
<div v-show="show" class="loading_view" @click.stop="actionClick">
  <div class="position-relative">
  <div class="loading_view-left"></div>
  <div class="loading_view-right"></div>
  </div>
</div>
</template>

<script>
  export default {
    name: 'LoadingView',
    props:{
      show:{
        type:Boolean,
        default:false
      }
    },
    methods:{
      actionClick(){
        //do nothing is ok
      }
    }
  };
</script>

<style scoped lang="less">
  @import "../assets/base";
  @import "../assets/loading.css";
  .loading_view{
    position: absolute;
    z-index: 10000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.7);
    .flex-column;
    .flex-item-center;
    .flex-justify-center;
    padding-bottom: 10%;
  }
  @size:70px;
  @mask:30px;

  .loading_view-left{
    position: absolute;
    left: 0;
    top: 0;
    width: @size; height: @size;
    border-radius: 50%;
    mask: radial-gradient(transparent @mask, #000 @mask);
    overflow: hidden;
    background: conic-gradient(rgba(255,255,255,0.9),#EDE604);
    filter: blur(2px);
    animation: left-rotate 2s infinite;
  }
  .loading_view-right{
    position: absolute;
    left: 0;
    top: 0;
    width: @size; height: @size;
    border-radius: 50%;
    mask: radial-gradient(transparent @mask, #000 @mask);
    overflow: hidden;
    background: conic-gradient(rgba(255,255,255,0.4),#0071BC);
    filter: blur(2px);
    animation: right-rotate 4s infinite;
  }


</style>
