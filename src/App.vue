<template>
  <div id="app">
    <div class="nav-bar">
      <div class="content">
        <img class="nav-bar-logo" src="./assets/icon/icon_logo.png"/>
        <div class="nav-bar-name margin-left-14">{{$t('MarcopoloWallet')}} </div>
        <div class="flex-1"></div>
        <div class="nav-bar-lang flex-row flex-item-center padding-left-14 padding-right-14"
        @click="showLang=true">{{$t('Language')}}：
          <div >{{languages[langIndex]}}
          <img src="./assets/icon/icon_arrow_down.png"/>
          </div>
          <pop-view v-model="showLang" :items="languages" @onChangeIndex="actionChangeLanguage"></pop-view>
        </div>
      </div>
    </div>
    <router-view/>
    <!--tips-->
    <div class="e-trading-queue">
      <c-notification
        v-for="(item,index) in notifications"
        :type="item.type"
        :title="item.title"
        @afterLeave="actionAfterLeave"></c-notification>
    </div>

  </div>
</template>
<style lang="less">
  @import "./assets/base";
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
  }

  .nav-bar {
    width: 100%;
    height: 100px;
    position: relative;
    z-index: 1000;
    /*top: 0;*/
    /*left: 0;*/
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-shadow:0px 1px 5px 0px rgba(171,171,171,0.44);
    .content{
      width: 1200px;
      height:100%;
      background-color: white;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .nav-bar-logo{
      height: 57px;
      width: 57px;
    }
    .nav-bar-name{
      height:26px;
      font-size:24px;
      font-family:Microsoft YaHei;
      font-weight:bold;
      color:rgba(51,51,51,1);
    }
    .nav-bar-wifi{
      width:213px;
      height:26px;
      background:rgba(253,249,232,1);
      border:1px solid rgba(248,223,196,1);
      border-radius:13px;
      line-height: 26px;
      text-align: center;
      font-size:14px;
      font-family:Microsoft YaHei;
      font-weight:400;
      color:rgba(227,157,83,1);
    }
    .nav-bar-lang{
      text-align: right;
      min-width: 180px;
      height:16px;
      font-size:16px;
      font-family:Microsoft YaHei;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:48px;
      position: relative;
      .flex-justify-end;
      img{
        width: 12px;
      }
      &:hover{
        cursor: pointer;
      }
    }
  }

  /*交易提示框*/
  .e-trading-queue {
    /*background-color: red;*/
    z-index: 100000;
    padding-right: 20px;
    height: 100%;
    position: fixed;
    right: 0;
    top: 10%;
    pointer-events: none;
  }
</style>
<script>
  import MainContent from './widgets/MainContent';
  import CNotification from './widgets/CNotification/index';
  import DropView from './widgets/DropView';
  import PopView from './widgets/PopView';
  import Requester from './utils/requester';

  export default {
    components: { PopView, DropView, CNotification, MainContent },
    data(){
      return{
        showLang:false,
        notifications:[],
        languages:['English','中文','한국어'],
        langIndex:0
      }
    },
    created(){
      this.$bus.$on('failed',(params)=>{
        this.notifications.push({
          type:'failed',
          title:params
        })

      });
      this.$bus.$on('success',(params)=>{
        this.notifications.push({
          type:'success',
          title:params
        })
      });
    },
    methods:{
      actionAfterLeave() {
        this.notifications.splice(0, 1);
      },
      actionChangeLanguage(index){
        this.langIndex = index;
        let lang = 'zh';
        if (index === 0) {
          lang='en';
        }else if (index===2){
          lang='ko';
        } ;
        this.$i18n.locale=lang;
        localStorage.setItem('language',lang);
      }
    },
    async mounted(){
      this.langIndex = this.$i18n.langIndex;
      let isProduct = process.env.NODE_ENV !=='development';
      let baseUrl = isProduct?'https://usersideapi.marcopay.org':'/api';
      let resutl = await new Requester(baseUrl).get({},"/api/queryTokenRate");
      if (resutl['code']===200){
        resutl = resutl['data']['rateList'];
        let rate_usd = {};
        for (let item of resutl) {
          rate_usd[item['token']]=item['price']
        }
        localStorage.setItem('rate_usd',JSON.stringify(rate_usd));
      }
    }
  };
</script>
