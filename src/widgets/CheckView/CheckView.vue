<template>
  <div class="flex-row flex-justify-around check_view">
    <div class="flex-row flex-item-center check_item"
         @click="actionOnItemClick('true')">
      <img v-if="coin==='true'" class="check_item-logo" src="../../assets/icon/icon_check.png"/>
      <img v-else class="check_item-logo" src="../../assets/icon/icon_uncheck.png"/>
      <div class="check_item-">Truechain</div>
    </div>
    <div class="flex-row flex-item-center check_item"
         @click="actionOnItemClick('eth')">
      <img v-if="coin==='eth'" class="check_item-logo" src="../../assets/icon/icon_check.png"/>
      <img v-else class="check_item-logo" src="../../assets/icon/icon_uncheck.png"/>
      <div class="check_item-">Ethereum</div>
    </div>
  </div>
</template>

<script>
  import CheckItem from './CheckItem';

  export default {
    name: 'CheckView',
    components: { CheckItem },
    model:{
      event:'onChange',
      prop:'value'
    },
    props:{
      value:[Number,String],
    },
    data() {
      return {
        coin: ''
      };
    },
    methods: {
      actionOnItemClick(index) {
        console.log(index);
        this.coin = index;
        this.$emit('onChange',this.coin);
      }
    },
    mounted(){
      this.coin=this.value;
    }
  };
</script>

<style scoped lang="less">
  @import "../../assets/base";
  .check_view{
    .padding-y-14;
  }

  .check_item {
    &:hover {
      cursor: pointer;
    }
  }

  .check_item-logo {
    width: 24px;
    height: 24px;
  }

  .check_item- {
    font-size: 16px;
    color: #000000;
    padding-left: 7px;
    font-weight: 400;
  }


</style>
