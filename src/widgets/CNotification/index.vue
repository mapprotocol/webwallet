<template>
  <transition name="slide-fade"
              @after-leave="afterLeave">
    <div class="c-notification" v-show="visible">
      <div class="c-notification-inner">
        <img v-if="type != 'success'" src="../../assets/icon/icon_error.svg"/>
        <img v-else src="../../assets/icon/icon_success.svg"/>
        <div class="c-notification-content">
          <div class="c-notification-title">{{title}}</div>
          <div class="c-notification-desc" v-show="desc != null && desc != ''">{{desc}}</div>
        </div>
      </div>
      <div class="c-notification-tips" v-show="tips != null && tips != ''">{{tips}}</div>
    </div>
  </transition>

</template>

<script>
  export default {
    name: "CNotification",
    props:{
      title:'',
      desc:'',
      tips:'',
      type:{
        type:String,
        default:'success'
      }
    },
    data() {
      return {
        visible: false
      }

    },
    methods: {
      actionLeave() {
        let _this = this;
        this.$timer(function (time) {
          if (time == 0) {
            _this.visible = false
          }
        }, 1000, 1);
      },
      actionShow() {
        let _this = this;
        this.$timer(function (time) {
          if (time == 0) {
            _this.visible = true;
            _this.actionLeave();
          }
        }, 500, 0);
      },
      afterLeave() {
        this.$emit('afterLeave');
      }
    },
    mounted() {
      this.actionShow();
    }
  }
</script>

<style scoped lang="less">
  .c-notification {
    min-height: 80px;
    width: 308px;
    background: white;
    margin-bottom: 5px;
    border-radius: 2px;
    border-style: solid;
    border-width: 0;

    .c-notification-inner{
      min-height: 77px;
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: transparent;
      img{
        padding: 20px;
        width: 77px;
        height: 77px;
      }
    }
    .c-notification-content{
      text-align: left;
    }
    .c-notification-title{
      color: #1E2331;
      font-size: 16px;
      line-height: 22px;
      padding-right: 14px;
    }
    .c-notification-desc{
      color: #5F6162;
      font-size: 14px;
      line-height: 20px;
      padding-right: 14px;
    }
    .c-notification-tips{
      color: #989EB2;
      font-size: 14px;
      line-height: 30px;
      background-color: #F4F5F6;
      border-width: 0;
      border-style: solid;
      border-bottom-right-radius: 2px;
      border-bottom-left-radius: 2px;
    }
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
