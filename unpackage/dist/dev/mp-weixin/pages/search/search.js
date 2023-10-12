"use strict";
const common_vendor = require("../../common/vendor.js");
const api_get = require("../../api/get.js");
const utils_toast = require("../../utils/toast.js");
require("../../api/config.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_subsection2 = common_vendor.resolveComponent("u-subsection");
  const _easycom_u_sticky2 = common_vendor.resolveComponent("u-sticky");
  const _easycom_u_loading_page2 = common_vendor.resolveComponent("u-loading-page");
  (_easycom_u_search2 + _easycom_u_subsection2 + _easycom_u_sticky2 + _easycom_u_loading_page2)();
}
const _easycom_u_search = () => "../../uni_modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_subsection = () => "../../uni_modules/uview-plus/components/u-subsection/u-subsection.js";
const _easycom_u_sticky = () => "../../uni_modules/uview-plus/components/u-sticky/u-sticky.js";
const _easycom_u_loading_page = () => "../../uni_modules/uview-plus/components/u-loading-page/u-loading-page.js";
if (!Math) {
  (_easycom_u_search + _easycom_u_subsection + _easycom_u_sticky + _easycom_u_loading_page)();
}
const _sfc_main = {
  __name: "search",
  setup(__props) {
    let searchValue = common_vendor.ref("");
    let list = common_vendor.ref([]);
    let isNextPage = true;
    let loadingTitle = common_vendor.ref("正在加载中....");
    let loading = common_vendor.ref(true);
    common_vendor.onLoad((options) => {
      searchValue.value = options.searchValue;
      if (options.type) {
        subCurrent.value = options.type;
      }
      getList();
    });
    let getList = () => {
      if (!isNextPage) {
        utils_toast.msgError("没有更多了");
        return false;
      }
      api_get.getFindBySearch(searchValue.value, indexPage, subList.value[subCurrent.value].type).then((res) => {
        if (!res.data && indexPage !== 1) {
          isNextPage = false;
          loadingTitle.value = "没有更多啦!";
          loading.value = false;
          flage.value = false;
          return false;
        }
        if (!res.data && indexPage === 1) {
          isNextPage = false;
          loadingTitle.value = "...";
          loading.value = false;
          flage.value = false;
          list.value = [];
          return false;
        }
        flage.value = true;
        loading.value = false;
        if (indexPage === 1) {
          list.value = res.data;
        } else {
          list.value = [...list.value, ...res.data];
        }
      });
    };
    let toDetail = (item) => {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail?id=" + item.videoId
      });
    };
    let flage = common_vendor.ref(true);
    let indexPage = 1;
    common_vendor.onReachBottom(() => {
      if (flage.value) {
        indexPage += 1;
        getList();
      }
    });
    let imageLoad = (item) => {
      item.updateTime = false;
    };
    let searchCustom = (e) => {
      if (e.trim() !== "") {
        setTimeout(() => {
          common_vendor.index.pageScrollTo({
            offsetTop: 0,
            duration: 0
          });
        });
        debounce(() => {
          searchInit();
          getList();
        });
      } else {
        utils_toast.msgError("输入不能为空!");
      }
    };
    let searchInit = () => {
      isNextPage = true;
      indexPage = 1;
      loading.value = true;
      list.value = [];
      loadingTitle.value = "正在加载中....";
    };
    let subList = common_vendor.ref([
      {
        name: "标题",
        type: "title"
      },
      {
        name: "导演",
        type: "director"
      },
      {
        name: "主演",
        type: "actor"
      },
      {
        name: "地区",
        type: "region"
      },
      {
        name: "上映",
        type: "releaseTime"
      },
      {
        name: "分类",
        type: "videoType"
      }
    ]);
    let subCurrent = common_vendor.ref(0);
    let sectionChange = (e) => {
      subCurrent.value = e;
      debounce(() => {
        searchInit();
        getList();
      });
    };
    let timer = null;
    let debounce = (fn) => {
      clearTimeout(timer);
      timer = setTimeout(fn, 500);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(common_vendor.unref(searchCustom)),
        b: common_vendor.o(common_vendor.unref(searchCustom)),
        c: common_vendor.o(($event) => common_vendor.isRef(searchValue) ? searchValue.value = $event : searchValue = $event),
        d: common_vendor.p({
          bgColor: "#28304c",
          color: "white",
          actionStyle: {
            color: "white"
          },
          showAction: true,
          actionText: "搜索",
          animation: true,
          shape: "round",
          modelValue: common_vendor.unref(searchValue)
        }),
        e: common_vendor.o(common_vendor.unref(sectionChange)),
        f: common_vendor.p({
          bgColor: "#080d16",
          bold: true,
          activeColo: "#0962EA",
          inactiveColor: "white",
          list: common_vendor.unref(subList),
          current: common_vendor.unref(subCurrent)
        }),
        g: !common_vendor.unref(loading) && common_vendor.unref(list).length
      }, !common_vendor.unref(loading) && common_vendor.unref(list).length ? {
        h: common_vendor.f(common_vendor.unref(list), (item, k0, i0) => {
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
        i: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {
        j: common_vendor.p({
          iconSize: "100",
          fontSize: "15",
          loadingText: "搜索中",
          image: "../../static/logo2.svg",
          ["bg-color"]: "#080d16",
          loading: common_vendor.unref(loading)
        })
      } : {}, {
        k: !common_vendor.unref(loading) && !common_vendor.unref(list).length
      }, !common_vendor.unref(loading) && !common_vendor.unref(list).length ? {} : {}, {
        l: common_vendor.t(common_vendor.unref(loadingTitle))
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c10c040c"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/search/search.vue"]]);
wx.createPage(MiniProgramPage);
