import Web3 from 'web3'

import {Wallet} from './wallet'

class WalletEth extends Wallet{

  constructor(lightWallet) {
    // super(lightWallet,new Web3('https://api.etherscan.io'),'eth');
    // super(lightWallet,new Web3('https://mainnet.infura.io/','infura'),'eth');
    super(lightWallet,new Web3(new Web3.providers.HttpProvider("https://ethrpc.truewallet.net")),'eth');
    this.account=null;
    this.mask=null;
  }

  async get_contract(address){
    return new Promise(resolve => {
      let url = 'https://api.etherscan.io/api?module=contract&action=getabi&address='+address;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.send();
      xhr.onreadystatechange = function(){
        if ( xhr.readyState == 4 && xhr.status == 200 ) {
          let res = JSON.parse(xhr.responseText);
          let contract_json = JSON.parse(res.result);
          let contract = new this.web3.eth.Contract(contract_json,address);
          return resolve(this.gen_result(contract));
        }
      };
    });
  }

  async get_balance(address) {
    let result = await this.web3.eth.getBalance(address);
    result = this.web3.utils.fromWei(result,'ether');
    await this.update_gas_price();
    return this.gen_result(result);
  }

  async check_mask(){
    console.log('Check Mask METAMASK');
    return new Promise(resolve => {
      const mask = window.ethereum;
      if (mask && mask.isMetaMask){
        this.provider = mask.currentProvider;
        this.mask = new Web3(this.provider);
        console.log('Check Mask METAMASK',true);
        mask.enable().then((accounts)=>{
          console.log('CehckMask Account',accounts)
          this.account = accounts[0];
          resolve(true);
        }).catch((reason)=>{
          console.log('CehckMask reason',reason)
          resolve(false);
        });
      }else {
        resolve(false);
      }
    })
    // console.log('Check Mask METAMASK');
    // console.log('Check Mask METAMASK',false);
    // return false;
  }
  async send_mask(obj){
    console.log('Send Mask METAMASK',obj);
    obj['from']=this.account;
    // obj['method']='eth_sendTransaction';
    return new Promise(async (resolve ,reject)=>{
      let timer=null;
      try {
        web3.eth.sendTransaction(obj, async (err, data) => {
          if (timer) {
            clearTimeout(timer);
          }
          if (err) {
            console.log('Mask Trans Failed', err);
            reject('transfer err');
          } else {
            console.log('Mask Trans Success', data);
            resolve(this.gen_result({ txid: data }));
          }
        });
      } catch (e) {
        console.log('Mask Trans Failed', e);
        resolve(this.gen_result(null,106,'PlaceLoginMetaMask'))
      }
      // timer=setTimeout(()=>{
      //   resolve(this.gen_result(null,100,'time out'));
      // },5000);
    });
  }

  get_mask(){
    return {
      name:"MetaMask",
      symbol:'metamask',
      coin:'eth'
    };
  }



}

export default WalletEth;
