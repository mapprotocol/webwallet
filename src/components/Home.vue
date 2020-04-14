<template>
  <div>
    <main-content>
      <div class="flex-row">
        <!--left-->
        <div class="home-left">
          <div class="home-left-top-avatar">{{getName(account.coin)}}</div>
          <img v-show="walletAddress" class="home-left-top-qr" src="../assets/icon/icon_qr.png" @click="actionShowQR"/>

          <div class="space-y-20"></div>
          <div class="home-left-wallet"
               @click="actionShowWalletList(true)">
            <img class="icon-wallet" src="../assets/icon/icon_wallet.png" @click.stop="actionClip"/>
            <div class="wallet-address">{{account.address}}</div>
            <img class="icon-arrow" src="../assets/icon/icon_arrow_down.png"/>

            <pop-view
              v-model="showWalletList"
              :items="walletList"
              @onChange="actionChangeWallet"></pop-view>
          </div>
          <div class="space-y-70"></div>

          <coin-item
            :name="getCoin(account.coin,2)"
            :amount="formatAmount(account.amount)"
            :currency="'$'+formatAmount(account.currency)"
            @onclick="actionOnClickCoinItem(account)"></coin-item>
          <coin-item
            v-for="(item,index) in contracts"
            :name="item.symbol"
            :key="item.symbol"
            :amount="formatAmount(item.amount)"
            :currency="'$'+formatAmount(item.currency)"
            @onclick="actionOnClickCoinItem(item)"></coin-item>

          <div class="space-y-70"></div>
          <div class="home-left-tips1">{{$t('CNFindUourToken')}}</div>
          <div class="home-left-tips2">{{$t('BelowToAddTokens')}}</div>
          <div class="home-left-tips3" @click="showAddToken=true">{{$t('AddToken')}}</div>

        </div>
        <!--right-->
        <div class="home-right">
          <div class="home-right-top padding-y-35 padding-left-35">
            <div class="home-right-top-logo">{{getCoin(mainAccount.symbol?mainAccount.symbol:mainAccount.coin,2)}}</div>
            <div class="padding-left-14">
              <div class="home-right-amount">{{formatAmount(mainAccount.amount)}}</div>
              <div class="home-right-currency">${{formatAmount(mainAccount.currency)}}</div>
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
              :key="item.transactionHash"
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
          <div class="flex-1" :class="createTabIndex===0?'tab_select':'tab_normal'" @click="createTabIndex=0">
            {{$t('CreateWallet')}}
          </div>
          <div class="flex-1" :class="createTabIndex===1?'tab_select':'tab_normal'" @click="createTabIndex=1">
            {{$t('ImportWallet')}}
          </div>
        </div>
        <div v-show="createTabIndex===0"
             class="create_dialog_content">
          <check-view v-model="createForm.coin"></check-view>
          <form><input type="password" autocomplete="off" readonly style="display: none;">
            <custom-input :place-holder="$t('WalletPassword')" type="password" v-model="createForm.password"/>
          </form>
          <div class="padding-x-14">
            <div class="button-base" @click="actionCreateWallet">{{$t('ConfirmCreation')}}</div>
          </div>
        </div>
        <div v-show="createTabIndex===1"
             class="import-dialog_content">
          <drop-view :items="['true','eth']"
                     v-model="importForm.coin"
          type="name"></drop-view>
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
                     @click="!importFormStatus?actionChoiceFile():()=>{}">
                  <img v-if="importFormStatus===false" src="../assets/icon/icon_file.png">
                  <img v-else src="../assets/icon/icon_success1.png">
                  <div v-if="importFormStatus===false">{{$t('UploadKEYSTORE')}}</div>
                  <div v-else>{{$t('UploadKEYSTORESuccess')}}</div>
                  <input
                    v-show="importFormStatus===false"
                    type="file"
                    name="myfile"
                    ref="filElem"
                    @change="actionFileChange">
                </div>

              </div>
              <form style="display: none;"><input type="password" autocomplete="off" readonly style="display: none;">
              </form>
              <custom-input :place-holder="$t('FillOutPassword')" type="password" v-model="importForm.password"/>
            </div>

          </div>
          <div class="padding-x-14">
            <div class="button-base" @click="actionImportWallet">{{$t('ImportWallet')}}</div>
          </div>
        </div>
        <loading-view :show="createForm.loading"></loading-view>
        <loading-view :show="importForm.loading"></loading-view>
      </div>
    </custom-dialog>
    <!--add contract-->
    <custom-dialog
      v-model="showAddToken">
      <div class="token_dialog">
        <title-view :tips="getName(account.coin)">{{$t('AddToken1')}}</title-view>
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
                       v-model="transForm.coinItem"
                       @onChangeIndex="actionTransCoinIndexChange"
            >

            </drop-view>
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
              {{createForm.address}}
            </div>
          </div>
        </label-view>
        <label-view :label="$t('Mnemonic')">
          <div class="padding-x-14">
            <div class="custom-box padding-x-14 padding-y-7 text-wrap">
              {{createForm.mnemonic}}
            </div>
          </div>
        </label-view>
        <label-view :label="$t('PrivateKey')">
          <div class="padding-x-14">
            <div class="custom-box padding-x-14 padding-y-7 text-wrap">
              {{createForm.privateKey}}
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
    <!--address qr-->
    <custom-dialog
      v-model="showQR">
      <div class="qr_dialog">

        <div class="qr_dialog-title text-center">{{getName(account.coin)}}</div>

        <div id="QRAddress" class="qr_dialog-qr"></div>

        <div class="qr_dialog-content">{{account.address}}
          <img src="../assets/icon/icon_wallet.png" @click="actionClip"/></div>


      </div>
    </custom-dialog>
  </div>

</template>

<script>
  import QRCode from 'qrcodejs2';
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
        showQR: false,
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
        contracts: [],//saved contracts data
        transferCoins: [],// can trans coins
        transferAccounts: [],//can trans coins
        transferBalances: [],//can trans coins

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
        importFormStatus: false,
        importForm: {
          coin: 'true',
          password: '',
          type: '',
          data: '',
          mnemonic: '',
          privateKey: '',
          keystore: '',
          loading: false,
          status: true
        },
        tokenForm: {
          address: '',
          name: '',
          decimal: 6,
          loading: false
        },
        transForm: {
          coinItem: '',
          gasprice: 20,
          coin: '',//main
          name: '',//token
          contract: '',
          from: '',
          to: '0x6cc2a74058174cedcc1fb74970a66ed0f26c5f18',
          amount: 0,
          loading: false,
        },
        transAccount: {},


        walletTrue: null,
        walletEth: null,

      };
    },
    created() {
      this.$bus.$on('clearWallets', () => {
        this.actionImportLocal();
      });
      this.$bus.$on('rateChanged',()=>{
        this.actionGetBalance();
      });

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
        // if (newValue.indexOf('(') >= 0) {
        //   let temp = newValue.replace(')', '');
        //   temp = temp.split('(');
        //   this.transForm.coin = temp[1];
        //   this.transForm.name = temp[0];
        // } else {
        //   this.transForm.coin = newValue;
        //   this.transForm.name = newValue;
        // }
        // this.transForm.from = '';
        // this.actionGetAllAddresses(this.transForm.coin, this.transForm.name);
      },
      'transForm.amount'(newValue){
        if (`${newValue}`.indexOf('-')>=0) {
          this.transForm.amount=`${newValue}`.replace('-','');
        }
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
        } else {
          this.transForm.loading = false;
        }

      },
      showCreate(newValue) {
        if (newValue) {
          this.importForm = {
            coin: 'true',
            password: '',
            type: '',
            data: '',
            mnemonic: '',
            privateKey: '',
            keystore: '',
            loading: false
          };
          this.importTab = {
            key: 'mnemonic',
            index: 0
          };
          this.createForm = {
            coin: 'true',
            password: '',
            loading: false,
          };
        }
      },
      walletAddress(newValue) {

      },
    },
    methods: {
      formatAmount(num) {
        if (num == 0) {
          return '0.00';
        }
        if (num) {
          return `${num}`;
        }
        return '0.00';
      },
      getName(chain) {
        if (!chain) {
          return '';
        }
        let temp = chain.toUpperCase();
        if (temp === 'TRUE' || temp === 'TRUECHAIN') {
          return 'TrueChain';
        }
        if (temp === 'ETH' || temp === 'ETHEREUM') {
          return 'Ethereum';
        }
        return chain;
      },
      getCoin(chain, size = 0) {
        //
        if (!chain) {
          return '';
        }
        let name = chain.toUpperCase();
        if (name === 'TRUE' || name === 'TRUECHAIN') {
          name = 'true';
        } else if (name === 'ETH' || name === 'ETHEREUM') {
          name = 'eth';
        } else {
          name = chain;
        }
        if (size == 0) {
          return name;
        } else if (size == 1) {
          return name.toLowerCase();
        } else {
          return name.toUpperCase();
        }
      },
      async actionClip(target) {
        try {
          await this.$clip(this.walletAddress, target);
          this.$success('CopySuccess');
        } catch (e) {
        }

      },
      actionShowQR() {
        this.showQR = true;
        if (this.walletAddress) {
          setTimeout(() => {
            new QRCode('QRAddress', {
              width: 200,
              height: 200,
              text: this.walletAddress
            });
          }, 500);

        }
      },

      actionGetTransferLog() {
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
        new Reader().down(name, this.createForm.keystore);
      },
      //click left coin
      actionOnClickCoinItem(coin) {
        this.mainAccount = coin;
        this.actionGetTransferLog();
      },
      //confirm trans
      async actionSubTransfer() {
        console.log('actionSubTransfer', this.transForm, this.transAccount);
        if (String.isEmpty(this.transForm.name)) {
          this.$failed(this.$t('SelectCoin'));
          return;
        }
        if (String.isEmpty(this.transForm.from)) {
          this.$failed(this.$t('SelectAddress'));
          return;
        }
        if (String.isEmpty(this.transForm.to)) {
          this.$failed(this.$t('SelectReceivingAddress'));
          return;
        }
        if (String.isEmpty(this.transForm.amount)) {
          this.$failed(this.$t('EnterTransNumber'));
          return;
        }
        console.log(this.transForm);
        console.log(this.transAccount);
        let wallet = this.getWallet(this.transAccount.coin.toLowerCase());
        if (this.transAccount.action !='mask'){
          let gas = wallet.web3.utils.fromWei(`${this.transForm.gasprice}`);
          if ((parseFloat(this.transForm.amount)+parseFloat(gas))>this.transAccount.amount){
            this.$failed(this.$t('BalanceisNotEnough'));
            return
          }
        }
        this.transForm.loading = true;
        if (this.transAccount['type'] === 'contract') {
          //contract
          let contract = await wallet.get_contract(this.transAccount.address);
          contract = contract['data'];
          let result = await wallet.send_token({
            action: this.transAccount.action,
            to: this.transForm.to,
            val: this.transForm.amount,
            privateKey: this.transAccount.privateKey,
            contract,
            gas_price: this.transForm.gasprice
          });
          this.transForm.loading = false;
          if (result['code'] ==106) {
            this.$failed(this.$t(result['msg']));
            return;
          }
          if (result['code'] !== 0) {
            this.$failed(this.$t('TransferFailed'));
            return;
          }
        } else {
          let result = await wallet.send_trans({
            action: this.transAccount.action,
            to: this.transForm.to,
            val: this.transForm.amount,
            privateKey: this.transAccount.privateKey,
            gas_price: this.transForm.gasprice,
            val_type: 'ether'
          });
          this.transForm.loading = false;
          if (result['code'] !== 0) {
            this.$failed(this.$t('TransferFailed'));
            return;
          }
        }
        this.$success(this.$t('TransferSuccess'));
        this.showTransfer = false;
        this.actionGetBalance();
      },
      //Confirm add contract
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
        )
          .update();
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
      actionMatchCoinInfo(str) {
        //
        let coin = '';
        let address = '';
        str = str.replace(')', '');
        let strs = str.split('(');
        coin = strs[1];
        address = strs[0];
        return {
          coin,
          address
        };
      },
      //show /close wallet list
      actionShowWalletList(show) {
        this.showWalletList = show;
      },
      //change wallet
      actionChangeWallet(row) {
        console.log('actionChangeWallet1', row);
        let coinInfo = this.actionMatchCoinInfo(row);
        console.log('actionChangeWallet2', coinInfo);
        this.walletAddress = coinInfo['address'];
        console.log('actionChangeWallet3', this.walletAddress);
        for (let item of this.accounts) {
          console.log('actionChangeWallet4', item);
          if (item.address === this.walletAddress
            && item.coin.toUpperCase() === coinInfo['coin'].toUpperCase()) {
            this.account = item;
            this.actionGetBalance();
            this.mainAccount = item;
            this.actionGetTransferLog();
            break;
          }
        }
        //check mask

      },
      actionChoiceFile() {
        if (!this.importFormStatus) {
          this.$refs.filElem.dispatchEvent(new MouseEvent('click'));
        }

      },
      //import keystore
      async actionFileChange(file) {
        file = file.target.files[0];
        let result = await new Reader(file).read();
        this.importForm.keystore = result;
        this.importFormStatus = true;
        this.$success(this.$t('UploadKEYSTORESuccess'));
      },
      async actionImportWallet() {
        this.importForm.loading = true;
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
          this.importForm.loading = false;
          if (!result) {
            this.$failed('ImportFailedPalceCheckIt');
            return;
          }
          let wallets = localStorage.getItem('wallets');
          if (wallets) {
            wallets = JSON.parse(wallets);
          } else {
            wallets = {};
          }
          wallets[result['data']['address']] = {
            coin: this.importForm.coin,
            keystore: result['data']['keystore'],
            password: this.$base64.encode(result['data']['password'])
          };
          localStorage.setItem('wallets', JSON.stringify(wallets));
          if (!result || !result['data']) {
            this.$failed(this.$t('ImportFailed'));
            return;
          }
          result['data']['coin'] = result['coin'];
          this.showCreate = false;
          for (let item of this.accounts) {
            if (item['address'] === result['data']['address']
              && item['coin'] === result['data']['coin']) {
              this.$success(this.$t('WalletAlready'));
              return;
            }
          }
          this.accounts.push(result['data']);
          this.account = result['data'];
          this.walletList.push(result['data']['address'] + `(${result['data']['coin'].toUpperCase()})`);
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
          // result['data']['coin'] = result['coin'];
          // this.accounts.push(result['data']);
          // this.account = result['data'];
          // this.account['amount'] = 0;
          // this.walletList.push(result['data']['address']);
          // this.walletAddress = result['data']['address'];
          // this.showCreate = false;
          // this.actionGetBalance();
          // this.mainAccount = {};
          // this.actionUpdateMainAccount();
          this.createForm = Object.assign(this.createForm, result['data']);
          this.showPrivateInfo = true;
        }
        this.createForm.loading = false;
      },
      actionOnImportTabChange(tab) {
        this.importTab = tab;
        this.importData = '';
        this.importForm.mnemonic = '';
        this.importForm.privateKey = '';
        this.importForm.keystore = '';
        this.importFormStatus = false;
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
          this.account.currency = wallet.match_currency_usd(this.account.coin, this.account['amount']);
          console.log('Action GetBalance Main', this.account);
          //get contract balance
          let contracts = new Contract().list(this.account.coin);
          for (let contract in contracts) {
            //get contract address
            let contractBalance = await wallet.get_contract_balance(
              this.walletAddress,
              contract);
            let contractObj = new Contract().find(contract, this.account.coin)
              .update();
            contracts[contract]['amount'] = contractBalance;
            contracts[contract]['privateKey'] = this.account['privateKey'];
            contracts[contract]['password'] = this.account['password'];
            contracts[contract]['keystore'] = this.account['keystore'];
            contracts[contract].currency = wallet.match_currency_usd(contracts[contract]['symbol'], contracts[contract]['amount']);
            let has=false;
            for (let imte of this.contracts) {
              if (imte['privateKey'] == this.account['privateKey']) {
                has=true;
              };
            }
            if (!has) {
              this.contracts.push(contracts[contract]);
              console.log('Action GetBalance Contract', contracts[contract]);
            }


          }
        }
        this.actionUpdateMainAccount();
      },
      //transfer step.1
      async actionGetAllContractsAndAccounts() {
        let allCoinNames = [];
        for (let item of this.accounts) {
          if (allCoinNames.indexOf(item.coin.toUpperCase()) < 0) {
            allCoinNames.push(item.coin.toUpperCase());
          }
        }
        let all = new Contract().all();
        let keys = Object.keys(all);
        for (let key of keys) {
          if (allCoinNames.indexOf(key.toUpperCase()) < 0) {
            continue;
          }
          let contracts = all[key];
          for (let contractAddress in contracts) {
            let item = contracts[contractAddress];
            if (allCoinNames.indexOf(`${item['symbol']}(${this.getName(key)})`) < 0) {
              allCoinNames.push(`${item['symbol']}(${this.getName(key)})`);
            }
          }
        }
        this.transferCoins = allCoinNames;
        console.log('actionGetAllContractsAndAccounts step.1', this.transferCoins.join(','));
      },
      //get current main coins and contracts step.2
      async actionGetAllAddresses(coin, symbol) {
        console.log('actionGetAllAddresses step.2', coin, symbol);
        coin = this.getCoin(coin);
        let allCoinAccounts = [];
        let transferBalances = [];
        let type='main';
        let address ='';
        //main
        if (coin.toUpperCase() == symbol.toUpperCase()) {

          for (let account of this.accounts) {
            console.log('actionGetAllAddresses====',account);
            if (account['coin'].toUpperCase() === coin.toUpperCase()) {
              account['type'] = type;
              account['action'] = 'normal';
              address = account['address'];
              let wallet = this.getWallet(account['coin']);
              let result = await wallet.get_balance(account['address']);
              account['amount']=result['data']/ this.decimals[account['coin'].toLowerCase()];
              // if (!account['amount']){
              //
              // }
              allCoinAccounts.push(account);
              transferBalances.push(`${account['address']} (${account['amount']} ${coin.toUpperCase()})`);
              console.log('actionGetAllAddresses Main Coin', coin, symbol, account);
            }
          }
        }
        //contracts
        else {
          type='contract';
          let all = new Contract().list(coin.toLowerCase());
          for (let contract in all) {
            let item = all[contract];
            if (item['symbol'] === symbol) {
              for (let account of this.accounts) {
                let temp = JSON.parse(JSON.stringify(item));
                if (account.coin.toUpperCase() == temp.coin.toUpperCase()) {
                  //get contract balance
                  let wallet = this.getWallet(coin);
                  let balance = await wallet.get_contract_balance(account['address'], temp['address']);
                  // balance = balance / temp.decimal;
                  temp['amount'] = balance;
                  temp['privateKey'] = account['privateKey'];
                  temp['password'] = account['password'];
                  temp['keystore'] = account['keystore'];
                  temp['mc'] = account['address'];
                  temp['type'] = type;
                  temp['action'] = 'normal';
                  address = temp['address'];
                  allCoinAccounts.push(temp);
                  transferBalances.push(`${account['address']} (${balance} ${item['symbol']})`);
                  console.log('actionGetAllAddresses Contract', coin, symbol);
                }
              }
            }
          }
        }
        let wallet = this.getWallet(this.getCoin(coin));
        let result = await wallet.check_mask();
        if (result) {
          let mask = wallet.get_mask();
          transferBalances.push(mask.name);
          allCoinAccounts.push({
            action: 'mask',
            name: mask.name,
            address: address,
            coin:mask.coin,
            type:type
          });
        }
        this.transferBalances = transferBalances;
        this.transferAccounts = allCoinAccounts;
        console.log(this.transferAccounts);
      },
      actionTransCoinIndexChange(index) {
        let transCoin = this.transferCoins[index];
        if (!transCoin) {
          return
        }
        console.log('actionTransCoinIndexChange 转账第二步', index, transCoin);
        if (transCoin.indexOf('(') >= 0) {
          let temp = transCoin.replace(')', '');
          temp = temp.split('(');
          this.transForm.coin = temp[1];
          this.transForm.name = temp[0];
        } else {
          this.transForm.coin = transCoin;
          this.transForm.name = transCoin;
        }
        this.transForm.from = '';
        this.actionGetAllAddresses(this.transForm.coin, this.transForm.name);

      },
      actionTransFromIndexChange(index) {
        if (index==undefined) {
          index=0;
        }
        let checkTransferAccount = this.transferAccounts[index];
        console.log('actionTransFromIndexChange step.3', index, checkTransferAccount);
        this.transAccount = checkTransferAccount;
      },
      async actionImportLocal() {
        let wallets = localStorage.getItem('wallets');
        if (wallets) {
          wallets = JSON.parse(wallets);
          for (let key in wallets) {
            let keystore = wallets[key];
            keystore.password = this.$base64.decode(keystore.password);
            let wallet = this.getWallet(keystore['coin']);
            let result = await wallet.import_account('keystore', keystore);
            if (result) {
              result['data'] = Object.assign(result['data'], keystore);
              this.accounts.push(result['data']);
              this.account = result['data'];
              this.walletList.push(result['data']['address'] + `(${result['data']['coin'].toUpperCase()})`);
              this.walletAddress = result['data']['address'];
            }
          }
        } else {
          this.account = {};
          this.accounts = [];
          this.mainAccount = [];
          this.walletList = [];
          this.walletAddress = '';
        }
        if (!this.account || !this.account.address) {
          this.showCreate = true;
        } else {
          this.mainAccount = {};
          this.actionUpdateMainAccount();
          this.actionGetBalance();
        }
      }
    },
    mounted() {
      //default contract
      let contracts = localStorage.getItem('contracts');
      if (contracts){
        contracts = JSON.parse(contracts);
      }else{
        contracts={};
      }
      if (!contracts['true']){
        contracts['true']={}
      }
      contracts['true']['0x735bCe5ecc8455Eb9Bf8270aA138ce05E069b4c1']={
        address: "0x735bCe5ecc8455Eb9Bf8270aA138ce05E069b4c1",
        coin: "true",
        name: "MarcoPolo",
        profile: "map",
        decimal: "18",
        symbol: "MAP",
      };
      localStorage.setItem('contracts',JSON.stringify(contracts));
      this.actionImportLocal();
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
      width: 88px;
      height: 88px;
      background: rgba(255, 255, 255, 1);
      border-radius: 50%;
      font-weight: bold;
      font-size: 14px;
      text-align: center;
      .flex-column;
      .flex-item-center;
      .flex-justify-center;
      .text-wrap;
    }

    .home-left-top-qr {
      height: 30px;
      opacity: .7;
      margin-top: 10px;

      &:hover {
        cursor: pointer;
      }
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

        &:hover {
          cursor: pointer;
        }
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

  .qr_dialog {
    width: 334px;
    background-color: white;
    padding-bottom: 30px;
    .padding-top-28;
    .padding-x-14;
    .flex-column;
    .flex-item-center;

    .qr_dialog-qr {
      /*background-color: red;*/
      height: 200px;
      width: 200px;
    }

    .qr_dialog-title {
      padding-top: 20px;
      padding-bottom: 20px;
      font-weight: bold;
      font-size: 16px;
    }

    .qr_dialog-content {
      padding-top: 20px;
      width: 80%;
      .text-wrap;

      img {
        width: 12px;
        margin-left: 10px;

        &:hover {
          cursor: pointer;
        }
      }
    }

  }


</style>
