<template>
  <div class="padding-y-7 padding-x-14">
    <div class="custom_input">
      <form v-if="type=='password'" style="width: 100%;height: 100%">
        <input class="custom_input-input" type="password" :placeholder="placeHolder" v-model="inputValue"/>
      </form>
      <input v-else class="custom_input-input"  :type="type" :placeholder="placeHolder" v-model="inputValue"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CustomInput',
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
        if (newValue !== this.inputValue) {
          this.inputValue = newValue;
        }

      }
    },
    methods:{
      actionOnChange(value){
        this.inputValue = value;
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

  .custom_input {
    .padding-x-14;
    background-color: red;
    height: 40px;
    background: rgba(255, 255, 255, 1);
    .custom-box;

    .custom_input-input {
      height: 100%;
      width: 100%;
      background: none;
      -webkit-box-shadow: none;
      box-shadow: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      outline: none;
      border: none;
      border-radius: 0 0 0 0;
    }
  }

</style>
