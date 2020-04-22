<template>
  <div class="slider_view">
    <div class="slider_view-background"></div>
    <input :ref="viewId"
           type="range"
           style="width: 100%;"
           v-model="step"
           :max="max">
    <div class="position-relative padding-top-7">
      <div :ref="stepId" class="slider_view-step">{{step}}</div>
      <div class="flex-row slider_view-limit">
        <div>0</div>
        <div class="flex-1"></div>
        <div>{{max}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SliderView',
    model:{
      prop:'value',
      event:'onChange'
    },
    props:{
      max:{
        type:Number,
        default:100
      },
      value:[Number,String]
    },
    data() {
      return {
        step: 0,
        viewId: `Slider-view_${new Date().getTime()}`,
        stepId: `Slider-step_${new Date().getTime()}`,
      };
    },
    created() {
      // this.viewId=`Slider-${new Date().getTime()}`
    },
    watch: {
      step(newValue) {
        this.matchStep();
      }
    },
    methods:{
      actionOnChange(){
        this.$emit('onChange',this.step)
      },
      matchStep(){
        let el = this.$refs[this.viewId];
        let value = (this.step / el.max) * 100;
        el.style.backgroundSize = `${value}% 100%`;
        let el2 = this.$refs[this.stepId];
        let fixValue=value;
        fixValue = el.clientWidth-el2.clientWidth;
        fixValue = value*fixValue/100;
        el2.style.left = `${fixValue}px`;
        this.actionOnChange();
      }
    },
    mounted() {
      this.step=isNaN(parseFloat(this.value))?0:parseFloat(this.value);
      this.matchStep();
    }
  };
</script>

<style scoped lang="less">
  @import "../assets/base";

  .slider_view {
    position: relative;
    padding-left: 14px;
    padding-right: 14px;
  }

  .slider_view-background {
    background-color: #dddddd;
    position: absolute;
    left: 14px;
    right: 14px;
    margin-top: 8px;
    height: 8px;
    border-radius: 8px; /*将轨道设为圆角的*/
  }

  .slider_view-step {
    background-color: #0071BC;
    color: white;
    display: inline-block;
    position: absolute;
    padding-left: 4px;
    padding-right: 4px;
    border-radius: 4px;
    left: 0%;

  }
  .slider_view-limit{
    font-size: 12px;
    color: #ccc;

  }

  input[type=range] {
    position: relative;
    -webkit-appearance: none;
    width: 300px;
    border-radius: 7px; /*这个属性设置使填充进度条时的图形为圆角*/
    background: -webkit-linear-gradient(#0071BC, #0071BC) no-repeat;
    background-size: 0% 100%;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      background-color: #ddd;
    }

    &::-webkit-slider-runnable-track {
      height: 8px;
      border-radius: 8px; /*将轨道设为圆角的*/
      /*background: -webkit-linear-gradient(#ddd, #ddd) no-repeat;*/
      /*background-size: 100% 100%;*/
      /*box-shadow: 0 1px 1px #ddd, inset 0 .125em .125em #000; !*轨道内置阴影效果*!*/
    }

    &:focus {
      /*outline: none;*/
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 21px;
      width: 21px;
      margin-top: -6px; /*使滑块超出轨道部分的偏移量相等*/
      background: #0071BC;
      border-radius: 50%; /*外观设置为圆形*/
      border: solid 0.125em #0071BC; /*设置边框*/
      box-shadow: 0 .125em .125em #3b4547; /*添加底部阴影*/
    }
  }
</style>
