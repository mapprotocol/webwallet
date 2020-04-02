<template>
  <div class="padding-x-14">
    <div class="custom_text">
      <textarea  :placeholder="placeHolder" v-model="inputValue"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CustomText',
    model:{
      event:'onChange',
      prop:'value'
    },
    props:{
      value:'',
      placeHolder:'',
      type:{
        type:String,
        default:'tel'
      }
    },
    data(){
      return{
        inputValue:''
      }
    },
    watch:{
      inputValue(){
        this.actionOnChange(this.inputValue)
      },
      value(newValue){
       if (newValue != this.inputValue) {
         this.inputValue = newValue;
       }
      }
    },
    methods:{
      actionOnChange(value){
        this.$emit('onChange',value);
      }
    },
    mounted(){
      this.inputValue=this.value;
    }
  };
</script>

<style scoped lang="less">
  @import "../assets/base";

  .custom_text {
    background-color: red;
    height: 100px;
    background: rgba(255, 255, 255, 1);
   .custom-box;

    textarea {
      height: 100%;
      width: 100%;
      resize: none;
      padding: 14px;
    }
  }

</style>
