
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

}

export default WalletTrue;
