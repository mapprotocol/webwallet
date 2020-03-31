<template>
  <transition name="fade">
    <div v-if="show1" class="custom-dialog" @click="onclose()">
      <div class="custom-dialog-content">
        <div @click.stop="">
        <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'CustomDialog',
    model: {
      event: 'onShow',
      prop: 'show'
    },
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        show1: false,
      };
    },
    watch: {
      show() {
        if (this.show !== this.show1) {
          this.show1 = this.show;
        }
      },
      show1(){

      }
    },
    methods: {
      onshow() {
        this.show1=true;
        this.$emit('onShow', this.show1);
      },
      onclose() {
        this.show1=false;
        this.$emit('onShow', this.show1);
      }
    },
    mounted() {
      this.show1 = this.show;
    }
  };
</script>

<style scoped lang="less">
  @import "../assets/base";

  .custom-dialog {
    z-index: 10000;
    background-color: rgba(0, 0, 0, .5);
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .custom-dialog-content {
    width: 100%;
    height: 100%;
    .flex-column;
    .flex-item-center;
    .flex-justify-center;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-active /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

</style>
