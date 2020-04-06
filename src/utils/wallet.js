/*
 *101 password error
 *102 generate account failed
 *104 trans main coin error
 *105 trans token coin error
 */
import Contract from './contract';
import Decimal from "decimal.js";
class Result {

  constructor(data = {}, code = 0, msg = '') {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }

  update(data = {}, code = 0, msg = '') {
    if (data instanceof Result) {
      this.code = data.code;
      this.msg = data.msg;
      this.data = data.data;
    } else {
      this.code = code;
      this.msg = msg;
      this.data = data;
    }
  }
}

class Wallet {

  constructor(lightwallet, web3, coin) {
    this.coin = coin;
    this.web3 = web3;
    this.lightwallet = lightwallet;
    this.keystore = lightwallet.keystore;
  }

  gen_result(data, code = 0, msg = '') {
    if (data) {
      if (data.hasOwnProperty('data')
        && data.hasOwnProperty('code')
        && data.hasOwnProperty('msg')) {
        data['coin'] = this.coin;
        return data;
      }
    }

    return {
      data,
      code,
      msg,
      coin: this.coin
    };
  }

  async _gen_account(pwd, seed = null) {
    return new Promise(resolve => {
      let mnemonic = seed ? seed : this.keystore.generateRandomSeed();
      // let mnemonic = this.keystore.generateRandomSeed();
      this.keystore.createVault({
        password: pwd,
        seedPhrase: mnemonic,
        hdPathString: 'm/44\'/60\'/0\'/0' //"m/44'/60'/0'/0/0"
      }, (err, ks) => {
        if (err) {
          resolve(this.gen_result(null, 102, 'Generate Account Errno'));
        } else {
          ks.keyFromPassword(pwd, (err, pwDerivedKey) => {
            if (err) {
              resolve(this.gen_result(null, 102, 'Generate Account Errno'));
            } else {
              ks.generateNewAddress(pwDerivedKey, 1);
              var addrs = ks.getAddresses();
              var jsontext = ks.serialize();
              var privatekey = ks.exportPrivateKey(addrs[0], pwDerivedKey);
              var ethv3_keystore = JSON.stringify(this.web3.eth.accounts.encrypt('0x' + privatekey, pwd));
              resolve(this.gen_result({
                mnemonic,// export mnemonic
                address: addrs[0],// export address
                privateKey: '0x' + privatekey,// export private key
                keystore: jsontext,// export keystore-bip39
                ethv3_keystore: ethv3_keystore,// export ethv3keystore
                password:pwd
              }));
            }
          });
        }
      });
    });
  }

  async generate_account(pwd) {
    let result = await this._gen_account(pwd);
    return this.gen_result(result);
  }

  async import_account(type, data) {
    return new Promise(async resolve => {
      if (type === 'mnemonic') {//
        return resolve(this.gen_result(await this._gen_account('', data)));
      } else if (type === 'keystore') {//
        let pwd = data.password;
        let ks = JSON.parse(data.keystore);
        if (ks.salt) {//bip39
          ks = this.keystore.deserialize(data.keystore);
          ks.keyFromPassword(pwd, (err, pwDerivedKey) => {
            if (err) {
              return resolve(null);
            }
            let address = ks.getAddresses()[0];
            let privateKey ='';
            try {
              privateKey = '0x' + ks.exportPrivateKey(address, pwDerivedKey);
            } catch (e) {
              console.log('导入钱包失败',e);
              return resolve(null);
            }
            let mnemonic = ks.getSeed(pwDerivedKey);
            return resolve(this.gen_result({
              address,
              privateKey,
              mnemonic,
              keystore:data.keystore,
              password:pwd
            }));
          });
        } else {
          let account = null;
          try {
            account = this.web3.eth.accounts.decrypt(ks, pwd);
            account['password']=pwd;
            account['keystore']=data.keystore;
          } catch (e) {
            return resolve(this.gen_result(null, 101, 'password errno'));
          }
          return resolve(this.gen_result(account));
        }
      } else {//
        return resolve(this.gen_result(await this.get_account(data)));
      }
    });
  }

  async get_account(pk,password='') {
    let account = this.web3.eth.accounts.privateKeyToAccount(pk);
    let keystore = this.web3.eth.accounts.encrypt(pk,password);
    account['keystore']=JSON.stringify(keystore);
    account['password']=password;
    return this.gen_result(account);
  }

  async get_balance(address) {
    let result = await this.web3.eth.getBalance(address);
    console.log('get_balance',result);
    return this.gen_result(result);
  }

  async get_contract(address) {
    let contract = new this.web3.eth.Contract(ABI, address);
    return this.gen_result(contract);
  }

  async get_contract_balance(address, contractAddress) {
    return new Promise(async resolve => {
      let result = await this.get_contract(contractAddress);
      let contract = result['data'];
      contract.methods.balanceOf(address)
        .call()
        .then(balance => {
          let temp = new Contract().find(contractAddress, this.coin)
            .update();

          let dcl = 1;
          if (temp) {
            for (let i = 0; i < temp.decimal; i++) {
              dcl *= 10;
            }
          }

          let result = new Decimal(balance).div(new Decimal(dcl));
            // .toDP(5, Decimal.ROUND_DOWN);
          console.log('Get Contract Balance Result',balance,"dcl",dcl,parseFloat(balance)/dcl,result.toNumber());
          resolve(result);
        })
        .catch(e => {
          resolve(0);
        });
    });
  }

  get_trans_list(address) {
    let transfers = localStorage.getItem('transfers');
    if (transfers) {
      transfers = JSON.parse(transfers);
    } else {
      transfers = {};
    }
    transfers = transfers[address];
    if (transfers && transfers['items']) {
      return transfers['items'];
    }
    return [];
  }

  //add transfer log
  add_trans(address, data) {
    let transfersAll = localStorage.getItem('transfers');
    let transfers = {};
    if (transfersAll && transfersAll[address]) {
      transfersAll = JSON.parse(transfersAll);
      transfers = transfersAll[address];
    } else {
      transfersAll = {};
    }
    if (!transfers['items']) {
      transfers = {
        items: [],
        time: new Date().getTime()
      };
    }
    transfers['items'].push(data);
    transfersAll[address] = transfers;
    localStorage.setItem('transfers', JSON.stringify(transfersAll));
  }

  async send_token(obj) {
    return new Promise(async (resolve) => {
      let send_num = this.web3.utils.toWei(obj.val);
      var contract = obj.contract;
      var encode_abi = contract.methods.transfer(obj.to, send_num)
        .encodeABI();
      var gas = ran_gas();
      if (obj.gas) {
        gas = parseInt(obj.gas);
      }
      let gas_price;
      if (obj.gas_price) {
        gas_price = obj.gas_price;
      } else {
        await this.update_gas_price();
        gas_price = this.gas_price;
      }
      gas_price = (parseInt(web3.utils.fromWei(gas_price, 'gwei')) + 5).toString();
      gas_price = web3.utils.toWei(gas_price, 'gwei');
      var tx = {
        to: contract.options.address,  //
        gas: gas,
        gasPrice: gas_price,
        data: encode_abi //
      };
      let privateKey = obj.privateKey;
      this.web3.eth.accounts.signTransaction(tx, privateKey, async (err, data) => {
        if (err) {
          console.log(err);
          resolve(this.gen_result(null, 104));
        } else {
          let account = await this.get_account(privateKey);
          let userContract = new Contract().find(contract.options.address, this.coin);
          account = account['data'];
          let result = {
            from: account.address,
            to: obj.to,
            amount: obj.val,
            type: 'out',
            contract: userContract.address,
            name: userContract.name,
            symbol: userContract.symbol,
            coin: this.coin
          };
          //
          this.web3.eth.sendSignedTransaction(data.rawTransaction)
            .then((data) => {
              if (data) {
                if (data['status']) {
                  result = Object.assign(result, data);
                  this.add_trans(account.address, result);
                  resolve(this.gen_result(result));
                } else {
                  resolve(this.gen_result(null, 104));
                }
              } else {
                resolve(this.gen_result(null, 104));
              }
            });
        }
      });
    });
  }

  async send_trans(obj) {
    return new Promise(async resolve => {
      let privateKey = obj.privateKey;
      if (privateKey.indexOf('0x') < 0) {
        privateKey = '0x' + privateKey;
      }
      let amount = `${obj.val}`;
      try {
        if (obj.val_type) {
          if (obj.val_type === 'ether') {
            amount = this.web3.utils.toWei(amount, 'ether');
          }
          if (obj.val_type === 'gwei') {
            amount = this.web3.utils.toWei(amount, 'gwei');
          }
        } else {
          amount = this.web3.utils.toWei(amount, 'gther');
        }
      } catch (e) {
      }
      let gas_price = '0';
      if (obj.gas_price) {
        gas_price = obj.gas_price;
      } else {
        await this.update_gas_price();
        gas_price = this.gas_price;
      }

      gas_price = ( parseInt( this.web3.utils.fromWei(gas_price,'gwei') ) + 5 ).toString();
      gas_price = this.web3.utils.toBN(gas_price);
      gas_price = this.web3.utils.toWei(gas_price, 'gwei');
      var gas = this.ran_gas();
      if (obj.gas) {
        gas = parseInt(obj.gas);
      }
      var tx = {
        to: obj.to,
        value: amount,
        gas: gas,
        gasPrice: gas_price
      };
      this.web3.eth.accounts.signTransaction(tx, privateKey, async (err, data) => {
        if (err) {
          console.log('Send Trans',err)
          resolve(this.gen_result(null, 104));
        } else {
          let account = await this.get_account(privateKey);
          account = account['data'];
          let result = {
            from: account.address,
            to: obj.to,
            amount: obj.val,
            type: 'out',
            name: this.coin,
            symbol: this.coin,
            coin: this.coin
          };
          console.log('Send Trans111',data);
          //
          this.web3.eth.sendSignedTransaction(data.rawTransaction)
            .then((data) => {
              console.log('Send Trans222',data);
              if (data) {
                if (data['status']) {
                  result = Object.assign(result, data);
                  this.add_trans(account.address, result);
                  resolve(this.gen_result(result));
                } else {
                  resolve(this.gen_result(null, 104));
                }

              } else {
                resolve(this.gen_result(null, 104));
              }
            });
        }
      });
    });
  }

  /**
   * async contract data
   * @returns {number}
   */
  async update_contract(address) {
    return new Promise(async resolve => {
      try {
        let contract = await this.get_contract(address);
        contract = contract['data'];
        let name = await contract.methods.name().call();
        let decimal = await contract.methods.decimals().call();
        let symbol = await contract.methods.symbol().call();
        new Contract().renew(address, this.coin, 'name', name)
          .update();
        new Contract().renew(address, this.coin, 'decimal', decimal)
          .update();
        new Contract().renew(address, this.coin, 'symbol', symbol)
          .update();
      } catch (e) {
      }
      resolve();
    });
  }

  match_currency_usd(symbol,amount){
    symbol = symbol.toUpperCase();
    let rates = localStorage.getItem('rate_usd');
    if (rates){
      rates=JSON.parse(rates);
      if (!rates[symbol]){
        return 0;
      }
      return parseFloat(rates[symbol])*amount.toFixed(8);
    }
    return 0;
  }

  // random gas
  ran_gas() {
    return parseInt((Math.floor(Math.random() * 70) + 60) * 1000);
  }

  async update_gas_price() {
    return new Promise(resolve => {
      this.web3.eth.getGasPrice((x,data) => {
        this.gas_price = this.web3.utils.toBN(data);
        let gweistr = this.web3.utils.fromWei(data, 'gwei');
        console.log('update_gas_price',data,gweistr);
        if (gweistr.lastIndexOf('.') > 0) {
          gweistr = gweistr.substring(0, gweistr.lastIndexOf('.'));
        }
        this.gas_price_gwei = gweistr;

        resolve();
      });
    });
  }
}

export { Result, Wallet };
