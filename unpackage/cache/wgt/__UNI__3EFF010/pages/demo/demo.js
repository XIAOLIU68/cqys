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


(()=>{var d=Object.create;var a=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var m=Object.getOwnPropertyNames;var _=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty;var b=(e,o)=>()=>(o||e((o={exports:{}}).exports,o),o.exports);var v=(e,o,r,l)=>{if(o&&typeof o=="object"||typeof o=="function")for(let n of m(o))!f.call(e,n)&&n!==r&&a(e,n,{get:()=>o[n],enumerable:!(l=g(o,n))||l.enumerable});return e};var y=(e,o,r)=>(r=e!=null?d(_(e)):{},v(o||!e||!e.__esModule?a(r,"default",{value:e,enumerable:!0}):r,e));var c=b((A,i)=>{i.exports=Vue});var t=y(c());function h(e,o,...r){uni.__log__?uni.__log__(e,o,...r):console[e].apply(console,[...r,o])}var w=(e,o)=>{let r=e.__vccOpts||e;for(let[l,n]of o)r[l]=n;return r};(0,t.getCurrentInstance)();var x=(0,t.ref)("");(0,t.ref)(!1);var k=uni.createVideoContext("videoRef",(0,t.getCurrentInstance)());(0,t.onMounted)(()=>{h("log","at pages/demo/demo.nvue:31","\u6267\u884C\u4E86\u554A");let e=uni.getStorageSync("path");e&&(x.value=e,k.requestFullScreen())});var S={};function C(e,o,r,l,n,V){return(0,t.openBlock)(),(0,t.createElementBlock)("scroll-view",{scrollY:!0,showScrollbar:!0,enableBackToTop:!0,bubble:"true",style:{flexDirection:"column"}},[(0,t.createElementVNode)("u-video",{id:"videoRef",autoplay:!0,src:e.path,enableDanmu:"",danmuBtn:""},[(0,t.createElementVNode)("u-scalable",{style:{position:"absolute",left:"0",right:"0",top:"0",bottom:"0"}},[(0,t.createElementVNode)("cover-view",{style:{position:"absolute",right:"0px",top:"0px",color:"blue",width:"300px",height:"300px","background-color":"rgba(255, 255, 0, 0.2)"}},[e.isShow?((0,t.openBlock)(),(0,t.createElementBlock)("u-text",{key:0,style:{color:"red"}},"1.5\u500D\u52A0\u901F\u4E2D...")):(0,t.createCommentVNode)("",!0),(0,t.createElementVNode)("view",{onLongpress:o[0]||(o[0]=(...p)=>e.demo&&e.demo(...p)),onTouchend:o[1]||(o[1]=(...p)=>e.demo1&&e.demo1(...p)),"catch:touchstart":"",style:{width:"100px",height:"200px","background-color":"pink",position:"absolute",right:"0px",top:"0px"}},null,32)])])],8,["src"])])}var s=w(S,[["render",C]]);var u=plus.webview.currentWebview();if(u){let e=parseInt(u.id),o="pages/demo/demo",r={};try{r=JSON.parse(u.__query__)}catch(n){}s.mpType="page";let l=Vue.createPageApp(s,{$store:getApp({allowDefault:!0}).$store,__pageId:e,__pagePath:o,__pageQuery:r});l.provide("__globalStyles",Vue.useCssStyles([...__uniConfig.styles,...s.styles||[]])),l.mount("#root")}})();
