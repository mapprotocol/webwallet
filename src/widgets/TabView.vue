<template>
  <div>
    <div v-show="tabs&& tabs.length>0" class="tab_view">
      <div class="tab_view-item " v-for="(item,index) in tabs"
           :class="index===tabIndex?'tab_view-item-select':'tab_view-item-normal'"
           @click="actionOnTabChange(index)">
        {{$t(item)}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TabView',
    props: {
      tabs: ''
    },
    data() {
      return {
        tabIndex: 0
      };
    },
    methods:{
      actionOnTabChange(index){
        this.tabIndex=index;
        let tab=this.tabs[index];
        this.$emit('onChange',{key:tab,index})
      }
    }
  };
</script>

<style scoped lang="less">
  @import "../assets/base";

  .tab_view {
    .flex-row;
    .padding-x-14;
  }

  .tab_view-item {
    .padding-y-7;
    text-align: center;
    flex: 1;
    font-size: 16px;
    border-width: 0;
    border-style: solid;
    border-color: transparent;
    border-bottom-width: 2px;

    &:hover {
      cursor: pointer;
    }

  }

  .tab_view-item-normal {
    border-bottom-color: transparent !important;
  }

  .tab_view-item-select {
    color: #FF9211;
    border-bottom-color: #FF9211 !important;
  }

</style>
