import { getCurrentInstance, ref, onMounted, openBlock, createElementBlock, createElementVNode, createCommentVNode } from "vue";
function formatAppLog(type, filename, ...args) {
  if (uni.__log__) {
    uni.__log__(type, filename, ...args);
  } else {
    console[type].apply(console, [...args, filename]);
  }
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
getCurrentInstance();
let path = ref("");
ref(false);
let videoContext = uni.createVideoContext("videoRef", getCurrentInstance());
onMounted(() => {
  formatAppLog("log", "at pages/demo/demo.nvue:31", "执行了啊");
  const value = uni.getStorageSync("path");
  if (value) {
    path.value = value;
    videoContext.requestFullScreen();
  }
});
const _sfc_main = {};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("scroll-view", {
    scrollY: true,
    showScrollbar: true,
    enableBackToTop: true,
    bubble: "true",
    style: { flexDirection: "column" }
  }, [
    createElementVNode("u-video", {
      id: "videoRef",
      autoplay: true,
      src: _ctx.path,
      enableDanmu: "",
      danmuBtn: ""
    }, [
      createElementVNode("u-scalable", { style: { position: "absolute", left: "0", right: "0", top: "0", bottom: "0" } }, [
        createElementVNode("cover-view", { style: { "position": "absolute", "right": "0px", "top": "0px", "color": "blue", "width": "300px", "height": "300px", "background-color": "rgba(255, 255, 0, 0.2)" } }, [
          _ctx.isShow ? (openBlock(), createElementBlock("u-text", {
            key: 0,
            style: { "color": "red" }
          }, "1.5倍加速中...")) : createCommentVNode("", true),
          createElementVNode("view", {
            onLongpress: _cache[0] || (_cache[0] = (...args) => _ctx.demo && _ctx.demo(...args)),
            onTouchend: _cache[1] || (_cache[1] = (...args) => _ctx.demo1 && _ctx.demo1(...args)),
            "catch:touchstart": "",
            style: { "width": "100px", "height": "200px", "background-color": "pink", "position": "absolute", "right": "0px", "top": "0px" }
          }, null, 32)
        ])
      ])
    ], 8, ["src"])
  ]);
}
const demo = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  demo as default
};
