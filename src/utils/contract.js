class Contract {

  constructor() {
    this.contracts = {};
    this.address = '';
    this.coin = '';
    this.profile = '';
    this.name = '';
    this.decimal = '';
    this.action = '';
    let temp = localStorage.getItem('contracts');
    if (temp){
      this.contracts = JSON.parse(temp)
    }
  }

  add(address, coin, profile, decimal) {
    this.action = 'add';
    this.address = address;
    this.coin = coin;
    this.profile = profile;
    this.decimal = decimal;
    return this;
  }

  find(address, coin) {
    this.action = 'find';
    this.address = address;
    this.coin = coin;
    return this;
  }

  delete(address, coin) {
    this.action = 'delete';
    this.address = address;
    this.coin = coin;
    return this;
  }

  renew(address,coin,key,value){
    let item = this.find(address,coin).update();
    this.action='renew';
    if (item){
      let keys = Object.keys(item);
      for (let aa of keys){
        this[aa]=item[aa];
      }
      this[key]=value;
    }
    return this;
  }

  update() {
    this.coin = this.coin.toLowerCase();
    if (this.action === 'add' || this.action === 'renew') {
      let params = {
        address: this.address,
        coin: this.coin,
        name: this.name,
        profile: this.profile,
        decimal: this.decimal,
        symbol:this.symbol
      };
      if (!this.contracts[this.coin]){
        this.contracts[this.coin]={};
      }
      this.contracts[this.coin][this.address]=params;
      localStorage.setItem('contracts',JSON.stringify(this.contracts));
    }else if (this.action === 'find') {
      if (this.contracts[this.coin] && this.contracts[this.coin][this.address]) {
        return this.contracts[this.coin][this.address];
      }
      return null;
    }
    else  if (this.action === 'delete') {
      if (this.contracts[this.coin] && this.contracts[this.coin][this.address]){
        delete this.contracts[this.coin][this.address];
      }
      localStorage.setItem('contracts',JSON.stringify(this.contracts));
    }
  }

  list(coin){
    this.coin=coin.toLowerCase();
    return this.contracts[this.coin]
  }
  all(){
    return this.contracts;
  }

}

export default Contract;
