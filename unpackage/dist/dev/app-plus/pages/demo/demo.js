"use weex:vue";

if (typeof Promise !== 'undefined' && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor
    return this.then(
      value => promise.resolve(callback()).then(() => value),
      reason => promise.resolve(callback()).then(() => {
        throw reason
      })
    )
  }
};

if (typeof uni !== 'undefined' && uni && uni.requireGlobal) {
  const global = uni.requireGlobal()
  ArrayBuffer = global.ArrayBuffer
  Int8Array = global.Int8Array
  Uint8Array = global.Uint8Array
  Uint8ClampedArray = global.Uint8ClampedArray
  Int16Array = global.Int16Array
  Uint16Array = global.Uint16Array
  Int32Array = global.Int32Array
  Uint32Array = global.Uint32Array
  Float32Array = global.Float32Array
  Float64Array = global.Float64Array
  BigInt64Array = global.BigInt64Array
  BigUint64Array = global.BigUint64Array
};


(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // vue-ns:vue
  var require_vue = __commonJS({
    "vue-ns:vue"(exports, module) {
      module.exports = Vue;
    }
  });

  // F:/Qffiction/app1/uni-app/commApp/unpackage/dist/dev/.nvue/pages/demo/demo.js
  var import_vue = __toESM(require_vue());
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  (0, import_vue.getCurrentInstance)();
  var path = (0, import_vue.ref)("");
  (0, import_vue.ref)(false);
  var videoContext = uni.createVideoContext("videoRef", (0, import_vue.getCurrentInstance)());
  (0, import_vue.onMounted)(() => {
    formatAppLog("log", "at pages/demo/demo.nvue:31", "\u6267\u884C\u4E86\u554A");
    const value = uni.getStorageSync("path");
    if (value) {
      path.value = value;
      videoContext.requestFullScreen();
    }
  });
  var _sfc_main = {};
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return (0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("scroll-view", {
      scrollY: true,
      showScrollbar: true,
      enableBackToTop: true,
      bubble: "true",
      style: { flexDirection: "column" }
    }, [
      (0, import_vue.createElementVNode)("u-video", {
        id: "videoRef",
        autoplay: true,
        src: _ctx.path,
        enableDanmu: "",
        danmuBtn: ""
      }, [
        (0, import_vue.createElementVNode)("u-scalable", { style: { position: "absolute", left: "0", right: "0", top: "0", bottom: "0" } }, [
          (0, import_vue.createElementVNode)("cover-view", { style: { "position": "absolute", "right": "0px", "top": "0px", "color": "blue", "width": "300px", "height": "300px", "background-color": "rgba(255, 255, 0, 0.2)" } }, [
            _ctx.isShow ? ((0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("u-text", {
              key: 0,
              style: { "color": "red" }
            }, "1.5\u500D\u52A0\u901F\u4E2D...")) : (0, import_vue.createCommentVNode)("v-if", true),
            (0, import_vue.createElementVNode)(
              "view",
              {
                onLongpress: _cache[0] || (_cache[0] = (...args) => _ctx.demo && _ctx.demo(...args)),
                onTouchend: _cache[1] || (_cache[1] = (...args) => _ctx.demo1 && _ctx.demo1(...args)),
                "catch:touchstart": "",
                style: { "width": "100px", "height": "200px", "background-color": "pink", "position": "absolute", "right": "0px", "top": "0px" }
              },
              null,
              32
              /* HYDRATE_EVENTS */
            )
          ])
        ])
      ], 8, ["src"])
    ]);
  }
  var demo = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/demo/demo.nvue"]]);

  // <stdin>
  var webview = plus.webview.currentWebview();
  if (webview) {
    const __pageId = parseInt(webview.id);
    const __pagePath = "pages/demo/demo";
    let __pageQuery = {};
    try {
      __pageQuery = JSON.parse(webview.__query__);
    } catch (e) {
    }
    demo.mpType = "page";
    const app = Vue.createPageApp(demo, { $store: getApp({ allowDefault: true }).$store, __pageId, __pagePath, __pageQuery });
    app.provide("__globalStyles", Vue.useCssStyles([...__uniConfig.styles, ...demo.styles || []]));
    app.mount("#root");
  }
})();
