<template>
  <div class="trans-item">
    <div class="flex-1_5">
      <img class="trans-item-copy"
           src="../assets/icon/icon_wallet.png"
      @click="actionCopy"/>
      {{formatItem(txid)}}</div>
    <div class="flex-1_5 trans-item-normal">{{formatItem(from)}}</div>
    <div v-if="status==='success' || status==true" class="flex-1 trans-item-normal">
      <img class="trans-item-status" src="../assets/icon/icon_success.png"/>
    </div>
    <div v-else-if="status==='failed'" class="flex-1 trans-item-normal">
      <img class="trans-item-status" src="../assets/icon/icon_failed.png"/>
    </div>
    <div v-else class="flex-1 trans-item-normal">
      <img class="trans-item-status" src="../assets/icon/icon_pending.png"/>
    </div>
    <div class="flex-1_5 trans-item-normal">{{formatItem(to)}}</div>
    <div class="flex-2 trans-item-normal">{{amount}} {{toUpperCase(coin)}}</div>
  </div>
</template>

<script>
  export default {
    name: 'TransItem',
    props: {
      txid: '',
      from: '',
      to: '',
      status: '',
      amount: '',
      coin: ''

    },
    data() {
      return {};
    },
    methods: {
      toUpperCase(str){
        if (str) {
          return str.toUpperCase();
        }
        return str;
      },
      async actionCopy(target){
        try {
          await this.$clip(this.txid, target);
          this.$success('CopySuccess');
        } catch (e) {
        }
      },
      formatItem(row) {
        if (row && row.length > 12) {
          let subStr1 = row.substr(0, 6);
          let subStr2 = row.substr(row.length - 6, 6);
          let subStr = subStr1 + '...' + subStr2;
          return subStr;
        }
        return row;

      }

    }
  };
</script>

<style scoped lang="less">
  @import "../assets/base";

  .trans-item {
    .flex-row;
    .text-center;
    .padding-y-7;
    .flex-item-center;
    background-color: white;

    div:nth-child(1) {
      font-size: 15px;
      font-weight: 500;
      color: rgba(230, 125, 0, 1);
    }

  }
  .trans-item-copy{
    width: 20px;
    padding-right: 8px;
    &:hover{
      cursor: pointer;
      opacity: .7;
    }
  }
  .trans-item-normal{
    font-size:15px;
    font-family:DIN;
    font-weight:500;
    color:rgba(0,0,0,1);
  }

  .trans-item-status {
    height: 19px;
  }


</style>
