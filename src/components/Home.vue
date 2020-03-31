<template>
  <div>
    <main-content>
      <div class="flex-row">
        <!--left-->
        <div class="home-left">
          <div class="home-left-top-avatar">{{account.coin.toUpperCase()}}</div>

          <div class="space-y-50"></div>
          <div class="home-left-wallet"
               @click="actionShowWalletList(true)">
            <img class="icon-wallet" src="../assets/icon/icon_wallet.png"/>
            <div class="wallet-address">{{account.address}}</div>
            <img class="icon-arrow" src="../assets/icon/icon_arrow_down.png"/>

            <pop-view
              v-model="showWalletList"
              :items="walletList"
              @onChange="actionChangeWallet"></pop-view>
          </div>
          <div class="space-y-70"></div>

          <coin-item
            :name="account.coin"
            :amount="account.amount"
            :currency="'$'+account.currency"
            @onclick="actionOnClickCoinItem(account)"></coin-item>
          <coin-item
            v-for="(item,index) in contracts"
            :name="item.symbol"
            :amount="item.amount"
            :currency="'$'+item.currency"
            @onclick="actionOnClickCoinItem(item)"></coin-item>

          <div class="space-y-70"></div>
          <div class="home-left-tips1">{{$t('CNFindUourToken')}}</div>
          <div class="home-left-tips2">{{$t('BelowToAddTokens')}}</div>
          <div class="home-left-tips3" @click="showAddToken=true">{{$t('AddToken')}}</div>

        </div>
        <!--right-->
        <div class="home-right">
          <div class="home-right-top padding-y-35 padding-left-35">
            <div class="home-right-top-logo">{{mainAccount.symbol?mainAccount.symbol:mainAccount.coin}}</div>
            <div class="padding-left-14">
              <div class="home-right-amount">{{mainAccount.amount}}</div>
              <div class="home-right-currency">{{mainAccount.currency}}</div>
            </div>

            <div class="flex-1"></div>
            <div class="button-base button-small space-mx-150" @click="showTransfer=true">
              <img src="../assets/icon/icon_trans.png"/>
              {{$t('Transfer')}}
            </div>
            <div class="space-x-20"></div>
            <div class="button-base button-small space-mx-150" @click="showCreate=true">
              <img src="../assets/icon/icon_wallet2.png"/>
              {{$t('AddWallet')}}
            </div>
          </div>
          <div class="padding-left-35">
            <div class="flex-row text-center padding-y-7" style="color: #666666;font-weight: 400;">
              <div class="flex-1_5">Txid</div>
              <div class="flex-1_5">From</div>
              <div class="flex-1"></div>
              <div class="flex-1_5">To</div>
              <div class="flex-2">Value</div>
            </div>
            <div class="line-x"></div>
            <trans-item
              v-for="(item,index) in mainTransfers"
              :txid="item.transactionHash"
              :status="item.status"
              :from="item.from"
              :to="item.to"
              :amount="item.amount"
              :coin="item.symbol"
            ></trans-item>
          </div>

        </div>
      </div>

    </main-content>
    <!--create import account-->
    <custom-dialog
      v-model="showCreate">
      <div class="create_dialog">
        <div class="flex-row">
          <div class="flex-1" :class="createTabIndex===0?'tab_select':'tab_normal'" @click="createTabIndex=0">{{$t('CreateWallet')}}</div>
          <div class="flex-1" :class="createTabIndex===1?'tab_select':'tab_normal'" @click="createTabIndex=1">{{$t('ImportWallet')}}</div>
        </div>
        <div v-show="createTabIndex===0"
             class="create_dialog_content">
          <check-view v-model="createForm.coin"></check-view>
          <input type="password" autocomplete="off" readonly style="display: none;">
          <custom-input :place-holder="$t('WalletPassword')" type="password" v-model="createForm.password"/>
          <div class="padding-x-14">
            <div class="button-base" @click="actionCreateWallet">{{$t('ConfirmCreation')}}</div>
          </div>
        </div>
        <div v-show="createTabIndex===1"
             class="import-dialog_content">
          <drop-view :items="['TRUE','ETH']"
                     v-model="importForm.coin"></drop-view>

          <div class="flex-1 flex-column">
            <tab-view
              :tabs="importTabs"
              @onChange="actionOnImportTabChange"></tab-view>
            <div v-show="importTab.index===0">
              <custom-text :place-holder="$t('EnterYourMnemonic')" v-model="importForm.mnemonic"></custom-text>
            </div>
            <div v-show="importTab.index===1">
              <custom-text :place-holder="$t('EnterThePrivateKey')" v-model="importForm.privateKey"></custom-text>
            </div>
            <div v-show="importTab.index===2" class="flex-column flex-1">
              <div class="padding-x-14 flex-1">
                <div class="custom-box full-parent import-dialog_content-keystore input_file_box"
                     @click="actionChoiceFile">
                  <img src="../assets/icon/icon_file.png">
                  <div>{{$t('UploadKEYSTORE')}}</div>
                  <input type="file"
                         name="myfile"
                         ref="filElem"
                         @change="actionFileChange">
                </div>
              </div>
              <input type="password" autocomplete="off" readonly style="display: none;">
              <custom-input :place-holder="$t('FillOutPassword')" type="password" v-model="importForm.password"/>
            </div>

          </div>
          <div class="padding-x-14">
            <div class="button-base" @click="actionImportWallet">{{$t('ImportWallet')}}</div>
          </div>
        </div>
        <loading-view :show="createForm.loading"></loading-view>
      </div>
    </custom-dialog>
    <!--add contract-->
    <custom-dialog
      v-model="showAddToken">
      <div class="token_dialog">
        <title-view :tips="account.coin.toUpperCase()">{{$t('AddToken1')}}</title-view>
        <label-view :label="$t('ContractAddress')">
          <custom-text :place-holder="$t('EnterContractAddress')" v-model="tokenForm.address"></custom-text>
        </label-view>
        <label-view :label="$t('TokenName')">
          <custom-text :place-holder="$t('EnterTokenName')" v-model="tokenForm.profile"></custom-text>
        </label-view>
        <label-view :label="$t('Precision')">
          <drop-view :items="decimalList"
                     height="100"
                     v-model="tokenForm.decimal"></drop-view>
        </label-view>
        <div class="padding-x-14 padding-top-28">
          <div class="button-base" @click="actionAddToken()">{{$t('ConfirmAdd')}}</div>
        </div>
        <loading-view :show="tokenForm.loading"></loading-view>
      </div>
    </custom-dialog>
    <!--transfer-->
    <custom-dialog
      v-model="showTransfer">
      <div class="trans_dialog">
        <title-view>{{$t('Transfer')}}</title-view>
        <div class="flex-row flex-item-center">
          <label-view :label="$t('Coin')" class="flex-1">
            <drop-view :items="transferCoins"
                       style="width: 190px;"
                       v-model="transForm.coinItem"></drop-view>
          </label-view>
          <label-view :label="$t('From')" class="flex-2">
            <drop-view :items="transferBalances"
                       style="width: 480px;"
                       v-model="transForm.from"
            @onChangeIndex="actionTransFromIndexChange"></drop-view>
          </label-view>
        </div>
        <label-view :label="$t('To')">
          <custom-input :place-holder="$t('Address')"
                        v-model="transForm.to"></custom-input>
        </label-view>
        <label-view :label="$t('Amount')">
          <custom-input :place-holder="$t('TransAmount')"
                        type="number"
                        v-model="transForm.amount"></custom-input>

        </label-view>

        <label-view label="GasPrice">
          <slider-view v-model="transForm.gasprice"></slider-view>
        </label-view>

        <div class="padding-x-14 padding-top-28">
          <div class="button-base" @click="actionSubTransfer()">{{$t('ConfirmSend')}}</div>
        </div>
        <loading-view :show="transForm.loading"></loading-view>
      </div>
    </custom-dialog>
    <!--private info-->
    <custom-dialog
      v-model="showPrivateInfo">
      <div class="private_dialog">
        <label-view :label="$t('WalletAddress')">
          <div class="padding-x-14">
            <div class="custom-box padding-x-14 padding-y-7">
              {{account.address}}
            </div>
          </div>
        </label-view>
        <label-view :label="$t('Mnemonic')">
          <div class="padding-x-14">
            <div class="custom-box padding-x-14 padding-y-7 text-wrap">
              {{account.mnemonic}}
            </div>
          </div>
        </label-view>
        <label-view :label="$t('PrivateKey')">
          <div class="padding-x-14">
            <div class="custom-box padding-x-14 padding-y-7 text-wrap">
              {{account.privateKey}}
            </div>
          </div>
        </label-view>
        <label-view label="KEYSTORE">
          <div class="padding-x-14">
            <div class="custom-box padding-x-14 padding-y-7 text-wrap text-center cursor-pointer"
                 @click="actionDownKeystore">
              {{$t('ClickDown')}}
            </div>
          </div>
        </label-view>
        <div class="padding-x-14 padding-y-21">
          <div class="button-base" @click="showPrivateInfo=false">{{$t('SavedAndImport')}}</div>
        </div>

      </div>
    </custom-dialog>
  </div>

</template>

<script>
  import CustomDialog from '../widgets/CustomDialog';
  import MainContent from '../widgets/MainContent';
  import CoinItem from '../widgets/CoinItem';
  import TransItem from '../widgets/TransItem';
  import DropView from '../widgets/DropView';
  import CheckView from '../widgets/CheckView/CheckView';
  import CustomInput from '../widgets/CustomInput';
  import CustomText from '../widgets/CustomText';
  import TabView from '../widgets/TabView';
  import * as Reader from '../utils/files';
  import PopView from '../widgets/PopView';
  import TitleView from '../widgets/TitleView';
  import LabelView from '../widgets/LabelView';
  import SliderView from '../widgets/SliderView';
  import CNotification from '../widgets/CNotification/index';
  import WalletTrue from '../utils/wallet_true';
  import WalletEth from '../utils/wallet_eth';
  import LoadingView from '../widgets/LoadingView';
  import Contract from '../utils/contract';
  export default {
    name: 'Home',
    components: {
      LoadingView,
      CNotification,
      SliderView,
      LabelView,
      TitleView,
      PopView,
      TabView,
      CustomText,
      CustomInput,
      CheckView,
      DropView,
      TransItem,
      CoinItem,
      MainContent,
      CustomDialog
    },
    data() {
      return {
        decimals: {
          'true': 1000000000000000000,
          'eth': 1
        },
        showPrivateInfo: false,
        showTransfer: false,//transfer
        showAddToken: false,//add token
        showCreate: false,//create or import account
        showWalletList: false,//show wallet list
        walletList: [],//show left wallet list
        walletAddress: '',//show left address

        accounts: [
          // {
          //   coin: '',
          //   address: '',
          //   privateKey: '',
          //   mnemonic: '',
          //   password: ''
          // }
        ],
        //current account
        account: {
          coin: '',
          address: '',
          privateKey: '',
          mnemonic: '',
          password: '',
          amount: 0
        },
        contracts: [],//已保存的合约数据 saved contracts data
        transferCoins:[],// can trans coins
        transferAccounts:[],//can trans coins
        transferBalances:[],//can trans coins

        //main area
        mainAccount: {},
        mainTransfers: [],//trans logs

        createTabIndex: 0,//
        password: '',

        importTabs: ['mnemonic', 'privateKey', 'keystore'],
        importTab: {
          key: 'mnemonic',
          index: 0
        },
        importData: '',

        createForm: {
          coin: 'true',
          password: '',
          loading: false,
        },
        importForm: {
          coin: 'TRUE',
          password: '',
          type: '',
          data: '',
          mnemonic: '',
          privateKey: '',
          keystore: '',
          loading: false
        },
        tokenForm: {
          address: '',
          name: '',
          decimal: 6,
          loading: false
        },
        transForm: {
          coinItem:'',
          gasprice: 20,
          coin: '',//main
          name:'',//token
          contract: '',
          from: '',
          to: '',
          amount:0,
          loading:false
        },
        transAccount:{},


        walletTrue: null,
        walletEth: null,

      };
    },
    created() {

    },
    computed: {
      decimalList() {
        let items = [];
        for (let i = 2; i < 31; i++) {
          items.push(i);
        }
        return items;
      }
    },
    watch: {
      'tokenForm.decimal'(newValue) {
      },
      'transForm.coinItem'(newValue) {
        if (newValue.indexOf('(')>=0) {
          let temp = newValue.replace(')','');
          temp = temp.split('(');
          this.transForm.coin=temp[1];
          this.transForm.name=temp[0];
        }else {
          this.transForm.coin=newValue;
          this.transForm.name=newValue;
        }
        this.transForm.from='';
        this.actionGetAllAddresses(this.transForm.coin,this.transForm.name);
      },
      showAddToken(newValue) {
        if (newValue) {
          this.tokenForm.address = '';
          this.tokenForm.profile = '';
          this.tokenForm.decimal = '';
        }
      },
      showTransfer(newValue) {
        if (newValue) {
          this.transForm.gasprice = 20;
          this.transForm.coin = '';
          this.transForm.contract = '';
          this.transForm.from = '';
          this.transForm.to = '';
          this.actionGetAllContractsAndAccounts();

        }

      },
      showCreate(newValue) {
        if (newValue) {
          this.importForm = {
            coin: 'TRUE',
            password: '',
            type: '',
            data: '',
            mnemonic: '',
            privateKey: '',
            keystore: '',
            loading: false
          };
          this.importTab={
            key: 'mnemonic',
              index: 0
          };
          //创建相关
          this.createForm = {
            coin: 'true',
            password: '',
            loading: false,
          };
        }
      },
    },

    methods: {
      actionGetTransferLog(){
        let wallet = this.getWallet(this.mainAccount.coin);
        let transLog = wallet.get_trans_list(this.mainAccount.address);
        this.mainTransfers = transLog;

      },
      getWallet(coin) {
        if (!coin) {
          return null;
        }
        let wallet = null;
        if (coin.toLowerCase() === 'true') {
          if (!this.walletTrue) {
            this.walletTrue = new WalletTrue(lightwallet);
          }
          wallet = this.walletTrue;
        } else if (coin.toLowerCase() === 'eth') {
          if (!this.walletEth) {
            this.walletEth = new WalletEth(lightwallet);
          }
          wallet = this.walletEth;
        }
        return wallet;
      },
      //download keystore
      actionDownKeystore() {
        let name = `keystore${new Date().getTime()}.txt`;
        new Reader().down(name, this.account.keystore);
      },
      //click left coin
      actionOnClickCoinItem(coin) {
        this.mainAccount = coin;
        this.actionGetTransferLog();
      },
      //confirm trans
      async actionSubTransfer() {
        if (String.isEmpty(this.transForm.name)){
          this.$failed(this.$t('SelectCoin'))
          return;
        } ;
        if (String.isEmpty(this.transForm.from)){
          this.$failed(this.$t('SelectAddress'))
          return;
        } ;
        if (String.isEmpty(this.transForm.to)){
          this.$failed(this.$t('SelectReceivingAddress'))
          return;
        } ;
        if (String.isEmpty(this.transForm.amount)){
          this.$failed(this.$t('EnterTransNumber'));
          return;
        } ;
        let wallet = this.getWallet(this.transForm.coin.toLowerCase());
        this.transForm.loading=true;
        if (this.transAccount.hasOwnProperty('account')) {
          //合约
          let contract = wallet.get_contract(this.transAccount.address);
          let result = await wallet.send_token({
            to:this.transForm.to,
            val:this.transForm.amount,
            privateKey:this.transAccount.account.privateKey,
            contract,
            gas_price:this.transForm.gasprice
          });
          this.transForm.loading=false;
          if (result['code']!==0){
            this.$failed(this.$t('TransferFailed'));
            return
          }
          this.$success(this.$t('TransferSuccess'));
        }else {
          let result = await wallet.send_trans({
            to:this.transForm.to,
            val:this.transForm.amount,
            privateKey:this.transAccount.privateKey,
            gas_price:this.transForm.gasprice,
            val_type:'ether'
          });
          this.transForm.loading=false;
          if (result['code']!==0){
            this.$failed(this.$t('TransferFailed'));
            return
          }
          this.$success(this.$t('TransferSuccess'));
        }
      },
      //确认添加合约
      async actionAddToken() {
        if (String.isEmpty(this.tokenForm.address)) {
          this.$failed(this.$t('EnterContractAddress1'));
          return;
        }
        if (String.isEmpty(this.tokenForm.profile)) {
          this.$failed(this.$t('EnterContractName'));
          return;
        }
        if (String.isEmpty(this.tokenForm.decimal)) {
          this.$failed(this.$t('EnterContractPrecision'));
          return;
        }
        this.tokenForm.loading = true;
        new Contract().add(
          this.tokenForm.address,
          this.account.coin,
          this.tokenForm.profile,
          this.tokenForm.decimal,
        ).update();
        let wallet;
        this.createForm.loading = true;
        //true
        if (this.account.coin.toLowerCase() === 'true') {
          wallet = new WalletTrue(lightwallet);
        }
        //eth
        else if (this.createForm.coin.toLowerCase() === 'eth') {
          wallet = new WalletEth(lightwallet);
        }
        if (wallet) {
          await wallet.update_contract(this.tokenForm.address);
          setTimeout(() => {
            this.showAddToken = false;
          }, 1000);
        }
        this.tokenForm.loading = false;
        this.actionUpdateLeftCoins();

      },
      //show /close wallet list
      actionShowWalletList(show) {
        this.showWalletList = show;
      },
      //change wallet
      actionChangeWallet(row) {
        this.walletAddress = row;
        for (let item of this.accounts) {
          if (item.address === this.walletAddress) {
            this.account = item;
            this.actionGetBalance();
            this.mainAccount = item;
            this.actionGetTransferLog();
            break;
          }
        }

      },
      actionChoiceFile() {
        this.$refs.filElem.dispatchEvent(new MouseEvent('click'));
      },
      //import keystore
      async actionFileChange(file) {
        file = file.target.files[0];
        let result = await new Reader(file).read();
        this.importForm.keystore = result;
      },
      async actionImportWallet() {
        let wallet = this.getWallet(this.importForm.coin);
        if (wallet) {
          let data = this.importForm[this.importTab['key']];
          if (this.importTab['key'] === 'keystore') {
            data = {
              password: this.importForm.password,
              keystore: this.importForm.keystore
            };
          }
          let result = await wallet.import_account(this.importTab['key'].toLowerCase(), data);
          if (!result || !result['data']) {
            this.$failed(this.$t('ImportFailed'));
            return;
          }
          result['data']['coin'] = result['coin'];
          this.showCreate = false;
          for (let item of this.accounts) {
            if (item['address'] === result['data']['address']) {
              this.$success(this.$t('WalletAlready'));
              return;
            }
          }
          this.accounts.push(result['data']);
          this.account = result['data'];
          this.walletList.push(result['data']['address']);
          this.walletAddress = result['data']['address'];
          this.mainAccount = {};
          this.actionUpdateMainAccount();
        } else {
        }
        this.actionGetBalance();

      },
      //create wallet
      async actionCreateWallet() {
        if (String.isEmpty(this.createForm.coin)) {
          this.$failed(this.$t('SelectTheTokenType'));
          return;
        }
        this.createForm.loading = true;
        let wallet = this.getWallet(this.createForm.coin);
        if (wallet) {
          let result = await wallet.generate_account(this.createForm.password);
          result['data']['coin'] = result['coin'];
          this.accounts.push(result['data']);
          this.account = result['data'];
          this.account['amount'] = 0;
          this.walletList.push(result['data']['address']);
          this.walletAddress = result['data']['address'];
          this.showCreate = false;
          this.actionGetBalance();
          this.mainAccount = {};
          this.actionUpdateMainAccount();
          this.showPrivateInfo = true;
        }
        this.createForm.loading = false;
      },
      actionOnImportTabChange(tab) {
        this.importTab = tab;
        this.importData = '';
      },
      //update left coin list
      actionUpdateLeftCoins() {
        let items = new Contract().list(this.account.coin);
        this.contracts = items;
        this.actionGetBalance();
      },
      actionUpdateMainAccount() {
        if (!this.mainAccount.symbol && !this.mainAccount.coin) {
          this.mainAccount = this.account;
        }
        this.actionGetTransferLog();
      },
      async actionGetBalance() {
        let wallet = this.getWallet(this.account.coin);
        if (wallet) {
          this.contracts = [];
          //get main balance
          let result = await wallet.get_balance(this.walletAddress);
          this.account['amount'] = result['data'] / this.decimals[this.account.coin.toLowerCase()];
          this.account.currency=wallet.match_currency_usd(this.account.coin,this.account['amount']);
          //get contract balance
          let contracts = new Contract().list(this.account.coin);
          for (let contract in contracts) {
            //get contract address
            let contractBalance = await wallet.get_contract_balance(
              this.walletAddress,
              contract);
            let contractObj = new Contract().find(contract, this.account.coin)
              .update();
            contracts[contract]['amount'] = contractBalance / contractObj.decimal;
            contracts[contract].currency=wallet.match_currency_usd(contracts[contract]['symbol'],contracts[contract]['amount']);
            this.contracts.push(contracts[contract]);
          }
        }
        this.actionUpdateMainAccount();
      },
      //transfer
      async actionGetAllContractsAndAccounts(){
        let allCoinNames = [];
        let allCoinAccounts={};
        for (let item of this.accounts){
          if (allCoinNames.indexOf(item.coin.toUpperCase())<0) {
            allCoinNames.push(item.coin.toUpperCase());
          }
        } ;
        let all = new Contract().all();
        let keys = Object.keys(all);
        for (let key of keys) {
          if (allCoinNames.indexOf(key.toUpperCase())<0) {
            continue;
          }
          let contracts = all[key];
          for (let contractAddress in contracts) {
            let item = contracts[contractAddress];
            if (allCoinNames.indexOf(`${item['symbol']}(${key.toUpperCase()})`)<0) {
              allCoinNames.push(`${item['symbol']}(${key.toUpperCase()})`);
            }
          }
        }
        this.transferCoins=allCoinNames;
      },
      //get current main coins and contracts
      async actionGetAllAddresses(coin,symbol){

        let allCoinAccounts=[];
        let transferBalances=[];
        //main
        if (coin === symbol) {
          for (let account of this.accounts) {
            if (account['coin'].toUpperCase()===coin.toUpperCase()) {
              allCoinAccounts.push(account);
              transferBalances.push(`${account['address']} (${account['amount']} ${coin.toUpperCase()})`)
            }
          }
        }
        //contracts
        else {
          let all = new Contract().list(coin.toLowerCase());
          for (let contract in all) {
            let item = all[contract];
            if (item['symbol']===symbol) {

              for (let account of this.accounts) {
                let temp = JSON.parse(JSON.stringify(item));
                if (account.coin.toUpperCase()==temp.coin.toUpperCase()) {
                  //get contract balance
                  let wallet = this.getWallet(coin);
                  let balance = await wallet.get_contract_balance(account['address'],temp['address']);
                  balance=balance / temp.decimal;
                  temp['amount']=balance;
                  temp['mc']=account['address'];
                  allCoinAccounts.push(temp);
                  transferBalances.push(`${item['address']} (${balance} ${item['symbol']})`)
                }
              }
            }
          }
        }
        this.transferBalances=transferBalances;
        this.transferAccounts=allCoinAccounts;
      },
      actionTransFromIndexChange(index){
        let checkTransferAccount = this.transferAccounts[index];
        if (checkTransferAccount.hasOwnProperty('mc')){
          for (let account of this.accounts) {
            if (account['address']===checkTransferAccount['mc']) {
              checkTransferAccount['account']=account;
            }
          }
        }
        this.transAccount=checkTransferAccount;
      }
    },
    mounted() {
      // let wallet = this.getWallet('true');
      // wallet.update_contract('0x735bCe5ecc8455Eb9Bf8270aA138ce05E069b4c1');

      let account={
        mnemonic: "gate dynamic disorder degree despair tilt reward science bird wolf normal law",
        address: "0xf7fd830fe15fbbb35fb6708ea72191848480f07e",
        privateKey: "0xb58aedff58f4cbc3090ad85fac519151ece4900338a220418f05cec05ecad5f4",
        keystore: JSON.stringify({
          "encSeed": {
            "encStr": "Xp0dz8V0g+ZY9sugx+1TXRnPqhKj77av13aVoyNqiBcJYcmnYNuoRM5Bsky8AzOLUI/pfgXhrE0kweDVoMVvgEf6x6/9OQ5s3RgIua7AdSLIIdvDbiq2QZ6LNlSOEc33R+msNoBKf2PnN2R0rDQGeGvfkGjcJJFgpXr9P+BB2AE41Tu7/nd+4g==",
            "nonce": "8Y8f4KY2nssvz1G+LOPibTtZpVSS67lM"
          },
          "encHdRootPriv": {
            "encStr": "HWZ9mhBv1GmbZfhginrU9C8hJ5/OQB71sF5RXXn6pytbXfbhc4fgCB0hMNtP3yg3X6rSxHtdplT/AqVl9gsDId5AztYxZRzYrofxBB5canxqp38BCzxi8mz0oUT1/b1Q88IAgBnEatiER8MeG3bAGca4kIheGZh3yYnHHkbXEg==",
            "nonce": "CfCFmWsmtSZMJmUT7rVwwnd982Xr6ECO"
          },
          "addresses": ["816518a242afe47d8f6bc3516c12a773b19372b5"],
          "encPrivKeys": {
            "816518a242afe47d8f6bc3516c12a773b19372b5": {
              "key": "mCoUo996H9KhQb+gvCpbG6sImOgy3tTkmJ0WTYe0wx+w26xDJvzwO7tjMBIWwrei",
              "nonce": "cv20JojlVqbNZdYGMHGsAYNCMJGowG2N"
            }
          },
          "hdPathString": "m/44'/60'/0'/0",
          "salt": "wFOLcxj+KOG2ePIiGQU3aVDx4uEQPyLpxIhJY9H0uWI=",
          "hdIndex": 1,
          "version": 3
        }),
        "ethv3_keystore":JSON.stringify({
          "version": 3,
          "id": "02f57f17-f133-4b98-9b70-c2f3a19ba0bd",
          "address": "f7fd830fe15fbbb35fb6708ea72191848480f07e",
          "crypto": {
            "ciphertext": "fd3d67338530e7feff786e2fa6c8b75ac4fddc63ece24b5d4c8a2529f811ea68",
            "cipherparams": {
              "iv": "07ee24b9f6fb9a3da9da3c3054e8e80f"
            },
            "cipher": "aes-128-ctr",
            "kdf": "scrypt",
            "kdfparams": {
              "dklen": 32,
              "salt": "ddd74c75d9addc3607fa638ff6f302c99ab1fadac4a2d02702415d26ee50785d",
              "n": 8192,
              "r": 8,
              "p": 1
            },
            "mac": "142886eb8f885cb5472fdbbc094407c26f3c204b2e4b0e6da6e7d4a9e2b2dac1"
          }
        }),
        coin: "true"
      }
      this.accounts.push(account);
      this.account = account;
      this.walletList.push(account['address']);
      this.walletAddress=account['address'];
      this.actionGetBalance();


    }
  };
</script>

<style scoped lang="less">
  @import "../assets/base";

  .home-left {
    width: 343px;
    min-height: 828px;
    background: rgba(242, 242, 242, 1);
    padding-top: 40px;
    .flex-column;
    .flex-item-center;


    .home-left-top-avatar {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 1);
      border-radius: 50%;
      font-weight: bold;
      line-height: 48px;
      font-size: 14px;
      text-align: center;
    }

    .home-left-wallet {
      position: relative;
      width: 268px;
      height: 31px;
      background: rgba(255, 255, 255, 1);
      .padding-x-7;
      .flex-row;
      .flex-item-center;

      .wallet-address {
        .flex-1;
        .single-line;
        .padding-x-7;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(84, 84, 84, 1);
      }

      .icon-wallet {
        height: 15px;
      }

      .icon-arrow {
        height: 6px;
      }
    }

    .home-left-tips1 {
      width: 100%;
      font-size: 16px;
      font-weight: bold;
      color: rgba(81, 81, 81, 1);
      line-height: 30px;
      text-align: center;
    }

    .home-left-tips2 {
      width: 100%;
      font-size: 12px;
      font-weight: 400;
      color: rgba(91, 90, 90, 1);
      line-height: 30px;
      text-align: center;
    }

    .home-left-tips3 {
      width: 100%;
      font-size: 16px;
      font-weight: bold;
      color: rgba(247, 122, 0, 1);
      line-height: 30px;
      text-align: center;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .home-right {
    .flex-1;

    .home-right-top {
      background-color: white;
      .flex-row;
      .flex-item-center;

      .home-right-top-logo {
        width: 48px;
        height: 48px;
        background: rgba(255, 235, 211, 1);
        border-radius: 50%;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(203, 121, 24, 1);
        text-align: center;
        word-break: break-word;
        .flex-column;
        .flex-item-center;
        .flex-justify-center;
      }

      .home-right-amount {
        font-size: 18px;
        font-weight: 400;
        color: rgba(18, 18, 18, 1);
      }

      .home-right-currency {
        font-size: 14px;
        font-family: Arial;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }


    }

  }

  .create_dialog {
    position: relative;
    width: 760px;
    min-height: 428px;
    background-color: white;
    padding-bottom: 30px;

    .tab_normal {
      text-align: center;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(0, 0, 0, 1);
      line-height: 48px;
      background-color: #D5D5D5;

      &:hover {
        cursor: pointer;
      }
    }

    .tab_select {
      text-align: center;
      color: #FF9211;
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 48px;

      &:hover {
        cursor: pointer;
      }
    }

    .create_dialog_content {
      .flex-column;
      .flex-justify-around;
      .padding-x-35;
      .padding-top-70;
      height: 350px;
    }

    .import-dialog_content {
      .flex-column;
      .padding-x-35;
      .padding-top-14;
      height: 350px;

      .import-dialog_content-keystore {
        text-align: center;
        .flex-column;
        .flex-item-center;
        .flex-justify-center;

        &:hover {
          cursor: pointer;
        }

        img {
          height: 30px;
        }

        div {
          padding-top: 10px;
          font-size: 12px;
        }
      }
    }

  }

  .input_file_box {
    input[type=file] {
      display: none;
    }
  }

  .token_dialog {
    width: 534px;
    min-height: 500px;
    background-color: white;
    padding-bottom: 30px;
    position: relative;
    .padding-x-28;
    .padding-top-28;
  }

  .trans_dialog {
    position: relative;
    width: 704px;
    min-height: 500px;
    background-color: white;
    padding-bottom: 30px;
    .padding-top-28;
    .padding-x-14;
  }

  .private_dialog {
    width: 534px;
    min-height: 500px;
    background-color: white;
    padding-bottom: 30px;
    .padding-top-28;
    .padding-x-14;
  }


</style>
