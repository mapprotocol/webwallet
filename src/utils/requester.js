class Requester {

  constructor(baseUrl = '', headers = {}) {
    this.params = {};
    this.header = headers ? headers : {};
    this.baseUrl = baseUrl;
    this.xhr = new XMLHttpRequest();
  }

  async get(params, path,withCredentials=true) {
    this.xhr.withCredentials = withCredentials;
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
      this.xhr.open('GET', `${this.baseUrl}${path}`);
      this.xhr.send(JSON.stringify(params));
    });
  }

  async post(params, path,withCredentials=true) {
    this.xhr.withCredentials = withCredentials;
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
      this.xhr.open('POST', `${this.baseUrl}${path}`);
      this.xhr.setRequestHeader("Content-Type", "application/json");
      this.xhr.send(JSON.stringify(params));
    });
  }


}

export default Requester;
