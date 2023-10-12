"use strict";
const common_vendor = require("../../common/vendor.js");
const api_get = require("../../api/get.js");
const api_user = require("../../api/user.js");
const utils_page = require("../../utils/page.js");
const utils_toast = require("../../utils/toast.js");
require("../../api/config.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_notice_bar2 = common_vendor.resolveComponent("u-notice-bar");
  const _easycom_u_sticky2 = common_vendor.resolveComponent("u-sticky");
  const _easycom_u_swiper2 = common_vendor.resolveComponent("u-swiper");
  const _easycom_u_tabs2 = common_vendor.resolveComponent("u-tabs");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u__text2 = common_vendor.resolveComponent("u--text");
  const _easycom_u_modal2 = common_vendor.resolveComponent("u-modal");
  const _easycom_u_line_progress2 = common_vendor.resolveComponent("u-line-progress");
  (_easycom_u_search2 + _easycom_u_notice_bar2 + _easycom_u_sticky2 + _easycom_u_swiper2 + _easycom_u_tabs2 + _easycom_u_icon2 + _easycom_u__text2 + _easycom_u_modal2 + _easycom_u_line_progress2)();
}
const _easycom_u_search = () => "../../uni_modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_notice_bar = () => "../../uni_modules/uview-plus/components/u-notice-bar/u-notice-bar.js";
const _easycom_u_sticky = () => "../../uni_modules/uview-plus/components/u-sticky/u-sticky.js";
const _easycom_u_swiper = () => "../../uni_modules/uview-plus/components/u-swiper/u-swiper.js";
const _easycom_u_tabs = () => "../../uni_modules/uview-plus/components/u-tabs/u-tabs.js";
const _easycom_u_icon = () => "../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u__text = () => "../../uni_modules/uview-plus/components/u--text/u--text.js";
const _easycom_u_modal = () => "../../uni_modules/uview-plus/components/u-modal/u-modal.js";
const _easycom_u_line_progress = () => "../../uni_modules/uview-plus/components/u-line-progress/u-line-progress.js";
if (!Math) {
  (_easycom_u_search + _easycom_u_notice_bar + _easycom_u_sticky + _easycom_u_swiper + _easycom_u_tabs + mySwipter + _easycom_u_icon + _easycom_u__text + _easycom_u_modal + _easycom_u_line_progress)();
}
const mySwipter = () => "./swiper.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    common_vendor.onShow(() => {
      utils_page.setFullscreen(false);
    });
    const lineBg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII=";
    let list1 = common_vendor.ref([{
      name: "动漫"
    }, {
      name: "动作片"
    }, {
      name: "科幻片"
    }, {
      name: "动画"
    }, {
      name: "日韩动漫"
    }, {
      name: "欧美动漫"
    }, {
      name: "国产动漫"
    }, {
      name: "奇幻"
    }, {
      name: "国产剧"
    }, {
      name: "喜剧"
    }, {
      name: "韩国剧"
    }, {
      name: "爱情片"
    }, {
      name: "战争片"
    }, {
      name: "恐怖片"
    }, {
      name: "喜剧片"
    }, {
      name: "日剧"
    }, {
      name: "犯罪"
    }, {
      name: "日本"
    }, {
      name: "香港剧"
    }, {
      name: "海外动漫"
    }]);
    let list = common_vendor.ref([]);
    let text1 = "通告:请仔细甄别视频内网站地址,防止上当受骗,违者后果自负。需要软件定制开发VX:s9080700";
    let toDetai2 = (item) => {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail?id=" + list.value[item].videoId
      });
    };
    let scrollTop = common_vendor.ref(0);
    common_vendor.onPageScroll((e) => {
      scrollTop.value = e.scrollTop;
    });
    let toTop = () => {
      common_vendor.index.pageScrollTo({
        scrollTop: 0,
        duration: 500
      });
    };
    common_vendor.onPullDownRefresh(() => {
      getList();
      common_vendor.index.stopPullDownRefresh();
    });
    let tabsCurrent = common_vendor.ref(0);
    let swiperCurrent = common_vendor.ref(0);
    let scrollChange = (event) => {
      tabsCurrent.value = event.detail.current;
      common_vendor.index.$emit(list1.value[tabsCurrent.value].name);
      list.value = [];
      getList(list1.value[tabsCurrent.value].name);
    };
    let tabChange = (e) => {
      swiperCurrent.value = e.index;
    };
    let getList = (name = "动漫") => {
      api_get.getTypeList(name, 1).then((res) => {
        list.value = res.data;
      }).catch((err) => {
        getList(name);
      });
    };
    let searchCustom = (e) => {
      if (e.trim() !== "") {
        common_vendor.index.navigateTo({
          url: "../search/search?searchValue=" + e
        });
      } else {
        utils_toast.msgError("输入不能为空!");
        console.log(this);
      }
    };
    let updateIsShow = common_vendor.ref(false);
    let update_contens = common_vendor.ref([{
      time: "2023/10/8",
      content: [
        "1.全新UI界面,优化体验。",
        "2.新增账号管理,注册,登录。",
        "3.搜索新增分类。",
        "4.新增热度榜。",
        "5.新增收藏功能。",
        "6.新增播放记忆功能,自动追溯到上次播放,以及选集。"
      ],
      footer: "苍穹影视团队-"
    }]);
    let url_ = "";
    let update_modu = common_vendor.ref(false);
    let downloadProgress = common_vendor.ref(0);
    let downText = common_vendor.ref("取消下载");
    let is_down = common_vendor.ref(false);
    let downloadTask = null;
    let down_max = common_vendor.ref(0);
    let down_byte = common_vendor.ref(0);
    let tempFilePath = null;
    let update_app = () => {
      update_modu.value = true;
      updateIsShow.value = false;
      is_down.value = true;
      downloadTask = common_vendor.index.downloadFile({
        url: url_,
        // 替换为实际安装包的下载链接
        success(res) {
          if (res.statusCode === 200) {
            tempFilePath = res.tempFilePath;
            downText.value = "立即安装";
            plus.runtime.install(tempFilePath, {
              force: false
            });
          } else {
            utils_toast.msgError("更新失败,请联系作者!");
          }
        },
        fail(err) {
          update_modu.value = false;
          utils_toast.msgError("下载错误:" + err);
        }
      });
      downloadTask.onProgressUpdate((e) => {
        downloadProgress.value = e.progress;
        down_max.value = (e.totalBytesExpectedToWrite / (1024 * 1024)).toFixed(2);
        down_byte.value = (e.totalBytesWritten / (1024 * 1024)).toFixed(2);
      });
    };
    let down_abort = () => {
      if (tempFilePath !== null) {
        plus.runtime.install(tempFilePath, {
          force: false
        });
        return;
      }
      console.log("aaa");
      let flag = is_down.value;
      downText.value = flag ? "立即更新" : "取消下载";
      flag ? downloadTask.abort() : update_app();
      plus.nativeUI.toast(flag ? "已取消下载!" : "开始下载");
      downloadProgress.value = 0;
      is_down.value = !is_down.value;
    };
    common_vendor.onMounted(() => {
      common_vendor.index.$emit(list1.value[tabsCurrent.value].name);
      getList();
      let key_ = common_vendor.index.getStorageSync("update_key");
      api_user.isUpdate(key_).then((res) => {
        if (!res.data.isUpdate)
          return;
        url_ = res.data.url;
        updateIsShow.value = true;
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(common_vendor.unref(searchCustom)),
        b: common_vendor.o(common_vendor.unref(searchCustom)),
        c: common_vendor.p({
          bgColor: "#28304c",
          color: "white",
          actionStyle: {
            color: "white"
          },
          showAction: true,
          actionText: "搜索",
          animation: true,
          shape: "round"
        }),
        d: common_vendor.p({
          color: "#0962EA",
          text: common_vendor.unref(text1)
        }),
        e: common_vendor.o(common_vendor.unref(toDetai2)),
        f: common_vendor.p({
          bgColor: "#15191f",
          ["show-title"]: true,
          previousMargin: "50",
          nextMargin: "50",
          circular: true,
          ["img-mode"]: "aspectFill",
          height: "400",
          radius: "4",
          loading: !common_vendor.unref(list).length,
          keyName: "cover",
          list: common_vendor.unref(list)
        }),
        g: common_vendor.o(common_vendor.unref(tabChange)),
        h: common_vendor.p({
          lineColor: `url(${lineBg}) 100% 100%`,
          current: common_vendor.unref(tabsCurrent),
          activeStyle: {
            color: "#0962EA"
          },
          inactiveStyle: {
            color: "#606266"
          },
          lineColor: "#6764f6",
          list: common_vendor.unref(list1)
        }),
        i: common_vendor.f(common_vendor.unref(list1), (i, k0, i0) => {
          return {
            a: "1cf27b2a-5-" + i0,
            b: common_vendor.p({
              type: i.name
            })
          };
        }),
        j: common_vendor.unref(swiperCurrent),
        k: common_vendor.o((...args) => common_vendor.unref(scrollChange) && common_vendor.unref(scrollChange)(...args)),
        l: common_vendor.unref(scrollTop) > 300
      }, common_vendor.unref(scrollTop) > 300 ? {
        m: common_vendor.p({
          size: "20",
          name: "arrow-upward"
        }),
        n: common_vendor.o((...args) => common_vendor.unref(toTop) && common_vendor.unref(toTop)(...args))
      } : {}, {
        o: common_vendor.f(common_vendor.unref(update_contens), (i, k0, i0) => {
          return {
            a: "1cf27b2a-8-" + i0 + ",1cf27b2a-7",
            b: common_vendor.p({
              type: "info",
              prefixIcon: "level",
              iconStyle: "font-size: 19px",
              text: i.time + "更新清单如下:"
            }),
            c: common_vendor.f(i.content, (contentVla, k1, i1) => {
              return {
                a: "1cf27b2a-9-" + i0 + "-" + i1 + ",1cf27b2a-7",
                b: common_vendor.p({
                  type: "info",
                  lineHeight: "30",
                  size: "13",
                  text: contentVla
                })
              };
            }),
            d: "1cf27b2a-10-" + i0 + ",1cf27b2a-7",
            e: common_vendor.p({
              align: "right",
              type: "primary",
              lineHeight: "30",
              size: "13",
              text: i.footer + i.time
            })
          };
        }),
        p: common_vendor.o(common_vendor.unref(update_app)),
        q: common_vendor.p({
          confirmColor: "#15191f",
          show: common_vendor.unref(updateIsShow),
          confirmText: "立即更新",
          title: "更新提示!"
        }),
        r: common_vendor.p({
          type: "primary",
          size: "13",
          text: "总大小" + common_vendor.unref(down_max) + "MB"
        }),
        s: common_vendor.p({
          type: "success",
          size: "13",
          text: "已下载" + common_vendor.unref(down_byte) + "MB"
        }),
        t: common_vendor.p({
          percentage: common_vendor.unref(downloadProgress),
          activeColor: "#73cf45"
        }),
        v: common_vendor.o(common_vendor.unref(down_abort)),
        w: common_vendor.p({
          show: common_vendor.unref(update_modu),
          title: "苍穹影视更新",
          confirmText: common_vendor.unref(downText)
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/index/index.vue"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
