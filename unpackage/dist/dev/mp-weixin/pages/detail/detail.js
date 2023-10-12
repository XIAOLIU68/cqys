"use strict";
const common_vendor = require("../../common/vendor.js");
const api_get = require("../../api/get.js");
const api_user = require("../../api/user.js");
const utils_toast = require("../../utils/toast.js");
require("../../api/config.js");
if (!Array) {
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_action_sheet2 = common_vendor.resolveComponent("u-action-sheet");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_easycom_u_button2 + _easycom_u_icon2 + _easycom_u_action_sheet2 + _easycom_u_popup2)();
}
const _easycom_u_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_icon = () => "../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_action_sheet = () => "../../uni_modules/uview-plus/components/u-action-sheet/u-action-sheet.js";
const _easycom_u_popup = () => "../../uni_modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_button + _easycom_u_icon + _easycom_u_action_sheet + _easycom_u_popup)();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    let collectObj = common_vendor.ref({
      color: {
        "0": "#FFF",
        //未收藏
        "1": "#D52B4D"
        //已收藏
      },
      icon: {
        "0": "heart",
        "1": "heart-fill"
      },
      text: {
        "0": "立即收藏",
        "1": "已收藏"
      }
    });
    let playObj = common_vendor.ref({});
    let play_path = common_vendor.ref("");
    let playId = "";
    let isDisplay = common_vendor.ref(false);
    let butText = common_vendor.ref("重新加载");
    let isShowBut = common_vendor.ref(false);
    let playSettingList = [{
      name: "1X播放",
      value: 1
    }, {
      name: "1.25X播放",
      value: 1.25
    }, {
      name: "1.5X播放",
      value: 1.5
    }];
    let sheetShow = common_vendor.ref(false);
    let typeTitle = common_vendor.ref("");
    let typesList = common_vendor.ref([]);
    let currentTime_ = common_vendor.ref(0);
    let currentTime1_ = common_vendor.ref(0);
    let ispopUp = common_vendor.ref(false);
    let handleClose = () => {
      ispopUp.value = false;
    };
    let toType = () => {
      common_vendor.index.navigateTo({
        url: "../search/search?searchValue=" + playObj.value.videoType + "&type=" + 5
      });
    };
    let getInfo = (options, isGetTypes = true) => {
      let {
        id
      } = options;
      playId = id;
      api_get.getFindByVideoId(id).then((res) => {
        if (!res.data) {
          plus.nativeUI.toast(res.msg);
          common_vendor.index.navigateBack();
        }
        playObj.value = res.data;
        playObj.value.isCollect = "0";
        let catch_films_ = common_vendor.index.getStorageSync("user_history_fiml") || [];
        catch_films_.forEach((x) => {
          if (x.videoId == playId) {
            currentTime_.value = x.progress;
            cutIndex.value = x.cutIndex;
            play();
          }
        });
        common_vendor.index.hideLoading();
        typeTitle.value = res.data.videoType;
        if (isGetTypes) {
          getTypesList();
        } else {
          isPlay.value = false;
        }
      }).catch((err) => {
        butText.value = "重新加载";
        isDisplay.value = false;
        isShowBut.value = true;
        common_vendor.index.hideLoading();
      });
    };
    let getTypesList = () => {
      api_get.getFindByVideoType(typeTitle.value).then((res) => {
        typesList.value = res.data;
      }).catch((err) => {
        getTypesList();
      });
    };
    let reloadData = () => {
      isDisplay.value = true;
      butText.value = "加载中...";
      getInfo(playId);
    };
    common_vendor.onLoad((options) => {
      getInfo(options);
    });
    let cutIndex = common_vendor.ref(-1);
    let cut = (path, index) => {
      currentTime_.value = 0;
      cutIndex.value = index;
      play_path.value = path;
      play();
    };
    let bgImageLoad = () => {
      playObj.value.updateTime = false;
    };
    let imageLoad = (item) => {
      item.updateTime = false;
    };
    let isPlay = common_vendor.ref(false);
    let play = () => {
      plus.navigator.setFullscreen(true);
      if (!isPlay.value) {
        let {
          videoId,
          title,
          cover,
          director
        } = playObj.value;
        api_user.addHot({
          videoId,
          title,
          cover,
          director
        });
      }
      isPlay.value = true;
      if (cutIndex.value < 0) {
        cutIndex.value = 0;
      }
      setTimeout(() => {
        play_path.value = playObj.value.chapterList[cutIndex.value === -1 ? 0 : cutIndex.value].chapterPath;
      }, 500);
    };
    let videoContext = common_vendor.index.createVideoContext("videoRef", common_vendor.getCurrentInstance());
    let sheetClose = (val) => {
      sheetShow.value = false;
      if (val) {
        videoContext.playbackRate(val.value);
        plus.nativeUI.toast("设置成功");
      }
    };
    let ended = () => {
      if (cutIndex.value + 1 === playObj.value.chapterList.length) {
        plus.nativeUI.toast("全部播放完成");
      } else {
        cutIndex.value += 1;
        plus.nativeUI.toast("开始播放" + playObj.value.chapterList[cutIndex.value].title);
        play_path.value = playObj.value.chapterList[cutIndex.value].chapterPath;
        play();
      }
    };
    let checkOutPlay = (item) => {
      if (playId != item.videoId) {
        cutIndex.value = 0;
        currentTime_.value = 0;
        common_vendor.index.showLoading({
          title: "正在加载...",
          mask: true
        });
        getInfo({
          id: item.videoId,
          type: item.videoType
        }, false);
      }
    };
    let addCollect = () => {
      let AjaxObj = {
        videoId: playId,
        userId: common_vendor.index.getStorageSync("userInfo").user_id,
        cover: playObj.value.cover,
        videoType: playObj.value.videoType,
        title: playObj.value.title
      };
      if (playObj.value.isCollect == "0") {
        playObj.value.isCollect = "1";
        api_user.userCollect(
          AjaxObj
        ).then((res) => {
          utils_toast.msgSuccess(res.msg);
        });
      } else {
        plus.nativeUI.confirm("确定要取消收藏这部电影吗？", function({
          index
        }) {
          if (index === 0) {
            api_user.userCancelCollect(AjaxObj).then((res) => {
              utils_toast.msgSuccess(res.msg);
              playObj.value.isCollect = "0";
            });
          }
        }, "提示", ["我不想看了", "算了还是看吧"]);
      }
    };
    let onTimeUpdate = (event) => {
      currentTime1_.value = event.detail.currentTime;
    };
    common_vendor.onUnmounted(() => {
      if (isPlay.value) {
        let catch_films = common_vendor.index.getStorageSync("user_history_fiml") || [];
        playObj.value.progress = currentTime1_.value;
        playObj.value.cutIndex = cutIndex.value;
        catch_films.unshift(playObj.value);
        const uniqueArr = catch_films.reduce((acc, cur) => {
          acc.has(cur.videoId) ? acc.get(cur.videoId).name = cur.name : acc.set(cur.videoId, cur);
          return acc;
        }, /* @__PURE__ */ new Map()).values();
        common_vendor.index.setStorageSync("user_history_fiml", [...uniqueArr]);
        console.log("缓存完毕");
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !common_vendor.unref(playObj).cover
      }, !common_vendor.unref(playObj).cover ? {
        b: common_vendor.unref(isShowBut),
        c: common_vendor.o(common_vendor.unref(reloadData)),
        d: common_vendor.p({
          disabled: common_vendor.unref(isDisplay),
          text: common_vendor.unref(butText),
          color: "linear-gradient(to right, #7e214d, #db6031)"
        })
      } : common_vendor.e({
        e: !common_vendor.unref(isPlay)
      }, !common_vendor.unref(isPlay) ? {
        f: common_vendor.o(($event) => common_vendor.unref(bgImageLoad)()),
        g: common_vendor.unref(playObj).updateTime ? "../../static/logo2.svg" : common_vendor.unref(playObj).cover
      } : {
        h: common_vendor.o((...args) => common_vendor.unref(onTimeUpdate) && common_vendor.unref(onTimeUpdate)(...args)),
        i: common_vendor.unref(currentTime_),
        j: common_vendor.o((...args) => _ctx.longPress && _ctx.longPress(...args)),
        k: common_vendor.unref(playObj).title + "--" + common_vendor.unref(playObj).chapterList[common_vendor.unref(cutIndex)].title,
        l: common_vendor.unref(play_path),
        m: common_vendor.o((...args) => common_vendor.unref(ended) && common_vendor.unref(ended)(...args))
      }, {
        n: common_vendor.o(common_vendor.unref(addCollect)),
        o: common_vendor.p({
          size: "32",
          color: common_vendor.unref(collectObj).color[common_vendor.unref(playObj).isCollect],
          name: common_vendor.unref(collectObj).icon[common_vendor.unref(playObj).isCollect]
        }),
        p: common_vendor.t(common_vendor.unref(collectObj).text[common_vendor.unref(playObj).isCollect]),
        q: !common_vendor.unref(isPlay)
      }, !common_vendor.unref(isPlay) ? {
        r: common_vendor.o((...args) => common_vendor.unref(play) && common_vendor.unref(play)(...args))
      } : {}, {
        s: common_vendor.o(($event) => common_vendor.isRef(sheetShow) ? sheetShow.value = true : sheetShow = true),
        t: common_vendor.p({
          size: "32",
          color: "white",
          name: "setting"
        }),
        v: common_vendor.unref(isPlay) ? "0rem" : "-3rem",
        w: common_vendor.t(common_vendor.unref(playObj).title),
        x: common_vendor.t(common_vendor.unref(playObj).region),
        y: common_vendor.t(common_vendor.unref(playObj).releaseTime),
        z: common_vendor.t(common_vendor.unref(playObj).videoType.replace(",", "") || ""),
        A: common_vendor.t(common_vendor.unref(playObj).descs),
        B: common_vendor.unref(isPlay) ? "0rem" : "2rem",
        C: common_vendor.t(common_vendor.unref(playObj).director),
        D: common_vendor.t(common_vendor.unref(playObj).actor),
        E: common_vendor.o(($event) => common_vendor.isRef(ispopUp) ? ispopUp.value = true : ispopUp = true),
        F: common_vendor.f(common_vendor.unref(playObj).chapterList, (i, index, i0) => {
          return {
            a: common_vendor.t(i.title),
            b: common_vendor.o(($event) => common_vendor.unref(cut)(i.chapterPath, index), i.chapterPath),
            c: i.chapterPath,
            d: index === common_vendor.unref(cutIndex) ? 1 : ""
          };
        }),
        G: common_vendor.unref(cutIndex) * 93.9 - 95,
        H: common_vendor.o((...args) => common_vendor.unref(toType) && common_vendor.unref(toType)(...args)),
        I: common_vendor.f(common_vendor.unref(typesList), (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => common_vendor.unref(imageLoad)(item), item.videoId),
            b: item.updateTime ? "../../static/logo2.svg" : item.cover,
            c: common_vendor.t(item.title),
            d: common_vendor.o(($event) => common_vendor.unref(checkOutPlay)(item), item.videoId),
            e: "play_" + index,
            f: item.videoId
          };
        })
      }), {
        J: common_vendor.o(common_vendor.unref(sheetClose)),
        K: common_vendor.o(common_vendor.unref(sheetClose)),
        L: common_vendor.p({
          actions: common_vendor.unref(playSettingList),
          round: 20,
          safeAreaInsetBottom: true,
          closeOnClickOverlay: true,
          closeOnClickAction: true,
          title: "播放设置",
          show: common_vendor.unref(sheetShow)
        }),
        M: common_vendor.f(common_vendor.unref(playObj).chapterList, (i, index, i0) => {
          return {
            a: common_vendor.t(i.title),
            b: common_vendor.o(($event) => common_vendor.unref(cut)(i.chapterPath, index), i.chapterPath),
            c: i.chapterPath,
            d: index === common_vendor.unref(cutIndex) ? 1 : ""
          };
        }),
        N: common_vendor.o(common_vendor.unref(handleClose)),
        O: common_vendor.p({
          show: common_vendor.unref(ispopUp),
          overlay: true,
          bgColor: "#0f161d",
          closeable: true,
          safeAreaInsetBottom: true,
          mode: "bottom"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca06f3c"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/detail/detail.vue"]]);
wx.createPage(MiniProgramPage);
