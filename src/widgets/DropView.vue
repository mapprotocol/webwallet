<template>
  <div class="drop_view-out" >
    <div class="drop_view-container">
      <div class="flex-row flex-item-center flex-justify-between padding-x-14"
           style="height: 100%;"
           @click="showItem=!showItem">
        <slot></slot>
        <div class="single-line flex-1">{{getName(itemInfo)}}</div>
        <img class="drop_view-arrow" src="../assets/icon/icon_arrow_down.png"/>
      </div>
      <div v-show="showItem" class="drop_view-ground" @click="actionOnItemClick(itemInfo)"></div>
      <transition>
        <div v-show="showItem" class="drop_view" :style="height?{maxHeight:height+'px'}:{}">
          <div v-for="(item,index) in items" class="drop_view-item" @click="actionOnItemClick(item,index)">{{getName(item)}}</div>
          <!--<div class="drop_view-item" @click.stop="actionOnItemClick('TRUE')">TRUE</div>-->
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DropView',
    model:{
      event:'onChange',
      prop:'value'
    },
    props: {
      items: '',
      value:'',
      height:'',
    },
    data() {
      return {
        showItem: false,
        itemInfo: '',
      };
    },
    watch:{
      showItem(newValue){
      },
      itemInfo(){
      },
      value(newValue){
        if (newValue != this.itemInfo) {
          this.itemInfo = this.getName(newValue);
        }
      }
    },
    methods: {
      getName(chain){
        if (!chain) {
          return '';
        }
        chain = chain.toUpperCase();
        if (chain === 'TRUE' || chain==='TRUECHAIN'){
          return 'TrueChain';
        }
        if (chain === 'ETH' || chain==='ETHEREUM'){
          return 'Ethereum';
        }
        return chain;
      },
      getCoin(chain){
        if (!chain) {
          return '';
        }
        chain = chain.toUpperCase();
        if (chain === 'TRUE' || chain==='TRUECHAIN'){
          return 'true';
        }
        if (chain === 'ETH' || chain==='ETHEREUM'){
          return 'eth';
        }
        return chain;
      },
      actionOnItemClick(row,index) {
        this.showItem = false;
        this.itemInfo = row;
        console.log('actionOnItemClick',this.getCoin(this.itemInfo));
        this.$emit('onChange',this.getCoin(this.itemInfo));
        this.$emit('onChangeIndex',index);

      },
      actionClose(){
        // this.showItem=false;
      }
    },
    mounted(){
      this.itemInfo = this.getName(this.value);
    }
  };
</script>

<style scoped lang="less">
  @import "../assets/base";
  @import "../assets/anims";

  .drop_view-out {
    padding: 16px;
  }

  .drop_view-container {
    position: relative;
    height: 39px;
    width: 100%;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(197, 197, 197, 1);
    border-radius: 2px;
    &:hover {
      cursor: pointer;
    }
  }

  .drop_view-arrow {
    height: 8px;
  }

  .drop_view-ground{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
  }


  .drop_view {
    min-height: 50px;
    position: absolute;
    z-index: 1000;
    top: 120%;
    left: 0;
    width: 100%;
    background-color: white;
    border-radius: 4px;
    -moz-box-shadow: 2px 2px 5px #333333;
    -webkit-box-shadow: 2px 2px 5px #333333;
    box-shadow: 2px 2px 5px #333333;
    padding-top: 14px;
    padding-bottom: 14px;
    animation: opacity01 100ms forwards;
    overflow-y: auto;

    .drop_view-item {
      line-height: 40px;
      .padding-x-14;

      &:hover {
        cursor: pointer;
        background-color: whitesmoke;
      }
    }
  }

</style>
