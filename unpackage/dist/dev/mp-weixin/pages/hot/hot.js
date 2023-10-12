"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user = require("../../api/user.js");
const utils_page = require("../../utils/page.js");
const common_assets = require("../../common/assets.js");
require("../../api/config.js");
require("../../utils/toast.js");
const _sfc_main = {
  __name: "hot",
  setup(__props) {
    utils_page.setFullscreen(false);
    let hotFirstListClass = common_vendor.ref([
      {
        class: "hot_top1 hot",
        src: common_assets.hot1
      },
      {
        class: "hot_top2 hot",
        src: common_assets.hot2
      },
      {
        class: "hot_top3 hot",
        src: common_assets.hot3
      }
    ]);
    let imageLoad = (item) => {
      item.updateTime = false;
    };
    let hotList = common_vendor.ref([]);
    let handlerGetHotList = () => {
      api_user.getHotList().then((res) => {
        hotList.value = res.data.map((x) => {
          x.updateTime = true;
          return x;
        });
        common_vendor.index.stopPullDownRefresh();
      });
    };
    common_vendor.onMounted(() => {
      handlerGetHotList();
    });
    common_vendor.onPullDownRefresh(() => {
      handlerGetHotList();
    });
    let toPlay = (item) => {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail?id=" + item.hot_video_id
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(hotList).slice(0, 3), (item, index, i0) => {
          return {
            a: item.updateTime ? "../../static/logo2.svg" : item.hot_video_img,
            b: common_vendor.o(($event) => common_vendor.unref(imageLoad)(item), item.hot_video_id),
            c: common_vendor.t(item.hot_video_name),
            d: common_vendor.t(item.hot_video_director || "暂无导演"),
            e: common_vendor.t(item.hot_play_number),
            f: common_vendor.t(index + 1),
            g: item.hot_video_id,
            h: common_vendor.o(($event) => common_vendor.unref(toPlay)(item), item.hot_video_id),
            i: common_vendor.n(common_vendor.unref(hotFirstListClass)[index].class)
          };
        }),
        b: common_vendor.f(common_vendor.unref(hotList).slice(3, 10), (item, k0, i0) => {
          return {
            a: common_vendor.o(($event) => common_vendor.unref(imageLoad)(item), item.hot_video_id),
            b: item.updateTime ? "../../static/logo2.svg" : item.hot_video_img,
            c: common_vendor.t(item.hot_video_name),
            d: common_vendor.t(item.hot_video_director || "暂无导演"),
            e: common_vendor.t(item.hot_play_number),
            f: item.hot_video_id,
            g: common_vendor.o(($event) => common_vendor.unref(toPlay)(item), item.hot_video_id)
          };
        }),
        c: !common_vendor.unref(hotList).length
      }, !common_vendor.unref(hotList).length ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/Qffiction/app1/uni-app/commApp/pages/hot/hot.vue"]]);
wx.createPage(MiniProgramPage);
