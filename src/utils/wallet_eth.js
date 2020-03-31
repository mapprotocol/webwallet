import Web3 from 'web3'

import {Wallet} from './wallet'

class WalletEth extends Wallet{

  constructor(lightWallet) {
    // super(lightWallet,new Web3('https://api.etherscan.io'),'eth');
    // super(lightWallet,new Web3('https://mainnet.infura.io/','infura'),'eth');
    super(lightWallet,new Web3(new Web3.providers.HttpProvider("https://ethrpc.truewallet.net")),'eth');
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

}

export default WalletEth;
