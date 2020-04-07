
import Web3t from 'web3true'
import ABI from './abi_v2.json'
// import ABI from './abi_v1.json'

const MAIN_NET = 'https://api.truescan.net/rpc';
import {Wallet} from './wallet'

class WalletTrue extends Wallet{

  constructor(lightWallet) {
    super(lightWallet,new Web3t(MAIN_NET,'etrue'),'true');
  }

  async get_contract(address){
    let contract = new this.web3.eth.Contract(ABI,address);
    return this.gen_result(contract);
  }

  async check_mask(){
    console.log('Check Mask TRUE');
    const truechain = window.truechain;
    if (truechain && truechain.isMetaMask){
      this.provider = truechain;
      console.log('Check Mask TRUE',true);
      return true;
    }
    console.log('Check Mask TRUE',false);
    return false;
  }
  async send_mask(obj){
    console.log('Send Mask TRUE',obj);
    return new Promise(async (resolve ,reject)=>{
      let timer=null;
      try {
        window.web3t.eth.sendTransaction(obj, async (err, data) => {
          if (timer) {
            clearTimeout(timer);
          }
          if (err) {
            console.log('Mask Trans Failed', err);
            reject('transfer err');
          } else {
            console.log('Mask Trans Success', data);
            this.web3.eth.getTransaction(data, (err, data) => {
              console.log('TransResult', err, data);
            });
            resolve(this.gen_result({ txid: data }));
          }
        });
      } catch (e) {
        resolve(this.gen_result(null,106,'PlaceLoginGreenBelt'))
      }
      // timer=setTimeout(()=>{
      //   resolve(this.gen_result(null,100,'time out'));
      // },5000);
    });
  }

  get_mask(){
    return {
      name:"GreenBelt",
      symbol:'greenbelt',
      coin:'true'
    };
  }

}

export default WalletTrue;
