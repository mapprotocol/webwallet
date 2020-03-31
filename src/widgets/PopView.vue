<template>
  <transition>
    <div>
      <div v-show="showItem" class="pop_view">
        <div v-for="(item,index) in items" class="pop_view-item" @click.stop="actionOnItemClick(item,index)">{{item}}
        </div>
        <!--<div class="pop_view-item" @click.stop="actionOnItemClick('TRUE')">TRUE</div>-->
      </div>
      <div v-show="showItem" class="pop_view-ground" @click.stop="actionOnClose"></div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'PopView',
    model: {
      event: 'onshow',
      prop: 'show'
    },
    props: {
      items: '',
      show: [Boolean],
    },
    data() {
      return {
        showItem: false,
        itemInfo: '',
      };
    },
    watch: {
      showItem(newValue) {
        console.log('ShowImte', newValue);
      },
      show(newValue) {
        if (this.showItem != newValue) {
          this.showItem = newValue;
        }
        ;
      }
    },
    methods: {
      actionOnItemClick(row, index) {
        this.showItem = false;
        this.itemInfo = row;
        this.$emit('onChange', this.itemInfo);
        this.$emit('onChangeIndex', index);
        this.actionOnShow();
      },
      actionOnClose() {
        this.showItem = false;
        this.$emit('onshow', false);
      },
      actionOnShow() {
        this.$emit('onshow', this.showItem);
      }
    },
    mounted() {
      this.showItem = this.show;
    }
  };
</script>

<style scoped lang="less">
  @import "../assets/base";
  @import "../assets/anims";


  .pop_view-ground {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .4;
    z-index: 1;
  }

  .pop_view {
    z-index: 1000;
    min-height: 50px;
    position: absolute;
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

    .pop_view-item {
      .padding-y-7;
      .padding-x-14;
      text-align: left;
      word-break: break-word;
      position: relative;
      z-index: 1000;

      &:hover {
        cursor: pointer;
        background-color: whitesmoke;
      }
    }
  }

</style>
