"use strict";
const common_vendor = require("../../common/vendor.js");
const api_get = require("../../api/get.js");
require("../../api/config.js");
require("../../utils/toast.js");
const _sfc_main = {
  __name: "swiper",
  props: {
    type: {
      type: String,
      default: "科幻片"
    }
  },
  setup(__props) {
    const props = __props;
    let page = 1;
    let list = common_vendor.ref([]);
    let toDetail = (item) => {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail?id=" + item.videoId
      });
    };
    let imageLoad = (item) => {
      item.updateTime = false;
    };
    let getList = (type, page2) => {
      api_get.getTypeList(type, page2).then((res) => {
        list.value = res.data;
      }).catch((err) => {
        getList(type, page2);
      });
    };
    common_vendor.onMounted(() => {
      common_vendor.index.$on(props.type, () => {
        if (list.value.length)
          return false;
        getList(props.type, page);
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(list).length
      }, common_vendor.unref(list).length ? {
        b: common_vendor.f(common_vendor.unref(list), (item, k0, i0) => {
          return {
            a: common_vendor.o(($event) => common_vendor.unref(toDetail)(item), item.videoId),
            b: common_vendor.o(($event) => common_vendor.unref(imageLoad)(item), item.videoId),
            c: item.updateTime ? "../../static/logo2.svg" : item.cover,
            d: common_vendor.t(item.title),
            e: common_vendor.t(item.director),
            f: item.videoId
          };
        })
      } : {}, {
        c: !common_vendor.unref(list).length
      }, !common_vendor.unref(list).length ? {} : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-70a4f539"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/index/swiper.vue"]]);
wx.createComponent(Component);
