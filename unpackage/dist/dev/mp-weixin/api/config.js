"use strict";
const common_vendor = require("../common/vendor.js");
const utils_toast = require("../utils/toast.js");
common_vendor.index.addInterceptor("request", {
  invoke(args) {
    args.url = "http://47.101.56.97:10001" + args.url;
  }
});
common_vendor.index.addInterceptor("request", {
  returnValue(response) {
    return new Promise((succ, err) => {
      response.then((res) => {
        let ret = res.data;
        if (typeof plus !== "undefined") {
          if (ret.code !== 200 && ret.code !== 0) {
            utils_toast.msgError(ret.msg);
            err(new Error(ret.msg));
          }
        } else {
          if (ret.code !== 200 && ret.code !== 0) {
            common_vendor.index.showToast({
              title: ret.msg,
              icon: "error",
              image: "/static/toast/error.png"
            });
            err(new Error(ret.msg));
          }
        }
        succ(ret);
      });
    });
  }
});
