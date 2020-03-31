class Requester {

  constructor(baseUrl = '', headers = {}) {
    this.params = {};
    this.header = headers ? headers : {};
    this.baseUrl = baseUrl;
    this.xhr = new XMLHttpRequest();
    this.xhr.withCredentials = true;

  }

  async get(params, path) {
    return new Promise(resolve => {
      let _this = this;
      this.xhr.onreadystatechange = function () {
        if (_this.xhr.readyState == 4) {
          if (_this.xhr.status == 200) {
            let result = _this.xhr.responseText;
            resolve(JSON.parse(result));
          } else {
            resolve(null);
          }
        }
      };
      this.xhr.open('get', `${this.baseUrl}${path}`);
      this.xhr.send(JSON.stringify(params));
    });
  }


}

export default Requester;
