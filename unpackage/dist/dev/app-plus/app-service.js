if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue, shared) {
  "use strict";
  function hideSystemNavigation() {
    if (typeof plus !== "undefined") {
      plus.navigator.hideSystemNavigation();
    }
  }
  function setFullscreen(fullscreen) {
    if (typeof plus !== "undefined") {
      plus.navigator.setFullscreen(fullscreen);
      plus.navigator.showSystemNavigation();
    }
  }
  function msgError(msg, centerType = "center", dur = 1500) {
    plus.nativeUI.toast(msg, {
      align: "center",
      icon: "/static/toast/error.png",
      style: "inline",
      iconWidth: "20px",
      iconHeight: "20px",
      verticalAlign: centerType,
      duration: dur
    });
  }
  function msgSuccess(msg, centerType = "center") {
    plus.nativeUI.toast(msg, {
      align: "center",
      icon: "/static/toast/success.png",
      style: "inline",
      iconWidth: "20px",
      iconHeight: "20px",
      verticalAlign: centerType,
      duration: 1500
    });
  }
  uni.addInterceptor("request", {
    invoke(args) {
      args.url = "http://192.168.10.13:10001" + args.url;
    }
  });
  uni.addInterceptor("request", {
    returnValue(response) {
      return new Promise((succ, err) => {
        response.then((res) => {
          let ret = res.data;
          if (typeof plus !== "undefined") {
            if (ret.code !== 200 && ret.code !== 0) {
              msgError(ret.msg);
              err(new Error(ret.msg));
            }
          } else {
            if (ret.code !== 200 && ret.code !== 0) {
              uni.showToast({
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
  function getRequist$1(url2, data = {}, method = "get") {
    return uni.request({
      method,
      url: url2,
      header: {
        "Authorization": uni.getStorageSync("token")
      },
      data
    });
  }
  function postRequist(url2, data) {
    return new Promise((reslove, reject) => {
      uni.uploadFile({
        url: "http://47.101.56.97:10001" + url2,
        filePath: data,
        name: "file",
        success: (res) => {
          let resp = JSON.parse(res.data);
          reslove(resp);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
  function login(userAccount, userPassword) {
    return getRequist$1(`/login/${userAccount}/${userPassword}`);
  }
  function register(userAccount, userPassword, userPassword1) {
    return uni.request({
      method: "post",
      url: `/register`,
      data: {
        userAccount,
        userPassword,
        userPassword1
      }
    });
  }
  function uploadTx(data, userId, fieldName) {
    return postRequist(`/userUploadTx/${userId}/${fieldName}`, data);
  }
  function userCollect(data) {
    return getRequist$1(`/userCollect`, data, "POST");
  }
  function userCancelCollect({ videoId, userId }) {
    return getRequist$1(`/userCancelCollect/${videoId}/${userId}`);
  }
  function getUserInfo(userId) {
    return getRequist$1(`/getUserInfo/${userId}`);
  }
  function userFindCollect(type = "list") {
    let { user_id } = uni.getStorageSync("userInfo");
    return getRequist$1(`/userFindCollect/${user_id}/${type}`);
  }
  function updateUserInfo(user) {
    return getRequist$1(`/userUpdateInfo`, user, "POST");
  }
  function addHot(video2) {
    return getRequist$1(`/AddHot`, video2, "POST");
  }
  function getHotList() {
    return getRequist$1(`/getHotList`);
  }
  function handleFeedback(data) {
    return getRequist$1(`/feedback`, data, "GET");
  }
  function isUpdate(key) {
    return getRequist$1(`/isUpdate/${key}`);
  }
  function comment(data) {
    return getRequist$1(`/userComment`, data, "POST");
  }
  function queryUserComment(film_id) {
    return getRequist$1(`/queryUserComment/${film_id}`);
  }
  const _export_sfc = (sfc, props2) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props2) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$M = {
    __name: "login",
    setup(__props) {
      let toSecurity_policy = () => {
        uni.navigateTo({
          url: "/pages/security_policy/security_policy",
          animationType: "slide-in-bottom"
        });
      };
      let toRegister = () => {
        uni.redirectTo({
          url: "/pages/register/register"
        });
      };
      let account = vue.ref("");
      let password = vue.ref("");
      let isCheck = vue.ref([]);
      let isCheckChange = (e) => {
        isCheck.value = e.detail.value;
      };
      let ruleTitle = vue.ref({
        accountRule: "none",
        passwordRule: "none"
      });
      let islogin = vue.ref(false);
      let SubmitLogin = () => {
        if (islogin.value)
          return false;
        if (isNull()) {
          if (!isCheck.value.length) {
            msgError("请勾选用户协议后,进行登录!");
            return;
          } else {
            uni.setStorageSync("isAuthLogin", true);
            uni.setStorageSync("accountInfo", {
              account: account.value,
              password: password.value
            });
          }
          islogin.value = true;
          login(account.value, password.value).then((res) => {
            uni.setStorageSync("userInfo", res.data.userInfo);
            uni.setStorageSync("token", res.data.token);
            uni.switchTab({
              url: "../index/index"
            });
            islogin.value = false;
          }).catch(() => {
            islogin.value = false;
          });
        } else {
          islogin.value = false;
        }
      };
      let isNull = () => {
        if (!account.value) {
          ruleTitle.value.accountRule = "block";
          return false;
        } else {
          ruleTitle.value.accountRule = "none";
        }
        if (!password.value) {
          ruleTitle.value.passwordRule = "block";
          return false;
        } else {
          ruleTitle.value.passwordRule = "none";
        }
        return true;
      };
      vue.onMounted(() => {
        hideSystemNavigation();
        let isAuthLogin = uni.getStorageSync("isAuthLogin");
        let accountInfo = uni.getStorageSync("accountInfo");
        if (isAuthLogin) {
          isCheckChange({ detail: { value: ["login"] } });
          account.value = accountInfo.account;
          password.value = accountInfo.password;
          SubmitLogin();
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
          vue.createCommentVNode(" 登录页 "),
          vue.createCommentVNode(" 返回按钮 "),
          vue.createElementVNode("div", { class: "back-box" }, [
            vue.createElementVNode("image", { src: "/static/index/back.svg" })
          ]),
          vue.createCommentVNode(" 登录提示标签 "),
          vue.createElementVNode("div", { class: "title-box" }, [
            vue.createElementVNode("span", null, "嘿!"),
            vue.createElementVNode("span", null, "欢迎登录苍穹影视!"),
            vue.createElementVNode("div", { class: "title-item" }, [
              vue.createElementVNode("span", null, "欢迎回来～我们等你好久了!")
            ])
          ]),
          vue.createCommentVNode(" 账号密码框 "),
          vue.createElementVNode("div", { class: "account-box" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "text",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(account) ? account.value = $event : account = $event),
                class: "account",
                placeholder: "请输入账号",
                "placeholder-style": "font-size:0.8rem;"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, vue.unref(account)]
            ]),
            vue.createElementVNode(
              "span",
              {
                style: vue.normalizeStyle({ "display": vue.unref(ruleTitle).accountRule }),
                class: "account-ruleTitle"
              },
              "看官,不能为空哦!",
              4
              /* STYLE */
            ),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "password",
                onConfirm: _cache[1] || (_cache[1] = (...args) => vue.unref(SubmitLogin) && vue.unref(SubmitLogin)(...args)),
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.isRef(password) ? password.value = $event : password = $event),
                class: "password",
                placeholder: "请输入密码",
                "placeholder-style": "font-size:0.8rem;"
              },
              null,
              544
              /* HYDRATE_EVENTS, NEED_PATCH */
            ), [
              [vue.vModelText, vue.unref(password)]
            ]),
            vue.createElementVNode(
              "span",
              {
                style: vue.normalizeStyle({ "display": vue.unref(ruleTitle).passwordRule }),
                class: "password-ruleTitle"
              },
              "看官,不能为空哦!",
              4
              /* STYLE */
            ),
            vue.createElementVNode("div", { class: "wj-password" }, [
              vue.createElementVNode(
                "checkbox-group",
                {
                  onChange: _cache[4] || (_cache[4] = (...args) => vue.unref(isCheckChange) && vue.unref(isCheckChange)(...args))
                },
                [
                  vue.createElementVNode("label", null, [
                    vue.createElementVNode("checkbox", {
                      style: { "transform": "scale(0.7)" },
                      color: "#5d68b6",
                      value: "login"
                    }),
                    vue.createTextVNode(" 我已同意"),
                    vue.createElementVNode("b", {
                      style: { "color": "blue" },
                      onClick: _cache[3] || (_cache[3] = (...args) => vue.unref(toSecurity_policy) && vue.unref(toSecurity_policy)(...args))
                    }, "用户协议")
                  ])
                ],
                32
                /* HYDRATE_EVENTS */
              ),
              vue.createElementVNode("span", null, "忘记密码")
            ])
          ]),
          vue.createCommentVNode(" 登录按钮 "),
          vue.createElementVNode("div", { class: "login-but-box" }, [
            vue.createElementVNode("button", {
              disabled: vue.unref(islogin),
              onClick: _cache[5] || (_cache[5] = (...args) => vue.unref(SubmitLogin) && vue.unref(SubmitLogin)(...args)),
              class: "loginBut"
            }, vue.toDisplayString(vue.unref(islogin) ? "登录中..." : "登录"), 9, ["disabled"])
          ]),
          vue.createCommentVNode(" 第三方登录 "),
          vue.createElementVNode("div", { class: "dsf" }, [
            vue.createElementVNode("span", { class: "dsf-item" }, "第三方登录")
          ]),
          vue.createCommentVNode(" QQ OR 微信 "),
          vue.createElementVNode("div", { class: "qq-weix-box" }, [
            vue.createElementVNode("image", { src: "/static/index/qq.svg" }),
            vue.createElementVNode("image", { src: "/static/index/wx.svg" })
          ]),
          vue.createElementVNode("div", { class: "regr-box" }, [
            vue.createElementVNode("span", { class: "regr-title" }, "没有账号?"),
            vue.createElementVNode("span", {
              onClick: _cache[6] || (_cache[6] = (...args) => vue.unref(toRegister) && vue.unref(toRegister)(...args)),
              class: "regr-title",
              style: { "color": "blue" }
            }, "点击这里")
          ])
        ]);
      };
    }
  };
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$M, [["__scopeId", "data-v-e4e4508d"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/login/login.vue"]]);
  const ON_SHOW = "onShow";
  const ON_LOAD = "onLoad";
  const ON_PAGE_SCROLL = "onPageScroll";
  const ON_REACH_BOTTOM = "onReachBottom";
  const ON_PULL_DOWN_REFRESH = "onPullDownRefresh";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return shared.isString(component) ? easycom : component;
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createHook(ON_SHOW);
  const onLoad = /* @__PURE__ */ createHook(ON_LOAD);
  const onPageScroll = /* @__PURE__ */ createHook(ON_PAGE_SCROLL);
  const onReachBottom = /* @__PURE__ */ createHook(ON_REACH_BOTTOM);
  const onPullDownRefresh = /* @__PURE__ */ createHook(ON_PULL_DOWN_REFRESH);
  const icons = {
    "uicon-level": "",
    "uicon-column-line": "",
    "uicon-checkbox-mark": "",
    "uicon-folder": "",
    "uicon-movie": "",
    "uicon-star-fill": "",
    "uicon-star": "",
    "uicon-phone-fill": "",
    "uicon-phone": "",
    "uicon-apple-fill": "",
    "uicon-chrome-circle-fill": "",
    "uicon-backspace": "",
    "uicon-attach": "",
    "uicon-cut": "",
    "uicon-empty-car": "",
    "uicon-empty-coupon": "",
    "uicon-empty-address": "",
    "uicon-empty-favor": "",
    "uicon-empty-permission": "",
    "uicon-empty-news": "",
    "uicon-empty-search": "",
    "uicon-github-circle-fill": "",
    "uicon-rmb": "",
    "uicon-person-delete-fill": "",
    "uicon-reload": "",
    "uicon-order": "",
    "uicon-server-man": "",
    "uicon-search": "",
    "uicon-fingerprint": "",
    "uicon-more-dot-fill": "",
    "uicon-scan": "",
    "uicon-share-square": "",
    "uicon-map": "",
    "uicon-map-fill": "",
    "uicon-tags": "",
    "uicon-tags-fill": "",
    "uicon-bookmark-fill": "",
    "uicon-bookmark": "",
    "uicon-eye": "",
    "uicon-eye-fill": "",
    "uicon-mic": "",
    "uicon-mic-off": "",
    "uicon-calendar": "",
    "uicon-calendar-fill": "",
    "uicon-trash": "",
    "uicon-trash-fill": "",
    "uicon-play-left": "",
    "uicon-play-right": "",
    "uicon-minus": "",
    "uicon-plus": "",
    "uicon-info": "",
    "uicon-info-circle": "",
    "uicon-info-circle-fill": "",
    "uicon-question": "",
    "uicon-error": "",
    "uicon-close": "",
    "uicon-checkmark": "",
    "uicon-android-circle-fill": "",
    "uicon-android-fill": "",
    "uicon-ie": "",
    "uicon-IE-circle-fill": "",
    "uicon-google": "",
    "uicon-google-circle-fill": "",
    "uicon-setting-fill": "",
    "uicon-setting": "",
    "uicon-minus-square-fill": "",
    "uicon-plus-square-fill": "",
    "uicon-heart": "",
    "uicon-heart-fill": "",
    "uicon-camera": "",
    "uicon-camera-fill": "",
    "uicon-more-circle": "",
    "uicon-more-circle-fill": "",
    "uicon-chat": "",
    "uicon-chat-fill": "",
    "uicon-bag-fill": "",
    "uicon-bag": "",
    "uicon-error-circle-fill": "",
    "uicon-error-circle": "",
    "uicon-close-circle": "",
    "uicon-close-circle-fill": "",
    "uicon-checkmark-circle": "",
    "uicon-checkmark-circle-fill": "",
    "uicon-question-circle-fill": "",
    "uicon-question-circle": "",
    "uicon-share": "",
    "uicon-share-fill": "",
    "uicon-shopping-cart": "",
    "uicon-shopping-cart-fill": "",
    "uicon-bell": "",
    "uicon-bell-fill": "",
    "uicon-list": "",
    "uicon-list-dot": "",
    "uicon-zhihu": "",
    "uicon-zhihu-circle-fill": "",
    "uicon-zhifubao": "",
    "uicon-zhifubao-circle-fill": "",
    "uicon-weixin-circle-fill": "",
    "uicon-weixin-fill": "",
    "uicon-twitter-circle-fill": "",
    "uicon-twitter": "",
    "uicon-taobao-circle-fill": "",
    "uicon-taobao": "",
    "uicon-weibo-circle-fill": "",
    "uicon-weibo": "",
    "uicon-qq-fill": "",
    "uicon-qq-circle-fill": "",
    "uicon-moments-circel-fill": "",
    "uicon-moments": "",
    "uicon-qzone": "",
    "uicon-qzone-circle-fill": "",
    "uicon-baidu-circle-fill": "",
    "uicon-baidu": "",
    "uicon-facebook-circle-fill": "",
    "uicon-facebook": "",
    "uicon-car": "",
    "uicon-car-fill": "",
    "uicon-warning-fill": "",
    "uicon-warning": "",
    "uicon-clock-fill": "",
    "uicon-clock": "",
    "uicon-edit-pen": "",
    "uicon-edit-pen-fill": "",
    "uicon-email": "",
    "uicon-email-fill": "",
    "uicon-minus-circle": "",
    "uicon-minus-circle-fill": "",
    "uicon-plus-circle": "",
    "uicon-plus-circle-fill": "",
    "uicon-file-text": "",
    "uicon-file-text-fill": "",
    "uicon-pushpin": "",
    "uicon-pushpin-fill": "",
    "uicon-grid": "",
    "uicon-grid-fill": "",
    "uicon-play-circle": "",
    "uicon-play-circle-fill": "",
    "uicon-pause-circle-fill": "",
    "uicon-pause": "",
    "uicon-pause-circle": "",
    "uicon-eye-off": "",
    "uicon-eye-off-outline": "",
    "uicon-gift-fill": "",
    "uicon-gift": "",
    "uicon-rmb-circle-fill": "",
    "uicon-rmb-circle": "",
    "uicon-kefu-ermai": "",
    "uicon-server-fill": "",
    "uicon-coupon-fill": "",
    "uicon-coupon": "",
    "uicon-integral": "",
    "uicon-integral-fill": "",
    "uicon-home-fill": "",
    "uicon-home": "",
    "uicon-hourglass-half-fill": "",
    "uicon-hourglass": "",
    "uicon-account": "",
    "uicon-plus-people-fill": "",
    "uicon-minus-people-fill": "",
    "uicon-account-fill": "",
    "uicon-thumb-down-fill": "",
    "uicon-thumb-down": "",
    "uicon-thumb-up": "",
    "uicon-thumb-up-fill": "",
    "uicon-lock-fill": "",
    "uicon-lock-open": "",
    "uicon-lock-opened-fill": "",
    "uicon-lock": "",
    "uicon-red-packet-fill": "",
    "uicon-photo-fill": "",
    "uicon-photo": "",
    "uicon-volume-off-fill": "",
    "uicon-volume-off": "",
    "uicon-volume-fill": "",
    "uicon-volume": "",
    "uicon-red-packet": "",
    "uicon-download": "",
    "uicon-arrow-up-fill": "",
    "uicon-arrow-down-fill": "",
    "uicon-play-left-fill": "",
    "uicon-play-right-fill": "",
    "uicon-rewind-left-fill": "",
    "uicon-rewind-right-fill": "",
    "uicon-arrow-downward": "",
    "uicon-arrow-leftward": "",
    "uicon-arrow-rightward": "",
    "uicon-arrow-upward": "",
    "uicon-arrow-down": "",
    "uicon-arrow-right": "",
    "uicon-arrow-left": "",
    "uicon-arrow-up": "",
    "uicon-skip-back-left": "",
    "uicon-skip-forward-right": "",
    "uicon-rewind-right": "",
    "uicon-rewind-left": "",
    "uicon-arrow-right-double": "",
    "uicon-arrow-left-double": "",
    "uicon-wifi-off": "",
    "uicon-wifi": "",
    "uicon-empty-data": "",
    "uicon-empty-history": "",
    "uicon-empty-list": "",
    "uicon-empty-page": "",
    "uicon-empty-order": "",
    "uicon-man": "",
    "uicon-woman": "",
    "uicon-man-add": "",
    "uicon-man-add-fill": "",
    "uicon-man-delete": "",
    "uicon-man-delete-fill": "",
    "uicon-zh": "",
    "uicon-en": ""
  };
  const version = "3";
  const config = {
    v: version,
    version,
    // 主题名称
    type: [
      "primary",
      "success",
      "info",
      "error",
      "warning"
    ],
    // 颜色部分，本来可以通过scss的:export导出供js使用，但是奈何nvue不支持
    color: {
      "u-primary": "#2979ff",
      "u-warning": "#ff9900",
      "u-success": "#19be6b",
      "u-error": "#fa3534",
      "u-info": "#909399",
      "u-main-color": "#303133",
      "u-content-color": "#606266",
      "u-tips-color": "#909399",
      "u-light-color": "#c0c4cc"
    },
    // 默认单位，可以通过配置为rpx，那么在用于传入组件大小参数为数值时，就默认为rpx
    unit: "px"
  };
  const ActionSheet = {
    // action-sheet组件
    actionSheet: {
      show: false,
      title: "",
      description: "",
      actions: () => [],
      index: "",
      cancelText: "",
      closeOnClickAction: true,
      safeAreaInsetBottom: true,
      openType: "",
      closeOnClickOverlay: true,
      round: 0
    }
  };
  const Album = {
    // album 组件
    album: {
      urls: () => [],
      keyName: "",
      singleSize: 180,
      multipleSize: 70,
      space: 6,
      singleMode: "scaleToFill",
      multipleMode: "aspectFill",
      maxCount: 9,
      previewFullImage: true,
      rowCount: 3,
      showMore: true
    }
  };
  const Alert = {
    // alert警告组件
    alert: {
      title: "",
      type: "warning",
      description: "",
      closable: false,
      showIcon: false,
      effect: "light",
      center: false,
      fontSize: 14
    }
  };
  const Avatar = {
    // avatar 组件
    avatar: {
      src: "",
      shape: "circle",
      size: 40,
      mode: "scaleToFill",
      text: "",
      bgColor: "#c0c4cc",
      color: "#ffffff",
      fontSize: 18,
      icon: "",
      mpAvatar: false,
      randomBgColor: false,
      defaultUrl: "",
      colorIndex: "",
      name: ""
    }
  };
  const AvatarGroup = {
    // avatarGroup 组件
    avatarGroup: {
      urls: () => [],
      maxCount: 5,
      shape: "circle",
      mode: "scaleToFill",
      showMore: true,
      size: 40,
      keyName: "",
      gap: 0.5,
      extraValue: 0
    }
  };
  const Backtop = {
    // backtop组件
    backtop: {
      mode: "circle",
      icon: "arrow-upward",
      text: "",
      duration: 100,
      scrollTop: 0,
      top: 400,
      bottom: 100,
      right: 20,
      zIndex: 9,
      iconStyle: () => ({
        color: "#909399",
        fontSize: "19px"
      })
    }
  };
  const Badge = {
    // 徽标数组件
    badge: {
      isDot: false,
      value: "",
      show: true,
      max: 999,
      type: "error",
      showZero: false,
      bgColor: null,
      color: null,
      shape: "circle",
      numberType: "overflow",
      offset: () => [],
      inverted: false,
      absolute: false
    }
  };
  const Button = {
    // button组件
    button: {
      hairline: false,
      type: "info",
      size: "normal",
      shape: "square",
      plain: false,
      disabled: false,
      loading: false,
      loadingText: "",
      loadingMode: "spinner",
      loadingSize: 15,
      openType: "",
      formType: "",
      appParameter: "",
      hoverStopPropagation: true,
      lang: "en",
      sessionFrom: "",
      sendMessageTitle: "",
      sendMessagePath: "",
      sendMessageImg: "",
      showMessageCard: false,
      dataName: "",
      throttleTime: 0,
      hoverStartTime: 0,
      hoverStayTime: 200,
      text: "",
      icon: "",
      iconColor: "",
      color: ""
    }
  };
  const Calendar = {
    // calendar 组件
    calendar: {
      title: "日期选择",
      showTitle: true,
      showSubtitle: true,
      mode: "single",
      startText: "开始",
      endText: "结束",
      customList: () => [],
      color: "#3c9cff",
      minDate: 0,
      maxDate: 0,
      defaultDate: null,
      maxCount: Number.MAX_SAFE_INTEGER,
      // Infinity
      rowHeight: 56,
      formatter: null,
      showLunar: false,
      showMark: true,
      confirmText: "确定",
      confirmDisabledText: "确定",
      show: false,
      closeOnClickOverlay: false,
      readonly: false,
      showConfirm: true,
      maxRange: Number.MAX_SAFE_INTEGER,
      // Infinity
      rangePrompt: "",
      showRangePrompt: true,
      allowSameDay: false,
      round: 0,
      monthNum: 3
    }
  };
  const CarKeyboard = {
    // 车牌号键盘
    carKeyboard: {
      random: false
    }
  };
  const Cell = {
    // cell组件的props
    cell: {
      customClass: "",
      title: "",
      label: "",
      value: "",
      icon: "",
      disabled: false,
      border: true,
      center: false,
      url: "",
      linkType: "navigateTo",
      clickable: false,
      isLink: false,
      required: false,
      arrowDirection: "",
      iconStyle: {},
      rightIconStyle: {},
      rightIcon: "arrow-right",
      titleStyle: {},
      size: "",
      stop: true,
      name: ""
    }
  };
  const CellGroup = {
    // cell-group组件的props
    cellGroup: {
      title: "",
      border: true,
      customStyle: {}
    }
  };
  const Checkbox = {
    // checkbox组件
    checkbox: {
      name: "",
      shape: "",
      size: "",
      checkbox: false,
      disabled: "",
      activeColor: "",
      inactiveColor: "",
      iconSize: "",
      iconColor: "",
      label: "",
      labelSize: "",
      labelColor: "",
      labelDisabled: ""
    }
  };
  const CheckboxGroup = {
    // checkbox-group组件
    checkboxGroup: {
      name: "",
      value: () => [],
      shape: "square",
      disabled: false,
      activeColor: "#2979ff",
      inactiveColor: "#c8c9cc",
      size: 18,
      placement: "row",
      labelSize: 14,
      labelColor: "#303133",
      labelDisabled: false,
      iconColor: "#ffffff",
      iconSize: 12,
      iconPlacement: "left",
      borderBottom: false
    }
  };
  const CircleProgress = {
    // circleProgress 组件
    circleProgress: {
      percentage: 30
    }
  };
  const Code = {
    // code 组件
    code: {
      seconds: 60,
      startText: "获取验证码",
      changeText: "X秒重新获取",
      endText: "重新获取",
      keepRunning: false,
      uniqueKey: ""
    }
  };
  const CodeInput = {
    // codeInput 组件
    codeInput: {
      adjustPosition: true,
      maxlength: 6,
      dot: false,
      mode: "box",
      hairline: false,
      space: 10,
      value: "",
      focus: false,
      bold: false,
      color: "#606266",
      fontSize: 18,
      size: 35,
      disabledKeyboard: false,
      borderColor: "#c9cacc",
      disabledDot: true
    }
  };
  const Col = {
    // col 组件
    col: {
      span: 12,
      offset: 0,
      justify: "start",
      align: "stretch",
      textAlign: "left"
    }
  };
  const Collapse = {
    // collapse 组件
    collapse: {
      value: null,
      accordion: false,
      border: true
    }
  };
  const CollapseItem = {
    // collapseItem 组件
    collapseItem: {
      title: "",
      value: "",
      label: "",
      disabled: false,
      isLink: true,
      clickable: true,
      border: true,
      align: "left",
      name: "",
      icon: "",
      duration: 300
    }
  };
  const ColumnNotice = {
    // columnNotice 组件
    columnNotice: {
      text: "",
      icon: "volume",
      mode: "",
      color: "#f9ae3d",
      bgColor: "#fdf6ec",
      fontSize: 14,
      speed: 80,
      step: false,
      duration: 1500,
      disableTouch: true
    }
  };
  const CountDown = {
    // u-count-down 计时器组件
    countDown: {
      time: 0,
      format: "HH:mm:ss",
      autoStart: true,
      millisecond: false
    }
  };
  const CountTo = {
    // countTo 组件
    countTo: {
      startVal: 0,
      endVal: 0,
      duration: 2e3,
      autoplay: true,
      decimals: 0,
      useEasing: true,
      decimal: ".",
      color: "#606266",
      fontSize: 22,
      bold: false,
      separator: ""
    }
  };
  const DatetimePicker = {
    // datetimePicker 组件
    datetimePicker: {
      show: false,
      showToolbar: true,
      value: "",
      title: "",
      mode: "datetime",
      maxDate: new Date(new Date().getFullYear() + 10, 0, 1).getTime(),
      minDate: new Date(new Date().getFullYear() - 10, 0, 1).getTime(),
      minHour: 0,
      maxHour: 23,
      minMinute: 0,
      maxMinute: 59,
      filter: null,
      formatter: null,
      loading: false,
      itemHeight: 44,
      cancelText: "取消",
      confirmText: "确认",
      cancelColor: "#909193",
      confirmColor: "#3c9cff",
      visibleItemCount: 5,
      closeOnClickOverlay: false,
      defaultIndex: () => []
    }
  };
  const Divider = {
    // divider组件
    divider: {
      dashed: false,
      hairline: true,
      dot: false,
      textPosition: "center",
      text: "",
      textSize: 14,
      textColor: "#909399",
      lineColor: "#dcdfe6"
    }
  };
  const Empty = {
    // empty组件
    empty: {
      icon: "",
      text: "",
      textColor: "#c0c4cc",
      textSize: 14,
      iconColor: "#c0c4cc",
      iconSize: 90,
      mode: "data",
      width: 160,
      height: 160,
      show: true,
      marginTop: 0
    }
  };
  const Form = {
    // form 组件
    form: {
      model: () => ({}),
      rules: () => ({}),
      errorType: "message",
      borderBottom: true,
      labelPosition: "left",
      labelWidth: 45,
      labelAlign: "left",
      labelStyle: () => ({})
    }
  };
  const GormItem = {
    // formItem 组件
    formItem: {
      label: "",
      prop: "",
      borderBottom: "",
      labelWidth: "",
      rightIcon: "",
      leftIcon: "",
      required: false,
      leftIconStyle: ""
    }
  };
  const Gap = {
    // gap组件
    gap: {
      bgColor: "transparent",
      height: 20,
      marginTop: 0,
      marginBottom: 0,
      customStyle: {}
    }
  };
  const Grid = {
    // grid组件
    grid: {
      col: 3,
      border: false,
      align: "left"
    }
  };
  const GridItem = {
    // grid-item组件
    gridItem: {
      name: null,
      bgColor: "transparent"
    }
  };
  const {
    color: color$3
  } = config;
  const Icon = {
    // icon组件
    icon: {
      name: "",
      color: color$3["u-content-color"],
      size: "16px",
      bold: false,
      index: "",
      hoverClass: "",
      customPrefix: "uicon",
      label: "",
      labelPos: "right",
      labelSize: "15px",
      labelColor: color$3["u-content-color"],
      space: "3px",
      imgMode: "",
      width: "",
      height: "",
      top: 0,
      stop: false
    }
  };
  const Image = {
    // image组件
    image: {
      src: "",
      mode: "aspectFill",
      width: "300",
      height: "225",
      shape: "square",
      radius: 0,
      lazyLoad: true,
      showMenuByLongpress: true,
      loadingIcon: "photo",
      errorIcon: "error-circle",
      showLoading: true,
      showError: true,
      fade: true,
      webp: false,
      duration: 500,
      bgColor: "#f3f4f6"
    }
  };
  const IndexAnchor = {
    // indexAnchor 组件
    indexAnchor: {
      text: "",
      color: "#606266",
      size: 14,
      bgColor: "#dedede",
      height: 32
    }
  };
  const IndexList = {
    // indexList 组件
    indexList: {
      inactiveColor: "#606266",
      activeColor: "#5677fc",
      indexList: () => [],
      sticky: true,
      customNavHeight: 0
    }
  };
  const Input = {
    // index 组件
    input: {
      value: "",
      type: "text",
      fixed: false,
      disabled: false,
      disabledColor: "#f5f7fa",
      clearable: false,
      password: false,
      maxlength: -1,
      placeholder: null,
      placeholderClass: "input-placeholder",
      placeholderStyle: "color: #c0c4cc",
      showWordLimit: false,
      confirmType: "done",
      confirmHold: false,
      holdKeyboard: false,
      focus: false,
      autoBlur: false,
      disableDefaultPadding: false,
      cursor: -1,
      cursorSpacing: 30,
      selectionStart: -1,
      selectionEnd: -1,
      adjustPosition: true,
      inputAlign: "left",
      fontSize: "15px",
      color: "#303133",
      prefixIcon: "",
      prefixIconStyle: "",
      suffixIcon: "",
      suffixIconStyle: "",
      border: "surround",
      readonly: false,
      shape: "square",
      formatter: null
    }
  };
  const Keyboard = {
    // 键盘组件
    keyboard: {
      mode: "number",
      dotDisabled: false,
      tooltip: true,
      showTips: true,
      tips: "",
      showCancel: true,
      showConfirm: true,
      random: false,
      safeAreaInsetBottom: true,
      closeOnClickOverlay: true,
      show: false,
      overlay: true,
      zIndex: 10075,
      cancelText: "取消",
      confirmText: "确定",
      autoChange: false
    }
  };
  const Line = {
    // line组件
    line: {
      color: "#d6d7d9",
      length: "100%",
      direction: "row",
      hairline: true,
      margin: 0,
      dashed: false
    }
  };
  const LineProgress = {
    // lineProgress 组件
    lineProgress: {
      activeColor: "#19be6b",
      inactiveColor: "#ececec",
      percentage: 0,
      showText: true,
      height: 12
    }
  };
  const {
    color: color$2
  } = config;
  const Link = {
    // link超链接组件props参数
    link: {
      color: color$2["u-primary"],
      fontSize: 15,
      underLine: false,
      href: "",
      mpTips: "链接已复制，请在浏览器打开",
      lineColor: "",
      text: ""
    }
  };
  const List = {
    // list 组件
    list: {
      showScrollbar: false,
      lowerThreshold: 50,
      upperThreshold: 0,
      scrollTop: 0,
      offsetAccuracy: 10,
      enableFlex: false,
      pagingEnabled: false,
      scrollable: true,
      scrollIntoView: "",
      scrollWithAnimation: false,
      enableBackToTop: false,
      height: 0,
      width: 0,
      preLoadScreen: 1
    }
  };
  const ListItem = {
    // listItem 组件
    listItem: {
      anchor: ""
    }
  };
  const {
    color: color$1
  } = config;
  const LoadingIcon = {
    // loading-icon加载中图标组件
    loadingIcon: {
      show: true,
      color: color$1["u-tips-color"],
      textColor: color$1["u-tips-color"],
      vertical: false,
      mode: "spinner",
      size: 24,
      textSize: 15,
      text: "",
      timingFunction: "ease-in-out",
      duration: 1200,
      inactiveColor: ""
    }
  };
  const LoadingPage = {
    // loading-page组件
    loadingPage: {
      loadingText: "正在加载",
      image: "",
      loadingMode: "circle",
      loading: false,
      bgColor: "#ffffff",
      color: "#C8C8C8",
      fontSize: 19,
      iconSize: 28,
      loadingColor: "#C8C8C8"
    }
  };
  const Loadmore = {
    // loadmore 组件
    loadmore: {
      status: "loadmore",
      bgColor: "transparent",
      icon: true,
      fontSize: 14,
      iconSize: 17,
      color: "#606266",
      loadingIcon: "spinner",
      loadmoreText: "加载更多",
      loadingText: "正在加载...",
      nomoreText: "没有更多了",
      isDot: false,
      iconColor: "#b7b7b7",
      marginTop: 10,
      marginBottom: 10,
      height: "auto",
      line: false,
      lineColor: "#E6E8EB",
      dashed: false
    }
  };
  const Modal = {
    // modal 组件
    modal: {
      show: false,
      title: "",
      content: "",
      confirmText: "确认",
      cancelText: "取消",
      showConfirmButton: true,
      showCancelButton: false,
      confirmColor: "#2979ff",
      cancelColor: "#606266",
      buttonReverse: false,
      zoom: true,
      asyncClose: false,
      closeOnClickOverlay: false,
      negativeTop: 0,
      width: "650rpx",
      confirmButtonShape: ""
    }
  };
  const color = {
    primary: "#3c9cff",
    info: "#909399",
    default: "#909399",
    warning: "#f9ae3d",
    error: "#f56c6c",
    success: "#5ac725",
    mainColor: "#303133",
    contentColor: "#606266",
    tipsColor: "#909399",
    lightColor: "#c0c4cc",
    borderColor: "#e4e7ed"
  };
  const Navbar = {
    // navbar 组件
    navbar: {
      safeAreaInsetTop: true,
      placeholder: false,
      fixed: true,
      border: false,
      leftIcon: "arrow-left",
      leftText: "",
      rightText: "",
      rightIcon: "",
      title: "",
      bgColor: "#ffffff",
      titleWidth: "400rpx",
      height: "44px",
      leftIconSize: 20,
      leftIconColor: color.mainColor,
      autoBack: false,
      titleStyle: ""
    }
  };
  const NoNetwork = {
    // noNetwork
    noNetwork: {
      tips: "哎呀，网络信号丢失",
      zIndex: "",
      image: "data:image/png;base64,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"
    }
  };
  const NoticeBar = {
    // noticeBar
    noticeBar: {
      text: () => [],
      direction: "row",
      step: false,
      icon: "volume",
      mode: "",
      color: "#f9ae3d",
      bgColor: "#fdf6ec",
      speed: 80,
      fontSize: 14,
      duration: 2e3,
      disableTouch: true,
      url: "",
      linkType: "navigateTo"
    }
  };
  const Notify = {
    // notify组件
    notify: {
      top: 0,
      type: "primary",
      color: "#ffffff",
      bgColor: "",
      message: "",
      duration: 3e3,
      fontSize: 15,
      safeAreaInsetTop: false
    }
  };
  const NumberBox = {
    // 步进器组件
    numberBox: {
      name: "",
      value: 0,
      min: 1,
      max: Number.MAX_SAFE_INTEGER,
      step: 1,
      integer: false,
      disabled: false,
      disabledInput: false,
      asyncChange: false,
      inputWidth: 35,
      showMinus: true,
      showPlus: true,
      decimalLength: null,
      longPress: true,
      color: "#323233",
      buttonSize: 30,
      bgColor: "#EBECEE",
      cursorSpacing: 100,
      disableMinus: false,
      disablePlus: false,
      iconStyle: ""
    }
  };
  const NumberKeyboard = {
    // 数字键盘
    numberKeyboard: {
      mode: "number",
      dotDisabled: false,
      random: false
    }
  };
  const Overlay = {
    // overlay组件
    overlay: {
      show: false,
      zIndex: 10070,
      duration: 300,
      opacity: 0.5
    }
  };
  const Parse = {
    // parse
    parse: {
      copyLink: true,
      errorImg: "",
      lazyLoad: false,
      loadingImg: "",
      pauseVideo: true,
      previewImg: true,
      setTitle: true,
      showImgMenu: true
    }
  };
  const Picker = {
    // picker
    picker: {
      show: false,
      showToolbar: true,
      title: "",
      columns: () => [],
      loading: false,
      itemHeight: 44,
      cancelText: "取消",
      confirmText: "确定",
      cancelColor: "#909193",
      confirmColor: "#3c9cff",
      visibleItemCount: 5,
      keyName: "text",
      closeOnClickOverlay: false,
      defaultIndex: () => [],
      immediateChange: false
    }
  };
  const Popup = {
    // popup组件
    popup: {
      show: false,
      overlay: true,
      mode: "bottom",
      duration: 300,
      closeable: false,
      overlayStyle: () => {
      },
      closeOnClickOverlay: true,
      zIndex: 10075,
      safeAreaInsetBottom: true,
      safeAreaInsetTop: false,
      closeIconPos: "top-right",
      round: 0,
      zoom: true,
      bgColor: "",
      overlayOpacity: 0.5
    }
  };
  const Radio = {
    // radio组件
    radio: {
      name: "",
      shape: "",
      disabled: "",
      labelDisabled: "",
      activeColor: "",
      inactiveColor: "",
      iconSize: "",
      labelSize: "",
      label: "",
      labelColor: "",
      size: "",
      iconColor: "",
      placement: ""
    }
  };
  const RadioGroup = {
    // radio-group组件
    radioGroup: {
      value: "",
      disabled: false,
      shape: "circle",
      activeColor: "#2979ff",
      inactiveColor: "#c8c9cc",
      name: "",
      size: 18,
      placement: "row",
      label: "",
      labelColor: "#303133",
      labelSize: 14,
      labelDisabled: false,
      iconColor: "#ffffff",
      iconSize: 12,
      borderBottom: false,
      iconPlacement: "left"
    }
  };
  const Rate = {
    // rate组件
    rate: {
      value: 1,
      count: 5,
      disabled: false,
      size: 18,
      inactiveColor: "#b2b2b2",
      activeColor: "#FA3534",
      gutter: 4,
      minCount: 1,
      allowHalf: false,
      activeIcon: "star-fill",
      inactiveIcon: "star",
      touchable: true
    }
  };
  const ReadMore = {
    // readMore
    readMore: {
      showHeight: 400,
      toggle: false,
      closeText: "展开阅读全文",
      openText: "收起",
      color: "#2979ff",
      fontSize: 14,
      textIndent: "2em",
      name: ""
    }
  };
  const Row = {
    // row
    row: {
      gutter: 0,
      justify: "start",
      align: "center"
    }
  };
  const RowNotice = {
    // rowNotice
    rowNotice: {
      text: "",
      icon: "volume",
      mode: "",
      color: "#f9ae3d",
      bgColor: "#fdf6ec",
      fontSize: 14,
      speed: 80
    }
  };
  const ScrollList = {
    // scrollList
    scrollList: {
      indicatorWidth: 50,
      indicatorBarWidth: 20,
      indicator: true,
      indicatorColor: "#f2f2f2",
      indicatorActiveColor: "#3c9cff",
      indicatorStyle: ""
    }
  };
  const Search = {
    // search
    search: {
      shape: "round",
      bgColor: "#f2f2f2",
      placeholder: "请输入关键字",
      clearabled: true,
      focus: false,
      showAction: true,
      actionStyle: () => ({}),
      actionText: "搜索",
      inputAlign: "left",
      inputStyle: () => ({}),
      disabled: false,
      borderColor: "transparent",
      searchIconColor: "#909399",
      searchIconSize: 22,
      color: "#606266",
      placeholderColor: "#909399",
      searchIcon: "search",
      margin: "0",
      animation: false,
      value: "",
      maxlength: "-1",
      height: 32,
      label: null
    }
  };
  const Section = {
    // u-section组件
    section: {
      title: "",
      subTitle: "更多",
      right: true,
      fontSize: 15,
      bold: true,
      color: "#303133",
      subColor: "#909399",
      showLine: true,
      lineColor: "",
      arrow: true
    }
  };
  const Skeleton = {
    // skeleton
    skeleton: {
      loading: true,
      animate: true,
      rows: 0,
      rowsWidth: "100%",
      rowsHeight: 18,
      title: true,
      titleWidth: "50%",
      titleHeight: 18,
      avatar: false,
      avatarSize: 32,
      avatarShape: "circle"
    }
  };
  const Slider = {
    // slider组件
    slider: {
      value: 0,
      blockSize: 18,
      min: 0,
      max: 100,
      step: 1,
      activeColor: "#2979ff",
      inactiveColor: "#c0c4cc",
      blockColor: "#ffffff",
      showValue: false,
      disabled: false,
      blockStyle: () => {
      }
    }
  };
  const StatusBar = {
    // statusBar
    statusBar: {
      bgColor: "transparent"
    }
  };
  const Steps = {
    // steps组件
    steps: {
      direction: "row",
      current: 0,
      activeColor: "#3c9cff",
      inactiveColor: "#969799",
      activeIcon: "",
      inactiveIcon: "",
      dot: false
    }
  };
  const StepsItem = {
    // steps-item组件
    stepsItem: {
      title: "",
      desc: "",
      iconSize: 17,
      error: false
    }
  };
  const Sticky = {
    // sticky组件
    sticky: {
      offsetTop: 0,
      customNavHeight: 0,
      disabled: false,
      bgColor: "transparent",
      zIndex: "",
      index: ""
    }
  };
  const Subsection = {
    // subsection组件
    subsection: {
      list: [],
      current: 0,
      activeColor: "#3c9cff",
      inactiveColor: "#303133",
      mode: "button",
      fontSize: 12,
      bold: true,
      bgColor: "#eeeeef",
      keyName: "name"
    }
  };
  const SwipeAction = {
    // swipe-action组件
    swipeAction: {
      autoClose: true
    }
  };
  const SwipeActionItem = {
    // swipeActionItem 组件
    swipeActionItem: {
      show: false,
      name: "",
      disabled: false,
      threshold: 20,
      autoClose: true,
      options: [],
      duration: 300
    }
  };
  const Swiper = {
    // swiper 组件
    swiper: {
      list: () => [],
      indicator: false,
      indicatorActiveColor: "#FFFFFF",
      indicatorInactiveColor: "rgba(255, 255, 255, 0.35)",
      indicatorStyle: "",
      indicatorMode: "line",
      autoplay: true,
      current: 0,
      currentItemId: "",
      interval: 3e3,
      duration: 300,
      circular: false,
      previousMargin: 0,
      nextMargin: 0,
      acceleration: false,
      displayMultipleItems: 1,
      easingFunction: "default",
      keyName: "url",
      imgMode: "aspectFill",
      height: 130,
      bgColor: "#f3f4f6",
      radius: 4,
      loading: false,
      showTitle: false
    }
  };
  const SwipterIndicator = {
    // swiperIndicator 组件
    swiperIndicator: {
      length: 0,
      current: 0,
      indicatorActiveColor: "",
      indicatorInactiveColor: "",
      indicatorMode: "line"
    }
  };
  const Switch = {
    // switch
    switch: {
      loading: false,
      disabled: false,
      size: 25,
      activeColor: "#2979ff",
      inactiveColor: "#ffffff",
      value: false,
      activeValue: true,
      inactiveValue: false,
      asyncChange: false,
      space: 0
    }
  };
  const Tabbar = {
    // tabbar
    tabbar: {
      value: null,
      safeAreaInsetBottom: true,
      border: true,
      zIndex: 1,
      activeColor: "#1989fa",
      inactiveColor: "#7d7e80",
      fixed: true,
      placeholder: true
    }
  };
  const TabbarItem = {
    //
    tabbarItem: {
      name: null,
      icon: "",
      badge: null,
      dot: false,
      text: "",
      badgeStyle: "top: 6px;right:2px;"
    }
  };
  const Tabs = {
    //
    tabs: {
      duration: 300,
      list: () => [],
      lineColor: "#3c9cff",
      activeStyle: () => ({
        color: "#303133"
      }),
      inactiveStyle: () => ({
        color: "#606266"
      }),
      lineWidth: 20,
      lineHeight: 3,
      lineBgSize: "cover",
      itemStyle: () => ({
        height: "44px"
      }),
      scrollable: true,
      current: 0,
      keyName: "name"
    }
  };
  const Tag = {
    // tag 组件
    tag: {
      type: "primary",
      disabled: false,
      size: "medium",
      shape: "square",
      text: "",
      bgColor: "",
      color: "",
      borderColor: "",
      closeColor: "#C6C7CB",
      name: "",
      plainFill: false,
      plain: false,
      closable: false,
      show: true,
      icon: ""
    }
  };
  const Text = {
    // text 组件
    text: {
      type: "",
      show: true,
      text: "",
      prefixIcon: "",
      suffixIcon: "",
      mode: "",
      href: "",
      format: "",
      call: false,
      openType: "",
      bold: false,
      block: false,
      lines: "",
      color: "#303133",
      size: 15,
      iconStyle: () => ({
        fontSize: "15px"
      }),
      decoration: "none",
      margin: 0,
      lineHeight: "",
      align: "left",
      wordWrap: "normal"
    }
  };
  const Textarea = {
    // textarea 组件
    textarea: {
      value: "",
      placeholder: "",
      placeholderClass: "textarea-placeholder",
      placeholderStyle: "color: #c0c4cc",
      height: 70,
      confirmType: "done",
      disabled: false,
      count: false,
      focus: false,
      autoHeight: false,
      fixed: false,
      cursorSpacing: 0,
      cursor: "",
      showConfirmBar: true,
      selectionStart: -1,
      selectionEnd: -1,
      adjustPosition: true,
      disableDefaultPadding: false,
      holdKeyboard: false,
      maxlength: 140,
      border: "surround",
      formatter: null
    }
  };
  const Toast = {
    // toast组件
    toast: {
      zIndex: 10090,
      loading: false,
      text: "",
      icon: "",
      type: "",
      loadingMode: "",
      show: "",
      overlay: false,
      position: "center",
      params: () => {
      },
      duration: 2e3,
      isTab: false,
      url: "",
      callback: null,
      back: false
    }
  };
  const Toolbar = {
    // toolbar 组件
    toolbar: {
      show: true,
      cancelText: "取消",
      confirmText: "确认",
      cancelColor: "#909193",
      confirmColor: "#3c9cff",
      title: ""
    }
  };
  const Tooltip = {
    // tooltip 组件
    tooltip: {
      text: "",
      copyText: "",
      size: 14,
      color: "#606266",
      bgColor: "transparent",
      direction: "top",
      zIndex: 10071,
      showCopy: true,
      buttons: () => [],
      overlay: true,
      showToast: true
    }
  };
  const Transition = {
    // transition动画组件的props
    transition: {
      show: false,
      mode: "fade",
      duration: "300",
      timingFunction: "ease-out"
    }
  };
  const Upload = {
    // upload组件
    upload: {
      accept: "image",
      capture: () => ["album", "camera"],
      compressed: true,
      camera: "back",
      maxDuration: 60,
      uploadIcon: "camera-fill",
      uploadIconColor: "#D3D4D6",
      useBeforeRead: false,
      previewFullImage: true,
      maxCount: 52,
      disabled: false,
      imageMode: "aspectFill",
      name: "",
      sizeType: () => ["original", "compressed"],
      multiple: false,
      deletable: true,
      maxSize: Number.MAX_VALUE,
      fileList: () => [],
      uploadText: "",
      width: 80,
      height: 80,
      previewImage: true
    }
  };
  const props$v = {
    ...ActionSheet,
    ...Album,
    ...Alert,
    ...Avatar,
    ...AvatarGroup,
    ...Backtop,
    ...Badge,
    ...Button,
    ...Calendar,
    ...CarKeyboard,
    ...Cell,
    ...CellGroup,
    ...Checkbox,
    ...CheckboxGroup,
    ...CircleProgress,
    ...Code,
    ...CodeInput,
    ...Col,
    ...Collapse,
    ...CollapseItem,
    ...ColumnNotice,
    ...CountDown,
    ...CountTo,
    ...DatetimePicker,
    ...Divider,
    ...Empty,
    ...Form,
    ...GormItem,
    ...Gap,
    ...Grid,
    ...GridItem,
    ...Icon,
    ...Image,
    ...IndexAnchor,
    ...IndexList,
    ...Input,
    ...Keyboard,
    ...Line,
    ...LineProgress,
    ...Link,
    ...List,
    ...ListItem,
    ...LoadingIcon,
    ...LoadingPage,
    ...Loadmore,
    ...Modal,
    ...Navbar,
    ...NoNetwork,
    ...NoticeBar,
    ...Notify,
    ...NumberBox,
    ...NumberKeyboard,
    ...Overlay,
    ...Parse,
    ...Picker,
    ...Popup,
    ...Radio,
    ...RadioGroup,
    ...Rate,
    ...ReadMore,
    ...Row,
    ...RowNotice,
    ...ScrollList,
    ...Search,
    ...Section,
    ...Skeleton,
    ...Slider,
    ...StatusBar,
    ...Steps,
    ...StepsItem,
    ...Sticky,
    ...Subsection,
    ...SwipeAction,
    ...SwipeActionItem,
    ...Swiper,
    ...SwipterIndicator,
    ...Switch,
    ...Tabbar,
    ...TabbarItem,
    ...Tabs,
    ...Tag,
    ...Text,
    ...Textarea,
    ...Toast,
    ...Toolbar,
    ...Tooltip,
    ...Transition,
    ...Upload
  };
  const props$u = {
    props: {
      // 图标类名
      name: {
        type: String,
        default: props$v.icon.name
      },
      // 图标颜色，可接受主题色
      color: {
        type: String,
        default: props$v.icon.color
      },
      // 字体大小，单位px
      size: {
        type: [String, Number],
        default: props$v.icon.size
      },
      // 是否显示粗体
      bold: {
        type: Boolean,
        default: props$v.icon.bold
      },
      // 点击图标的时候传递事件出去的index（用于区分点击了哪一个）
      index: {
        type: [String, Number],
        default: props$v.icon.index
      },
      // 触摸图标时的类名
      hoverClass: {
        type: String,
        default: props$v.icon.hoverClass
      },
      // 自定义扩展前缀，方便用户扩展自己的图标库
      customPrefix: {
        type: String,
        default: props$v.icon.customPrefix
      },
      // 图标右边或者下面的文字
      label: {
        type: [String, Number],
        default: props$v.icon.label
      },
      // label的位置，只能右边或者下边
      labelPos: {
        type: String,
        default: props$v.icon.labelPos
      },
      // label的大小
      labelSize: {
        type: [String, Number],
        default: props$v.icon.labelSize
      },
      // label的颜色
      labelColor: {
        type: String,
        default: props$v.icon.labelColor
      },
      // label与图标的距离
      space: {
        type: [String, Number],
        default: props$v.icon.space
      },
      // 图片的mode
      imgMode: {
        type: String,
        default: props$v.icon.imgMode
      },
      // 用于显示图片小图标时，图片的宽度
      width: {
        type: [String, Number],
        default: props$v.icon.width
      },
      // 用于显示图片小图标时，图片的高度
      height: {
        type: [String, Number],
        default: props$v.icon.height
      },
      // 用于解决某些情况下，让图标垂直居中的用途
      top: {
        type: [String, Number],
        default: props$v.icon.top
      },
      // 是否阻止事件传播
      stop: {
        type: Boolean,
        default: props$v.icon.stop
      }
    }
  };
  const mpMixin = {};
  const mixin = {
    // 定义每个组件都可能需要用到的外部样式以及类名
    props: {
      // 每个组件都有的父组件传递的样式，可以为字符串或者对象形式
      customStyle: {
        type: [Object, String],
        default: () => ({})
      },
      customClass: {
        type: String,
        default: ""
      },
      // 跳转的页面路径
      url: {
        type: String,
        default: ""
      },
      // 页面跳转的类型
      linkType: {
        type: String,
        default: "navigateTo"
      }
    },
    data() {
      return {};
    },
    onLoad() {
      this.$u.getRect = this.$uGetRect;
    },
    created() {
      this.$u.getRect = this.$uGetRect;
    },
    computed: {
      // 在2.x版本中，将会把$u挂载到uni对象下，导致在模板中无法使用uni.$u.xxx形式
      // 所以这里通过computed计算属性将其附加到this.$u上，就可以在模板或者js中使用uni.$u.xxx
      // 只在nvue环境通过此方式引入完整的$u，其他平台会出现性能问题，非nvue则按需引入（主要原因是props过大）
      $u() {
        return uni.$u.deepMerge(uni.$u, {
          props: void 0,
          http: void 0,
          mixin: void 0
        });
      },
      /**
       * 生成bem规则类名
       * 由于微信小程序，H5，nvue之间绑定class的差异，无法通过:class="[bem()]"的形式进行同用
       * 故采用如下折中做法，最后返回的是数组（一般平台）或字符串（支付宝和字节跳动平台），类似['a', 'b', 'c']或'a b c'的形式
       * @param {String} name 组件名称
       * @param {Array} fixed 一直会存在的类名
       * @param {Array} change 会根据变量值为true或者false而出现或者隐藏的类名
       * @returns {Array|string}
       */
      bem() {
        return function(name, fixed, change) {
          const prefix = `u-${name}--`;
          const classes = {};
          if (fixed) {
            fixed.map((item) => {
              classes[prefix + this[item]] = true;
            });
          }
          if (change) {
            change.map((item) => {
              this[item] ? classes[prefix + item] = this[item] : delete classes[prefix + item];
            });
          }
          return Object.keys(classes);
        };
      }
    },
    methods: {
      // 跳转某一个页面
      openPage(urlKey = "url") {
        const url2 = this[urlKey];
        if (url2) {
          this.$u.route({ type: this.linkType, url: url2 });
        }
      },
      // 查询节点信息
      // 目前此方法在支付宝小程序中无法获取组件跟接点的尺寸，为支付宝的bug(2020-07-21)
      // 解决办法为在组件根部再套一个没有任何作用的view元素
      $uGetRect(selector, all) {
        return new Promise((resolve) => {
          uni.createSelectorQuery().in(this)[all ? "selectAll" : "select"](selector).boundingClientRect((rect) => {
            if (all && Array.isArray(rect) && rect.length) {
              resolve(rect);
            }
            if (!all && rect) {
              resolve(rect);
            }
          }).exec();
        });
      },
      getParentData(parentName = "") {
        if (!this.parent)
          this.parent = {};
        this.parent = uni.$u.$parent.call(this, parentName);
        if (this.parent.children) {
          this.parent.children.indexOf(this) === -1 && this.parent.children.push(this);
        }
        if (this.parent && this.parentData) {
          Object.keys(this.parentData).map((key) => {
            this.parentData[key] = this.parent[key];
          });
        }
      },
      // 阻止事件冒泡
      preventEvent(e) {
        e && typeof e.stopPropagation === "function" && e.stopPropagation();
      },
      // 空操作
      noop(e) {
        this.preventEvent(e);
      }
    },
    onReachBottom() {
      uni.$emit("uOnReachBottom");
    },
    beforeDestroy() {
      if (this.parent && uni.$u.test.array(this.parent.children)) {
        const childrenList = this.parent.children;
        childrenList.map((child, index2) => {
          if (child === this) {
            childrenList.splice(index2, 1);
          }
        });
      }
    }
  };
  const _sfc_main$L = {
    name: "u-icon",
    data() {
      return {};
    },
    emits: ["click"],
    mixins: [mpMixin, mixin, props$u],
    computed: {
      uClasses() {
        let classes = [];
        classes.push(this.customPrefix + "-" + this.name);
        if (this.color && uni.$u.config.type.includes(this.color))
          classes.push("u-icon__icon--" + this.color);
        return classes;
      },
      iconStyle() {
        let style = {};
        style = {
          fontSize: uni.$u.addUnit(this.size),
          lineHeight: uni.$u.addUnit(this.size),
          fontWeight: this.bold ? "bold" : "normal",
          // 某些特殊情况需要设置一个到顶部的距离，才能更好的垂直居中
          top: uni.$u.addUnit(this.top)
        };
        if (this.color && !uni.$u.config.type.includes(this.color))
          style.color = this.color;
        return style;
      },
      // 判断传入的name属性，是否图片路径，只要带有"/"均认为是图片形式
      isImg() {
        return this.name.indexOf("/") !== -1;
      },
      imgStyle() {
        let style = {};
        style.width = this.width ? uni.$u.addUnit(this.width) : uni.$u.addUnit(this.size);
        style.height = this.height ? uni.$u.addUnit(this.height) : uni.$u.addUnit(this.size);
        return style;
      },
      // 通过图标名，查找对应的图标
      icon() {
        return icons["uicon-" + this.name] || this.name;
      }
    },
    methods: {
      clickHandler(e) {
        this.$emit("click", this.index);
        this.stop && this.preventEvent(e);
      }
    }
  };
  function _sfc_render$z(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["u-icon", ["u-icon--" + _ctx.labelPos]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options.clickHandler && $options.clickHandler(...args))
      },
      [
        $options.isImg ? (vue.openBlock(), vue.createElementBlock("image", {
          key: 0,
          class: "u-icon__img",
          src: _ctx.name,
          mode: _ctx.imgMode,
          style: vue.normalizeStyle([$options.imgStyle, _ctx.$u.addStyle(_ctx.customStyle)])
        }, null, 12, ["src", "mode"])) : (vue.openBlock(), vue.createElementBlock("text", {
          key: 1,
          class: vue.normalizeClass(["u-icon__icon", $options.uClasses]),
          style: vue.normalizeStyle([$options.iconStyle, _ctx.$u.addStyle(_ctx.customStyle)]),
          "hover-class": _ctx.hoverClass
        }, vue.toDisplayString($options.icon), 15, ["hover-class"])),
        vue.createCommentVNode(' 这里进行空字符串判断，如果仅仅是v-if="label"，可能会出现传递0的时候，结果也无法显示 '),
        _ctx.label !== "" ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 2,
            class: "u-icon__label",
            style: vue.normalizeStyle({
              color: _ctx.labelColor,
              fontSize: _ctx.$u.addUnit(_ctx.labelSize),
              marginLeft: _ctx.labelPos == "right" ? _ctx.$u.addUnit(_ctx.space) : 0,
              marginTop: _ctx.labelPos == "bottom" ? _ctx.$u.addUnit(_ctx.space) : 0,
              marginRight: _ctx.labelPos == "left" ? _ctx.$u.addUnit(_ctx.space) : 0,
              marginBottom: _ctx.labelPos == "top" ? _ctx.$u.addUnit(_ctx.space) : 0
            })
          },
          vue.toDisplayString(_ctx.label),
          5
          /* TEXT, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_1$9 = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["render", _sfc_render$z], ["__scopeId", "data-v-ac70166d"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-icon/u-icon.vue"]]);
  const props$t = {
    props: {
      // 是否显示组件
      show: {
        type: Boolean,
        default: props$v.loadingIcon.show
      },
      // 颜色
      color: {
        type: String,
        default: props$v.loadingIcon.color
      },
      // 提示文字颜色
      textColor: {
        type: String,
        default: props$v.loadingIcon.textColor
      },
      // 文字和图标是否垂直排列
      vertical: {
        type: Boolean,
        default: props$v.loadingIcon.vertical
      },
      // 模式选择，circle-圆形，spinner-花朵形，semicircle-半圆形
      mode: {
        type: String,
        default: props$v.loadingIcon.mode
      },
      // 图标大小，单位默认px
      size: {
        type: [String, Number],
        default: props$v.loadingIcon.size
      },
      // 文字大小
      textSize: {
        type: [String, Number],
        default: props$v.loadingIcon.textSize
      },
      // 文字内容
      text: {
        type: [String, Number],
        default: props$v.loadingIcon.text
      },
      // 动画模式
      timingFunction: {
        type: String,
        default: props$v.loadingIcon.timingFunction
      },
      // 动画执行周期时间
      duration: {
        type: [String, Number],
        default: props$v.loadingIcon.duration
      },
      // mode=circle时的暗边颜色
      inactiveColor: {
        type: String,
        default: props$v.loadingIcon.inactiveColor
      }
    }
  };
  const _sfc_main$K = {
    name: "u-loading-icon",
    mixins: [mpMixin, mixin, props$t],
    data() {
      return {
        // Array.form可以通过一个伪数组对象创建指定长度的数组
        // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from
        array12: Array.from({
          length: 12
        }),
        // 这里需要设置默认值为360，否则在安卓nvue上，会延迟一个duration周期后才执行
        // 在iOS nvue上，则会一开始默认执行两个周期的动画
        aniAngel: 360,
        // 动画旋转角度
        webviewHide: false,
        // 监听webview的状态，如果隐藏了页面，则停止动画，以免性能消耗
        loading: false
        // 是否运行中，针对nvue使用
      };
    },
    computed: {
      // 当为circle类型时，给其另外三边设置一个更轻一些的颜色
      // 之所以需要这么做的原因是，比如父组件传了color为红色，那么需要另外的三个边为浅红色
      // 而不能是固定的某一个其他颜色(因为这个固定的颜色可能浅蓝，导致效果没有那么细腻良好)
      otherBorderColor() {
        const lightColor = uni.$u.colorGradient(this.color, "#ffffff", 100)[80];
        if (this.mode === "circle") {
          return this.inactiveColor ? this.inactiveColor : lightColor;
        } else {
          return "transparent";
        }
      }
    },
    watch: {
      show(n) {
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        setTimeout(() => {
          this.show && this.addEventListenerToWebview();
        }, 20);
      },
      // 监听webview的显示与隐藏
      addEventListenerToWebview() {
        const pages2 = getCurrentPages();
        const page2 = pages2[pages2.length - 1];
        const currentWebview = page2.$getAppWebview();
        currentWebview.addEventListener("hide", () => {
          this.webviewHide = true;
        });
        currentWebview.addEventListener("show", () => {
          this.webviewHide = false;
        });
      }
    }
  };
  function _sfc_render$y(_ctx, _cache, $props, $setup, $data, $options) {
    return _ctx.show ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass(["u-loading-icon", [_ctx.vertical && "u-loading-icon--vertical"]]),
        style: vue.normalizeStyle([_ctx.$u.addStyle(_ctx.customStyle)])
      },
      [
        !$data.webviewHide ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass(["u-loading-icon__spinner", [`u-loading-icon__spinner--${_ctx.mode}`]]),
            ref: "ani",
            style: vue.normalizeStyle({
              color: _ctx.color,
              width: _ctx.$u.addUnit(_ctx.size),
              height: _ctx.$u.addUnit(_ctx.size),
              borderTopColor: _ctx.color,
              borderBottomColor: $options.otherBorderColor,
              borderLeftColor: $options.otherBorderColor,
              borderRightColor: $options.otherBorderColor,
              "animation-duration": `${_ctx.duration}ms`,
              "animation-timing-function": _ctx.mode === "semicircle" || _ctx.mode === "circle" ? _ctx.timingFunction : ""
            })
          },
          [
            _ctx.mode === "spinner" ? (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              { key: 0 },
              vue.renderList($data.array12, (item, index2) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index2,
                  class: "u-loading-icon__dot"
                });
              }),
              128
              /* KEYED_FRAGMENT */
            )) : vue.createCommentVNode("v-if", true)
          ],
          6
          /* CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true),
        _ctx.text ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 1,
            class: "u-loading-icon__text",
            style: vue.normalizeStyle({
              fontSize: _ctx.$u.addUnit(_ctx.textSize),
              color: _ctx.textColor
            })
          },
          vue.toDisplayString(_ctx.text),
          5
          /* TEXT, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_0$9 = /* @__PURE__ */ _export_sfc(_sfc_main$K, [["render", _sfc_render$y], ["__scopeId", "data-v-2af81691"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-loading-icon/u-loading-icon.vue"]]);
  const button = {
    props: {
      lang: String,
      sessionFrom: String,
      sendMessageTitle: String,
      sendMessagePath: String,
      sendMessageImg: String,
      showMessageCard: Boolean,
      appParameter: String,
      formType: String,
      openType: String
    }
  };
  const openType = {
    props: {
      openType: String
    },
    methods: {
      onGetUserInfo(event) {
        this.$emit("getuserinfo", event.detail);
      },
      onContact(event) {
        this.$emit("contact", event.detail);
      },
      onGetPhoneNumber(event) {
        this.$emit("getphonenumber", event.detail);
      },
      onError(event) {
        this.$emit("error", event.detail);
      },
      onLaunchApp(event) {
        this.$emit("launchapp", event.detail);
      },
      onOpenSetting(event) {
        this.$emit("opensetting", event.detail);
      }
    }
  };
  const props$s = {
    props: {
      // 是否细边框
      hairline: {
        type: Boolean,
        default: props$v.button.hairline
      },
      // 按钮的预置样式，info，primary，error，warning，success
      type: {
        type: String,
        default: props$v.button.type
      },
      // 按钮尺寸，large，normal，small，mini
      size: {
        type: String,
        default: props$v.button.size
      },
      // 按钮形状，circle（两边为半圆），square（带圆角）
      shape: {
        type: String,
        default: props$v.button.shape
      },
      // 按钮是否镂空
      plain: {
        type: Boolean,
        default: props$v.button.plain
      },
      // 是否禁止状态
      disabled: {
        type: Boolean,
        default: props$v.button.disabled
      },
      // 是否加载中
      loading: {
        type: Boolean,
        default: props$v.button.loading
      },
      // 加载中提示文字
      loadingText: {
        type: [String, Number],
        default: props$v.button.loadingText
      },
      // 加载状态图标类型
      loadingMode: {
        type: String,
        default: props$v.button.loadingMode
      },
      // 加载图标大小
      loadingSize: {
        type: [String, Number],
        default: props$v.button.loadingSize
      },
      // 开放能力，具体请看uniapp稳定关于button组件部分说明
      // https://uniapp.dcloud.io/component/button
      openType: {
        type: String,
        default: props$v.button.openType
      },
      // 用于 <form> 组件，点击分别会触发 <form> 组件的 submit/reset 事件
      // 取值为submit（提交表单），reset（重置表单）
      formType: {
        type: String,
        default: props$v.button.formType
      },
      // 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效
      // 只微信小程序、QQ小程序有效
      appParameter: {
        type: String,
        default: props$v.button.appParameter
      },
      // 指定是否阻止本节点的祖先节点出现点击态，微信小程序有效
      hoverStopPropagation: {
        type: Boolean,
        default: props$v.button.hoverStopPropagation
      },
      // 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。只微信小程序有效
      lang: {
        type: String,
        default: props$v.button.lang
      },
      // 会话来源，open-type="contact"时有效。只微信小程序有效
      sessionFrom: {
        type: String,
        default: props$v.button.sessionFrom
      },
      // 会话内消息卡片标题，open-type="contact"时有效
      // 默认当前标题，只微信小程序有效
      sendMessageTitle: {
        type: String,
        default: props$v.button.sendMessageTitle
      },
      // 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效
      // 默认当前分享路径，只微信小程序有效
      sendMessagePath: {
        type: String,
        default: props$v.button.sendMessagePath
      },
      // 会话内消息卡片图片，open-type="contact"时有效
      // 默认当前页面截图，只微信小程序有效
      sendMessageImg: {
        type: String,
        default: props$v.button.sendMessageImg
      },
      // 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，
      // 用户点击后可以快速发送小程序消息，open-type="contact"时有效
      showMessageCard: {
        type: Boolean,
        default: props$v.button.showMessageCard
      },
      // 额外传参参数，用于小程序的data-xxx属性，通过target.dataset.name获取
      dataName: {
        type: String,
        default: props$v.button.dataName
      },
      // 节流，一定时间内只能触发一次
      throttleTime: {
        type: [String, Number],
        default: props$v.button.throttleTime
      },
      // 按住后多久出现点击态，单位毫秒
      hoverStartTime: {
        type: [String, Number],
        default: props$v.button.hoverStartTime
      },
      // 手指松开后点击态保留时间，单位毫秒
      hoverStayTime: {
        type: [String, Number],
        default: props$v.button.hoverStayTime
      },
      // 按钮文字，之所以通过props传入，是因为slot传入的话
      // nvue中无法控制文字的样式
      text: {
        type: [String, Number],
        default: props$v.button.text
      },
      // 按钮图标
      icon: {
        type: String,
        default: props$v.button.icon
      },
      // 按钮图标
      iconColor: {
        type: String,
        default: props$v.button.icon
      },
      // 按钮颜色，支持传入linear-gradient渐变色
      color: {
        type: String,
        default: props$v.button.color
      }
    }
  };
  const _sfc_main$J = {
    name: "u-button",
    mixins: [mpMixin, mixin, props$s],
    data() {
      return {};
    },
    computed: {
      // 生成bem风格的类名
      bemClass() {
        if (!this.color) {
          return this.bem(
            "button",
            ["type", "shape", "size"],
            ["disabled", "plain", "hairline"]
          );
        } else {
          return this.bem(
            "button",
            ["shape", "size"],
            ["disabled", "plain", "hairline"]
          );
        }
      },
      loadingColor() {
        if (this.plain) {
          return this.color ? this.color : uni.$u.config.color[`u-${this.type}`];
        }
        if (this.type === "info") {
          return "#c9c9c9";
        }
        return "rgb(200, 200, 200)";
      },
      iconColorCom() {
        if (this.iconColor)
          return this.iconColor;
        if (this.plain) {
          return this.color ? this.color : this.type;
        } else {
          return this.type === "info" ? "#000000" : "#ffffff";
        }
      },
      baseColor() {
        let style = {};
        if (this.color) {
          style.color = this.plain ? this.color : "white";
          if (!this.plain) {
            style["background-color"] = this.color;
          }
          if (this.color.indexOf("gradient") !== -1) {
            style.borderTopWidth = 0;
            style.borderRightWidth = 0;
            style.borderBottomWidth = 0;
            style.borderLeftWidth = 0;
            if (!this.plain) {
              style.backgroundImage = this.color;
            }
          } else {
            style.borderColor = this.color;
            style.borderWidth = "1px";
            style.borderStyle = "solid";
          }
        }
        return style;
      },
      // nvue版本按钮的字体不会继承父组件的颜色，需要对每一个text组件进行单独的设置
      nvueTextStyle() {
        let style = {};
        if (this.type === "info") {
          style.color = "#323233";
        }
        if (this.color) {
          style.color = this.plain ? this.color : "white";
        }
        style.fontSize = this.textSize + "px";
        return style;
      },
      // 字体大小
      textSize() {
        let fontSize = 14, { size } = this;
        if (size === "large")
          fontSize = 16;
        if (size === "normal")
          fontSize = 14;
        if (size === "small")
          fontSize = 12;
        if (size === "mini")
          fontSize = 10;
        return fontSize;
      }
    },
    emits: [
      "click",
      "getphonenumber",
      "getuserinfo",
      "error",
      "opensetting",
      "launchapp"
    ],
    methods: {
      clickHandler() {
        if (!this.disabled && !this.loading) {
          uni.$u.throttle(() => {
            this.$emit("click");
          }, this.throttleTime);
        }
      },
      // 下面为对接uniapp官方按钮开放能力事件回调的对接
      getphonenumber(res) {
        this.$emit("getphonenumber", res);
      },
      getuserinfo(res) {
        this.$emit("getuserinfo", res);
      },
      error(res) {
        this.$emit("error", res);
      },
      opensetting(res) {
        this.$emit("opensetting", res);
      },
      launchapp(res) {
        this.$emit("launchapp", res);
      }
    }
  };
  function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_loading_icon = resolveEasycom(vue.resolveDynamicComponent("u-loading-icon"), __easycom_0$9);
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_1$9);
    return vue.openBlock(), vue.createElementBlock("button", {
      "hover-start-time": Number(_ctx.hoverStartTime),
      "hover-stay-time": Number(_ctx.hoverStayTime),
      "form-type": _ctx.formType,
      "open-type": _ctx.openType,
      "app-parameter": _ctx.appParameter,
      "hover-stop-propagation": _ctx.hoverStopPropagation,
      "send-message-title": _ctx.sendMessageTitle,
      "send-message-path": _ctx.sendMessagePath,
      lang: _ctx.lang,
      "data-name": _ctx.dataName,
      "session-from": _ctx.sessionFrom,
      "send-message-img": _ctx.sendMessageImg,
      "show-message-card": _ctx.showMessageCard,
      onGetphonenumber: _cache[0] || (_cache[0] = (...args) => $options.getphonenumber && $options.getphonenumber(...args)),
      onGetuserinfo: _cache[1] || (_cache[1] = (...args) => $options.getuserinfo && $options.getuserinfo(...args)),
      onError: _cache[2] || (_cache[2] = (...args) => $options.error && $options.error(...args)),
      onOpensetting: _cache[3] || (_cache[3] = (...args) => $options.opensetting && $options.opensetting(...args)),
      onLaunchapp: _cache[4] || (_cache[4] = (...args) => $options.launchapp && $options.launchapp(...args)),
      "hover-class": !_ctx.disabled && !_ctx.loading ? "u-button--active" : "",
      class: vue.normalizeClass(["u-button u-reset-button", $options.bemClass]),
      style: vue.normalizeStyle([$options.baseColor, _ctx.$u.addStyle(_ctx.customStyle)]),
      onClick: _cache[5] || (_cache[5] = (...args) => $options.clickHandler && $options.clickHandler(...args))
    }, [
      _ctx.loading ? (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 0 },
        [
          vue.createVNode(_component_u_loading_icon, {
            mode: _ctx.loadingMode,
            size: _ctx.loadingSize * 1.15,
            color: $options.loadingColor
          }, null, 8, ["mode", "size", "color"]),
          vue.createElementVNode(
            "text",
            {
              class: "u-button__loading-text",
              style: vue.normalizeStyle([{ fontSize: $options.textSize + "px" }])
            },
            vue.toDisplayString(_ctx.loadingText || _ctx.text),
            5
            /* TEXT, STYLE */
          )
        ],
        64
        /* STABLE_FRAGMENT */
      )) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        [
          _ctx.icon ? (vue.openBlock(), vue.createBlock(_component_u_icon, {
            key: 0,
            name: _ctx.icon,
            color: $options.iconColorCom,
            size: $options.textSize * 1.35,
            customStyle: { marginRight: "2px" }
          }, null, 8, ["name", "color", "size"])) : vue.createCommentVNode("v-if", true),
          vue.renderSlot(_ctx.$slots, "default", {}, () => [
            vue.createElementVNode(
              "text",
              {
                class: "u-button__text",
                style: vue.normalizeStyle([{ fontSize: $options.textSize + "px" }])
              },
              vue.toDisplayString(_ctx.text),
              5
              /* TEXT, STYLE */
            )
          ], true)
        ],
        64
        /* STABLE_FRAGMENT */
      ))
    ], 46, ["hover-start-time", "hover-stay-time", "form-type", "open-type", "app-parameter", "hover-stop-propagation", "send-message-title", "send-message-path", "lang", "data-name", "session-from", "send-message-img", "show-message-card", "hover-class"]);
  }
  const __easycom_0$8 = /* @__PURE__ */ _export_sfc(_sfc_main$J, [["render", _sfc_render$x], ["__scopeId", "data-v-5ce41ee6"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-button/u-button.vue"]]);
  const props$r = {
    props: {
      // 是否展示组件
      show: {
        type: Boolean,
        default: props$v.transition.show
      },
      // 使用的动画模式
      mode: {
        type: String,
        default: props$v.transition.mode
      },
      // 动画的执行时间，单位ms
      duration: {
        type: [String, Number],
        default: props$v.transition.duration
      },
      // 使用的动画过渡函数
      timingFunction: {
        type: String,
        default: props$v.transition.timingFunction
      }
    }
  };
  const getClassNames = (name) => ({
    enter: `u-${name}-enter u-${name}-enter-active`,
    "enter-to": `u-${name}-enter-to u-${name}-enter-active`,
    leave: `u-${name}-leave u-${name}-leave-active`,
    "leave-to": `u-${name}-leave-to u-${name}-leave-active`
  });
  const transition = {
    methods: {
      // 组件被点击发出事件
      clickHandler() {
        this.$emit("click");
      },
      // vue版本的组件进场处理
      vueEnter() {
        const classNames = getClassNames(this.mode);
        this.status = "enter";
        this.$emit("beforeEnter");
        this.inited = true;
        this.display = true;
        this.classes = classNames.enter;
        this.$nextTick(async () => {
          this.$emit("enter");
          this.transitionEnded = false;
          this.$emit("afterEnter");
          this.classes = classNames["enter-to"];
        });
      },
      // 动画离场处理
      vueLeave() {
        if (!this.display)
          return;
        const classNames = getClassNames(this.mode);
        this.status = "leave";
        this.$emit("beforeLeave");
        this.classes = classNames.leave;
        this.$nextTick(() => {
          this.transitionEnded = false;
          this.$emit("leave");
          setTimeout(this.onTransitionEnd, this.duration);
          this.classes = classNames["leave-to"];
        });
      },
      // 完成过渡后触发
      onTransitionEnd() {
        if (this.transitionEnded)
          return;
        this.transitionEnded = true;
        this.$emit(this.status === "leave" ? "afterLeave" : "afterEnter");
        if (!this.show && this.display) {
          this.display = false;
          this.inited = false;
        }
      }
    }
  };
  const _sfc_main$I = {
    name: "u-transition",
    data() {
      return {
        inited: false,
        // 是否显示/隐藏组件
        viewStyle: {},
        // 组件内部的样式
        status: "",
        // 记录组件动画的状态
        transitionEnded: false,
        // 组件是否结束的标记
        display: false,
        // 组件是否展示
        classes: ""
        // 应用的类名
      };
    },
    computed: {
      mergeStyle() {
        const { viewStyle, customStyle } = this;
        return {
          transitionDuration: `${this.duration}ms`,
          // display: `${this.display ? '' : 'none'}`,
          transitionTimingFunction: this.timingFunction,
          // 避免自定义样式影响到动画属性，所以写在viewStyle前面
          ...uni.$u.addStyle(customStyle),
          ...viewStyle
        };
      }
    },
    // 将mixin挂在到组件中，uni.$u.mixin实际上为一个vue格式对象
    mixins: [mpMixin, mixin, transition, props$r],
    watch: {
      show: {
        handler(newVal) {
          newVal ? this.vueEnter() : this.vueLeave();
        },
        // 表示同时监听初始化时的props的show的意思
        immediate: true
      }
    }
  };
  function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.inited ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass(["u-transition", $data.classes]),
        ref: "u-transition",
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.clickHandler && _ctx.clickHandler(...args)),
        style: vue.normalizeStyle([$options.mergeStyle]),
        onTouchmove: _cache[1] || (_cache[1] = (...args) => _ctx.noop && _ctx.noop(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      38
      /* CLASS, STYLE, HYDRATE_EVENTS */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_1$8 = /* @__PURE__ */ _export_sfc(_sfc_main$I, [["render", _sfc_render$w], ["__scopeId", "data-v-5cec8177"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-transition/u-transition.vue"]]);
  const props$q = {
    props: {
      // 是否显示遮罩
      show: {
        type: Boolean,
        default: props$v.overlay.show
      },
      // 层级z-index
      zIndex: {
        type: [String, Number],
        default: props$v.overlay.zIndex
      },
      // 遮罩的过渡时间，单位为ms
      duration: {
        type: [String, Number],
        default: props$v.overlay.duration
      },
      // 不透明度值，当做rgba的第四个参数
      opacity: {
        type: [String, Number],
        default: props$v.overlay.opacity
      }
    }
  };
  const _sfc_main$H = {
    name: "u-overlay",
    mixins: [mpMixin, mixin, props$q],
    computed: {
      overlayStyle() {
        const style = {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: this.zIndex,
          bottom: 0,
          "background-color": `rgba(0, 0, 0, ${this.opacity})`
        };
        return uni.$u.deepMerge(style, uni.$u.addStyle(this.customStyle));
      }
    },
    methods: {
      clickHandler() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_transition = resolveEasycom(vue.resolveDynamicComponent("u-transition"), __easycom_1$8);
    return vue.openBlock(), vue.createBlock(_component_u_transition, {
      show: _ctx.show,
      "custom-class": "u-overlay",
      duration: _ctx.duration,
      "custom-style": $options.overlayStyle,
      onClick: $options.clickHandler
    }, {
      default: vue.withCtx(() => [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ]),
      _: 3
      /* FORWARDED */
    }, 8, ["show", "duration", "custom-style", "onClick"]);
  }
  const __easycom_0$7 = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["render", _sfc_render$v], ["__scopeId", "data-v-9112bed9"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-overlay/u-overlay.vue"]]);
  const props$p = {
    props: {
      bgColor: {
        type: String,
        default: props$v.statusBar.bgColor
      }
    }
  };
  const _sfc_main$G = {
    name: "u-status-bar",
    mixins: [mpMixin, mixin, props$p],
    data() {
      return {};
    },
    computed: {
      style() {
        const style = {};
        style.height = uni.$u.addUnit(uni.$u.sys().statusBarHeight, "px");
        style.backgroundColor = this.bgColor;
        return uni.$u.deepMerge(style, uni.$u.addStyle(this.customStyle));
      }
    }
  };
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        style: vue.normalizeStyle([$options.style]),
        class: "u-status-bar"
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      4
      /* STYLE */
    );
  }
  const __easycom_0$6 = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["render", _sfc_render$u], ["__scopeId", "data-v-eb8e0cdd"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-status-bar/u-status-bar.vue"]]);
  const props$o = {
    props: {}
  };
  const _sfc_main$F = {
    name: "u-safe-bottom",
    mixins: [mpMixin, mixin, props$o],
    data() {
      return {
        safeAreaBottomHeight: 0,
        isNvue: false
      };
    },
    computed: {
      style() {
        const style = {};
        return uni.$u.deepMerge(style, uni.$u.addStyle(this.customStyle));
      }
    },
    mounted() {
    }
  };
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["u-safe-bottom", [!$data.isNvue && "u-safe-area-inset-bottom"]]),
        style: vue.normalizeStyle([$options.style])
      },
      null,
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_3$4 = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["render", _sfc_render$t], ["__scopeId", "data-v-f3d22cfe"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-safe-bottom/u-safe-bottom.vue"]]);
  const props$n = {
    props: {
      // 是否展示弹窗
      show: {
        type: Boolean,
        default: props$v.popup.show
      },
      // 是否显示遮罩
      overlay: {
        type: Boolean,
        default: props$v.popup.overlay
      },
      // 弹出的方向，可选值为 top bottom right left center
      mode: {
        type: String,
        default: props$v.popup.mode
      },
      // 动画时长，单位ms
      duration: {
        type: [String, Number],
        default: props$v.popup.duration
      },
      // 是否显示关闭图标
      closeable: {
        type: Boolean,
        default: props$v.popup.closeable
      },
      // 自定义遮罩的样式
      overlayStyle: {
        type: [Object, String],
        default: props$v.popup.overlayStyle
      },
      // 点击遮罩是否关闭弹窗
      closeOnClickOverlay: {
        type: Boolean,
        default: props$v.popup.closeOnClickOverlay
      },
      // 层级
      zIndex: {
        type: [String, Number],
        default: props$v.popup.zIndex
      },
      // 是否为iPhoneX留出底部安全距离
      safeAreaInsetBottom: {
        type: Boolean,
        default: props$v.popup.safeAreaInsetBottom
      },
      // 是否留出顶部安全距离（状态栏高度）
      safeAreaInsetTop: {
        type: Boolean,
        default: props$v.popup.safeAreaInsetTop
      },
      // 自定义关闭图标位置，top-left为左上角，top-right为右上角，bottom-left为左下角，bottom-right为右下角
      closeIconPos: {
        type: String,
        default: props$v.popup.closeIconPos
      },
      // 是否显示圆角
      round: {
        type: [Boolean, String, Number],
        default: props$v.popup.round
      },
      // mode=center，也即中部弹出时，是否使用缩放模式
      zoom: {
        type: Boolean,
        default: props$v.popup.zoom
      },
      // 弹窗背景色，设置为transparent可去除白色背景
      bgColor: {
        type: String,
        default: props$v.popup.bgColor
      },
      // 遮罩的透明度，0-1之间
      overlayOpacity: {
        type: [Number, String],
        default: props$v.popup.overlayOpacity
      }
    }
  };
  const _sfc_main$E = {
    name: "u-popup",
    mixins: [mpMixin, mixin, props$n],
    data() {
      return {
        overlayDuration: this.duration + 50
      };
    },
    watch: {
      show(newValue, oldValue) {
      }
    },
    computed: {
      transitionStyle() {
        const style = {
          zIndex: this.zIndex,
          position: "fixed",
          display: "flex"
        };
        style[this.mode] = 0;
        if (this.mode === "left") {
          return uni.$u.deepMerge(style, {
            bottom: 0,
            top: 0
          });
        } else if (this.mode === "right") {
          return uni.$u.deepMerge(style, {
            bottom: 0,
            top: 0
          });
        } else if (this.mode === "top") {
          return uni.$u.deepMerge(style, {
            left: 0,
            right: 0
          });
        } else if (this.mode === "bottom") {
          return uni.$u.deepMerge(style, {
            left: 0,
            right: 0
          });
        } else if (this.mode === "center") {
          return uni.$u.deepMerge(style, {
            alignItems: "center",
            "justify-content": "center",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          });
        }
      },
      contentStyle() {
        const style = {};
        uni.$u.sys();
        if (this.mode !== "center") {
          style.flex = 1;
        }
        if (this.bgColor) {
          style.backgroundColor = this.bgColor;
        }
        if (this.round) {
          const value2 = uni.$u.addUnit(this.round);
          if (this.mode === "top") {
            style.borderBottomLeftRadius = value2;
            style.borderBottomRightRadius = value2;
          } else if (this.mode === "bottom") {
            style.borderTopLeftRadius = value2;
            style.borderTopRightRadius = value2;
          } else if (this.mode === "center") {
            style.borderRadius = value2;
          }
        }
        return uni.$u.deepMerge(style, uni.$u.addStyle(this.customStyle));
      },
      position() {
        if (this.mode === "center") {
          return this.zoom ? "fade-zoom" : "fade";
        }
        if (this.mode === "left") {
          return "slide-left";
        }
        if (this.mode === "right") {
          return "slide-right";
        }
        if (this.mode === "bottom") {
          return "slide-up";
        }
        if (this.mode === "top") {
          return "slide-down";
        }
      }
    },
    methods: {
      // 点击遮罩
      overlayClick() {
        if (this.closeOnClickOverlay) {
          this.$emit("close");
        }
      },
      close(e) {
        this.$emit("close");
      },
      afterEnter() {
        this.$emit("open");
      },
      clickHandler() {
        if (this.mode === "center") {
          this.overlayClick();
        }
        this.$emit("click");
      }
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_overlay = resolveEasycom(vue.resolveDynamicComponent("u-overlay"), __easycom_0$7);
    const _component_u_status_bar = resolveEasycom(vue.resolveDynamicComponent("u-status-bar"), __easycom_0$6);
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_1$9);
    const _component_u_safe_bottom = resolveEasycom(vue.resolveDynamicComponent("u-safe-bottom"), __easycom_3$4);
    const _component_u_transition = resolveEasycom(vue.resolveDynamicComponent("u-transition"), __easycom_1$8);
    return vue.openBlock(), vue.createElementBlock("view", { class: "u-popup" }, [
      _ctx.overlay ? (vue.openBlock(), vue.createBlock(_component_u_overlay, {
        key: 0,
        show: _ctx.show,
        onClick: $options.overlayClick,
        duration: $data.overlayDuration,
        customStyle: _ctx.overlayStyle,
        opacity: _ctx.overlayOpacity
      }, null, 8, ["show", "onClick", "duration", "customStyle", "opacity"])) : vue.createCommentVNode("v-if", true),
      vue.createVNode(_component_u_transition, {
        show: _ctx.show,
        customStyle: $options.transitionStyle,
        mode: $options.position,
        duration: _ctx.duration,
        onAfterEnter: $options.afterEnter,
        onClick: $options.clickHandler
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode(
            "view",
            {
              class: "u-popup__content",
              style: vue.normalizeStyle([$options.contentStyle]),
              onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => _ctx.noop && _ctx.noop(...args), ["stop"]))
            },
            [
              _ctx.safeAreaInsetTop ? (vue.openBlock(), vue.createBlock(_component_u_status_bar, { key: 0 })) : vue.createCommentVNode("v-if", true),
              vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
              _ctx.closeable ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 1,
                  onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.close && $options.close(...args), ["stop"])),
                  class: vue.normalizeClass(["u-popup__content__close", ["u-popup__content__close--" + _ctx.closeIconPos]]),
                  "hover-class": "u-popup__content__close--hover",
                  "hover-stay-time": "150"
                },
                [
                  vue.createVNode(_component_u_icon, {
                    name: "close",
                    color: "#909399",
                    size: "18",
                    bold: ""
                  })
                ],
                2
                /* CLASS */
              )) : vue.createCommentVNode("v-if", true),
              _ctx.safeAreaInsetBottom ? (vue.openBlock(), vue.createBlock(_component_u_safe_bottom, { key: 2 })) : vue.createCommentVNode("v-if", true)
            ],
            4
            /* STYLE */
          )
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["show", "customStyle", "mode", "duration", "onAfterEnter", "onClick"])
    ]);
  }
  const __easycom_8$1 = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["render", _sfc_render$s], ["__scopeId", "data-v-05c24e9b"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-popup/u-popup.vue"]]);
  const GenderFemale = "/static/home/GenderFemale.svg";
  const GenderMale = "/static/home/GenderMale.svg";
  const LV1 = "/static/index/LV_1.svg";
  const LV2 = "/static/index/LV_2.svg";
  const LV3 = "/static/index/LV_3.svg";
  const LV4 = "/static/index/LV_4.svg";
  const LV5 = "/static/index/LV_5.svg";
  const LV6 = "/static/index/LV_6.svg";
  const LV7 = "/static/index/LV_7.svg";
  const LV8 = "/static/index/LV_8.svg";
  const LV9 = "/static/index/LV_9.svg";
  const LV10 = "/static/index/LV_10.svg";
  const _sfc_main$D = {
    __name: "home",
    setup(__props) {
      let lvs = vue.ref([
        LV1,
        LV2,
        LV3,
        LV4,
        LV5,
        LV6,
        LV7,
        LV8,
        LV9,
        LV10
      ]);
      let bg_ref = vue.ref(null);
      vue.onMounted(() => {
        userInfo.value = uni.getStorageSync("userInfo");
        getClloectNumber();
      });
      vue.ref(null);
      onShow(() => {
        getClloectNumber();
        userInfo.value = uni.getStorageSync("userInfo");
        setFullscreen(false);
      });
      let handelGetUserInfo = () => {
        getUserInfo(userInfo.value.user_id).then((res) => {
          userInfo.value = res.data;
          userInfo.value.user_image += "?" + new Date().getTime();
          uni.setStorageSync("userInfo", res.data);
          uni.stopPullDownRefresh();
        });
      };
      let feedback = () => {
        plus.nativeUI.prompt("简单表述刚才遇到的问题", (res) => {
          if (res.index === 0) {
            formatAppLog("log", "at pages/home/home.vue:180", "，", res.value);
            handleFeedback({
              content: res.value,
              userId: uni.getStorageSync("userInfo").user_id
            }).then((res2) => {
              msgSuccess(res2.msg);
            });
          }
        }, "提示!", "请在此输入问题", ["提交", "取消"]);
      };
      onPullDownRefresh(() => {
        handelGetUserInfo();
        getClloectNumber();
      });
      let bg_height = vue.ref(12);
      let key = "";
      let user_img_height = vue.ref(5);
      let user_img_width = vue.ref(5);
      let touchmove = (ev) => {
        clearTimeout(key);
        key = setTimeout(() => {
          bg_height.value = 20;
        }, 10);
      };
      let touchend = () => {
        bg_height.value = 12;
      };
      let button_show = vue.ref(false);
      let button_showValue = vue.ref("更换头像");
      let fieldName = "";
      let close = () => {
        button_show.value = false;
      };
      let checkImg = (title, field) => {
        fieldName = field;
        button_showValue.value = title;
        button_show.value = true;
      };
      let chooseImage = () => {
        try {
          uni.chooseImage({
            count: 1,
            //默认9
            sizeType: ["original", "compressed"],
            //可以指定是原图还是压缩图，默认二者都有
            sourceType: ["album"],
            //从相册选择
            success: (res, tempFiles) => {
              uni.showLoading({
                title: "正在上传中.."
              });
              uploadTx(res.tempFilePaths[0], userInfo.value.user_id, fieldName).then((res2) => {
                plus.nativeUI.toast(res2.msg, {
                  align: "center",
                  icon: "/static/toast/success.png",
                  style: "inline",
                  iconWidth: "20px",
                  iconHeight: "20px"
                });
                let time = new Date().getTime();
                if (fieldName == "user_bg") {
                  userInfo.value.user_bg = res2.img_url + "?time=" + time;
                } else {
                  userInfo.value.user_image = res2.img_url + "?time=" + time;
                }
                handelGetUserInfo();
              }).catch((err) => {
                if (err.msg) {
                  msgError(err.msg);
                }
              });
              uni.hideLoading();
              button_show.value = false;
            }
          });
        } catch (e) {
        }
      };
      let saveImg = () => {
        plus.gallery.save(userInfo.value.user_image, () => {
          plus.nativeUI.toast("已经在相册里躺好啦");
          button_show.value = false;
        }, (err) => {
          plus.nativeUI.toast("保存好像失败了", err);
        });
      };
      let userInfo = vue.ref({});
      let logOut = () => {
        uni.setStorageSync("isAuthLogin", false);
        uni.redirectTo({
          url: "../login/login"
        });
      };
      let navTo = (pageUrl) => {
        uni.navigateTo({
          url: pageUrl,
          animationType: "pop-in"
        });
      };
      let collectNumber = vue.ref(0);
      let historyNumber = vue.ref(0);
      let getClloectNumber = () => {
        let TempList = uni.getStorageSync("user_history_fiml");
        if (TempList !== null && TempList !== void 0) {
          historyNumber.value = TempList.length;
        }
        userFindCollect("number").then((res) => {
          collectNumber.value = res.data.total;
        });
      };
      let toDownload = () => {
        msgError("功能暂时不可用,敬请期待!");
      };
      return (_ctx, _cache) => {
        const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_1$9);
        const _component_u_button = resolveEasycom(vue.resolveDynamicComponent("u-button"), __easycom_0$8);
        const _component_u_popup = resolveEasycom(vue.resolveDynamicComponent("u-popup"), __easycom_8$1);
        return vue.openBlock(), vue.createElementBlock(
          "view",
          {
            onTouchend: _cache[13] || (_cache[13] = (...args) => vue.unref(touchend) && vue.unref(touchend)(...args)),
            class: "home-box"
          },
          [
            vue.createElementVNode(
              "div",
              {
                ref_key: "bg_ref",
                ref: bg_ref,
                onClick: _cache[2] || (_cache[2] = (...args) => vue.unref(touchmove) && vue.unref(touchmove)(...args)),
                onLongpress: _cache[3] || (_cache[3] = ($event) => vue.unref(checkImg)("更换背景", "user_bg")),
                style: vue.normalizeStyle({ backgroundImage: `url(${vue.unref(userInfo).user_bg})`, height: `${vue.unref(bg_height)}rem` }),
                class: "user-bg-box"
              },
              [
                vue.createCommentVNode(" 导航栏nav "),
                vue.createElementVNode("div", { class: "nav-box" }, [
                  vue.createElementVNode("div", {
                    class: "nav-item",
                    onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => vue.isRef(button_show) ? button_show.value = false : button_show = false, ["stop"]))
                  }),
                  vue.createElementVNode("div", {
                    class: "nav-item",
                    onClick: _cache[1] || (_cache[1] = vue.withModifiers(($event) => vue.isRef(button_show) ? button_show.value = false : button_show = false, ["stop"])),
                    style: { "padding": "0.5rem" }
                  }, [
                    vue.createVNode(_component_u_icon, {
                      color: "#f9f9f9",
                      size: "30",
                      name: "setting"
                    })
                  ])
                ])
              ],
              36
              /* STYLE, HYDRATE_EVENTS */
            ),
            vue.createCommentVNode(" 头像 "),
            vue.createElementVNode("div", { class: "user-tx-box" }, [
              vue.createElementVNode("image", {
                style: vue.normalizeStyle({ height: `${vue.unref(user_img_height)}rem`, width: `${vue.unref(user_img_width)}rem`, zIndex: "20" }),
                onClick: _cache[4] || (_cache[4] = ($event) => vue.unref(checkImg)("更换头像", "user_image")),
                mode: "aspectFill",
                class: "user_image",
                src: vue.unref(userInfo).user_image
              }, null, 12, ["src"]),
              vue.createElementVNode("div", { class: "user-LV" }, [
                vue.createElementVNode("image", {
                  src: vue.unref(lvs)[vue.unref(collectNumber) >= 100 ? 9 : Math.floor(vue.unref(collectNumber) / 10)],
                  class: "LV",
                  style: { "z-index": "20" }
                }, null, 8, ["src"]),
                vue.createElementVNode("div", { class: "lv_name" }, [
                  vue.createElementVNode(
                    "span",
                    null,
                    vue.toDisplayString(vue.unref(userInfo).user_name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("image", {
                    src: vue.unref(userInfo).user_sex === "0" ? vue.unref(GenderFemale) : vue.unref(GenderMale),
                    class: "user-sex"
                  }, null, 8, ["src"])
                ]),
                vue.createCommentVNode(" 编辑资料 "),
                vue.createElementVNode("button", {
                  onClick: _cache[5] || (_cache[5] = ($event) => vue.unref(navTo)("/pages/edit_user/edit_user")),
                  class: "edit-user"
                }, "编辑资料")
              ])
            ]),
            vue.createCommentVNode(" 我发布的 关注 粉丝 "),
            vue.createElementVNode("div", { class: "user-nav-box" }, [
              vue.createElementVNode("div", {
                class: "issue-box",
                onClick: _cache[6] || (_cache[6] = ($event) => vue.unref(navTo)("/pages/collect/collect"))
              }, [
                vue.createElementVNode(
                  "span",
                  { class: "number" },
                  vue.toDisplayString(vue.unref(collectNumber)),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("span", null, "我的收藏")
              ]),
              vue.createElementVNode("div", {
                class: "issue-box",
                onClick: _cache[7] || (_cache[7] = ($event) => vue.unref(navTo)("/pages/watch_record/watch_record"))
              }, [
                vue.createElementVNode(
                  "span",
                  { class: "number" },
                  vue.toDisplayString(vue.unref(historyNumber)),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("span", null, "观看记录")
              ]),
              vue.createElementVNode("div", {
                class: "issue-box",
                onClick: _cache[8] || (_cache[8] = (...args) => vue.unref(toDownload) && vue.unref(toDownload)(...args))
              }, [
                vue.createElementVNode("span", { class: "number" }, "1"),
                vue.createElementVNode("span", null, "我的下载")
              ])
            ]),
            vue.createElementVNode("div", { class: "function-list-box" }, [
              vue.createElementVNode("div", { class: "item" }, [
                vue.createElementVNode("div", { class: "item-left-box" }, [
                  vue.createElementVNode("image", { src: "/static/home/user.svg" }),
                  vue.createElementVNode(
                    "span",
                    { class: "item-title" },
                    "我的ID：0000" + vue.toDisplayString(vue.unref(userInfo).user_id),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("span")
              ]),
              vue.createElementVNode("div", {
                onClick: _cache[9] || (_cache[9] = (...args) => vue.unref(toDownload) && vue.unref(toDownload)(...args)),
                class: "item"
              }, [
                vue.createElementVNode("div", { class: "item-left-box" }, [
                  vue.createElementVNode("image", { src: "/static/home/user-aq.svg" }),
                  vue.createElementVNode("span", { class: "item-title" }, "账号与安全")
                ]),
                vue.createElementVNode("span")
              ]),
              vue.createElementVNode("div", {
                onClick: _cache[10] || (_cache[10] = (...args) => vue.unref(toDownload) && vue.unref(toDownload)(...args)),
                class: "item"
              }, [
                vue.createElementVNode("div", { class: "item-left-box" }, [
                  vue.createElementVNode("image", { src: "/static/home/ys.svg" }),
                  vue.createElementVNode("span", { class: "item-title" }, "隐私设置")
                ]),
                vue.createElementVNode("span")
              ]),
              vue.createElementVNode("div", {
                onClick: _cache[11] || (_cache[11] = (...args) => vue.unref(feedback) && vue.unref(feedback)(...args)),
                class: "item"
              }, [
                vue.createElementVNode("div", { class: "item-left-box" }, [
                  vue.createElementVNode("image", { src: "/static/home/yjfk.svg" }),
                  vue.createElementVNode("span", { class: "item-title" }, "反馈问题")
                ]),
                vue.createElementVNode("span")
              ]),
              vue.createElementVNode("div", {
                onClick: _cache[12] || (_cache[12] = (...args) => vue.unref(logOut) && vue.unref(logOut)(...args)),
                class: "item"
              }, [
                vue.createElementVNode("div", { class: "item-left-box" }, [
                  vue.createElementVNode("image", { src: "/static/home/user-logout.svg" }),
                  vue.createElementVNode("span", { class: "item-title" }, "退出登录")
                ]),
                vue.createElementVNode("span")
              ])
            ]),
            vue.createCommentVNode(" 底部弹出框 "),
            vue.createVNode(_component_u_popup, {
              round: 10,
              safeAreaInsetBottom: "",
              closeable: "",
              show: vue.unref(button_show),
              onClose: vue.unref(close)
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode("view", { class: "check_tx" }, [
                  vue.createVNode(_component_u_button, {
                    text: vue.unref(button_showValue),
                    onClick: vue.unref(chooseImage),
                    color: "linear-gradient(to right, #D94BC6, #F9F871)"
                  }, null, 8, ["text", "onClick"]),
                  vue.createVNode(_component_u_button, {
                    text: "保存",
                    onClick: vue.unref(saveImg),
                    color: "linear-gradient(to right, #FF5997, #0078F5)"
                  }, null, 8, ["onClick"])
                ])
              ]),
              _: 1
              /* STABLE */
            }, 8, ["show", "onClose"])
          ],
          32
          /* HYDRATE_EVENTS */
        );
      };
    }
  };
  const PagesHomeHome = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["__file", "F:/Qffiction/app1/uni-app/commApp/pages/home/home.vue"]]);
  const props$m = {
    props: {
      // 搜索框形状，round-圆形，square-方形
      shape: {
        type: String,
        default: props$v.search.shape
      },
      // 搜索框背景色，默认值#f2f2f2
      bgColor: {
        type: String,
        default: props$v.search.bgColor
      },
      // 占位提示文字
      placeholder: {
        type: String,
        default: props$v.search.placeholder
      },
      // 是否启用清除控件
      clearabled: {
        type: Boolean,
        default: props$v.search.clearabled
      },
      // 是否自动聚焦
      focus: {
        type: Boolean,
        default: props$v.search.focus
      },
      // 是否在搜索框右侧显示取消按钮
      showAction: {
        type: Boolean,
        default: props$v.search.showAction
      },
      // 右边控件的样式
      actionStyle: {
        type: Object,
        default: props$v.search.actionStyle
      },
      // 取消按钮文字
      actionText: {
        type: String,
        default: props$v.search.actionText
      },
      // 输入框内容对齐方式，可选值为 left|center|right
      inputAlign: {
        type: String,
        default: props$v.search.inputAlign
      },
      // input输入框的样式，可以定义文字颜色，大小等，对象形式
      inputStyle: {
        type: Object,
        default: props$v.search.inputStyle
      },
      // 是否启用输入框
      disabled: {
        type: Boolean,
        default: props$v.search.disabled
      },
      // 边框颜色
      borderColor: {
        type: String,
        default: props$v.search.borderColor
      },
      // 搜索图标的颜色，默认同输入框字体颜色
      searchIconColor: {
        type: String,
        default: props$v.search.searchIconColor
      },
      // 输入框字体颜色
      color: {
        type: String,
        default: props$v.search.color
      },
      // placeholder的颜色
      placeholderColor: {
        type: String,
        default: props$v.search.placeholderColor
      },
      // 左边输入框的图标，可以为uView图标名称或图片路径
      searchIcon: {
        type: String,
        default: props$v.search.searchIcon
      },
      searchIconSize: {
        type: [Number, String],
        default: props$v.search.searchIconSize
      },
      // 组件与其他上下左右元素之间的距离，带单位的字符串形式，如"30px"、"30px 20px"等写法
      margin: {
        type: String,
        default: props$v.search.margin
      },
      // 开启showAction时，是否在input获取焦点时才显示
      animation: {
        type: Boolean,
        default: props$v.search.animation
      },
      // 输入框的初始化内容
      modelValue: {
        type: String,
        default: props$v.search.value
      },
      value: {
        type: String,
        default: props$v.search.value
      },
      // 输入框最大能输入的长度，-1为不限制长度(来自uniapp文档)
      maxlength: {
        type: [String, Number],
        default: props$v.search.maxlength
      },
      // 搜索框高度，单位px
      height: {
        type: [String, Number],
        default: props$v.search.height
      },
      // 搜索框左侧文本
      label: {
        type: [String, Number, null],
        default: props$v.search.label
      }
    }
  };
  const _sfc_main$C = {
    name: "u-search",
    mixins: [mpMixin, mixin, props$m],
    data() {
      return {
        keyword: "",
        showClear: false,
        // 是否显示右边的清除图标
        show: false,
        // 标记input当前状态是否处于聚焦中，如果是，才会显示右侧的清除控件
        focused: this.focus
        // 绑定输入框的值
        // inputValue: this.value
      };
    },
    watch: {
      keyword(nVal) {
        this.$emit("update:modelValue", nVal);
        this.$emit("change", nVal);
      },
      modelValue: {
        immediate: true,
        handler(nVal) {
          this.keyword = nVal;
        }
      }
    },
    computed: {
      showActionBtn() {
        return !this.animation && this.showAction;
      }
    },
    emits: ["clear", "search", "custom", "focus", "blur", "click", "clickIcon", "update:modelValue", "change"],
    methods: {
      // 目前HX2.6.9 v-model双向绑定无效，故监听input事件获取输入框内容的变化
      inputChange(e) {
        this.keyword = e.detail.value;
      },
      // 清空输入
      // 也可以作为用户通过this.$refs形式调用清空输入框内容
      clear() {
        this.keyword = "";
        this.$nextTick(() => {
          this.$emit("clear");
        });
      },
      // 确定搜索
      search(e) {
        this.$emit("search", e.detail.value);
        try {
          uni.hideKeyboard();
        } catch (e2) {
        }
      },
      // 点击右边自定义按钮的事件
      custom() {
        this.$emit("custom", this.keyword);
        try {
          uni.hideKeyboard();
        } catch (e) {
        }
      },
      // 获取焦点
      getFocus() {
        this.focused = true;
        if (this.animation && this.showAction)
          this.show = true;
        this.$emit("focus", this.keyword);
      },
      // 失去焦点
      blur() {
        setTimeout(() => {
          this.focused = false;
        }, 100);
        this.show = false;
        this.$emit("blur", this.keyword);
      },
      // 点击搜索框，只有disabled=true时才发出事件，因为禁止了输入，意味着是想跳转真正的搜索页
      clickHandler() {
        if (this.disabled)
          this.$emit("click");
      },
      // 点击左边图标
      clickIcon() {
        this.$emit("clickIcon");
      }
    }
  };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_1$9);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "u-search",
        onClick: _cache[6] || (_cache[6] = (...args) => $options.clickHandler && $options.clickHandler(...args)),
        style: vue.normalizeStyle([{
          margin: _ctx.margin
        }, _ctx.$u.addStyle(_ctx.customStyle)])
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "u-search__content",
            style: vue.normalizeStyle({
              backgroundColor: _ctx.bgColor,
              borderRadius: _ctx.shape == "round" ? "100px" : "4px",
              borderColor: _ctx.borderColor
            })
          },
          [
            _ctx.$slots.label || _ctx.label !== null ? vue.renderSlot(_ctx.$slots, "label", { key: 0 }, () => [
              vue.createElementVNode(
                "text",
                { class: "u-search__content__label" },
                vue.toDisplayString(_ctx.label),
                1
                /* TEXT */
              )
            ], true) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "u-search__content__icon" }, [
              vue.createVNode(_component_u_icon, {
                onClick: $options.clickIcon,
                size: _ctx.searchIconSize,
                name: _ctx.searchIcon,
                color: _ctx.searchIconColor ? _ctx.searchIconColor : _ctx.color
              }, null, 8, ["onClick", "size", "name", "color"])
            ]),
            vue.createElementVNode("input", {
              "confirm-type": "search",
              onBlur: _cache[0] || (_cache[0] = (...args) => $options.blur && $options.blur(...args)),
              value: $data.keyword,
              onConfirm: _cache[1] || (_cache[1] = (...args) => $options.search && $options.search(...args)),
              onInput: _cache[2] || (_cache[2] = (...args) => $options.inputChange && $options.inputChange(...args)),
              disabled: _ctx.disabled,
              onFocus: _cache[3] || (_cache[3] = (...args) => $options.getFocus && $options.getFocus(...args)),
              focus: _ctx.focus,
              maxlength: _ctx.maxlength,
              "placeholder-class": "u-search__content__input--placeholder",
              placeholder: _ctx.placeholder,
              "placeholder-style": `color: ${_ctx.placeholderColor}`,
              class: "u-search__content__input",
              type: "text",
              style: vue.normalizeStyle([{
                textAlign: _ctx.inputAlign,
                color: _ctx.color,
                backgroundColor: _ctx.bgColor,
                height: _ctx.$u.addUnit(_ctx.height)
              }, _ctx.inputStyle])
            }, null, 44, ["value", "disabled", "focus", "maxlength", "placeholder", "placeholder-style"]),
            $data.keyword && _ctx.clearabled && $data.focused ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "u-search__content__icon u-search__content__close",
              onClick: _cache[4] || (_cache[4] = (...args) => $options.clear && $options.clear(...args))
            }, [
              vue.createVNode(_component_u_icon, {
                name: "close",
                size: "11",
                color: "#ffffff",
                customStyle: "line-height: 12px"
              })
            ])) : vue.createCommentVNode("v-if", true)
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "text",
          {
            style: vue.normalizeStyle([_ctx.actionStyle]),
            class: vue.normalizeClass(["u-search__action", [($options.showActionBtn || $data.show) && "u-search__action--active"]]),
            onClick: _cache[5] || (_cache[5] = vue.withModifiers((...args) => $options.custom && $options.custom(...args), ["stop", "prevent"]))
          },
          vue.toDisplayString(_ctx.actionText),
          7
          /* TEXT, CLASS, STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const __easycom_0$5 = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["render", _sfc_render$r], ["__scopeId", "data-v-e082a34a"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-search/u-search.vue"]]);
  const props$l = {
    props: {
      // 显示的内容，字符串
      text: {
        type: [Array],
        default: props$v.columnNotice.text
      },
      // 是否显示左侧的音量图标
      icon: {
        type: String,
        default: props$v.columnNotice.icon
      },
      // 通告模式，link-显示右箭头，closable-显示右侧关闭图标
      mode: {
        type: String,
        default: props$v.columnNotice.mode
      },
      // 文字颜色，各图标也会使用文字颜色
      color: {
        type: String,
        default: props$v.columnNotice.color
      },
      // 背景颜色
      bgColor: {
        type: String,
        default: props$v.columnNotice.bgColor
      },
      // 字体大小，单位px
      fontSize: {
        type: [String, Number],
        default: props$v.columnNotice.fontSize
      },
      // 水平滚动时的滚动速度，即每秒滚动多少px(px)，这有利于控制文字无论多少时，都能有一个恒定的速度
      speed: {
        type: [String, Number],
        default: props$v.columnNotice.speed
      },
      // direction = row时，是否使用步进形式滚动
      step: {
        type: Boolean,
        default: props$v.columnNotice.step
      },
      // 滚动一个周期的时间长，单位ms
      duration: {
        type: [String, Number],
        default: props$v.columnNotice.duration
      },
      // 是否禁止用手滑动切换
      // 目前HX2.6.11，只支持App 2.5.5+、H5 2.5.5+、支付宝小程序、字节跳动小程序
      disableTouch: {
        type: Boolean,
        default: props$v.columnNotice.disableTouch
      }
    }
  };
  const _sfc_main$B = {
    mixins: [mpMixin, mixin, props$l],
    watch: {
      text: {
        immediate: true,
        handler(newValue, oldValue) {
          if (!uni.$u.test.array(newValue)) {
            uni.$u.error("noticebar组件direction为column时，要求text参数为数组形式");
          }
        }
      }
    },
    computed: {
      // 文字内容的样式
      textStyle() {
        let style = {};
        style.color = this.color;
        style.fontSize = uni.$u.addUnit(this.fontSize);
        return style;
      },
      // 垂直或者水平滚动
      vertical() {
        if (this.mode == "horizontal")
          return false;
        else
          return true;
      }
    },
    data() {
      return {
        index: 0
      };
    },
    methods: {
      noticeChange(e) {
        this.index = e.detail.current;
      },
      // 点击通告栏
      clickHandler() {
        this.$emit("click", this.index);
      },
      // 点击关闭按钮
      close() {
        this.$emit("close");
      }
    }
  };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_1$9);
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "u-notice",
      onClick: _cache[1] || (_cache[1] = (...args) => $options.clickHandler && $options.clickHandler(...args))
    }, [
      vue.renderSlot(_ctx.$slots, "icon", {}, () => [
        _ctx.icon ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "u-notice__left-icon"
        }, [
          vue.createVNode(_component_u_icon, {
            name: _ctx.icon,
            color: _ctx.color,
            size: "19"
          }, null, 8, ["name", "color"])
        ])) : vue.createCommentVNode("v-if", true)
      ], true),
      vue.createElementVNode("swiper", {
        "disable-touch": _ctx.disableTouch,
        vertical: _ctx.step ? false : true,
        circular: "",
        interval: _ctx.duration,
        autoplay: true,
        class: "u-notice__swiper",
        onChange: _cache[0] || (_cache[0] = (...args) => $options.noticeChange && $options.noticeChange(...args))
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(_ctx.text, (item, index2) => {
            return vue.openBlock(), vue.createElementBlock("swiper-item", {
              key: index2,
              class: "u-notice__swiper__item"
            }, [
              vue.createElementVNode(
                "text",
                {
                  class: "u-notice__swiper__item__text u-line-1",
                  style: vue.normalizeStyle([$options.textStyle])
                },
                vue.toDisplayString(item),
                5
                /* TEXT, STYLE */
              )
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ], 40, ["disable-touch", "vertical", "interval"]),
      ["link", "closable"].includes(_ctx.mode) ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "u-notice__right-icon"
      }, [
        _ctx.mode === "link" ? (vue.openBlock(), vue.createBlock(_component_u_icon, {
          key: 0,
          name: "arrow-right",
          size: 17,
          color: _ctx.color
        }, null, 8, ["color"])) : vue.createCommentVNode("v-if", true),
        _ctx.mode === "closable" ? (vue.openBlock(), vue.createBlock(_component_u_icon, {
          key: 1,
          name: "close",
          size: 16,
          color: _ctx.color,
          onClick: $options.close
        }, null, 8, ["color", "onClick"])) : vue.createCommentVNode("v-if", true)
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_0$4 = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["render", _sfc_render$q], ["__scopeId", "data-v-bacc3427"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-column-notice/u-column-notice.vue"]]);
  const props$k = {
    props: {
      // 显示的内容，字符串
      text: {
        type: String,
        default: props$v.rowNotice.text
      },
      // 是否显示左侧的音量图标
      icon: {
        type: String,
        default: props$v.rowNotice.icon
      },
      // 通告模式，link-显示右箭头，closable-显示右侧关闭图标
      mode: {
        type: String,
        default: props$v.rowNotice.mode
      },
      // 文字颜色，各图标也会使用文字颜色
      color: {
        type: String,
        default: props$v.rowNotice.color
      },
      // 背景颜色
      bgColor: {
        type: String,
        default: props$v.rowNotice.bgColor
      },
      // 字体大小，单位px
      fontSize: {
        type: [String, Number],
        default: props$v.rowNotice.fontSize
      },
      // 水平滚动时的滚动速度，即每秒滚动多少px(rpx)，这有利于控制文字无论多少时，都能有一个恒定的速度
      speed: {
        type: [String, Number],
        default: props$v.rowNotice.speed
      }
    }
  };
  const _sfc_main$A = {
    name: "u-row-notice",
    mixins: [mpMixin, mixin, props$k],
    data() {
      return {
        animationDuration: "0",
        // 动画执行时间
        animationPlayState: "paused",
        // 动画的开始和结束执行
        // nvue下，内容发生变化，导致滚动宽度也变化，需要标志为是否需要重新计算宽度
        // 不能在内容变化时直接重新计算，因为nvue的animation模块上一次的滚动不是刚好结束，会有影响
        nvueInit: true,
        show: true
      };
    },
    watch: {
      text: {
        immediate: true,
        handler(newValue, oldValue) {
          this.vue();
          if (!uni.$u.test.string(newValue)) {
            uni.$u.error("noticebar组件direction为row时，要求text参数为字符串形式");
          }
        }
      },
      fontSize() {
        this.vue();
      },
      speed() {
        this.vue();
      }
    },
    computed: {
      // 文字内容的样式
      textStyle() {
        let style = {};
        style.color = this.color;
        style.fontSize = uni.$u.addUnit(this.fontSize);
        return style;
      },
      animationStyle() {
        let style = {};
        style.animationDuration = this.animationDuration;
        style.animationPlayState = this.animationPlayState;
        return style;
      },
      // 内部对用户传入的数据进一步分割，放到多个text标签循环，否则如果用户传入的字符串很长（100个字符以上）
      // 放在一个text标签中进行滚动，在低端安卓机上，动画可能会出现抖动现象，需要分割到多个text中可解决此问题
      innerText() {
        let result = [], len = 20;
        const textArr = this.text.split("");
        for (let i = 0; i < textArr.length; i += len) {
          result.push(textArr.slice(i, i + len).join(""));
        }
        return result;
      }
    },
    mounted() {
      var pages2 = getCurrentPages();
      var page2 = pages2[pages2.length - 1];
      var currentWebview = page2.$getAppWebview();
      currentWebview.addEventListener("hide", () => {
        this.webviewHide = true;
      });
      currentWebview.addEventListener("show", () => {
        this.webviewHide = false;
      });
      this.init();
    },
    methods: {
      init() {
        this.vue();
        if (!uni.$u.test.string(this.text)) {
          uni.$u.error("noticebar组件direction为row时，要求text参数为字符串形式");
        }
      },
      // vue版处理
      async vue() {
        let textWidth = 0;
        await uni.$u.sleep();
        textWidth = (await this.$uGetRect(".u-notice__content__text")).width;
        (await this.$uGetRect(".u-notice__content")).width;
        this.animationDuration = `${textWidth / uni.$u.getPx(this.speed)}s`;
        this.animationPlayState = "paused";
        setTimeout(() => {
          this.animationPlayState = "running";
        }, 10);
      },
      // nvue版处理
      async nvue() {
      },
      loopAnimation(textWidth, boxWidth) {
      },
      getNvueRect(el) {
      },
      // 点击通告栏
      clickHandler(index2) {
        this.$emit("click");
      },
      // 点击右侧按钮，需要判断点击的是关闭图标还是箭头图标
      close() {
        this.$emit("close");
      }
    }
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_1$9);
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "u-notice",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.clickHandler && $options.clickHandler(...args))
    }, [
      vue.renderSlot(_ctx.$slots, "icon", {}, () => [
        _ctx.icon ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "u-notice__left-icon"
        }, [
          vue.createVNode(_component_u_icon, {
            name: _ctx.icon,
            color: _ctx.color,
            size: "19"
          }, null, 8, ["name", "color"])
        ])) : vue.createCommentVNode("v-if", true)
      ], true),
      vue.createElementVNode(
        "view",
        {
          class: "u-notice__content",
          ref: "u-notice__content"
        },
        [
          vue.createElementVNode(
            "view",
            {
              ref: "u-notice__content__text",
              class: "u-notice__content__text",
              style: vue.normalizeStyle([$options.animationStyle])
            },
            [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.innerText, (item, index2) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: index2,
                      style: vue.normalizeStyle([$options.textStyle])
                    },
                    vue.toDisplayString(item),
                    5
                    /* TEXT, STYLE */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ],
            4
            /* STYLE */
          )
        ],
        512
        /* NEED_PATCH */
      ),
      ["link", "closable"].includes(_ctx.mode) ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "u-notice__right-icon"
      }, [
        _ctx.mode === "link" ? (vue.openBlock(), vue.createBlock(_component_u_icon, {
          key: 0,
          name: "arrow-right",
          size: 17,
          color: _ctx.color
        }, null, 8, ["color"])) : vue.createCommentVNode("v-if", true),
        _ctx.mode === "closable" ? (vue.openBlock(), vue.createBlock(_component_u_icon, {
          key: 1,
          onClick: $options.close,
          name: "close",
          size: 16,
          color: _ctx.color
        }, null, 8, ["onClick", "color"])) : vue.createCommentVNode("v-if", true)
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_1$7 = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["render", _sfc_render$p], ["__scopeId", "data-v-ab8dee7b"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-row-notice/u-row-notice.vue"]]);
  const props$j = {
    props: {
      // 显示的内容，数组
      text: {
        type: [Array, String],
        default: props$v.noticeBar.text
      },
      // 通告滚动模式，row-横向滚动，column-竖向滚动
      direction: {
        type: String,
        default: props$v.noticeBar.direction
      },
      // direction = row时，是否使用步进形式滚动
      step: {
        type: Boolean,
        default: props$v.noticeBar.step
      },
      // 是否显示左侧的音量图标
      icon: {
        type: String,
        default: props$v.noticeBar.icon
      },
      // 通告模式，link-显示右箭头，closable-显示右侧关闭图标
      mode: {
        type: String,
        default: props$v.noticeBar.mode
      },
      // 文字颜色，各图标也会使用文字颜色
      color: {
        type: String,
        default: props$v.noticeBar.color
      },
      // 背景颜色
      bgColor: {
        type: String,
        default: props$v.noticeBar.bgColor
      },
      // 水平滚动时的滚动速度，即每秒滚动多少px(px)，这有利于控制文字无论多少时，都能有一个恒定的速度
      speed: {
        type: [String, Number],
        default: props$v.noticeBar.speed
      },
      // 字体大小
      fontSize: {
        type: [String, Number],
        default: props$v.noticeBar.fontSize
      },
      // 滚动一个周期的时间长，单位ms
      duration: {
        type: [String, Number],
        default: props$v.noticeBar.duration
      },
      // 是否禁止用手滑动切换
      // 目前HX2.6.11，只支持App 2.5.5+、H5 2.5.5+、支付宝小程序、字节跳动小程序
      disableTouch: {
        type: Boolean,
        default: props$v.noticeBar.disableTouch
      },
      // 跳转的页面路径
      url: {
        type: String,
        default: props$v.noticeBar.url
      },
      // 页面跳转的类型
      linkType: {
        type: String,
        default: props$v.noticeBar.linkType
      }
    }
  };
  const _sfc_main$z = {
    name: "u-notice-bar",
    mixins: [mpMixin, mixin, props$j],
    data() {
      return {
        show: true
      };
    },
    methods: {
      // 点击通告栏
      click(index2) {
        this.$emit("click", index2);
        if (this.url && this.linkType) {
          this.openPage();
        }
      },
      // 点击关闭按钮
      close() {
        this.show = false;
        this.$emit("close");
      }
    }
  };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_column_notice = resolveEasycom(vue.resolveDynamicComponent("u-column-notice"), __easycom_0$4);
    const _component_u_row_notice = resolveEasycom(vue.resolveDynamicComponent("u-row-notice"), __easycom_1$7);
    return $data.show ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: "u-notice-bar",
        style: vue.normalizeStyle([{
          backgroundColor: _ctx.bgColor
        }, _ctx.$u.addStyle(_ctx.customStyle)])
      },
      [
        _ctx.direction === "column" || _ctx.direction === "row" && _ctx.step ? (vue.openBlock(), vue.createBlock(_component_u_column_notice, {
          key: 0,
          color: _ctx.color,
          bgColor: _ctx.bgColor,
          text: _ctx.text,
          mode: _ctx.mode,
          step: _ctx.step,
          icon: _ctx.icon,
          "disable-touch": _ctx.disableTouch,
          fontSize: _ctx.fontSize,
          duration: _ctx.duration,
          onClose: $options.close,
          onClick: $options.click
        }, null, 8, ["color", "bgColor", "text", "mode", "step", "icon", "disable-touch", "fontSize", "duration", "onClose", "onClick"])) : (vue.openBlock(), vue.createBlock(_component_u_row_notice, {
          key: 1,
          color: _ctx.color,
          bgColor: _ctx.bgColor,
          text: _ctx.text,
          mode: _ctx.mode,
          fontSize: _ctx.fontSize,
          speed: _ctx.speed,
          url: _ctx.url,
          linkType: _ctx.linkType,
          icon: _ctx.icon,
          onClose: $options.close,
          onClick: $options.click
        }, null, 8, ["color", "bgColor", "text", "mode", "fontSize", "speed", "url", "linkType", "icon", "onClose", "onClick"]))
      ],
      4
      /* STYLE */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_1$6 = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$o], ["__scopeId", "data-v-54bd9363"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-notice-bar/u-notice-bar.vue"]]);
  const props$i = {
    props: {
      // 吸顶容器到顶部某个距离的时候，进行吸顶，在H5平台，NavigationBar为44px
      offsetTop: {
        type: [String, Number],
        default: props$v.sticky.offsetTop
      },
      // 自定义导航栏的高度
      customNavHeight: {
        type: [String, Number],
        default: props$v.sticky.customNavHeight
      },
      // 是否开启吸顶功能
      disabled: {
        type: Boolean,
        default: props$v.sticky.disabled
      },
      // 吸顶区域的背景颜色
      bgColor: {
        type: String,
        default: props$v.sticky.bgColor
      },
      // z-index值
      zIndex: {
        type: [String, Number],
        default: props$v.sticky.zIndex
      },
      // 列表中的索引值
      index: {
        type: [String, Number],
        default: props$v.sticky.index
      }
    }
  };
  const _sfc_main$y = {
    name: "u-sticky",
    mixins: [mpMixin, mixin, props$i],
    data() {
      return {
        cssSticky: false,
        // 是否使用css的sticky实现
        stickyTop: 0,
        // 吸顶的top值，因为可能受自定义导航栏影响，最终的吸顶值非offsetTop值
        elId: uni.$u.guid(),
        left: 0,
        // js模式时，吸顶的内容因为处于postition: fixed模式，为了和原来保持一致的样式，需要记录并重新设置它的left，height，width属性
        width: "auto",
        height: "auto",
        fixed: false
        // js模式时，是否处于吸顶模式
      };
    },
    computed: {
      style() {
        const style = {};
        if (!this.disabled) {
          if (this.cssSticky) {
            style.position = "sticky";
            style.zIndex = this.uZindex;
            style.top = uni.$u.addUnit(this.stickyTop);
          } else {
            style.height = this.fixed ? this.height + "px" : "auto";
          }
        } else {
          style.position = "static";
        }
        style.backgroundColor = this.bgColor;
        return uni.$u.deepMerge(uni.$u.addStyle(this.customStyle), style);
      },
      // 吸顶内容的样式
      stickyContent() {
        const style = {};
        if (!this.cssSticky) {
          style.position = this.fixed ? "fixed" : "static";
          style.top = this.stickyTop + "px";
          style.left = this.left + "px";
          style.width = this.width == "auto" ? "auto" : this.width + "px";
          style.zIndex = this.uZindex;
        }
        return style;
      },
      uZindex() {
        return this.zIndex ? this.zIndex : uni.$u.zIndex.sticky;
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.getStickyTop();
        this.checkSupportCssSticky();
        if (!this.cssSticky) {
          !this.disabled && this.initObserveContent();
        }
      },
      initObserveContent() {
        this.$uGetRect("#" + this.elId).then((res) => {
          this.height = res.height;
          this.left = res.left;
          this.width = res.width;
          this.$nextTick(() => {
            this.observeContent();
          });
        });
      },
      observeContent() {
        this.disconnectObserver("contentObserver");
        const contentObserver = uni.createIntersectionObserver({
          // 检测的区间范围
          thresholds: [0.95, 0.98, 1]
        });
        contentObserver.relativeToViewport({
          top: -this.stickyTop
        });
        contentObserver.observe(`#${this.elId}`, (res) => {
          this.setFixed(res.boundingClientRect.top);
        });
        this.contentObserver = contentObserver;
      },
      setFixed(top) {
        const fixed = top <= this.stickyTop;
        this.fixed = fixed;
      },
      disconnectObserver(observerName) {
        const observer = this[observerName];
        observer && observer.disconnect();
      },
      getStickyTop() {
        this.stickyTop = uni.$u.getPx(this.offsetTop) + uni.$u.getPx(this.customNavHeight);
      },
      async checkSupportCssSticky() {
        if (uni.$u.os() === "android" && Number(uni.$u.sys().system) > 8) {
          this.cssSticky = true;
        }
        this.cssSticky = await this.checkComputedStyle();
        if (uni.$u.os() === "ios") {
          this.cssSticky = true;
        }
      },
      // 在APP和微信小程序上，通过uni.createSelectorQuery可以判断是否支持css sticky
      checkComputedStyle() {
        return new Promise((resolve) => {
          uni.createSelectorQuery().in(this).select(".u-sticky").fields({
            computedStyle: ["position"]
          }).exec((e) => {
            resolve("sticky" === e[0].position);
          });
        });
      },
      // H5通过创建元素的形式嗅探是否支持css sticky
      // 判断浏览器是否支持sticky属性
      checkCssStickyForH5() {
      }
    },
    beforeDestroy() {
      this.disconnectObserver("contentObserver");
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "u-sticky",
      id: $data.elId,
      style: vue.normalizeStyle([$options.style])
    }, [
      vue.createElementVNode(
        "view",
        {
          style: vue.normalizeStyle([$options.stickyContent]),
          class: "u-sticky__content"
        },
        [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ],
        4
        /* STYLE */
      )
    ], 12, ["id"]);
  }
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$n], ["__scopeId", "data-v-8b303089"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-sticky/u-sticky.vue"]]);
  const props$h = {
    props: {
      // 轮播的长度
      length: {
        type: [String, Number],
        default: props$v.swiperIndicator.length
      },
      // 当前处于活动状态的轮播的索引
      current: {
        type: [String, Number],
        default: props$v.swiperIndicator.current
      },
      // 指示器非激活颜色
      indicatorActiveColor: {
        type: String,
        default: props$v.swiperIndicator.indicatorActiveColor
      },
      // 指示器的激活颜色
      indicatorInactiveColor: {
        type: String,
        default: props$v.swiperIndicator.indicatorInactiveColor
      },
      // 指示器模式，line-线型，dot-点型
      indicatorMode: {
        type: String,
        default: props$v.swiperIndicator.indicatorMode
      }
    }
  };
  const _sfc_main$x = {
    name: "u-swiper-indicator",
    mixins: [mpMixin, mixin, props$h],
    data() {
      return {
        lineWidth: 22
      };
    },
    computed: {
      // 指示器为线型的样式
      lineStyle() {
        let style = {};
        style.width = uni.$u.addUnit(this.lineWidth);
        style.transform = `translateX(${uni.$u.addUnit(this.current * this.lineWidth)})`;
        style.backgroundColor = this.indicatorActiveColor;
        return style;
      },
      // 指示器为点型的样式
      dotStyle() {
        return (index2) => {
          let style = {};
          style.backgroundColor = index2 === this.current ? this.indicatorActiveColor : this.indicatorInactiveColor;
          return style;
        };
      }
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "u-swiper-indicator" }, [
      _ctx.indicatorMode === "line" ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: vue.normalizeClass(["u-swiper-indicator__wrapper", [`u-swiper-indicator__wrapper--${_ctx.indicatorMode}`]]),
          style: vue.normalizeStyle({
            width: _ctx.$u.addUnit($data.lineWidth * _ctx.length),
            backgroundColor: _ctx.indicatorInactiveColor
          })
        },
        [
          vue.createElementVNode(
            "view",
            {
              class: "u-swiper-indicator__wrapper--line__bar",
              style: vue.normalizeStyle([$options.lineStyle])
            },
            null,
            4
            /* STYLE */
          )
        ],
        6
        /* CLASS, STYLE */
      )) : vue.createCommentVNode("v-if", true),
      _ctx.indicatorMode === "dot" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "u-swiper-indicator__wrapper"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(_ctx.length, (item, index2) => {
            return vue.openBlock(), vue.createElementBlock(
              "view",
              {
                class: vue.normalizeClass(["u-swiper-indicator__wrapper__dot", [index2 === _ctx.current && "u-swiper-indicator__wrapper__dot--active"]]),
                key: index2,
                style: vue.normalizeStyle([$options.dotStyle(index2)])
              },
              null,
              6
              /* CLASS, STYLE */
            );
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_1$5 = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$m], ["__scopeId", "data-v-7b7c7ea6"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-swiper-indicator/u-swiper-indicator.vue"]]);
  const props$g = {
    props: {
      // 列表数组，元素可为字符串，如为对象可通过keyName指定目标属性名
      list: {
        type: Array,
        default: props$v.swiper.list
      },
      // 是否显示面板指示器
      indicator: {
        type: Boolean,
        default: props$v.swiper.indicator
      },
      // 指示器非激活颜色
      indicatorActiveColor: {
        type: String,
        default: props$v.swiper.indicatorActiveColor
      },
      // 指示器的激活颜色
      indicatorInactiveColor: {
        type: String,
        default: props$v.swiper.indicatorInactiveColor
      },
      // 指示器样式，可通过bottom，left，right进行定位
      indicatorStyle: {
        type: [String, Object],
        default: props$v.swiper.indicatorStyle
      },
      // 指示器模式，line-线型，dot-点型
      indicatorMode: {
        type: String,
        default: props$v.swiper.indicatorMode
      },
      // 是否自动切换
      autoplay: {
        type: Boolean,
        default: props$v.swiper.autoplay
      },
      // 当前所在滑块的 index
      current: {
        type: [String, Number],
        default: props$v.swiper.current
      },
      // 当前所在滑块的 item-id ，不能与 current 被同时指定
      currentItemId: {
        type: String,
        default: props$v.swiper.currentItemId
      },
      // 滑块自动切换时间间隔
      interval: {
        type: [String, Number],
        default: props$v.swiper.interval
      },
      // 滑块切换过程所需时间
      duration: {
        type: [String, Number],
        default: props$v.swiper.duration
      },
      // 播放到末尾后是否重新回到开头
      circular: {
        type: Boolean,
        default: props$v.swiper.circular
      },
      // 前边距，可用于露出前一项的一小部分，nvue和支付宝不支持
      previousMargin: {
        type: [String, Number],
        default: props$v.swiper.previousMargin
      },
      // 后边距，可用于露出后一项的一小部分，nvue和支付宝不支持
      nextMargin: {
        type: [String, Number],
        default: props$v.swiper.nextMargin
      },
      // 当开启时，会根据滑动速度，连续滑动多屏，支付宝不支持
      acceleration: {
        type: Boolean,
        default: props$v.swiper.acceleration
      },
      // 同时显示的滑块数量，nvue、支付宝小程序不支持
      displayMultipleItems: {
        type: Number,
        default: props$v.swiper.displayMultipleItems
      },
      // 指定swiper切换缓动动画类型，有效值：default、linear、easeInCubic、easeOutCubic、easeInOutCubic
      // 只对微信小程序有效
      easingFunction: {
        type: String,
        default: props$v.swiper.easingFunction
      },
      // list数组中指定对象的目标属性名
      keyName: {
        type: String,
        default: props$v.swiper.keyName
      },
      // 图片的裁剪模式
      imgMode: {
        type: String,
        default: props$v.swiper.imgMode
      },
      // 组件高度
      height: {
        type: [String, Number],
        default: props$v.swiper.height
      },
      // 背景颜色
      bgColor: {
        type: String,
        default: props$v.swiper.bgColor
      },
      // 组件圆角，数值或带单位的字符串
      radius: {
        type: [String, Number],
        default: props$v.swiper.radius
      },
      // 是否加载中
      loading: {
        type: Boolean,
        default: props$v.swiper.loading
      },
      // 是否显示标题，要求数组对象中有title属性
      showTitle: {
        type: Boolean,
        default: props$v.swiper.showTitle
      }
    }
  };
  const _sfc_main$w = {
    name: "u-swiper",
    mixins: [mpMixin, mixin, props$g],
    data() {
      return {
        currentIndex: 0
      };
    },
    watch: {
      current(val, preVal) {
        if (val === preVal)
          return;
        this.currentIndex = val;
      }
    },
    computed: {
      itemStyle() {
        return (index2) => {
          const style = {};
          if (this.nextMargin && this.previousMargin) {
            style.borderRadius = uni.$u.addUnit(this.radius);
            if (index2 !== this.currentIndex)
              style.transform = "scale(0.92)";
          }
          return style;
        };
      }
    },
    methods: {
      getItemType(item) {
        if (typeof item === "string")
          return uni.$u.test.video(this.getSource(item)) ? "video" : "image";
        if (typeof item === "object" && this.keyName) {
          if (!item.type)
            return uni.$u.test.video(this.getSource(item)) ? "video" : "image";
          if (item.type === "image")
            return "image";
          if (item.type === "video")
            return "video";
          return "image";
        }
      },
      // 获取目标路径，可能数组中为字符串，对象的形式，额外可指定对象的目标属性名keyName
      getSource(item) {
        if (typeof item === "string")
          return item;
        if (typeof item === "object" && this.keyName)
          return item[this.keyName];
        else
          uni.$u.error("请按格式传递列表参数");
        return "";
      },
      // 轮播切换事件
      change(e) {
        const {
          current
        } = e.detail;
        this.pauseVideo(this.currentIndex);
        this.currentIndex = current;
        this.$emit("change", e.detail);
      },
      // 切换轮播时，暂停视频播放
      pauseVideo(index2) {
        const lastItem = this.getSource(this.list[index2]);
        if (uni.$u.test.video(lastItem)) {
          const video2 = uni.createVideoContext(`video-${index2}`, this);
          video2.pause();
        }
      },
      // 当一个轮播item为视频时，获取它的视频海报
      getPoster(item) {
        return typeof item === "object" && item.poster ? item.poster : "";
      },
      // 点击某个item
      clickHandler(index2) {
        this.$emit("click", index2);
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_loading_icon = resolveEasycom(vue.resolveDynamicComponent("u-loading-icon"), __easycom_0$9);
    const _component_u_swiper_indicator = resolveEasycom(vue.resolveDynamicComponent("u-swiper-indicator"), __easycom_1$5);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "u-swiper",
        style: vue.normalizeStyle({
          backgroundColor: _ctx.bgColor,
          height: _ctx.$u.addUnit(_ctx.height),
          borderRadius: _ctx.$u.addUnit(_ctx.radius)
        })
      },
      [
        _ctx.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "u-swiper__loading"
        }, [
          vue.createVNode(_component_u_loading_icon, { mode: "circle" })
        ])) : (vue.openBlock(), vue.createElementBlock("swiper", {
          key: 1,
          class: "u-swiper__wrapper",
          style: vue.normalizeStyle({
            height: _ctx.$u.addUnit(_ctx.height)
          }),
          onChange: _cache[0] || (_cache[0] = (...args) => $options.change && $options.change(...args)),
          circular: _ctx.circular,
          interval: _ctx.interval,
          duration: _ctx.duration,
          autoplay: _ctx.autoplay,
          current: _ctx.current,
          currentItemId: _ctx.currentItemId,
          previousMargin: _ctx.$u.addUnit(_ctx.previousMargin),
          nextMargin: _ctx.$u.addUnit(_ctx.nextMargin),
          acceleration: _ctx.acceleration,
          displayMultipleItems: _ctx.displayMultipleItems,
          easingFunction: _ctx.easingFunction
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(_ctx.list, (item, index2) => {
              return vue.openBlock(), vue.createElementBlock("swiper-item", {
                class: "u-swiper__wrapper__item",
                key: index2
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "u-swiper__wrapper__item__wrapper",
                    style: vue.normalizeStyle([$options.itemStyle(index2)])
                  },
                  [
                    vue.createCommentVNode(" 在nvue中，image图片的宽度默认为屏幕宽度，需要通过flex:1撑开，另外必须设置高度才能显示图片 "),
                    $options.getItemType(item) === "image" ? (vue.openBlock(), vue.createElementBlock("image", {
                      key: 0,
                      class: "u-swiper__wrapper__item__wrapper__image",
                      src: $options.getSource(item),
                      mode: _ctx.imgMode,
                      onClick: ($event) => $options.clickHandler(index2),
                      style: vue.normalizeStyle({
                        height: _ctx.$u.addUnit(_ctx.height),
                        borderRadius: _ctx.$u.addUnit(_ctx.radius)
                      })
                    }, null, 12, ["src", "mode", "onClick"])) : vue.createCommentVNode("v-if", true),
                    $options.getItemType(item) === "video" ? (vue.openBlock(), vue.createElementBlock("video", {
                      key: 1,
                      class: "u-swiper__wrapper__item__wrapper__video",
                      id: `video-${index2}`,
                      "enable-progress-gesture": false,
                      src: $options.getSource(item),
                      poster: $options.getPoster(item),
                      title: _ctx.showTitle && _ctx.$u.test.object(item) && item.title ? item.title : "",
                      style: vue.normalizeStyle({
                        height: _ctx.$u.addUnit(_ctx.height)
                      }),
                      controls: "",
                      onClick: ($event) => $options.clickHandler(index2)
                    }, null, 12, ["id", "src", "poster", "title", "onClick"])) : vue.createCommentVNode("v-if", true),
                    _ctx.showTitle && _ctx.$u.test.object(item) && item.title && _ctx.$u.test.image($options.getSource(item)) ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 2,
                        class: "u-swiper__wrapper__item__wrapper__title u-line-1"
                      },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    )) : vue.createCommentVNode("v-if", true)
                  ],
                  4
                  /* STYLE */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ], 44, ["circular", "interval", "duration", "autoplay", "current", "currentItemId", "previousMargin", "nextMargin", "acceleration", "displayMultipleItems", "easingFunction"])),
        vue.createElementVNode(
          "view",
          {
            class: "u-swiper__indicator",
            style: vue.normalizeStyle([_ctx.$u.addStyle(_ctx.indicatorStyle)])
          },
          [
            vue.renderSlot(_ctx.$slots, "indicator", {}, () => [
              !_ctx.loading && _ctx.indicator && !_ctx.showTitle ? (vue.openBlock(), vue.createBlock(_component_u_swiper_indicator, {
                key: 0,
                indicatorActiveColor: _ctx.indicatorActiveColor,
                indicatorInactiveColor: _ctx.indicatorInactiveColor,
                length: _ctx.list.length,
                current: $data.currentIndex,
                indicatorMode: _ctx.indicatorMode
              }, null, 8, ["indicatorActiveColor", "indicatorInactiveColor", "length", "current", "indicatorMode"])) : vue.createCommentVNode("v-if", true)
            ], true)
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const __easycom_3$3 = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$l], ["__scopeId", "data-v-4e7d0c90"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-swiper/u-swiper.vue"]]);
  const props$f = {
    props: {
      // 是否显示圆点
      isDot: {
        type: Boolean,
        default: props$v.badge.isDot
      },
      // 显示的内容
      value: {
        type: [Number, String],
        default: props$v.badge.value
      },
      // 显示的内容
      modelValue: {
        type: [Number, String],
        default: props$v.badge.modelValue
      },
      // 是否显示
      show: {
        type: Boolean,
        default: props$v.badge.show
      },
      // 最大值，超过最大值会显示 '{max}+'
      max: {
        type: [Number, String],
        default: props$v.badge.max
      },
      // 主题类型，error|warning|success|primary
      type: {
        type: String,
        default: props$v.badge.type
      },
      // 当数值为 0 时，是否展示 Badge
      showZero: {
        type: Boolean,
        default: props$v.badge.showZero
      },
      // 背景颜色，优先级比type高，如设置，type参数会失效
      bgColor: {
        type: [String, null],
        default: props$v.badge.bgColor
      },
      // 字体颜色
      color: {
        type: [String, null],
        default: props$v.badge.color
      },
      // 徽标形状，circle-四角均为圆角，horn-左下角为直角
      shape: {
        type: String,
        default: props$v.badge.shape
      },
      // 设置数字的显示方式，overflow|ellipsis|limit
      // overflow会根据max字段判断，超出显示`${max}+`
      // ellipsis会根据max判断，超出显示`${max}...`
      // limit会依据1000作为判断条件，超出1000，显示`${value/1000}K`，比如2.2k、3.34w，最多保留2位小数
      numberType: {
        type: String,
        default: props$v.badge.numberType
      },
      // 设置badge的位置偏移，格式为 [x, y]，也即设置的为top和right的值，absolute为true时有效
      offset: {
        type: Array,
        default: props$v.badge.offset
      },
      // 是否反转背景和字体颜色
      inverted: {
        type: Boolean,
        default: props$v.badge.inverted
      },
      // 是否绝对定位
      absolute: {
        type: Boolean,
        default: props$v.badge.absolute
      }
    }
  };
  const _sfc_main$v = {
    name: "u-badge",
    mixins: [mpMixin, props$f, mixin],
    computed: {
      // 是否将badge中心与父组件右上角重合
      boxStyle() {
        let style = {};
        return style;
      },
      // 整个组件的样式
      badgeStyle() {
        const style = {};
        if (this.color) {
          style.color = this.color;
        }
        if (this.bgColor && !this.inverted) {
          style.backgroundColor = this.bgColor;
        }
        if (this.absolute) {
          style.position = "absolute";
          if (this.offset.length) {
            const top = this.offset[0];
            const right = this.offset[1] || top;
            style.top = uni.$u.addUnit(top);
            style.right = uni.$u.addUnit(right);
          }
        }
        return style;
      },
      showValue() {
        switch (this.numberType) {
          case "overflow":
            return Number(this.value) > Number(this.max) ? this.max + "+" : this.value;
          case "ellipsis":
            return Number(this.value) > Number(this.max) ? "..." : this.value;
          case "limit":
            return Number(this.value) > 999 ? Number(this.value) >= 9999 ? Math.floor(this.value / 1e4 * 100) / 100 + "w" : Math.floor(this.value / 1e3 * 100) / 100 + "k" : this.value;
          default:
            return Number(this.value);
        }
      }
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return _ctx.show && ((Number(_ctx.value) === 0 ? _ctx.showZero : true) || _ctx.isDot) ? (vue.openBlock(), vue.createElementBlock(
      "text",
      {
        key: 0,
        class: vue.normalizeClass([[_ctx.isDot ? "u-badge--dot" : "u-badge--not-dot", _ctx.inverted && "u-badge--inverted", _ctx.shape === "horn" && "u-badge--horn", `u-badge--${_ctx.type}${_ctx.inverted ? "--inverted" : ""}`], "u-badge"]),
        style: vue.normalizeStyle([_ctx.$u.addStyle(_ctx.customStyle), $options.badgeStyle])
      },
      vue.toDisplayString(_ctx.isDot ? "" : $options.showValue),
      7
      /* TEXT, CLASS, STYLE */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$k], ["__scopeId", "data-v-06cca9b7"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-badge/u-badge.vue"]]);
  const props$e = {
    props: {
      // 滑块的移动过渡时间，单位ms
      duration: {
        type: Number,
        default: props$v.tabs.duration
      },
      // tabs标签数组
      list: {
        type: Array,
        default: props$v.tabs.list
      },
      // 滑块颜色
      lineColor: {
        type: String,
        default: props$v.tabs.lineColor
      },
      // 菜单选择中时的样式
      activeStyle: {
        type: [String, Object],
        default: props$v.tabs.activeStyle
      },
      // 菜单非选中时的样式
      inactiveStyle: {
        type: [String, Object],
        default: props$v.tabs.inactiveStyle
      },
      // 滑块长度
      lineWidth: {
        type: [String, Number],
        default: props$v.tabs.lineWidth
      },
      // 滑块高度
      lineHeight: {
        type: [String, Number],
        default: props$v.tabs.lineHeight
      },
      // 滑块背景显示大小，当滑块背景设置为图片时使用
      lineBgSize: {
        type: String,
        default: props$v.tabs.lineBgSize
      },
      // 菜单item的样式
      itemStyle: {
        type: [String, Object],
        default: props$v.tabs.itemStyle
      },
      // 菜单是否可滚动
      scrollable: {
        type: Boolean,
        default: props$v.tabs.scrollable
      },
      // 当前选中标签的索引
      current: {
        type: [Number, String],
        default: props$v.tabs.current
      },
      // 默认读取的键名
      keyName: {
        type: String,
        default: props$v.tabs.keyName
      }
    }
  };
  const _sfc_main$u = {
    name: "u-tabs",
    mixins: [mpMixin, mixin, props$e],
    data() {
      return {
        firstTime: true,
        scrollLeft: 0,
        scrollViewWidth: 0,
        lineOffsetLeft: 0,
        tabsRect: {
          left: 0
        },
        innerCurrent: 0,
        moving: false
      };
    },
    watch: {
      current: {
        immediate: true,
        handler(newValue, oldValue) {
          if (newValue !== this.innerCurrent) {
            this.innerCurrent = newValue;
            this.$nextTick(() => {
              this.resize();
            });
          }
        }
      },
      // list变化时，重新渲染list各项信息
      list() {
        this.$nextTick(() => {
          this.resize();
        });
      }
    },
    computed: {
      textStyle() {
        return (index2) => {
          const style = {};
          const customeStyle = index2 === this.innerCurrent ? uni.$u.addStyle(this.activeStyle) : uni.$u.addStyle(
            this.inactiveStyle
          );
          if (this.list[index2].disabled) {
            style.color = "#c8c9cc";
          }
          return uni.$u.deepMerge(customeStyle, style);
        };
      },
      propsBadge() {
        return uni.$u.props.badge;
      }
    },
    async mounted() {
      this.init();
    },
    emits: ["click", "change"],
    methods: {
      setLineLeft() {
        const tabItem = this.list[this.innerCurrent];
        if (!tabItem) {
          return;
        }
        let lineOffsetLeft = this.list.slice(0, this.innerCurrent).reduce((total, curr) => total + curr.rect.width, 0);
        const lineWidth = uni.$u.getPx(this.lineWidth);
        this.lineOffsetLeft = lineOffsetLeft + (tabItem.rect.width - lineWidth) / 2;
        if (this.firstTime) {
          setTimeout(() => {
            this.firstTime = false;
          }, 10);
        }
      },
      // nvue下设置滑块的位置
      animation(x, duration = 0) {
      },
      // 点击某一个标签
      clickHandler(item, index2) {
        this.$emit("click", {
          ...item,
          index: index2
        });
        if (item.disabled)
          return;
        this.innerCurrent = index2;
        this.resize();
        this.$emit("change", {
          ...item,
          index: index2
        });
      },
      init() {
        uni.$u.sleep().then(() => {
          this.resize();
        });
      },
      setScrollLeft() {
        const tabRect = this.list[this.innerCurrent];
        const offsetLeft = this.list.slice(0, this.innerCurrent).reduce((total, curr) => {
          return total + curr.rect.width;
        }, 0);
        const windowWidth = uni.$u.sys().windowWidth;
        let scrollLeft = offsetLeft - (this.tabsRect.width - tabRect.rect.width) / 2 - (windowWidth - this.tabsRect.right) / 2 + this.tabsRect.left / 2;
        scrollLeft = Math.min(scrollLeft, this.scrollViewWidth - this.tabsRect.width);
        this.scrollLeft = Math.max(0, scrollLeft);
      },
      // 获取所有标签的尺寸
      resize() {
        if (this.list.length === 0) {
          return;
        }
        Promise.all([this.getTabsRect(), this.getAllItemRect()]).then(([tabsRect, itemRect = []]) => {
          this.tabsRect = tabsRect;
          this.scrollViewWidth = 0;
          itemRect.map((item, index2) => {
            this.scrollViewWidth += item.width;
            this.list[index2].rect = item;
          });
          this.setLineLeft();
          this.setScrollLeft();
        });
      },
      // 获取导航菜单的尺寸
      getTabsRect() {
        return new Promise((resolve) => {
          this.queryRect("u-tabs__wrapper__scroll-view").then((size) => resolve(size));
        });
      },
      // 获取所有标签的尺寸
      getAllItemRect() {
        return new Promise((resolve) => {
          const promiseAllArr = this.list.map((item, index2) => this.queryRect(
            `u-tabs__wrapper__nav__item-${index2}`,
            true
          ));
          Promise.all(promiseAllArr).then((sizes) => resolve(sizes));
        });
      },
      // 获取各个标签的尺寸
      queryRect(el, item) {
        return new Promise((resolve) => {
          this.$uGetRect(`.${el}`).then((size) => {
            resolve(size);
          });
        });
      }
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_badge = resolveEasycom(vue.resolveDynamicComponent("u-badge"), __easycom_0$3);
    return vue.openBlock(), vue.createElementBlock("view", { class: "u-tabs" }, [
      vue.createElementVNode("view", { class: "u-tabs__wrapper" }, [
        vue.renderSlot(_ctx.$slots, "left", {}, void 0, true),
        vue.createElementVNode("view", { class: "u-tabs__wrapper__scroll-view-wrapper" }, [
          vue.createElementVNode("scroll-view", {
            "scroll-x": _ctx.scrollable,
            "scroll-left": $data.scrollLeft,
            "scroll-with-animation": "",
            class: "u-tabs__wrapper__scroll-view",
            "show-scrollbar": false,
            ref: "u-tabs__wrapper__scroll-view"
          }, [
            vue.createElementVNode(
              "view",
              {
                class: "u-tabs__wrapper__nav",
                ref: "u-tabs__wrapper__nav"
              },
              [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(_ctx.list, (item, index2) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: vue.normalizeClass(["u-tabs__wrapper__nav__item", [`u-tabs__wrapper__nav__item-${index2}`, item.disabled && "u-tabs__wrapper__nav__item--disabled"]]),
                      key: index2,
                      onClick: ($event) => $options.clickHandler(item, index2),
                      ref_for: true,
                      ref: `u-tabs__wrapper__nav__item-${index2}`,
                      style: vue.normalizeStyle([_ctx.$u.addStyle(_ctx.itemStyle), { flex: _ctx.scrollable ? "" : 1 }])
                    }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass([[item.disabled && "u-tabs__wrapper__nav__item__text--disabled"], "u-tabs__wrapper__nav__item__text"]),
                          style: vue.normalizeStyle([$options.textStyle(index2)])
                        },
                        vue.toDisplayString(item[_ctx.keyName]),
                        7
                        /* TEXT, CLASS, STYLE */
                      ),
                      vue.createVNode(_component_u_badge, {
                        show: !!(item.badge && (item.badge.show || item.badge.isDot || item.badge.value)),
                        isDot: item.badge && item.badge.isDot || $options.propsBadge.isDot,
                        value: item.badge && item.badge.value || $options.propsBadge.value,
                        max: item.badge && item.badge.max || $options.propsBadge.max,
                        type: item.badge && item.badge.type || $options.propsBadge.type,
                        showZero: item.badge && item.badge.showZero || $options.propsBadge.showZero,
                        bgColor: item.badge && item.badge.bgColor || $options.propsBadge.bgColor,
                        color: item.badge && item.badge.color || $options.propsBadge.color,
                        shape: item.badge && item.badge.shape || $options.propsBadge.shape,
                        numberType: item.badge && item.badge.numberType || $options.propsBadge.numberType,
                        inverted: item.badge && item.badge.inverted || $options.propsBadge.inverted,
                        customStyle: "margin-left: 4px;"
                      }, null, 8, ["show", "isDot", "value", "max", "type", "showZero", "bgColor", "color", "shape", "numberType", "inverted"])
                    ], 14, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                )),
                vue.createElementVNode(
                  "view",
                  {
                    class: "u-tabs__wrapper__nav__line",
                    ref: "u-tabs__wrapper__nav__line",
                    style: vue.normalizeStyle([{
                      width: _ctx.$u.addUnit(_ctx.lineWidth),
                      transform: `translate(${$data.lineOffsetLeft}px)`,
                      transitionDuration: `${$data.firstTime ? 0 : _ctx.duration}ms`,
                      height: _ctx.$u.addUnit(_ctx.lineHeight),
                      background: _ctx.lineColor,
                      backgroundSize: _ctx.lineBgSize
                    }])
                  },
                  null,
                  4
                  /* STYLE */
                )
              ],
              512
              /* NEED_PATCH */
            )
          ], 8, ["scroll-x", "scroll-left"])
        ]),
        vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
      ])
    ]);
  }
  const __easycom_4$1 = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$j], ["__scopeId", "data-v-02b0c54f"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-tabs/u-tabs.vue"]]);
  const props$d = {
    props: {
      // 文字颜色
      color: {
        type: String,
        default: props$v.link.color
      },
      // 字体大小，单位px
      fontSize: {
        type: [String, Number],
        default: props$v.link.fontSize
      },
      // 是否显示下划线
      underLine: {
        type: Boolean,
        default: props$v.link.underLine
      },
      // 要跳转的链接
      href: {
        type: String,
        default: props$v.link.href
      },
      // 小程序中复制到粘贴板的提示语
      mpTips: {
        type: String,
        default: props$v.link.mpTips
      },
      // 下划线颜色
      lineColor: {
        type: String,
        default: props$v.link.lineColor
      },
      // 超链接的问题，不使用slot形式传入，是因为nvue下无法修改颜色
      text: {
        type: String,
        default: props$v.link.text
      }
    }
  };
  const _sfc_main$t = {
    name: "u-link",
    mixins: [mpMixin, mixin, props$d],
    computed: {
      linkStyle() {
        const style = {
          color: this.color,
          fontSize: uni.$u.addUnit(this.fontSize),
          // line-height设置为比字体大小多2px
          lineHeight: uni.$u.addUnit(uni.$u.getPx(this.fontSize) + 2),
          textDecoration: this.underLine ? "underline" : "none"
        };
        return style;
      }
    },
    methods: {
      openLink() {
        plus.runtime.openURL(this.href);
        this.$emit("click");
      }
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        class: "u-link",
        onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.openLink && $options.openLink(...args), ["stop"])),
        style: vue.normalizeStyle([$options.linkStyle, _ctx.$u.addStyle(_ctx.customStyle)])
      },
      vue.toDisplayString(_ctx.text),
      5
      /* TEXT, STYLE */
    );
  }
  const __easycom_1$4 = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$i], ["__scopeId", "data-v-12f6646d"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-link/u-link.vue"]]);
  const value = {
    computed: {
      // 经处理后需要显示的值
      value() {
        const {
          text,
          mode,
          format,
          href
        } = this;
        if (mode === "price") {
          if (!/^\d+(\.\d+)?$/.test(text)) {
            uni.$u.error("金额模式下，text参数需要为金额格式");
          }
          if (uni.$u.test.func(format)) {
            return format(text);
          }
          return uni.$u.priceFormat(text, 2);
        }
        if (mode === "date") {
          !uni.$u.test.date(text) && uni.$u.error("日期模式下，text参数需要为日期或时间戳格式");
          if (uni.$u.test.func(format)) {
            return format(text);
          }
          if (format) {
            return uni.$u.timeFormat(text, format);
          }
          return uni.$u.timeFormat(text, "yyyy-mm-dd");
        }
        if (mode === "phone") {
          if (uni.$u.test.func(format)) {
            return format(text);
          }
          if (format === "encrypt") {
            return `${text.substr(0, 3)}****${text.substr(7)}`;
          }
          return text;
        }
        if (mode === "name") {
          !(typeof text === "string") && uni.$u.error("姓名模式下，text参数需要为字符串格式");
          if (uni.$u.test.func(format)) {
            return format(text);
          }
          if (format === "encrypt") {
            return this.formatName(text);
          }
          return text;
        }
        if (mode === "link") {
          !uni.$u.test.url(href) && uni.$u.error("超链接模式下，href参数需要为URL格式");
          return text;
        }
        return text;
      }
    },
    methods: {
      // 默认的姓名脱敏规则
      formatName(name) {
        let value2 = "";
        if (name.length === 2) {
          value2 = name.substr(0, 1) + "*";
        } else if (name.length > 2) {
          let char = "";
          for (let i = 0, len = name.length - 2; i < len; i++) {
            char += "*";
          }
          value2 = name.substr(0, 1) + char + name.substr(-1, 1);
        } else {
          value2 = name;
        }
        return value2;
      }
    }
  };
  const props$c = {
    props: {
      // 主题颜色
      type: {
        type: String,
        default: props$v.text.type
      },
      // 是否显示
      show: {
        type: Boolean,
        default: props$v.text.show
      },
      // 显示的值
      text: {
        type: [String, Number],
        default: props$v.text.text
      },
      // 前置图标
      prefixIcon: {
        type: String,
        default: props$v.text.prefixIcon
      },
      // 后置图标
      suffixIcon: {
        type: String,
        default: props$v.text.suffixIcon
      },
      // 文本处理的匹配模式
      // text-普通文本，price-价格，phone-手机号，name-姓名，date-日期，link-超链接
      mode: {
        type: String,
        default: props$v.text.mode
      },
      // mode=link下，配置的链接
      href: {
        type: String,
        default: props$v.text.href
      },
      // 格式化规则
      format: {
        type: [String, Function],
        default: props$v.text.format
      },
      // mode=phone时，点击文本是否拨打电话
      call: {
        type: Boolean,
        default: props$v.text.call
      },
      // 小程序的打开方式
      openType: {
        type: String,
        default: props$v.text.openType
      },
      // 是否粗体，默认normal
      bold: {
        type: Boolean,
        default: props$v.text.bold
      },
      // 是否块状
      block: {
        type: Boolean,
        default: props$v.text.block
      },
      // 文本显示的行数，如果设置，超出此行数，将会显示省略号
      lines: {
        type: [String, Number],
        default: props$v.text.lines
      },
      // 文本颜色
      color: {
        type: String,
        default: props$v.text.color
      },
      // 字体大小
      size: {
        type: [String, Number],
        default: props$v.text.size
      },
      // 图标的样式
      iconStyle: {
        type: [Object, String],
        default: props$v.text.iconStyle
      },
      // 文字装饰，下划线，中划线等，可选值 none|underline|line-through
      decoration: {
        tepe: String,
        default: props$v.text.decoration
      },
      // 外边距，对象、字符串，数值形式均可
      margin: {
        type: [Object, String, Number],
        default: props$v.text.margin
      },
      // 文本行高
      lineHeight: {
        type: [String, Number],
        default: props$v.text.lineHeight
      },
      // 文本对齐方式，可选值left|center|right
      align: {
        type: String,
        default: props$v.text.align
      },
      // 文字换行，可选值break-word|normal|anywhere
      wordWrap: {
        type: String,
        default: props$v.text.wordWrap
      }
    }
  };
  const _sfc_main$s = {
    name: "u--text",
    mixins: [mpMixin, mixin, value, props$c],
    emits: ["click"],
    computed: {
      valueStyle() {
        const style = {
          textDecoration: this.decoration,
          fontWeight: this.bold ? "bold" : "normal",
          wordWrap: this.wordWrap,
          fontSize: uni.$u.addUnit(this.size)
        };
        !this.type && (style.color = this.color);
        this.isNvue && this.lines && (style.lines = this.lines);
        this.lineHeight && (style.lineHeight = uni.$u.addUnit(this.lineHeight));
        !this.isNvue && this.block && (style.display = "block");
        return uni.$u.deepMerge(style, uni.$u.addStyle(this.customStyle));
      },
      isNvue() {
        let nvue = false;
        return nvue;
      },
      isMp() {
        let mp = false;
        return mp;
      }
    },
    data() {
      return {};
    },
    methods: {
      clickHandler() {
        if (this.call && this.mode === "phone") {
          uni.makePhoneCall({
            phoneNumber: this.text
          });
        }
        this.$emit("click");
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_1$9);
    const _component_u_link = resolveEasycom(vue.resolveDynamicComponent("u-link"), __easycom_1$4);
    return _ctx.show ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass(["u-text", []]),
        style: vue.normalizeStyle({
          margin: _ctx.margin,
          justifyContent: _ctx.align === "left" ? "flex-start" : _ctx.align === "center" ? "center" : "flex-end"
        }),
        onClick: _cache[6] || (_cache[6] = (...args) => $options.clickHandler && $options.clickHandler(...args))
      },
      [
        _ctx.mode === "price" ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 0,
            class: vue.normalizeClass(["u-text__price", _ctx.type && `u-text__value--${_ctx.type}`]),
            style: vue.normalizeStyle([$options.valueStyle])
          },
          "￥",
          6
          /* CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true),
        _ctx.prefixIcon ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "u-text__prefix-icon"
        }, [
          vue.createVNode(_component_u_icon, {
            name: _ctx.prefixIcon,
            customStyle: _ctx.$u.addStyle(_ctx.iconStyle)
          }, null, 8, ["name", "customStyle"])
        ])) : vue.createCommentVNode("v-if", true),
        _ctx.mode === "link" ? (vue.openBlock(), vue.createBlock(_component_u_link, {
          key: 2,
          text: _ctx.value,
          href: _ctx.href,
          underLine: ""
        }, null, 8, ["text", "href"])) : _ctx.openType && $options.isMp ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 3,
          class: "u-reset-button u-text__value",
          style: vue.normalizeStyle([$options.valueStyle]),
          "data-index": _ctx.index,
          openType: _ctx.openType,
          onGetuserinfo: _cache[0] || (_cache[0] = (...args) => _ctx.onGetUserInfo && _ctx.onGetUserInfo(...args)),
          onContact: _cache[1] || (_cache[1] = (...args) => _ctx.onContact && _ctx.onContact(...args)),
          onGetphonenumber: _cache[2] || (_cache[2] = (...args) => _ctx.onGetPhoneNumber && _ctx.onGetPhoneNumber(...args)),
          onError: _cache[3] || (_cache[3] = (...args) => _ctx.onError && _ctx.onError(...args)),
          onLaunchapp: _cache[4] || (_cache[4] = (...args) => _ctx.onLaunchApp && _ctx.onLaunchApp(...args)),
          onOpensetting: _cache[5] || (_cache[5] = (...args) => _ctx.onOpenSetting && _ctx.onOpenSetting(...args)),
          lang: _ctx.lang,
          "session-from": _ctx.sessionFrom,
          "send-message-title": _ctx.sendMessageTitle,
          "send-message-path": _ctx.sendMessagePath,
          "send-message-img": _ctx.sendMessageImg,
          "show-message-card": _ctx.showMessageCard,
          "app-parameter": _ctx.appParameter
        }, vue.toDisplayString(_ctx.value), 45, ["data-index", "openType", "lang", "session-from", "send-message-title", "send-message-path", "send-message-img", "show-message-card", "app-parameter"])) : (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 4,
            class: vue.normalizeClass(["u-text__value", [
              _ctx.type && `u-text__value--${_ctx.type}`,
              _ctx.lines && `u-line-${_ctx.lines}`
            ]]),
            style: vue.normalizeStyle([$options.valueStyle])
          },
          vue.toDisplayString(_ctx.value),
          7
          /* TEXT, CLASS, STYLE */
        )),
        _ctx.suffixIcon ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 5,
          class: "u-text__suffix-icon"
        }, [
          vue.createVNode(_component_u_icon, {
            name: _ctx.suffixIcon,
            customStyle: _ctx.$u.addStyle(_ctx.iconStyle)
          }, null, 8, ["name", "customStyle"])
        ])) : vue.createCommentVNode("v-if", true)
      ],
      4
      /* STYLE */
    )) : vue.createCommentVNode("v-if", true);
  }
  const uvText = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$h], ["__scopeId", "data-v-0a574502"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-text/u-text.vue"]]);
  const _sfc_main$r = {
    name: "u--text",
    mixins: [mpMixin, mixin, props$c],
    components: {
      uvText
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uvText = vue.resolveComponent("uvText");
    return vue.openBlock(), vue.createBlock(_component_uvText, {
      type: _ctx.type,
      show: _ctx.show,
      text: _ctx.text,
      prefixIcon: _ctx.prefixIcon,
      suffixIcon: _ctx.suffixIcon,
      mode: _ctx.mode,
      href: _ctx.href,
      format: _ctx.format,
      call: _ctx.call,
      openType: _ctx.openType,
      bold: _ctx.bold,
      block: _ctx.block,
      lines: _ctx.lines,
      color: _ctx.color,
      decoration: _ctx.decoration,
      size: _ctx.size,
      iconStyle: _ctx.iconStyle,
      margin: _ctx.margin,
      lineHeight: _ctx.lineHeight,
      align: _ctx.align,
      wordWrap: _ctx.wordWrap,
      customStyle: _ctx.customStyle
    }, null, 8, ["type", "show", "text", "prefixIcon", "suffixIcon", "mode", "href", "format", "call", "openType", "bold", "block", "lines", "color", "decoration", "size", "iconStyle", "margin", "lineHeight", "align", "wordWrap", "customStyle"]);
  }
  const __easycom_1$3 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$g], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u--text/u--text.vue"]]);
  const props$b = {
    props: {
      color: {
        type: String,
        default: props$v.line.color
      },
      // 长度，竖向时表现为高度，横向时表现为长度，可以为百分比，带px单位的值等
      length: {
        type: [String, Number],
        default: props$v.line.length
      },
      // 线条方向，col-竖向，row-横向
      direction: {
        type: String,
        default: props$v.line.direction
      },
      // 是否显示细边框
      hairline: {
        type: Boolean,
        default: props$v.line.hairline
      },
      // 线条与上下左右元素的间距，字符串形式，如"30px"、"20px 30px"
      margin: {
        type: [String, Number],
        default: props$v.line.margin
      },
      // 是否虚线，true-虚线，false-实线
      dashed: {
        type: Boolean,
        default: props$v.line.dashed
      }
    }
  };
  const _sfc_main$q = {
    name: "u-line",
    mixins: [mpMixin, mixin, props$b],
    computed: {
      lineStyle() {
        const style = {};
        style.margin = this.margin;
        if (this.direction === "row") {
          style.borderBottomWidth = "1px";
          style.borderBottomStyle = this.dashed ? "dashed" : "solid";
          style.width = uni.$u.addUnit(this.length);
          if (this.hairline)
            style.transform = "scaleY(0.5)";
        } else {
          style.borderLeftWidth = "1px";
          style.borderLeftStyle = this.dashed ? "dashed" : "solid";
          style.height = uni.$u.addUnit(this.length);
          if (this.hairline)
            style.transform = "scaleX(0.5)";
        }
        style.borderColor = this.color;
        return uni.$u.deepMerge(style, uni.$u.addStyle(this.customStyle));
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "u-line",
        style: vue.normalizeStyle([$options.lineStyle])
      },
      null,
      4
      /* STYLE */
    );
  }
  const __easycom_1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$f], ["__scopeId", "data-v-72791e59"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-line/u-line.vue"]]);
  const props$a = {
    props: {
      // 是否展示modal
      show: {
        type: Boolean,
        default: props$v.modal.show
      },
      // 标题
      title: {
        type: [String],
        default: props$v.modal.title
      },
      // 弹窗内容
      content: {
        type: String,
        default: props$v.modal.content
      },
      // 确认文案
      confirmText: {
        type: String,
        default: props$v.modal.confirmText
      },
      // 取消文案
      cancelText: {
        type: String,
        default: props$v.modal.cancelText
      },
      // 是否显示确认按钮
      showConfirmButton: {
        type: Boolean,
        default: props$v.modal.showConfirmButton
      },
      // 是否显示取消按钮
      showCancelButton: {
        type: Boolean,
        default: props$v.modal.showCancelButton
      },
      // 确认按钮颜色
      confirmColor: {
        type: String,
        default: props$v.modal.confirmColor
      },
      // 取消文字颜色
      cancelColor: {
        type: String,
        default: props$v.modal.cancelColor
      },
      // 对调确认和取消的位置
      buttonReverse: {
        type: Boolean,
        default: props$v.modal.buttonReverse
      },
      // 是否开启缩放效果
      zoom: {
        type: Boolean,
        default: props$v.modal.zoom
      },
      // 是否异步关闭，只对确定按钮有效
      asyncClose: {
        type: Boolean,
        default: props$v.modal.asyncClose
      },
      // 是否允许点击遮罩关闭modal
      closeOnClickOverlay: {
        type: Boolean,
        default: props$v.modal.closeOnClickOverlay
      },
      // 给一个负的margin-top，往上偏移，避免和键盘重合的情况
      negativeTop: {
        type: [String, Number],
        default: props$v.modal.negativeTop
      },
      // modal宽度，不支持百分比，可以数值，px，rpx单位
      width: {
        type: [String, Number],
        default: props$v.modal.width
      },
      // 确认按钮的样式，circle-圆形，square-方形，如设置，将不会显示取消按钮
      confirmButtonShape: {
        type: String,
        default: props$v.modal.confirmButtonShape
      }
    }
  };
  const _sfc_main$p = {
    name: "u-modal",
    mixins: [mpMixin, mixin, props$a],
    data() {
      return {
        loading: false
      };
    },
    watch: {
      show(n) {
        if (n && this.loading)
          this.loading = false;
      }
    },
    methods: {
      // 点击确定按钮
      confirmHandler() {
        if (this.asyncClose) {
          this.loading = true;
        }
        this.$emit("confirm");
      },
      // 点击取消按钮
      cancelHandler() {
        this.$emit("cancel");
      },
      // 点击遮罩
      // 从原理上来说，modal的遮罩点击，并不是真的点击到了遮罩
      // 因为modal依赖于popup的中部弹窗类型，中部弹窗比较特殊，虽有然遮罩，但是为了让弹窗内容能flex居中
      // 多了一个透明的遮罩，此透明的遮罩会覆盖在灰色的遮罩上，所以实际上是点击不到灰色遮罩的，popup内部在
      // 透明遮罩的子元素做了.stop处理，所以点击内容区，也不会导致误触发
      clickHandler() {
        if (this.closeOnClickOverlay) {
          this.$emit("close");
        }
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_line = resolveEasycom(vue.resolveDynamicComponent("u-line"), __easycom_1$2);
    const _component_u_loading_icon = resolveEasycom(vue.resolveDynamicComponent("u-loading-icon"), __easycom_0$9);
    const _component_u_popup = resolveEasycom(vue.resolveDynamicComponent("u-popup"), __easycom_8$1);
    return vue.openBlock(), vue.createBlock(_component_u_popup, {
      mode: "center",
      zoom: _ctx.zoom,
      show: _ctx.show,
      customStyle: {
        borderRadius: "6px",
        overflow: "hidden",
        marginTop: `-${_ctx.$u.addUnit(_ctx.negativeTop)}`
      },
      closeOnClickOverlay: _ctx.closeOnClickOverlay,
      safeAreaInsetBottom: false,
      duration: 400,
      onClick: $options.clickHandler
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode(
          "view",
          {
            class: "u-modal",
            style: vue.normalizeStyle({
              width: _ctx.$u.addUnit(_ctx.width)
            })
          },
          [
            _ctx.title ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 0,
                class: "u-modal__title"
              },
              vue.toDisplayString(_ctx.title),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode(
              "view",
              {
                class: "u-modal__content",
                style: vue.normalizeStyle({
                  paddingTop: `${_ctx.title ? 12 : 25}px`
                })
              },
              [
                vue.renderSlot(_ctx.$slots, "default", {}, () => [
                  vue.createElementVNode(
                    "text",
                    { class: "u-modal__content__text" },
                    vue.toDisplayString(_ctx.content),
                    1
                    /* TEXT */
                  )
                ], true)
              ],
              4
              /* STYLE */
            ),
            _ctx.$slots.confirmButton ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "u-modal__button-group--confirm-button"
            }, [
              vue.renderSlot(_ctx.$slots, "confirmButton", {}, void 0, true)
            ])) : (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 2 },
              [
                vue.createVNode(_component_u_line),
                vue.createElementVNode(
                  "view",
                  {
                    class: "u-modal__button-group",
                    style: vue.normalizeStyle({
                      flexDirection: _ctx.buttonReverse ? "row-reverse" : "row"
                    })
                  },
                  [
                    _ctx.showCancelButton ? (vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: 0,
                        class: vue.normalizeClass(["u-modal__button-group__wrapper u-modal__button-group__wrapper--cancel", [_ctx.showCancelButton && !_ctx.showConfirmButton && "u-modal__button-group__wrapper--only-cancel"]]),
                        "hover-stay-time": 150,
                        "hover-class": "u-modal__button-group__wrapper--hover",
                        onClick: _cache[0] || (_cache[0] = (...args) => $options.cancelHandler && $options.cancelHandler(...args))
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          {
                            class: "u-modal__button-group__wrapper__text",
                            style: vue.normalizeStyle({
                              color: _ctx.cancelColor
                            })
                          },
                          vue.toDisplayString(_ctx.cancelText),
                          5
                          /* TEXT, STYLE */
                        )
                      ],
                      2
                      /* CLASS */
                    )) : vue.createCommentVNode("v-if", true),
                    _ctx.showConfirmButton && _ctx.showCancelButton ? (vue.openBlock(), vue.createBlock(_component_u_line, {
                      key: 1,
                      direction: "column"
                    })) : vue.createCommentVNode("v-if", true),
                    _ctx.showConfirmButton ? (vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: 2,
                        class: vue.normalizeClass(["u-modal__button-group__wrapper u-modal__button-group__wrapper--confirm", [!_ctx.showCancelButton && _ctx.showConfirmButton && "u-modal__button-group__wrapper--only-confirm"]]),
                        "hover-stay-time": 150,
                        "hover-class": "u-modal__button-group__wrapper--hover",
                        onClick: _cache[1] || (_cache[1] = (...args) => $options.confirmHandler && $options.confirmHandler(...args))
                      },
                      [
                        $data.loading ? (vue.openBlock(), vue.createBlock(_component_u_loading_icon, { key: 0 })) : (vue.openBlock(), vue.createElementBlock(
                          "text",
                          {
                            key: 1,
                            class: "u-modal__button-group__wrapper__text",
                            style: vue.normalizeStyle({
                              color: _ctx.confirmColor
                            })
                          },
                          vue.toDisplayString(_ctx.confirmText),
                          5
                          /* TEXT, STYLE */
                        ))
                      ],
                      2
                      /* CLASS */
                    )) : vue.createCommentVNode("v-if", true)
                  ],
                  4
                  /* STYLE */
                )
              ],
              64
              /* STABLE_FRAGMENT */
            ))
          ],
          4
          /* STYLE */
        )
      ]),
      _: 3
      /* FORWARDED */
    }, 8, ["zoom", "show", "customStyle", "closeOnClickOverlay", "onClick"]);
  }
  const __easycom_5 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$e], ["__scopeId", "data-v-f667648f"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-modal/u-modal.vue"]]);
  const props$9 = {
    props: {
      // 激活部分的颜色
      activeColor: {
        type: String,
        default: props$v.lineProgress.activeColor
      },
      inactiveColor: {
        type: String,
        default: props$v.lineProgress.color
      },
      // 进度百分比，数值
      percentage: {
        type: [String, Number],
        default: props$v.lineProgress.inactiveColor
      },
      // 是否在进度条内部显示百分比的值
      showText: {
        type: Boolean,
        default: props$v.lineProgress.showText
      },
      // 进度条的高度，单位px
      height: {
        type: [String, Number],
        default: props$v.lineProgress.height
      }
    }
  };
  const _sfc_main$o = {
    name: "u-line-progress",
    mixins: [mpMixin, mixin, props$9],
    data() {
      return {
        lineWidth: 0
      };
    },
    watch: {
      percentage(n) {
        this.resizeProgressWidth();
      }
    },
    computed: {
      progressStyle() {
        let style = {};
        style.width = this.lineWidth;
        style.backgroundColor = this.activeColor;
        style.height = uni.$u.addUnit(this.height);
        return style;
      },
      innserPercentage() {
        return uni.$u.range(0, 100, this.percentage);
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        uni.$u.sleep(20).then(() => {
          this.resizeProgressWidth();
        });
      },
      getProgressWidth() {
        return this.$uGetRect(".u-line-progress__background");
      },
      resizeProgressWidth() {
        this.getProgressWidth().then((size) => {
          const {
            width
          } = size;
          this.lineWidth = width * this.innserPercentage / 100 + "px";
        });
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "u-line-progress",
        style: vue.normalizeStyle([_ctx.$u.addStyle(_ctx.customStyle)])
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "u-line-progress__background",
            ref: "u-line-progress__background",
            style: vue.normalizeStyle([{
              backgroundColor: _ctx.inactiveColor,
              height: _ctx.$u.addUnit(_ctx.height)
            }])
          },
          null,
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "u-line-progress__line",
            style: vue.normalizeStyle([$options.progressStyle])
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, () => [
              _ctx.showText && _ctx.percentage >= 10 ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 0,
                  class: "u-line-progress__text"
                },
                vue.toDisplayString($options.innserPercentage + "%"),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ], true)
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const __easycom_8 = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$d], ["__scopeId", "data-v-eeee7090"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-line-progress/u-line-progress.vue"]]);
  function getRequist(url2) {
    return uni.request({
      method: "GET",
      url: url2,
      header: {
        "Authorization": uni.getStorageSync("token")
      }
    });
  }
  function getTypeList(type, page2) {
    return getRequist(`/getTypeList/${type}/${page2}`);
  }
  function getFindByVideoId(videoId) {
    return getRequist(`/getFindByVideoId/${videoId}`);
  }
  function getFindBySearch(name, indexPage, type) {
    return getRequist(`/getFindBySearch/${name}/${indexPage}/${type}`);
  }
  function getFindByVideoType(type, indexPage = 1) {
    return getRequist(`/getFindByVideoType/${type}/${indexPage}`);
  }
  const _sfc_main$n = {
    __name: "swiper",
    props: {
      type: {
        type: String,
        default: "科幻片"
      }
    },
    setup(__props) {
      const props2 = __props;
      let page2 = 1;
      let list = vue.ref([]);
      let toDetail = (item) => {
        uni.navigateTo({
          url: "/pages/detail/detail?id=" + item.videoId
        });
      };
      let imageLoad = (item) => {
        item.updateTime = false;
      };
      let getList = (type, page3) => {
        getTypeList(type, page3).then((res) => {
          list.value = res.data;
        }).catch((err) => {
          getList(type, page3);
        });
      };
      vue.onMounted(() => {
        uni.$on(props2.type, () => {
          if (list.value.length)
            return false;
          getList(props2.type, page2);
        });
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          null,
          [
            vue.unref(list).length ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "list-box-item"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(vue.unref(list), (item) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    key: item.videoId,
                    class: "list-item"
                  }, [
                    vue.createElementVNode("image", {
                      onClick: ($event) => vue.unref(toDetail)(item),
                      onLoad: ($event) => vue.unref(imageLoad)(item),
                      src: item.updateTime ? "../../static/logo2.svg" : item.cover
                    }, null, 40, ["onClick", "onLoad", "src"]),
                    vue.createElementVNode("div", { class: "footer" }, [
                      vue.createElementVNode(
                        "div",
                        null,
                        vue.toDisplayString(item.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "div",
                        null,
                        vue.toDisplayString(item.director),
                        1
                        /* TEXT */
                      )
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : vue.createCommentVNode("v-if", true),
            !vue.unref(list).length ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 1,
              class: "loading-box"
            }, [
              vue.createElementVNode("image", {
                class: "loading-img",
                src: "/static/logo2.svg"
              })
            ])) : vue.createCommentVNode("v-if", true)
          ],
          64
          /* STABLE_FRAGMENT */
        );
      };
    }
  };
  const mySwipter = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-70a4f539"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/index/swiper.vue"]]);
  const _sfc_main$m = {
    __name: "index",
    setup(__props) {
      onShow(() => {
        setFullscreen(false);
      });
      const lineBg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII=";
      let list1 = vue.ref([{
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
      let list = vue.ref([]);
      let text1 = "通告:请仔细甄别视频内网站地址,防止上当受骗,违者后果自负。需要软件定制开发VX:s9080700";
      let toDetai2 = (item) => {
        uni.navigateTo({
          url: "/pages/detail/detail?id=" + list.value[item].videoId
        });
      };
      let scrollTop = vue.ref(0);
      onPageScroll((e) => {
        scrollTop.value = e.scrollTop;
      });
      let toTop = () => {
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 500
        });
      };
      onPullDownRefresh(() => {
        getList();
        uni.stopPullDownRefresh();
      });
      let tabsCurrent = vue.ref(0);
      let swiperCurrent = vue.ref(0);
      let scrollChange = (event) => {
        tabsCurrent.value = event.detail.current;
        uni.$emit(list1.value[tabsCurrent.value].name);
        list.value = [];
        getList(list1.value[tabsCurrent.value].name);
      };
      let tabChange = (e) => {
        swiperCurrent.value = e.index;
      };
      let getList = (name = "动漫") => {
        getTypeList(name, 1).then((res) => {
          list.value = res.data;
        }).catch((err) => {
          getList(name);
        });
      };
      let searchCustom = (e) => {
        if (e.trim() !== "") {
          uni.navigateTo({
            url: "../search/search?searchValue=" + e
          });
        } else {
          msgError("输入不能为空!");
          formatAppLog("log", "at pages/index/index.vue:233", this);
        }
      };
      let updateIsShow = vue.ref(false);
      let update_contens = vue.ref([{
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
      let update_modu = vue.ref(false);
      let downloadProgress = vue.ref(0);
      let downText = vue.ref("取消下载");
      let is_down = vue.ref(false);
      let downloadTask = null;
      let down_max = vue.ref(0);
      let down_byte = vue.ref(0);
      let tempFilePath = null;
      let update_app = () => {
        update_modu.value = true;
        updateIsShow.value = false;
        is_down.value = true;
        downloadTask = uni.downloadFile({
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
              msgError("更新失败,请联系作者!");
            }
          },
          fail(err) {
            update_modu.value = false;
            msgError("下载错误:" + err);
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
        let flag2 = is_down.value;
        downText.value = flag2 ? "立即更新" : "取消下载";
        flag2 ? downloadTask.abort() : update_app();
        plus.nativeUI.toast(flag2 ? "已取消下载!" : "开始下载");
        downloadProgress.value = 0;
        is_down.value = !is_down.value;
      };
      let histPLay = vue.ref({});
      let isShowHistPLay = vue.ref(true);
      vue.onMounted(() => {
        uni.$emit(list1.value[tabsCurrent.value].name);
        getList();
        let key_ = uni.getStorageSync("update_key");
        isUpdate(key_).then((res) => {
          if (!res.data.isUpdate)
            return;
          url_ = res.data.url;
          updateIsShow.value = true;
        });
        histPLay.value = uni.getStorageSync("user_history_fiml")[0];
        setTimeout(() => {
          isShowHistPLay.value = false;
        }, 5e3);
      });
      let toDetail = () => {
        uni.navigateTo({
          url: "/pages/detail/detail?id=" + histPLay.value.videoId
        });
      };
      return (_ctx, _cache) => {
        const _component_u_search = resolveEasycom(vue.resolveDynamicComponent("u-search"), __easycom_0$5);
        const _component_u_notice_bar = resolveEasycom(vue.resolveDynamicComponent("u-notice-bar"), __easycom_1$6);
        const _component_u_sticky = resolveEasycom(vue.resolveDynamicComponent("u-sticky"), __easycom_2);
        const _component_u_swiper = resolveEasycom(vue.resolveDynamicComponent("u-swiper"), __easycom_3$3);
        const _component_u_tabs = resolveEasycom(vue.resolveDynamicComponent("u-tabs"), __easycom_4$1);
        const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_1$9);
        const _component_u__text = resolveEasycom(vue.resolveDynamicComponent("u--text"), __easycom_1$3);
        const _component_u_modal = resolveEasycom(vue.resolveDynamicComponent("u-modal"), __easycom_5);
        const _component_u_line_progress = resolveEasycom(vue.resolveDynamicComponent("u-line-progress"), __easycom_8);
        return vue.openBlock(), vue.createElementBlock("view", { class: "index-box" }, [
          vue.createVNode(_component_u_sticky, null, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", { class: "search-box" }, [
                vue.createElementVNode("image", { src: "/static/logo2.svg" }),
                vue.createElementVNode("div", { class: "search" }, [
                  vue.createVNode(_component_u_search, {
                    bgColor: "#28304c",
                    color: "white",
                    actionStyle: { color: "white" },
                    showAction: true,
                    actionText: "搜索",
                    onSearch: vue.unref(searchCustom),
                    onCustom: vue.unref(searchCustom),
                    animation: true,
                    shape: "round"
                  }, null, 8, ["onSearch", "onCustom"])
                ])
              ]),
              vue.createVNode(_component_u_notice_bar, {
                style: { "background-color": "#15191f" },
                color: "#0962EA",
                class: "custom-notice-bar",
                text: vue.unref(text1)
              }, null, 8, ["text"])
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_u_swiper, {
            onClick: vue.unref(toDetai2),
            bgColor: "#15191f",
            "show-title": "",
            previousMargin: "50",
            nextMargin: "50",
            circular: "",
            "img-mode": "aspectFill",
            height: "400",
            radius: "4",
            loading: !vue.unref(list).length,
            keyName: "cover",
            list: vue.unref(list)
          }, null, 8, ["onClick", "loading", "list"]),
          vue.createCommentVNode(" 分类列表div "),
          vue.createElementVNode("div", { class: "list-box" }, [
            vue.createVNode(_component_u_tabs, {
              onChange: vue.unref(tabChange),
              lineColor: `url(${lineBg}) 100% 100%`,
              current: vue.unref(tabsCurrent),
              activeStyle: { color: "#0962EA" },
              inactiveStyle: { color: "#606266" },
              list: vue.unref(list1)
            }, null, 8, ["onChange", "lineColor", "current", "list"]),
            vue.createElementVNode("scroll-view", {
              "scroll-y": true,
              "scroll-x": true,
              id: "swipt",
              class: "swipt"
            }, [
              vue.createElementVNode("swiper", {
                current: vue.unref(swiperCurrent),
                onChange: _cache[0] || (_cache[0] = (...args) => vue.unref(scrollChange) && vue.unref(scrollChange)(...args)),
                class: "swipt1"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(vue.unref(list1), (i) => {
                    return vue.openBlock(), vue.createElementBlock("swiper-item", null, [
                      vue.createVNode(mySwipter, {
                        type: i.name
                      }, null, 8, ["type"])
                    ]);
                  }),
                  256
                  /* UNKEYED_FRAGMENT */
                ))
              ], 40, ["current"])
            ])
          ]),
          vue.createCommentVNode(" 底部遮挡div "),
          vue.createElementVNode("div", { class: "footer-box-bottom" }),
          vue.createCommentVNode(" 返回顶部按钮 "),
          vue.unref(scrollTop) > 300 ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 0,
            onClick: _cache[1] || (_cache[1] = (...args) => vue.unref(toTop) && vue.unref(toTop)(...args)),
            class: "up_but"
          }, [
            vue.createVNode(_component_u_icon, {
              size: "20",
              name: "arrow-upward"
            })
          ])) : vue.createCommentVNode("v-if", true),
          vue.createVNode(_component_u_modal, {
            confirmColor: "#15191f",
            show: vue.unref(updateIsShow),
            onConfirm: vue.unref(update_app),
            confirmText: "立即更新",
            title: "更新提示!"
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("view", {
                class: "slot-content",
                style: { "width": "100%" }
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(vue.unref(update_contens), (i) => {
                    return vue.openBlock(), vue.createElementBlock("view", null, [
                      vue.createVNode(_component_u__text, {
                        type: "info",
                        prefixIcon: "level",
                        iconStyle: "font-size: 19px",
                        text: i.time + "更新清单如下:"
                      }, null, 8, ["text"]),
                      vue.createElementVNode("view", {
                        class: "text-in",
                        style: { "max-height": "calc(80vh - 10rem)", "overflow": "auto" }
                      }, [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList(i.content, (contentVla) => {
                            return vue.openBlock(), vue.createBlock(_component_u__text, {
                              type: "info",
                              lineHeight: "30",
                              size: "13",
                              text: contentVla
                            }, null, 8, ["text"]);
                          }),
                          256
                          /* UNKEYED_FRAGMENT */
                        )),
                        vue.createElementVNode("view", { class: "footer_thore" }, [
                          vue.createVNode(_component_u__text, {
                            align: "right",
                            type: "primary",
                            lineHeight: "30",
                            size: "13",
                            text: i.footer + i.time
                          }, null, 8, ["text"])
                        ])
                      ])
                    ]);
                  }),
                  256
                  /* UNKEYED_FRAGMENT */
                ))
              ])
            ]),
            _: 1
            /* STABLE */
          }, 8, ["show", "onConfirm"]),
          vue.createVNode(_component_u_modal, {
            show: vue.unref(update_modu),
            title: "苍穹影视更新",
            confirmText: vue.unref(downText),
            onConfirm: vue.unref(down_abort)
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("view", {
                class: "slot-content",
                style: { "width": "100%" }
              }, [
                vue.createVNode(_component_u__text, {
                  type: "primary",
                  size: "13",
                  text: "总大小" + vue.unref(down_max) + "MB"
                }, null, 8, ["text"]),
                vue.createVNode(_component_u__text, {
                  type: "success",
                  size: "13",
                  text: "已下载" + vue.unref(down_byte) + "MB"
                }, null, 8, ["text"]),
                vue.createVNode(_component_u_line_progress, {
                  percentage: vue.unref(downloadProgress),
                  activeColor: "#73cf45"
                }, null, 8, ["percentage"])
              ])
            ]),
            _: 1
            /* STABLE */
          }, 8, ["show", "confirmText", "onConfirm"]),
          vue.createCommentVNode(" 上次观看 "),
          vue.createElementVNode(
            "view",
            {
              style: vue.normalizeStyle({ "right": vue.unref(isShowHistPLay) ? "0px" : "-10rem" }),
              class: "last_viewed",
              onClick: _cache[2] || (_cache[2] = (...args) => vue.unref(toDetail) && vue.unref(toDetail)(...args))
            },
            [
              vue.createElementVNode("img", {
                src: vue.unref(histPLay).cover,
                alt: ""
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "last_info_box" }, [
                vue.createElementVNode(
                  "span",
                  { class: "fiml_name fi" },
                  vue.toDisplayString(vue.unref(histPLay).title),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "fiml_title fi" }, [
                  vue.createTextVNode("点击"),
                  vue.createElementVNode("span", { class: "active_" }, "继续观看")
                ])
              ])
            ],
            4
            /* STYLE */
          )
        ]);
      };
    }
  };
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-1cf27b2a"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/index/index.vue"]]);
  const props$8 = {
    props: {
      // 内置图标名称，或图片路径，建议绝对路径
      icon: {
        type: String,
        default: props$v.empty.icon
      },
      // 提示文字
      text: {
        type: String,
        default: props$v.empty.text
      },
      // 文字颜色
      textColor: {
        type: String,
        default: props$v.empty.textColor
      },
      // 文字大小
      textSize: {
        type: [String, Number],
        default: props$v.empty.textSize
      },
      // 图标的颜色
      iconColor: {
        type: String,
        default: props$v.empty.iconColor
      },
      // 图标的大小
      iconSize: {
        type: [String, Number],
        default: props$v.empty.iconSize
      },
      // 选择预置的图标类型
      mode: {
        type: String,
        default: props$v.empty.mode
      },
      //  图标宽度，单位px
      width: {
        type: [String, Number],
        default: props$v.empty.width
      },
      // 图标高度，单位px
      height: {
        type: [String, Number],
        default: props$v.empty.height
      },
      // 是否显示组件
      show: {
        type: Boolean,
        default: props$v.empty.show
      },
      // 组件距离上一个元素之间的距离，默认px单位
      marginTop: {
        type: [String, Number],
        default: props$v.empty.marginTop
      }
    }
  };
  const _sfc_main$l = {
    name: "u-empty",
    mixins: [mpMixin, mixin, props$8],
    data() {
      return {
        icons: {
          car: "购物车为空",
          page: "页面不存在",
          search: "没有搜索结果",
          address: "没有收货地址",
          wifi: "没有WiFi",
          order: "订单为空",
          coupon: "没有优惠券",
          favor: "暂无收藏",
          permission: "无权限",
          history: "无历史记录",
          news: "无新闻列表",
          message: "消息列表为空",
          list: "列表为空",
          data: "数据为空",
          comment: "暂无评论"
        }
      };
    },
    computed: {
      // 组件样式
      emptyStyle() {
        const style = {};
        style.marginTop = uni.$u.addUnit(this.marginTop);
        return uni.$u.deepMerge(uni.$u.addStyle(this.customStyle), style);
      },
      // 文本样式
      textStyle() {
        const style = {};
        style.color = this.textColor;
        style.fontSize = uni.$u.addUnit(this.textSize);
        return style;
      },
      // 判断icon是否图片路径
      isSrc() {
        return this.icon.indexOf("/") >= 0;
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_1$9);
    return _ctx.show ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: "u-empty",
        style: vue.normalizeStyle([$options.emptyStyle])
      },
      [
        !$options.isSrc ? (vue.openBlock(), vue.createBlock(_component_u_icon, {
          key: 0,
          name: _ctx.mode === "message" ? "chat" : `empty-${_ctx.mode}`,
          size: _ctx.iconSize,
          color: _ctx.iconColor,
          "margin-top": "14"
        }, null, 8, ["name", "size", "color"])) : (vue.openBlock(), vue.createElementBlock("image", {
          key: 1,
          style: vue.normalizeStyle({
            width: _ctx.$u.addUnit(_ctx.width),
            height: _ctx.$u.addUnit(_ctx.height)
          }),
          src: _ctx.icon,
          mode: "widthFix"
        }, null, 12, ["src"])),
        vue.createElementVNode(
          "text",
          {
            class: "u-empty__text",
            style: vue.normalizeStyle([$options.textStyle])
          },
          vue.toDisplayString(_ctx.text ? _ctx.text : $data.icons[_ctx.mode]),
          5
          /* TEXT, STYLE */
        ),
        _ctx.$slots.default || _ctx.$slots.$default ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "u-empty__wrap"
        }, [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ])) : vue.createCommentVNode("v-if", true)
      ],
      4
      /* STYLE */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$c], ["__scopeId", "data-v-8dd5928e"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-empty/u-empty.vue"]]);
  const props$7 = {
    props: {
      // 绑定的值
      modelValue: {
        type: [String, Number],
        default: props$v.input.value
      },
      // number-数字输入键盘，app-vue下可以输入浮点数，app-nvue和小程序平台下只能输入整数
      // idcard-身份证输入键盘，微信、支付宝、百度、QQ小程序
      // digit-带小数点的数字键盘，App的nvue页面、微信、支付宝、百度、头条、QQ小程序
      // text-文本输入键盘
      type: {
        type: String,
        default: props$v.input.type
      },
      // 如果 textarea 是在一个 position:fixed 的区域，需要显示指定属性 fixed 为 true，
      // 兼容性：微信小程序、百度小程序、字节跳动小程序、QQ小程序
      fixed: {
        type: Boolean,
        default: props$v.input.fixed
      },
      // 是否禁用输入框
      disabled: {
        type: Boolean,
        default: props$v.input.disabled
      },
      // 禁用状态时的背景色
      disabledColor: {
        type: String,
        default: props$v.input.disabledColor
      },
      // 是否显示清除控件
      clearable: {
        type: Boolean,
        default: props$v.input.clearable
      },
      // 是否密码类型
      password: {
        type: Boolean,
        default: props$v.input.password
      },
      // 最大输入长度，设置为 -1 的时候不限制最大长度
      maxlength: {
        type: [String, Number],
        default: props$v.input.maxlength
      },
      // 	输入框为空时的占位符
      placeholder: {
        type: String,
        default: props$v.input.placeholder
      },
      // 指定placeholder的样式类，注意页面或组件的style中写了scoped时，需要在类名前写/deep/
      placeholderClass: {
        type: String,
        default: props$v.input.placeholderClass
      },
      // 指定placeholder的样式
      placeholderStyle: {
        type: [String, Object],
        default: props$v.input.placeholderStyle
      },
      // 是否显示输入字数统计，只在 type ="text"或type ="textarea"时有效
      showWordLimit: {
        type: Boolean,
        default: props$v.input.showWordLimit
      },
      // 设置右下角按钮的文字，有效值：send|search|next|go|done，兼容性详见uni-app文档
      // https://uniapp.dcloud.io/component/input
      // https://uniapp.dcloud.io/component/textarea
      confirmType: {
        type: String,
        default: props$v.input.confirmType
      },
      // 点击键盘右下角按钮时是否保持键盘不收起，H5无效
      confirmHold: {
        type: Boolean,
        default: props$v.input.confirmHold
      },
      // focus时，点击页面的时候不收起键盘，微信小程序有效
      holdKeyboard: {
        type: Boolean,
        default: props$v.input.holdKeyboard
      },
      // 自动获取焦点
      // 在 H5 平台能否聚焦以及软键盘是否跟随弹出，取决于当前浏览器本身的实现。nvue 页面不支持，需使用组件的 focus()、blur() 方法控制焦点
      focus: {
        type: Boolean,
        default: props$v.input.focus
      },
      // 键盘收起时，是否自动失去焦点，目前仅App3.0.0+有效
      autoBlur: {
        type: Boolean,
        default: props$v.input.autoBlur
      },
      // 是否去掉 iOS 下的默认内边距，仅微信小程序，且type=textarea时有效
      disableDefaultPadding: {
        type: Boolean,
        default: props$v.input.disableDefaultPadding
      },
      // 指定focus时光标的位置
      cursor: {
        type: [String, Number],
        default: props$v.input.cursor
      },
      // 输入框聚焦时底部与键盘的距离
      cursorSpacing: {
        type: [String, Number],
        default: props$v.input.cursorSpacing
      },
      // 光标起始位置，自动聚集时有效，需与selection-end搭配使用
      selectionStart: {
        type: [String, Number],
        default: props$v.input.selectionStart
      },
      // 光标结束位置，自动聚集时有效，需与selection-start搭配使用
      selectionEnd: {
        type: [String, Number],
        default: props$v.input.selectionEnd
      },
      // 键盘弹起时，是否自动上推页面
      adjustPosition: {
        type: Boolean,
        default: props$v.input.adjustPosition
      },
      // 输入框内容对齐方式，可选值为：left|center|right
      inputAlign: {
        type: String,
        default: props$v.input.inputAlign
      },
      // 输入框字体的大小
      fontSize: {
        type: [String, Number],
        default: props$v.input.fontSize
      },
      // 输入框字体颜色
      color: {
        type: String,
        default: props$v.input.color
      },
      // 输入框前置图标
      prefixIcon: {
        type: String,
        default: props$v.input.prefixIcon
      },
      // 前置图标样式，对象或字符串
      prefixIconStyle: {
        type: [String, Object],
        default: props$v.input.prefixIconStyle
      },
      // 输入框后置图标
      suffixIcon: {
        type: String,
        default: props$v.input.suffixIcon
      },
      // 后置图标样式，对象或字符串
      suffixIconStyle: {
        type: [String, Object],
        default: props$v.input.suffixIconStyle
      },
      // 边框类型，surround-四周边框，bottom-底部边框，none-无边框
      border: {
        type: String,
        default: props$v.input.border
      },
      // 是否只读，与disabled不同之处在于disabled会置灰组件，而readonly则不会
      readonly: {
        type: Boolean,
        default: props$v.input.readonly
      },
      // 输入框形状，circle-圆形，square-方形
      shape: {
        type: String,
        default: props$v.input.shape
      },
      // 用于处理或者过滤输入框内容的方法
      formatter: {
        type: [Function, null],
        default: props$v.input.formatter
      },
      // 是否忽略组件内对文本合成系统事件的处理
      ignoreCompositionEvent: {
        type: Boolean,
        default: true
      }
    }
  };
  const _sfc_main$k = {
    name: "u-input",
    mixins: [mpMixin, mixin, props$7],
    data() {
      return {
        // 输入框的值
        innerValue: "",
        // 是否处于获得焦点状态
        focused: false,
        // value是否第一次变化，在watch中，由于加入immediate属性，会在第一次触发，此时不应该认为value发生了变化
        firstChange: true,
        // value绑定值的变化是由内部还是外部引起的
        changeFromInner: false,
        // 过滤处理方法
        innerFormatter: (value2) => value2
      };
    },
    watch: {
      modelValue: {
        immediate: true,
        handler(newVal, oldVal) {
          this.innerValue = newVal;
          this.firstChange = false;
          this.changeFromInner = false;
        }
      }
    },
    computed: {
      // 是否显示清除控件
      isShowClear() {
        const { clearable, readonly, focused, innerValue } = this;
        return !!clearable && !readonly && !!focused && innerValue !== "";
      },
      // 组件的类名
      inputClass() {
        let classes = [], { border, disabled, shape } = this;
        border === "surround" && (classes = classes.concat(["u-border", "u-input--radius"]));
        classes.push(`u-input--${shape}`);
        border === "bottom" && (classes = classes.concat([
          "u-border-bottom",
          "u-input--no-radius"
        ]));
        return classes.join(" ");
      },
      // 组件的样式
      wrapperStyle() {
        const style = {};
        if (this.disabled) {
          style.backgroundColor = this.disabledColor;
        }
        if (this.border === "none") {
          style.padding = "0";
        } else {
          style.paddingTop = "6px";
          style.paddingBottom = "6px";
          style.paddingLeft = "9px";
          style.paddingRight = "9px";
        }
        return uni.$u.deepMerge(style, uni.$u.addStyle(this.customStyle));
      },
      // 输入框的样式
      inputStyle() {
        const style = {
          color: this.color,
          fontSize: uni.$u.addUnit(this.fontSize),
          textAlign: this.inputAlign
        };
        return style;
      }
    },
    emits: ["update:modelValue", "focus", "blur", "change", "confirm", "clear", "keyboardheightchange"],
    methods: {
      // 在微信小程序中，不支持将函数当做props参数，故只能通过ref形式调用
      setFormatter(e) {
        this.innerFormatter = e;
      },
      // 当键盘输入时，触发input事件
      onInput(e) {
        let { value: value2 = "" } = e.detail || {};
        const formatter = this.formatter || this.innerFormatter;
        const formatValue = formatter(value2);
        this.innerValue = value2;
        this.$nextTick(() => {
          this.innerValue = formatValue;
          this.valueChange();
        });
      },
      // 输入框失去焦点时触发
      onBlur(event) {
        this.$emit("blur", event.detail.value);
        uni.$u.sleep(50).then(() => {
          this.focused = false;
        });
        uni.$u.formValidate(this, "blur");
      },
      // 输入框聚焦时触发
      onFocus(event) {
        this.focused = true;
        this.$emit("focus");
      },
      // 点击完成按钮时触发
      onConfirm(event) {
        this.$emit("confirm", this.innerValue);
      },
      // 键盘高度发生变化的时候触发此事件
      // 兼容性：微信小程序2.7.0+、App 3.1.0+
      onkeyboardheightchange() {
        this.$emit("keyboardheightchange");
      },
      // 内容发生变化，进行处理
      valueChange() {
        const value2 = this.innerValue;
        this.$nextTick(() => {
          this.$emit("update:modelValue", value2);
          this.changeFromInner = true;
          this.$emit("change", value2);
          uni.$u.formValidate(this, "change");
        });
      },
      // 点击清除控件
      onClear() {
        this.innerValue = "";
        this.$nextTick(() => {
          this.valueChange();
          this.$emit("clear");
        });
      },
      /**
       * 在安卓nvue上，事件无法冒泡
       * 在某些时间，我们希望监听u-from-item的点击事件，此时会导致点击u-form-item内的u-input后
       * 无法触发u-form-item的点击事件，这里通过手动调用u-form-item的方法进行触发
       */
      clickHandler() {
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_1$9);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["u-input", $options.inputClass]),
        style: vue.normalizeStyle([$options.wrapperStyle])
      },
      [
        vue.createElementVNode("view", { class: "u-input__content" }, [
          _ctx.prefixIcon || _ctx.$slots.prefix ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "u-input__content__prefix-icon"
          }, [
            vue.renderSlot(_ctx.$slots, "prefix", {}, () => [
              vue.createVNode(_component_u_icon, {
                name: _ctx.prefixIcon,
                size: "18",
                customStyle: _ctx.prefixIconStyle
              }, null, 8, ["name", "customStyle"])
            ], true)
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", {
            class: "u-input__content__field-wrapper",
            onClick: _cache[5] || (_cache[5] = (...args) => $options.clickHandler && $options.clickHandler(...args))
          }, [
            vue.createCommentVNode(" 根据uni-app的input组件文档，H5和APP中只要声明了password参数(无论true还是false)，type均失效，此时\n					为了防止type=number时，又存在password属性，type无效，此时需要设置password为undefined\n				 "),
            vue.createElementVNode("input", {
              class: "u-input__content__field-wrapper__field",
              style: vue.normalizeStyle([$options.inputStyle]),
              type: _ctx.type,
              focus: _ctx.focus,
              cursor: _ctx.cursor,
              value: $data.innerValue,
              "auto-blur": _ctx.autoBlur,
              disabled: _ctx.disabled || _ctx.readonly,
              maxlength: _ctx.maxlength,
              placeholder: _ctx.placeholder,
              "placeholder-style": _ctx.placeholderStyle,
              "placeholder-class": _ctx.placeholderClass,
              "confirm-type": _ctx.confirmType,
              "confirm-hold": _ctx.confirmHold,
              "hold-keyboard": _ctx.holdKeyboard,
              "cursor-spacing": _ctx.cursorSpacing,
              "adjust-position": _ctx.adjustPosition,
              "selection-end": _ctx.selectionEnd,
              "selection-start": _ctx.selectionStart,
              password: _ctx.password || _ctx.type === "password" || void 0,
              ignoreCompositionEvent: _ctx.ignoreCompositionEvent,
              onInput: _cache[0] || (_cache[0] = (...args) => $options.onInput && $options.onInput(...args)),
              onBlur: _cache[1] || (_cache[1] = (...args) => $options.onBlur && $options.onBlur(...args)),
              onFocus: _cache[2] || (_cache[2] = (...args) => $options.onFocus && $options.onFocus(...args)),
              onConfirm: _cache[3] || (_cache[3] = (...args) => $options.onConfirm && $options.onConfirm(...args)),
              onKeyboardheightchange: _cache[4] || (_cache[4] = (...args) => $options.onkeyboardheightchange && $options.onkeyboardheightchange(...args))
            }, null, 44, ["type", "focus", "cursor", "value", "auto-blur", "disabled", "maxlength", "placeholder", "placeholder-style", "placeholder-class", "confirm-type", "confirm-hold", "hold-keyboard", "cursor-spacing", "adjust-position", "selection-end", "selection-start", "password", "ignoreCompositionEvent"])
          ]),
          $options.isShowClear ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "u-input__content__clear",
            onClick: _cache[6] || (_cache[6] = (...args) => $options.onClear && $options.onClear(...args))
          }, [
            vue.createVNode(_component_u_icon, {
              name: "close",
              size: "11",
              color: "#ffffff",
              customStyle: "line-height: 12px"
            })
          ])) : vue.createCommentVNode("v-if", true),
          _ctx.suffixIcon || _ctx.$slots.suffix ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "u-input__content__subfix-icon"
          }, [
            vue.renderSlot(_ctx.$slots, "suffix", {}, () => [
              vue.createVNode(_component_u_icon, {
                name: _ctx.suffixIcon,
                size: "18",
                customStyle: _ctx.suffixIconStyle
              }, null, 8, ["name", "customStyle"])
            ], true)
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const uvInput = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$b], ["__scopeId", "data-v-df79975b"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-input/u-input.vue"]]);
  const _sfc_main$j = {
    name: "u--input",
    mixins: [mpMixin, props$7, mixin],
    components: {
      uvInput
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uvInput = vue.resolveComponent("uvInput");
    return vue.openBlock(), vue.createBlock(_component_uvInput, {
      modelValue: _ctx.modelValue,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = (e) => _ctx.$emit("update:modelValue", e)),
      type: _ctx.type,
      fixed: _ctx.fixed,
      disabled: _ctx.disabled,
      disabledColor: _ctx.disabledColor,
      clearable: _ctx.clearable,
      password: _ctx.password,
      maxlength: _ctx.maxlength,
      placeholder: _ctx.placeholder,
      placeholderClass: _ctx.placeholderClass,
      placeholderStyle: _ctx.placeholderStyle,
      showWordLimit: _ctx.showWordLimit,
      confirmType: _ctx.confirmType,
      confirmHold: _ctx.confirmHold,
      holdKeyboard: _ctx.holdKeyboard,
      focus: _ctx.focus,
      autoBlur: _ctx.autoBlur,
      disableDefaultPadding: _ctx.disableDefaultPadding,
      cursor: _ctx.cursor,
      cursorSpacing: _ctx.cursorSpacing,
      selectionStart: _ctx.selectionStart,
      selectionEnd: _ctx.selectionEnd,
      adjustPosition: _ctx.adjustPosition,
      inputAlign: _ctx.inputAlign,
      fontSize: _ctx.fontSize,
      color: _ctx.color,
      prefixIcon: _ctx.prefixIcon,
      suffixIcon: _ctx.suffixIcon,
      suffixIconStyle: _ctx.suffixIconStyle,
      prefixIconStyle: _ctx.prefixIconStyle,
      border: _ctx.border,
      readonly: _ctx.readonly,
      shape: _ctx.shape,
      customStyle: _ctx.customStyle,
      formatter: _ctx.formatter,
      ignoreCompositionEvent: _ctx.ignoreCompositionEvent
    }, {
      default: vue.withCtx(() => [
        vue.renderSlot(_ctx.$slots, "prefix", { slot: "prefix" }),
        vue.renderSlot(_ctx.$slots, "suffix", { slot: "suffix" })
      ]),
      _: 3
      /* FORWARDED */
    }, 8, ["modelValue", "type", "fixed", "disabled", "disabledColor", "clearable", "password", "maxlength", "placeholder", "placeholderClass", "placeholderStyle", "showWordLimit", "confirmType", "confirmHold", "holdKeyboard", "focus", "autoBlur", "disableDefaultPadding", "cursor", "cursorSpacing", "selectionStart", "selectionEnd", "adjustPosition", "inputAlign", "fontSize", "color", "prefixIcon", "suffixIcon", "suffixIconStyle", "prefixIconStyle", "border", "readonly", "shape", "customStyle", "formatter", "ignoreCompositionEvent"]);
  }
  const __easycom_3$2 = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$a], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u--input/u--input.vue"]]);
  const props$6 = {
    props: {
      // 用于v-model双向绑定选中的星星数量
      modelValue: {
        type: [String, Number],
        default: props$v.rate.value
      },
      // 要显示的星星数量
      count: {
        type: [String, Number],
        default: props$v.rate.count
      },
      // 是否不可选中
      disabled: {
        type: Boolean,
        default: props$v.rate.disabled
      },
      // 是否只读
      readonly: {
        type: Boolean,
        default: props$v.rate.readonly
      },
      // 星星的大小，单位px
      size: {
        type: [String, Number],
        default: props$v.rate.size
      },
      // 未选中时的颜色
      inactiveColor: {
        type: String,
        default: props$v.rate.inactiveColor
      },
      // 选中的颜色
      activeColor: {
        type: String,
        default: props$v.rate.activeColor
      },
      // 星星之间的间距，单位px
      gutter: {
        type: [String, Number],
        default: props$v.rate.gutter
      },
      // 最少能选择的星星个数
      minCount: {
        type: [String, Number],
        default: props$v.rate.minCount
      },
      // 是否允许半星
      allowHalf: {
        type: Boolean,
        default: props$v.rate.allowHalf
      },
      // 选中时的图标(星星)
      activeIcon: {
        type: String,
        default: props$v.rate.activeIcon
      },
      // 未选中时的图标(星星)
      inactiveIcon: {
        type: String,
        default: props$v.rate.inactiveIcon
      },
      // 是否可以通过滑动手势选择评分
      touchable: {
        type: Boolean,
        default: props$v.rate.touchable
      }
    }
  };
  const _sfc_main$i = {
    name: "u-rate",
    mixins: [mpMixin, mixin, props$6],
    data() {
      return {
        // 生成一个唯一id，否则一个页面多个评分组件，会造成冲突
        elId: uni.$u.guid(),
        elClass: uni.$u.guid(),
        rateBoxLeft: 0,
        // 评分盒子左边到屏幕左边的距离，用于滑动选择时计算距离
        activeIndex: this.modelValue,
        rateWidth: 0,
        // 每个星星的宽度
        // 标识是否正在滑动，由于iOS事件上touch比click先触发，导致快速滑动结束后，接着触发click，导致事件混乱而出错
        moving: false
      };
    },
    watch: {
      modelValue(val) {
        this.activeIndex = val;
      },
      activeIndex: "emitEvent"
    },
    emits: ["update:modelValue", "change"],
    methods: {
      init() {
        uni.$u.sleep().then(() => {
          this.getRateItemRect();
          this.getRateIconWrapRect();
        });
      },
      // 获取评分组件盒子的布局信息
      async getRateItemRect() {
        await uni.$u.sleep();
        this.$uGetRect("#" + this.elId).then((res) => {
          this.rateBoxLeft = res.left;
        });
      },
      // 获取单个星星的尺寸
      getRateIconWrapRect() {
        this.$uGetRect("." + this.elClass).then((res) => {
          this.rateWidth = res.width;
        });
      },
      // 手指滑动
      touchMove(e) {
        if (!this.touchable) {
          return;
        }
        this.preventEvent(e);
        const x = e.changedTouches[0].pageX;
        this.getActiveIndex(x);
      },
      // 停止滑动
      touchEnd(e) {
        if (!this.touchable) {
          return;
        }
        this.preventEvent(e);
        const x = e.changedTouches[0].pageX;
        this.getActiveIndex(x);
      },
      // 通过点击，直接选中
      clickHandler(e, index2) {
        if (uni.$u.os() === "ios" && this.moving) {
          return;
        }
        this.preventEvent(e);
        let x = 0;
        x = e.changedTouches[0].pageX;
        this.getActiveIndex(x, true);
      },
      // 发出事件
      emitEvent() {
        this.$emit("change", this.activeIndex);
        this.$emit("update:modelValue", this.activeIndex);
      },
      // 获取当前激活的评分图标
      getActiveIndex(x, isClick = false) {
        if (this.disabled || this.readonly) {
          return;
        }
        const allRateWidth = this.rateWidth * this.count + this.rateBoxLeft;
        x = uni.$u.range(this.rateBoxLeft, allRateWidth, x) - this.rateBoxLeft;
        const distance = x;
        let index2;
        if (this.allowHalf) {
          index2 = Math.floor(distance / this.rateWidth);
          const decimal = distance % this.rateWidth;
          if (decimal <= this.rateWidth / 2 && decimal > 0) {
            index2 += 0.5;
          } else if (decimal > this.rateWidth / 2) {
            index2++;
          }
        } else {
          index2 = Math.floor(distance / this.rateWidth);
          const decimal = distance % this.rateWidth;
          if (isClick) {
            if (decimal > 0)
              index2++;
          } else {
            if (decimal > this.rateWidth / 2)
              index2++;
          }
        }
        this.activeIndex = Math.min(index2, this.count);
        if (this.activeIndex < this.minCount) {
          this.activeIndex = this.minCount;
        }
        setTimeout(() => {
          this.moving = true;
        }, 10);
        setTimeout(() => {
          this.moving = false;
        }, 10);
      }
    },
    mounted() {
      this.init();
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_1$9);
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "u-rate",
      id: $data.elId,
      ref: "u-rate",
      style: vue.normalizeStyle([_ctx.$u.addStyle(_ctx.customStyle)])
    }, [
      vue.createElementVNode(
        "view",
        {
          class: "u-rate__content",
          onTouchmove: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.touchMove && $options.touchMove(...args), ["stop"])),
          onTouchend: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.touchEnd && $options.touchEnd(...args), ["stop"]))
        },
        [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(Number(_ctx.count), (item, index2) => {
              return vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  class: vue.normalizeClass(["u-rate__content__item", [$data.elClass]]),
                  key: index2
                },
                [
                  vue.createElementVNode("view", {
                    class: "u-rate__content__item__icon-wrap",
                    ref_for: true,
                    ref: "u-rate__content__item__icon-wrap",
                    onClick: vue.withModifiers(($event) => $options.clickHandler($event, index2 + 1), ["stop"])
                  }, [
                    vue.createVNode(_component_u_icon, {
                      name: Math.floor($data.activeIndex) > index2 ? _ctx.activeIcon : _ctx.inactiveIcon,
                      color: _ctx.disabled ? "#c8c9cc" : Math.floor($data.activeIndex) > index2 ? _ctx.activeColor : _ctx.inactiveColor,
                      "custom-style": {
                        padding: `0 ${_ctx.$u.addUnit(_ctx.gutter / 2)}`
                      },
                      size: _ctx.size
                    }, null, 8, ["name", "color", "custom-style", "size"])
                  ], 8, ["onClick"]),
                  _ctx.allowHalf ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    onClick: vue.withModifiers(($event) => $options.clickHandler($event, index2 + 1), ["stop"]),
                    class: "u-rate__content__item__icon-wrap u-rate__content__item__icon-wrap--half",
                    style: vue.normalizeStyle([{
                      width: _ctx.$u.addUnit($data.rateWidth / 2)
                    }]),
                    ref_for: true,
                    ref: "u-rate__content__item__icon-wrap"
                  }, [
                    vue.createVNode(_component_u_icon, {
                      name: Math.ceil($data.activeIndex) > index2 ? _ctx.activeIcon : _ctx.inactiveIcon,
                      color: _ctx.disabled ? "#c8c9cc" : Math.ceil($data.activeIndex) > index2 ? _ctx.activeColor : _ctx.inactiveColor,
                      "custom-style": {
                        padding: `0 ${_ctx.$u.addUnit(_ctx.gutter / 2)}`
                      },
                      size: _ctx.size
                    }, null, 8, ["name", "color", "custom-style", "size"])
                  ], 12, ["onClick"])) : vue.createCommentVNode("v-if", true)
                ],
                2
                /* CLASS */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ],
        32
        /* HYDRATE_EVENTS */
      )
    ], 12, ["id"]);
  }
  const __easycom_4 = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$9], ["__scopeId", "data-v-69a384ee"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-rate/u-rate.vue"]]);
  const props$5 = {
    props: {
      // 头像图片路径(不能为相对路径)
      src: {
        type: String,
        default: props$v.avatar.src
      },
      // 头像形状，circle-圆形，square-方形
      shape: {
        type: String,
        default: props$v.avatar.shape
      },
      // 头像尺寸
      size: {
        type: [String, Number],
        default: props$v.avatar.size
      },
      // 裁剪模式
      mode: {
        type: String,
        default: props$v.avatar.mode
      },
      // 显示的文字
      text: {
        type: String,
        default: props$v.avatar.text
      },
      // 背景色
      bgColor: {
        type: String,
        default: props$v.avatar.bgColor
      },
      // 文字颜色
      color: {
        type: String,
        default: props$v.avatar.color
      },
      // 文字大小
      fontSize: {
        type: [String, Number],
        default: props$v.avatar.fontSize
      },
      // 显示的图标
      icon: {
        type: String,
        default: props$v.avatar.icon
      },
      // 显示小程序头像，只对百度，微信，QQ小程序有效
      mpAvatar: {
        type: Boolean,
        default: props$v.avatar.mpAvatar
      },
      // 是否使用随机背景色
      randomBgColor: {
        type: Boolean,
        default: props$v.avatar.randomBgColor
      },
      // 加载失败的默认头像(组件有内置默认图片)
      defaultUrl: {
        type: String,
        default: props$v.avatar.defaultUrl
      },
      // 如果配置了randomBgColor为true，且配置了此值，则从默认的背景色数组中取出对应索引的颜色值，取值0-19之间
      colorIndex: {
        type: [String, Number],
        // 校验参数规则，索引在0-19之间
        validator(n) {
          return uni.$u.test.range(n, [0, 19]) || n === "";
        },
        default: props$v.avatar.colorIndex
      },
      // 组件标识符
      name: {
        type: String,
        default: props$v.avatar.name
      }
    }
  };
  const base64Avatar = "data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjREMEQwRkY0RjgwNDExRUE5OTY2RDgxODY3NkJFODMxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjREMEQwRkY1RjgwNDExRUE5OTY2RDgxODY3NkJFODMxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEQwRDBGRjJGODA0MTFFQTk5NjZEODE4Njc2QkU4MzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEQwRDBGRjNGODA0MTFFQTk5NjZEODE4Njc2QkU4MzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYG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";
  const _sfc_main$h = {
    name: "u-avatar",
    mixins: [mpMixin, mixin, props$5],
    data() {
      return {
        // 如果配置randomBgColor参数为true，在图标或者文字的模式下，会随机从中取出一个颜色值当做背景色
        colors: [
          "#ffb34b",
          "#f2bba9",
          "#f7a196",
          "#f18080",
          "#88a867",
          "#bfbf39",
          "#89c152",
          "#94d554",
          "#f19ec2",
          "#afaae4",
          "#e1b0df",
          "#c38cc1",
          "#72dcdc",
          "#9acdcb",
          "#77b1cc",
          "#448aca",
          "#86cefa",
          "#98d1ee",
          "#73d1f1",
          "#80a7dc"
        ],
        avatarUrl: this.src,
        allowMp: false
      };
    },
    watch: {
      // 监听头像src的变化，赋值给内部的avatarUrl变量，因为图片加载失败时，需要修改图片的src为默认值
      // 而组件内部不能直接修改props的值，所以需要一个中间变量
      src: {
        immediate: true,
        handler(newVal) {
          this.avatarUrl = newVal;
          if (!newVal) {
            this.errorHandler();
          }
        }
      }
    },
    computed: {
      imageStyle() {
        const style = {};
        return style;
      }
    },
    created() {
      this.init();
    },
    methods: {
      init() {
      },
      // 判断传入的name属性，是否图片路径，只要带有"/"均认为是图片形式
      isImg() {
        return this.src.indexOf("/") !== -1;
      },
      // 图片加载时失败时触发
      errorHandler() {
        this.avatarUrl = this.defaultUrl || base64Avatar;
      },
      clickHandler() {
        this.$emit("click", this.name);
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_1$9);
    const _component_u__text = resolveEasycom(vue.resolveDynamicComponent("u--text"), __easycom_1$3);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["u-avatar", [`u-avatar--${_ctx.shape}`]]),
        style: vue.normalizeStyle([{
          backgroundColor: _ctx.text || _ctx.icon ? _ctx.randomBgColor ? $data.colors[_ctx.colorIndex !== "" ? _ctx.colorIndex : _ctx.$u.random(0, 19)] : _ctx.bgColor : "transparent",
          width: _ctx.$u.addUnit(_ctx.size),
          height: _ctx.$u.addUnit(_ctx.size)
        }, _ctx.$u.addStyle(_ctx.customStyle)]),
        onClick: _cache[1] || (_cache[1] = (...args) => $options.clickHandler && $options.clickHandler(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          _ctx.mpAvatar && $data.allowMp ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 0 },
            [],
            64
            /* STABLE_FRAGMENT */
          )) : _ctx.icon ? (vue.openBlock(), vue.createBlock(_component_u_icon, {
            key: 1,
            name: _ctx.icon,
            size: _ctx.fontSize,
            color: _ctx.color
          }, null, 8, ["name", "size", "color"])) : _ctx.text ? (vue.openBlock(), vue.createBlock(_component_u__text, {
            key: 2,
            text: _ctx.text,
            size: _ctx.fontSize,
            color: _ctx.color,
            align: "center",
            customStyle: "justify-content: center"
          }, null, 8, ["text", "size", "color"])) : (vue.openBlock(), vue.createElementBlock("image", {
            key: 3,
            class: vue.normalizeClass(["u-avatar__image", [`u-avatar__image--${_ctx.shape}`]]),
            src: $data.avatarUrl || _ctx.defaultUrl,
            mode: _ctx.mode,
            onError: _cache[0] || (_cache[0] = (...args) => $options.errorHandler && $options.errorHandler(...args)),
            style: vue.normalizeStyle([{
              width: _ctx.$u.addUnit(_ctx.size),
              height: _ctx.$u.addUnit(_ctx.size)
            }])
          }, null, 46, ["src", "mode"]))
        ], true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_6 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$8], ["__scopeId", "data-v-34d954f9"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-avatar/u-avatar.vue"]]);
  const props$4 = {
    props: {
      // 背景颜色（默认transparent）
      bgColor: {
        type: String,
        default: props$v.gap.bgColor
      },
      // 分割槽高度，单位px（默认30）
      height: {
        type: [String, Number],
        default: props$v.gap.height
      },
      // 与上一个组件的距离
      marginTop: {
        type: [String, Number],
        default: props$v.gap.marginTop
      },
      // 与下一个组件的距离
      marginBottom: {
        type: [String, Number],
        default: props$v.gap.marginBottom
      }
    }
  };
  const _sfc_main$g = {
    name: "u-gap",
    mixins: [mpMixin, mixin, props$4],
    computed: {
      gapStyle() {
        const style = {
          backgroundColor: this.bgColor,
          height: uni.$u.addUnit(this.height),
          marginTop: uni.$u.addUnit(this.marginTop),
          marginBottom: uni.$u.addUnit(this.marginBottom)
        };
        return uni.$u.deepMerge(style, uni.$u.addStyle(this.customStyle));
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "u-gap",
        style: vue.normalizeStyle([$options.gapStyle])
      },
      null,
      4
      /* STYLE */
    );
  }
  const __easycom_3$1 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$7], ["__scopeId", "data-v-6fe44ee6"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-gap/u-gap.vue"]]);
  const props$3 = {
    props: {
      // 操作菜单是否展示 （默认false）
      show: {
        type: Boolean,
        default: props$v.actionSheet.show
      },
      // 标题
      title: {
        type: String,
        default: props$v.actionSheet.title
      },
      // 选项上方的描述信息
      description: {
        type: String,
        default: props$v.actionSheet.description
      },
      // 数据
      actions: {
        type: Array,
        default: props$v.actionSheet.actions
      },
      // 取消按钮的文字，不为空时显示按钮
      cancelText: {
        type: String,
        default: props$v.actionSheet.cancelText
      },
      // 点击某个菜单项时是否关闭弹窗
      closeOnClickAction: {
        type: Boolean,
        default: props$v.actionSheet.closeOnClickAction
      },
      // 处理底部安全区（默认true）
      safeAreaInsetBottom: {
        type: Boolean,
        default: props$v.actionSheet.safeAreaInsetBottom
      },
      // 小程序的打开方式
      openType: {
        type: String,
        default: props$v.actionSheet.openType
      },
      // 点击遮罩是否允许关闭 (默认true)
      closeOnClickOverlay: {
        type: Boolean,
        default: props$v.actionSheet.closeOnClickOverlay
      },
      // 圆角值
      round: {
        type: [Boolean, String, Number],
        default: props$v.actionSheet.round
      }
    }
  };
  const _sfc_main$f = {
    name: "u-action-sheet",
    // 一些props参数和methods方法，通过mixin混入，因为其他文件也会用到
    mixins: [openType, button, mixin, props$3],
    data() {
      return {};
    },
    computed: {
      // 操作项目的样式
      itemStyle() {
        return (index2) => {
          let style = {};
          if (this.actions[index2].color)
            style.color = this.actions[index2].color;
          if (this.actions[index2].fontSize)
            style.fontSize = uni.$u.addUnit(this.actions[index2].fontSize);
          if (this.actions[index2].disabled)
            style.color = "#c0c4cc";
          return style;
        };
      }
    },
    methods: {
      closeHandler() {
        if (this.closeOnClickOverlay) {
          this.$emit("close");
        }
      },
      // 点击取消按钮
      cancel() {
        this.$emit("close");
      },
      selectHandler(index2) {
        const item = this.actions[index2];
        if (item && !item.disabled && !item.loading) {
          this.$emit("select", item);
          if (this.closeOnClickAction) {
            this.$emit("close");
          }
        }
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_1$9);
    const _component_u_line = resolveEasycom(vue.resolveDynamicComponent("u-line"), __easycom_1$2);
    const _component_u_loading_icon = resolveEasycom(vue.resolveDynamicComponent("u-loading-icon"), __easycom_0$9);
    const _component_u_gap = resolveEasycom(vue.resolveDynamicComponent("u-gap"), __easycom_3$1);
    const _component_u_popup = resolveEasycom(vue.resolveDynamicComponent("u-popup"), __easycom_8$1);
    return vue.openBlock(), vue.createBlock(_component_u_popup, {
      show: _ctx.show,
      mode: "bottom",
      onClose: $options.closeHandler,
      safeAreaInsetBottom: _ctx.safeAreaInsetBottom,
      round: _ctx.round
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("view", { class: "u-action-sheet" }, [
          _ctx.title ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "u-action-sheet__header"
          }, [
            vue.createElementVNode(
              "text",
              { class: "u-action-sheet__header__title u-line-1" },
              vue.toDisplayString(_ctx.title),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", {
              class: "u-action-sheet__header__icon-wrap",
              onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.cancel && $options.cancel(...args), ["stop"]))
            }, [
              vue.createVNode(_component_u_icon, {
                name: "close",
                size: "17",
                color: "#c8c9cc",
                bold: ""
              })
            ])
          ])) : vue.createCommentVNode("v-if", true),
          _ctx.description ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 1,
              class: "u-action-sheet__description",
              style: vue.normalizeStyle([{
                marginTop: `${_ctx.title && _ctx.description ? 0 : "18px"}`
              }])
            },
            vue.toDisplayString(_ctx.description),
            5
            /* TEXT, STYLE */
          )) : vue.createCommentVNode("v-if", true),
          vue.renderSlot(_ctx.$slots, "default", {}, () => [
            _ctx.description ? (vue.openBlock(), vue.createBlock(_component_u_line, { key: 0 })) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "u-action-sheet__item-wrap" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(_ctx.actions, (item, index2) => {
                  return vue.openBlock(), vue.createElementBlock("view", { key: index2 }, [
                    vue.createElementVNode("view", {
                      class: "u-action-sheet__item-wrap__item",
                      onClick: vue.withModifiers(($event) => $options.selectHandler(index2), ["stop"]),
                      "hover-class": !item.disabled && !item.loading ? "u-action-sheet--hover" : "",
                      "hover-stay-time": 150
                    }, [
                      !item.loading ? (vue.openBlock(), vue.createElementBlock(
                        vue.Fragment,
                        { key: 0 },
                        [
                          vue.createElementVNode(
                            "text",
                            {
                              class: "u-action-sheet__item-wrap__item__name",
                              style: vue.normalizeStyle([$options.itemStyle(index2)])
                            },
                            vue.toDisplayString(item.name),
                            5
                            /* TEXT, STYLE */
                          ),
                          item.subname ? (vue.openBlock(), vue.createElementBlock(
                            "text",
                            {
                              key: 0,
                              class: "u-action-sheet__item-wrap__item__subname"
                            },
                            vue.toDisplayString(item.subname),
                            1
                            /* TEXT */
                          )) : vue.createCommentVNode("v-if", true)
                        ],
                        64
                        /* STABLE_FRAGMENT */
                      )) : (vue.openBlock(), vue.createBlock(_component_u_loading_icon, {
                        key: 1,
                        "custom-class": "van-action-sheet__loading",
                        size: "18",
                        mode: "circle"
                      }))
                    ], 8, ["onClick", "hover-class"]),
                    index2 !== _ctx.actions.length - 1 ? (vue.openBlock(), vue.createBlock(_component_u_line, { key: 0 })) : vue.createCommentVNode("v-if", true)
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ], true),
          _ctx.cancelText ? (vue.openBlock(), vue.createBlock(_component_u_gap, {
            key: 2,
            bgColor: "#eaeaec",
            height: "6"
          })) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { "hover-class": "u-action-sheet--hover" }, [
            _ctx.cancelText ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 0,
                onTouchmove: _cache[1] || (_cache[1] = vue.withModifiers(() => {
                }, ["stop", "prevent"])),
                "hover-stay-time": 150,
                class: "u-action-sheet__cancel-text",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.cancel && $options.cancel(...args))
              },
              vue.toDisplayString(_ctx.cancelText),
              33
              /* TEXT, HYDRATE_EVENTS */
            )) : vue.createCommentVNode("v-if", true)
          ])
        ])
      ]),
      _: 3
      /* FORWARDED */
    }, 8, ["show", "onClose", "safeAreaInsetBottom", "round"]);
  }
  const __easycom_7 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$6], ["__scopeId", "data-v-69669810"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-action-sheet/u-action-sheet.vue"]]);
  const _sfc_main$e = {
    __name: "detail",
    setup(__props) {
      let collectObj = vue.ref({
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
      let playObj = vue.ref({});
      let play_path = vue.ref("");
      let playId = "";
      let isDisplay = vue.ref(false);
      let butText = vue.ref("重新加载");
      let isShowBut = vue.ref(false);
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
      let sheetShow = vue.ref(false);
      let typeTitle = vue.ref("");
      let typesList = vue.ref([]);
      let currentTime_ = vue.ref(0);
      let currentTime1_ = vue.ref(0);
      let ispopUp = vue.ref(false);
      let handleClose = () => {
        ispopUp.value = false;
      };
      let comm_countList = vue.ref([]);
      let danmuList = vue.ref([]);
      let getCommentList = () => {
        queryUserComment(playId).then((res) => {
          comm_countList.value = res.data.reverse();
          interScObserver();
          const rgb = [];
          for (let i = 0; i < 3; ++i) {
            let color2 = Math.floor(Math.random() * 256).toString(16);
            color2 = color2.length == 1 ? "0" + color2 : color2;
            rgb.push(color2);
          }
          danmuList.value = res.data.map((x) => {
            return {
              text: x.comment,
              color: "#" + rgb.join(""),
              time: x.film_time
            };
          });
        });
      };
      let getInfo = (options, isGetTypes = true) => {
        let {
          id
        } = options;
        playId = id;
        getFindByVideoId(id).then((res) => {
          if (!res.data) {
            plus.nativeUI.toast(res.msg);
            uni.navigateBack();
          }
          playObj.value = res.data;
          playObj.value.isCollect = "0";
          let catch_films_ = uni.getStorageSync("user_history_fiml") || [];
          catch_films_.forEach((x) => {
            if (x.videoId == playId) {
              currentTime_.value = x.progress;
              cutIndex.value = x.cutIndex;
              play();
            }
          });
          uni.hideLoading();
          typeTitle.value = res.data.videoType;
          if (isGetTypes) {
            getTypesList();
          } else {
            isPlay.value = false;
          }
          getCommentList();
        }).catch((err) => {
          butText.value = "重新加载";
          isDisplay.value = false;
          isShowBut.value = true;
          uni.hideLoading();
        });
      };
      let getTypesList = () => {
        getFindByVideoType(typeTitle.value).then((res) => {
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
      onLoad((options) => {
        getInfo(options);
      });
      let cutIndex = vue.ref(-1);
      let cut = (path, index2) => {
        currentTime_.value = 0;
        cutIndex.value = index2;
        play_path.value = path;
        play();
      };
      let bgImageLoad = () => {
        playObj.value.updateTime = false;
      };
      let imageLoad = (item) => {
        item.updateTime = false;
      };
      let isPlay = vue.ref(false);
      let play = () => {
        plus.navigator.setFullscreen(true);
        if (!isPlay.value) {
          let {
            videoId,
            title,
            cover,
            director
          } = playObj.value;
          addHot({
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
      let videoContext = uni.createVideoContext("videoRef", vue.getCurrentInstance());
      let sheetClose = (val) => {
        sheetShow.value = false;
        if (val) {
          videoContext.playbackRate(val.value);
          plus.nativeUI.toast("设置成功");
        }
      };
      let toType = () => {
        videoContext.pause();
        uni.navigateTo({
          url: "../search/search?searchValue=" + playObj.value.videoType + "&type=" + 5
        });
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
          uni.showLoading({
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
          userId: uni.getStorageSync("userInfo").user_id,
          cover: playObj.value.cover,
          videoType: playObj.value.videoType,
          title: playObj.value.title
        };
        if (playObj.value.isCollect == "0") {
          playObj.value.isCollect = "1";
          userCollect(
            AjaxObj
          ).then((res) => {
            msgSuccess(res.msg);
          });
        } else {
          plus.nativeUI.confirm("确定要取消收藏这部电影吗？", function({
            index: index2
          }) {
            if (index2 === 0) {
              userCancelCollect(AjaxObj).then((res) => {
                msgSuccess(res.msg);
                playObj.value.isCollect = "0";
              });
            }
          }, "提示", ["我不想看了", "算了还是看吧"]);
        }
      };
      let onTimeUpdate = (event) => {
        currentTime1_.value = event.detail.currentTime;
      };
      let commentShow = vue.ref(false);
      let comment_val = vue.ref("");
      let comment_count = vue.ref(5);
      let commentConfirm = () => {
        let com = comment_val.value;
        if (!com.trim()) {
          msgError("评论不能为空!");
          return false;
        }
        let {
          user_id
        } = uni.getStorageSync("userInfo");
        let data = {
          userId: user_id,
          comment: comment_val.value,
          film_rate: comment_count.value,
          film_time: currentTime1_.value,
          film_id: playId
        };
        plus.nativeUI.showWaiting("正在上传评论...");
        comment(data).then((res) => {
          msgSuccess(res.msg);
          comment_val.value = "";
          comment_count.value = 5;
          commentShow.value = false;
          plus.nativeUI.closeWaiting();
          getCommentList();
        }).catch((e) => {
          plus.nativeUI.closeWaiting();
        });
      };
      let isShowCommentBut = vue.ref(false);
      let interScObserver = () => {
        vue.nextTick(() => {
          setTimeout(() => {
            uni.createIntersectionObserver(vue.getCurrentInstance(), {
              initialRatio: 0.5
            }).relativeToViewport(".info-box").observe(".comm_container", (res) => {
              isShowCommentBut.value = res.intersectionRatio > 0;
            });
          }, 1e3);
        });
      };
      vue.onMounted(() => {
        interScObserver();
      });
      vue.onUnmounted(() => {
        if (isPlay.value) {
          let catch_films = uni.getStorageSync("user_history_fiml") || [];
          playObj.value.progress = currentTime1_.value;
          playObj.value.cutIndex = cutIndex.value;
          catch_films.unshift(playObj.value);
          const uniqueArr = catch_films.reduce((acc, cur) => {
            acc.has(cur.videoId) ? acc.get(cur.videoId).name = cur.name : acc.set(cur.videoId, cur);
            return acc;
          }, /* @__PURE__ */ new Map()).values();
          uni.setStorageSync("user_history_fiml", [...uniqueArr]);
        }
      });
      return (_ctx, _cache) => {
        const _component_u_button = resolveEasycom(vue.resolveDynamicComponent("u-button"), __easycom_0$8);
        const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_1$9);
        const _component_u_empty = resolveEasycom(vue.resolveDynamicComponent("u-empty"), __easycom_0$2);
        const _component_u__input = resolveEasycom(vue.resolveDynamicComponent("u--input"), __easycom_3$2);
        const _component_u_rate = resolveEasycom(vue.resolveDynamicComponent("u-rate"), __easycom_4);
        const _component_u_modal = resolveEasycom(vue.resolveDynamicComponent("u-modal"), __easycom_5);
        const _component_u_avatar = resolveEasycom(vue.resolveDynamicComponent("u-avatar"), __easycom_6);
        const _component_u_action_sheet = resolveEasycom(vue.resolveDynamicComponent("u-action-sheet"), __easycom_7);
        const _component_u_popup = resolveEasycom(vue.resolveDynamicComponent("u-popup"), __easycom_8$1);
        return vue.openBlock(), vue.createElementBlock("view", { class: "info-box" }, [
          !vue.unref(playObj).cover ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "loading-box"
          }, [
            vue.createElementVNode("image", {
              class: "loading-img",
              src: "/static/logo2.svg"
            }),
            vue.withDirectives(vue.createVNode(_component_u_button, {
              onClick: vue.unref(reloadData),
              style: { "width": "50%" },
              disabled: vue.unref(isDisplay),
              text: vue.unref(butText),
              color: "linear-gradient(to right, #7e214d, #db6031)"
            }, null, 8, ["onClick", "disabled", "text"]), [
              [vue.vShow, vue.unref(isShowBut)]
            ])
          ])) : (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              !vue.unref(isPlay) ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 0,
                class: "videoPlayer",
                mode: "aspectFill",
                onLoad: _cache[0] || (_cache[0] = ($event) => vue.unref(bgImageLoad)()),
                src: vue.unref(playObj).updateTime ? "../../static/logo2.svg" : vue.unref(playObj).cover
              }, null, 40, ["src"])) : (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                { key: 1 },
                [
                  vue.createCommentVNode(" 播放组件 "),
                  vue.createElementVNode("video", {
                    id: "videoRef",
                    onTimeupdate: _cache[1] || (_cache[1] = (...args) => vue.unref(onTimeUpdate) && vue.unref(onTimeUpdate)(...args)),
                    "initial-time": vue.unref(currentTime_),
                    onClick: _cache[2] || (_cache[2] = (...args) => _ctx.longPress && _ctx.longPress(...args)),
                    autoplay: true,
                    playbackRate: 30,
                    class: "videoPlayer",
                    "vslide-gesture-in-fullscreen": "",
                    "object-fit": "cover",
                    title: vue.unref(playObj).title + "--" + vue.unref(playObj).chapterList[vue.unref(cutIndex)].title,
                    controls: "",
                    "play-strategy": 2,
                    codec: "",
                    src: vue.unref(play_path),
                    onEnded: _cache[3] || (_cache[3] = (...args) => vue.unref(ended) && vue.unref(ended)(...args)),
                    "danmu-list": vue.unref(danmuList),
                    "enable-danmu": "",
                    "danmu-btn": "true"
                  }, null, 40, ["initial-time", "title", "src", "danmu-list"])
                ],
                2112
                /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
              )),
              vue.createCommentVNode(" 播放按钮组 "),
              vue.createElementVNode(
                "div",
                {
                  style: vue.normalizeStyle({ "margin-top": vue.unref(isPlay) ? "0rem" : "-3rem" }),
                  class: "brief-box"
                },
                [
                  vue.createCommentVNode(" 左边盒子 "),
                  vue.createElementVNode("div", { class: "left" }, [
                    vue.createVNode(_component_u_icon, {
                      onClick: vue.unref(addCollect),
                      size: "32",
                      color: vue.unref(collectObj).color[vue.unref(playObj).isCollect],
                      name: vue.unref(collectObj).icon[vue.unref(playObj).isCollect]
                    }, null, 8, ["onClick", "color", "name"]),
                    vue.createElementVNode(
                      "span",
                      null,
                      vue.toDisplayString(vue.unref(collectObj).text[vue.unref(playObj).isCollect]),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createCommentVNode(" 中间盒子 "),
                  !vue.unref(isPlay) ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 0,
                    onClick: _cache[4] || (_cache[4] = (...args) => vue.unref(play) && vue.unref(play)(...args)),
                    class: "center"
                  }, [
                    vue.createElementVNode("image", { src: "/static/detail/playBut.svg" }),
                    vue.createElementVNode("span", null, "立即播放")
                  ])) : vue.createCommentVNode("v-if", true),
                  vue.createCommentVNode(" 右边盒子 "),
                  vue.createElementVNode("div", { class: "right" }, [
                    vue.createVNode(_component_u_icon, {
                      onClick: _cache[5] || (_cache[5] = ($event) => vue.isRef(sheetShow) ? sheetShow.value = true : sheetShow = true),
                      size: "32",
                      color: "white",
                      name: "setting"
                    }),
                    vue.createElementVNode("span", null, "播放设置")
                  ])
                ],
                4
                /* STYLE */
              ),
              vue.createCommentVNode(" 片名以及详细信息 "),
              vue.createElementVNode(
                "div",
                {
                  class: "firm-info-box",
                  style: vue.normalizeStyle({ "margin-top": vue.unref(isPlay) ? "0rem" : "2rem" })
                },
                [
                  vue.createCommentVNode(" 片名 "),
                  vue.createElementVNode(
                    "span",
                    { class: "firm-name" },
                    vue.toDisplayString(vue.unref(playObj).title),
                    1
                    /* TEXT */
                  ),
                  vue.createCommentVNode(" 地区 "),
                  vue.createElementVNode(
                    "span",
                    null,
                    vue.toDisplayString(vue.unref(playObj).region) + " | " + vue.toDisplayString(vue.unref(playObj).releaseTime) + " | " + vue.toDisplayString(vue.unref(playObj).videoType.replace(",", "") || ""),
                    1
                    /* TEXT */
                  ),
                  vue.createCommentVNode(" 介绍 "),
                  vue.createElementVNode(
                    "div",
                    { class: "descs" },
                    vue.toDisplayString(vue.unref(playObj).descs),
                    1
                    /* TEXT */
                  )
                ],
                4
                /* STYLE */
              ),
              vue.createCommentVNode(" 导演以及演员 "),
              vue.createElementVNode("div", { class: "acts-box" }, [
                vue.createElementVNode("div", { class: "myEllipsis" }, [
                  vue.createElementVNode("span", { class: "Directed" }, "导演"),
                  vue.createTextVNode("    "),
                  vue.createElementVNode(
                    "span",
                    null,
                    vue.toDisplayString(vue.unref(playObj).director),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("div", { class: "myEllipsis" }, [
                  vue.createElementVNode("span", { class: "Cast" }, "主演"),
                  vue.createTextVNode("    "),
                  vue.createElementVNode(
                    "span",
                    null,
                    vue.toDisplayString(vue.unref(playObj).actor),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("div", { class: "myEllipsis flx" }, [
                  vue.createElementVNode("span", { class: "Cast" }, "选集"),
                  vue.createElementVNode("image", {
                    onClick: _cache[6] || (_cache[6] = ($event) => vue.isRef(ispopUp) ? ispopUp.value = true : ispopUp = true),
                    src: "/static/detail/gengduo.svg"
                  })
                ])
              ]),
              vue.createCommentVNode(" 播放列表 "),
              vue.createElementVNode("scroll-view", {
                "scroll-x": "true",
                "scroll-left": vue.unref(cutIndex) * 93.9 - 95,
                class: "play_list"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(vue.unref(playObj).chapterList, (i, index2) => {
                    return vue.openBlock(), vue.createElementBlock("div", {
                      onClick: ($event) => vue.unref(cut)(i.chapterPath, index2),
                      key: i.chapterPath,
                      class: vue.normalizeClass([{ "item-active": index2 === vue.unref(cutIndex) }, "item"])
                    }, vue.toDisplayString(i.title), 11, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ], 8, ["scroll-left"]),
              vue.createCommentVNode(" 更多标题 "),
              vue.createElementVNode("div", { class: "types_boxs" }, [
                vue.createElementVNode("span", null, " 更多推荐 "),
                vue.createElementVNode("image", {
                  onClick: _cache[7] || (_cache[7] = (...args) => vue.unref(toType) && vue.unref(toType)(...args)),
                  src: "/static/detail/gengduo.svg"
                })
              ]),
              vue.createCommentVNode(" 更多列表盒子 "),
              vue.createElementVNode("div", { class: "types_list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(vue.unref(typesList), (item, index2) => {
                    return vue.openBlock(), vue.createElementBlock("div", {
                      onClick: ($event) => vue.unref(checkOutPlay)(item),
                      ref_for: true,
                      ref: "play_" + index2,
                      key: item.videoId,
                      class: "item"
                    }, [
                      vue.createElementVNode("image", {
                        mode: "aspectFill",
                        onLoad: ($event) => vue.unref(imageLoad)(item),
                        src: item.updateTime ? "../../static/logo2.svg" : item.cover
                      }, null, 40, ["onLoad", "src"]),
                      vue.createElementVNode(
                        "span",
                        { class: "myEllipsis" },
                        vue.toDisplayString(item.title),
                        1
                        /* TEXT */
                      )
                    ], 8, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createCommentVNode(" 更多标题 "),
              vue.createElementVNode("div", { class: "types_boxs" }, [
                vue.createElementVNode("span", null, [
                  vue.createVNode(_component_u_icon, {
                    label: "",
                    size: "40",
                    name: "../../static/detail/comment.svg"
                  })
                ])
              ]),
              vue.createCommentVNode(" 无评论 "),
              !vue.unref(comm_countList).length ? (vue.openBlock(), vue.createBlock(_component_u_empty, {
                key: 2,
                icon: "../../static/detail/noComment.svg",
                text: " "
              }, {
                default: vue.withCtx(() => [
                  vue.renderSlot(_ctx.$slots, "default", {}, () => [
                    vue.createVNode(_component_u_button, {
                      onClick: _cache[8] || (_cache[8] = ($event) => vue.isRef(commentShow) ? commentShow.value = true : commentShow = true),
                      style: { "margin-top": "-1rem", "margin-bottom": "1rem" },
                      type: "primary",
                      size: "mini",
                      color: "linear-gradient(to right, #4851d6, #ce34bb)",
                      text: "评论一下"
                    })
                  ], true)
                ]),
                _: 3
                /* FORWARDED */
              })) : vue.createCommentVNode("v-if", true),
              vue.createVNode(_component_u_modal, {
                show: vue.unref(commentShow),
                onCancel: _cache[11] || (_cache[11] = ($event) => vue.isRef(commentShow) ? commentShow.value = false : commentShow = false),
                onConfirm: vue.unref(commentConfirm),
                showCancelButton: true,
                title: "请输入你对影片的评价"
              }, {
                default: vue.withCtx(() => [
                  vue.createElementVNode("view", { class: "slot-content" }, [
                    vue.createVNode(_component_u__input, {
                      style: { "border": "1rpx solid #ccc" },
                      placeholder: "请输入内容",
                      border: "surround",
                      modelValue: vue.unref(comment_val),
                      "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => vue.isRef(comment_val) ? comment_val.value = $event : comment_val = $event)
                    }, null, 8, ["modelValue"]),
                    vue.createVNode(_component_u_rate, {
                      style: { "margin-left": "3rem", "margin-top": "1rem" },
                      count: 5,
                      modelValue: vue.unref(comment_count),
                      "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => vue.isRef(comment_count) ? comment_count.value = $event : comment_count = $event)
                    }, null, 8, ["modelValue"])
                  ])
                ]),
                _: 1
                /* STABLE */
              }, 8, ["show", "onConfirm"]),
              vue.createCommentVNode(" 评论列表 "),
              vue.unref(comm_countList).length ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 3,
                class: "comm_container"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(vue.unref(comm_countList), (item) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: item.time,
                      class: "item"
                    }, [
                      vue.createVNode(_component_u_avatar, {
                        shape: "circle",
                        src: item.user_image
                      }, null, 8, ["src"]),
                      vue.createElementVNode("view", { class: "title" }, [
                        vue.createElementVNode(
                          "span",
                          { class: "user_name" },
                          vue.toDisplayString(item.user_name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "span",
                          { class: "comment_val" },
                          vue.toDisplayString(item.comment),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "time" }, [
                        vue.createElementVNode(
                          "span",
                          null,
                          vue.toDisplayString(item.time),
                          1
                          /* TEXT */
                        ),
                        vue.createVNode(_component_u_rate, {
                          activeColor: "#FFA500",
                          size: "13",
                          readonly: "",
                          modelValue: item.film_rate,
                          "onUpdate:modelValue": ($event) => item.film_rate = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              vue.createCommentVNode(" 评论浮动按钮 "),
              vue.createElementVNode(
                "button",
                {
                  style: vue.normalizeStyle({ "right": vue.unref(isShowCommentBut) ? "1rem" : "-5rem" }),
                  onClick: _cache[12] || (_cache[12] = ($event) => vue.isRef(commentShow) ? commentShow.value = true : commentShow = true),
                  class: "comment_but"
                },
                "评论一下",
                4
                /* STYLE */
              )
            ],
            64
            /* STABLE_FRAGMENT */
          )),
          vue.createCommentVNode(" 播放速度设置 "),
          vue.createVNode(_component_u_action_sheet, {
            actions: vue.unref(playSettingList),
            round: 20,
            onSelect: vue.unref(sheetClose),
            onClose: vue.unref(sheetClose),
            safeAreaInsetBottom: true,
            closeOnClickOverlay: true,
            closeOnClickAction: true,
            title: "播放设置",
            show: vue.unref(sheetShow)
          }, null, 8, ["actions", "onSelect", "onClose", "show"]),
          vue.createCommentVNode(" 选集操作 "),
          vue.createVNode(_component_u_popup, {
            show: vue.unref(ispopUp),
            onClose: vue.unref(handleClose),
            overlay: true,
            bgColor: "#0f161d",
            closeable: true,
            safeAreaInsetBottom: true,
            mode: "bottom"
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("view", { class: "XJ" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(vue.unref(playObj).chapterList, (i, index2) => {
                    return vue.openBlock(), vue.createElementBlock("div", {
                      onClick: ($event) => vue.unref(cut)(i.chapterPath, index2),
                      key: i.chapterPath,
                      class: vue.normalizeClass([{ "item-active": index2 === vue.unref(cutIndex) }, "XJ_item"])
                    }, vue.toDisplayString(i.title), 11, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ]),
            _: 1
            /* STABLE */
          }, 8, ["show", "onClose"])
        ]);
      };
    }
  };
  const PagesDetailDetail = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-eca06f3c"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/detail/detail.vue"]]);
  const props$2 = {
    props: {
      // tab的数据
      list: {
        type: Array,
        default: props$v.subsection.list
      },
      // 当前活动的tab的index
      current: {
        type: [String, Number],
        default: props$v.subsection.current
      },
      // 激活的颜色
      activeColor: {
        type: String,
        default: props$v.subsection.activeColor
      },
      // 未激活的颜色
      inactiveColor: {
        type: String,
        default: props$v.subsection.inactiveColor
      },
      // 模式选择，mode=button为按钮形式，mode=subsection时为分段模式
      mode: {
        type: String,
        default: props$v.subsection.mode
      },
      // 字体大小
      fontSize: {
        type: [String, Number],
        default: props$v.subsection.fontSize
      },
      // 激活tab的字体是否加粗
      bold: {
        type: Boolean,
        default: props$v.subsection.bold
      },
      // mode = button时，组件背景颜色
      bgColor: {
        type: String,
        default: props$v.subsection.bgColor
      },
      // 从list元素对象中读取的键名
      keyName: {
        type: String,
        default: props$v.subsection.keyName
      }
    }
  };
  const _sfc_main$d = {
    name: "u-subsection",
    mixins: [mpMixin, mixin, props$2],
    data() {
      return {
        // 组件尺寸
        itemRect: {
          width: 0,
          height: 0
        }
      };
    },
    watch: {
      list(newValue, oldValue) {
        this.init();
      },
      current: {
        immediate: true,
        handler(n) {
        }
      }
    },
    computed: {
      wrapperStyle() {
        const style = {};
        if (this.mode === "button") {
          style.backgroundColor = this.bgColor;
        }
        return style;
      },
      // 滑块的样式
      barStyle() {
        const style = {};
        style.width = `${this.itemRect.width}px`;
        style.height = `${this.itemRect.height}px`;
        style.transform = `translateX(${this.current * this.itemRect.width}px)`;
        if (this.mode === "subsection") {
          style.backgroundColor = this.activeColor;
        }
        return style;
      },
      // 分段器item的样式
      itemStyle(index2) {
        return (index3) => {
          const style = {};
          if (this.mode === "subsection") {
            style.borderColor = this.activeColor;
            style.borderWidth = "1px";
            style.borderStyle = "solid";
          }
          return style;
        };
      },
      // 分段器文字颜色
      textStyle(index2) {
        return (index3) => {
          const style = {};
          style.fontWeight = this.bold && this.current === index3 ? "bold" : "normal";
          style.fontSize = uni.$u.addUnit(this.fontSize);
          if (this.mode === "subsection") {
            style.color = this.current === index3 ? "#fff" : this.inactiveColor;
          } else {
            style.color = this.current === index3 ? this.activeColor : this.inactiveColor;
          }
          return style;
        };
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        uni.$u.sleep().then(() => this.getRect());
      },
      // 判断展示文本
      getText(item) {
        return typeof item === "object" ? item[this.keyName] : item;
      },
      // 获取组件的尺寸
      getRect() {
        this.$uGetRect(".u-subsection__item--0").then((size) => {
          this.itemRect = size;
        });
      },
      clickHandler(index2) {
        this.$emit("change", index2);
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["u-subsection", [`u-subsection--${_ctx.mode}`]]),
        ref: "u-subsection",
        style: vue.normalizeStyle([_ctx.$u.addStyle(_ctx.customStyle), $options.wrapperStyle])
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["u-subsection__bar", [
              _ctx.mode === "button" && "u-subsection--button__bar",
              _ctx.current === 0 && _ctx.mode === "subsection" && "u-subsection__bar--first",
              _ctx.current > 0 && _ctx.current < _ctx.list.length - 1 && _ctx.mode === "subsection" && "u-subsection__bar--center",
              _ctx.current === _ctx.list.length - 1 && _ctx.mode === "subsection" && "u-subsection__bar--last"
            ]]),
            ref: "u-subsection__bar",
            style: vue.normalizeStyle([$options.barStyle])
          },
          null,
          6
          /* CLASS, STYLE */
        ),
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(_ctx.list, (item, index2) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: vue.normalizeClass(["u-subsection__item", [
                `u-subsection__item--${index2}`,
                index2 < _ctx.list.length - 1 && "u-subsection__item--no-border-right",
                index2 === 0 && "u-subsection__item--first",
                index2 === _ctx.list.length - 1 && "u-subsection__item--last"
              ]]),
              ref_for: true,
              ref: `u-subsection__item--${index2}`,
              style: vue.normalizeStyle([$options.itemStyle(index2)]),
              onClick: ($event) => $options.clickHandler(index2),
              key: index2
            }, [
              vue.createElementVNode(
                "text",
                {
                  class: "u-subsection__item__text",
                  style: vue.normalizeStyle([$options.textStyle(index2)])
                },
                vue.toDisplayString($options.getText(item)),
                5
                /* TEXT, STYLE */
              )
            ], 14, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$5], ["__scopeId", "data-v-b5ccb67e"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-subsection/u-subsection.vue"]]);
  const props$1 = {
    props: {
      // 提示内容
      loadingText: {
        type: [String, Number],
        default: props$v.loadingPage.loadingText
      },
      // 文字上方用于替换loading动画的图片
      image: {
        type: String,
        default: props$v.loadingPage.image
      },
      // 加载动画的模式，circle-圆形，spinner-花朵形，semicircle-半圆形
      loadingMode: {
        type: String,
        default: props$v.loadingPage.loadingMode
      },
      // 是否加载中
      loading: {
        type: Boolean,
        default: props$v.loadingPage.loading
      },
      // 背景色
      bgColor: {
        type: String,
        default: props$v.loadingPage.bgColor
      },
      // 文字颜色
      color: {
        type: String,
        default: props$v.loadingPage.color
      },
      // 文字大小
      fontSize: {
        type: [String, Number],
        default: props$v.loadingPage.fontSize
      },
      // 图标大小
      iconSize: {
        type: [String, Number],
        default: props$v.loadingPage.fontSize
      },
      // 加载中图标的颜色，只能rgb或者十六进制颜色值
      loadingColor: {
        type: String,
        default: props$v.loadingPage.loadingColor
      }
    }
  };
  const _sfc_main$c = {
    name: "u-loading-page",
    mixins: [mpMixin, mixin, props$1],
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_loading_icon = resolveEasycom(vue.resolveDynamicComponent("u-loading-icon"), __easycom_0$9);
    const _component_u_transition = resolveEasycom(vue.resolveDynamicComponent("u-transition"), __easycom_1$8);
    return vue.openBlock(), vue.createBlock(_component_u_transition, {
      show: _ctx.loading,
      "custom-style": {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: _ctx.bgColor,
        display: "flex"
      }
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("view", { class: "u-loading-page" }, [
          vue.createElementVNode("view", { class: "u-loading-page__warpper" }, [
            vue.createElementVNode("view", { class: "u-loading-page__warpper__loading-icon" }, [
              _ctx.image ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 0,
                src: _ctx.image,
                class: "u-loading-page__warpper__loading-icon__img",
                mode: "widthFit",
                style: vue.normalizeStyle({
                  width: _ctx.$u.addUnit(_ctx.iconSize),
                  height: _ctx.$u.addUnit(_ctx.iconSize)
                })
              }, null, 12, ["src"])) : (vue.openBlock(), vue.createBlock(_component_u_loading_icon, {
                key: 1,
                mode: _ctx.loadingMode,
                size: _ctx.$u.addUnit(_ctx.iconSize),
                color: _ctx.loadingColor
              }, null, 8, ["mode", "size", "color"]))
            ]),
            vue.renderSlot(_ctx.$slots, "default", {}, () => [
              vue.createElementVNode(
                "text",
                {
                  class: "u-loading-page__warpper__text",
                  style: vue.normalizeStyle({
                    fontSize: _ctx.$u.addUnit(_ctx.fontSize),
                    color: _ctx.color
                  })
                },
                vue.toDisplayString(_ctx.loadingText),
                5
                /* TEXT, STYLE */
              )
            ], true)
          ])
        ])
      ]),
      _: 3
      /* FORWARDED */
    }, 8, ["show", "custom-style"]);
  }
  const __easycom_3 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$4], ["__scopeId", "data-v-9c9e88a3"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-loading-page/u-loading-page.vue"]]);
  const _sfc_main$b = {
    __name: "search",
    setup(__props) {
      let searchValue = vue.ref("");
      let list = vue.ref([]);
      let isNextPage = true;
      let loadingTitle = vue.ref("正在加载中....");
      let loading = vue.ref(true);
      onLoad((options) => {
        searchValue.value = options.searchValue;
        if (options.type) {
          subCurrent.value = options.type;
        }
        getList();
      });
      let getList = () => {
        if (!isNextPage) {
          msgError("没有更多了");
          return false;
        }
        getFindBySearch(searchValue.value, indexPage, subList.value[subCurrent.value].type).then((res) => {
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
        uni.navigateTo({
          url: "/pages/detail/detail?id=" + item.videoId
        });
      };
      let flage = vue.ref(true);
      let indexPage = 1;
      onReachBottom(() => {
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
            uni.pageScrollTo({
              offsetTop: 0,
              duration: 0
            });
          });
          debounce2(() => {
            searchInit();
            getList();
          });
        } else {
          msgError("输入不能为空!");
        }
      };
      let searchInit = () => {
        isNextPage = true;
        indexPage = 1;
        loading.value = true;
        list.value = [];
        loadingTitle.value = "正在加载中....";
      };
      let subList = vue.ref([
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
      let subCurrent = vue.ref(0);
      let sectionChange = (e) => {
        subCurrent.value = e;
        debounce2(() => {
          searchInit();
          getList();
        });
      };
      let timer = null;
      let debounce2 = (fn) => {
        clearTimeout(timer);
        timer = setTimeout(fn, 500);
      };
      return (_ctx, _cache) => {
        const _component_u_search = resolveEasycom(vue.resolveDynamicComponent("u-search"), __easycom_0$5);
        const _component_u_subsection = resolveEasycom(vue.resolveDynamicComponent("u-subsection"), __easycom_1$1);
        const _component_u_sticky = resolveEasycom(vue.resolveDynamicComponent("u-sticky"), __easycom_2);
        const _component_u_loading_page = resolveEasycom(vue.resolveDynamicComponent("u-loading-page"), __easycom_3);
        return vue.openBlock(), vue.createElementBlock("view", { class: "search-box" }, [
          vue.createCommentVNode(" 搜索栏 "),
          vue.createVNode(_component_u_sticky, null, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", { class: "search-box" }, [
                vue.createElementVNode("image", { src: "/static/logo2.svg" }),
                vue.createElementVNode("div", { class: "search" }, [
                  vue.createVNode(_component_u_search, {
                    modelValue: vue.unref(searchValue),
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(searchValue) ? searchValue.value = $event : searchValue = $event),
                    bgColor: "#28304c",
                    color: "white",
                    actionStyle: { color: "white" },
                    showAction: true,
                    actionText: "搜索",
                    onSearch: vue.unref(searchCustom),
                    onCustom: vue.unref(searchCustom),
                    animation: true,
                    shape: "round"
                  }, null, 8, ["modelValue", "onSearch", "onCustom"])
                ])
              ]),
              vue.createVNode(_component_u_subsection, {
                style: { "padding-bottom": "0.5rem", "height": "2.5rem" },
                bgColor: "#080d16",
                bold: "",
                activeColo: "#0962EA",
                inactiveColor: "white",
                list: vue.unref(subList),
                current: vue.unref(subCurrent),
                onChange: vue.unref(sectionChange)
              }, null, 8, ["list", "current", "onChange"])
            ]),
            _: 1
            /* STABLE */
          }),
          !vue.unref(loading) && vue.unref(list).length ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "list-box-item"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(vue.unref(list), (item) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: item.videoId,
                  class: "list-item"
                }, [
                  vue.createElementVNode("image", {
                    onClick: ($event) => vue.unref(toDetail)(item),
                    onLoad: ($event) => vue.unref(imageLoad)(item),
                    src: item.updateTime ? "../../static/logo2.svg" : item.cover
                  }, null, 40, ["onClick", "onLoad", "src"]),
                  vue.createElementVNode("div", { class: "footer" }, [
                    vue.createElementVNode(
                      "div",
                      null,
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "div",
                      null,
                      vue.toDisplayString(item.director),
                      1
                      /* TEXT */
                    )
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true),
          vue.unref(loading) ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            class: "loading-box"
          }, [
            vue.createVNode(_component_u_loading_page, {
              iconSize: "100",
              fontSize: "15",
              loadingText: "搜索中",
              image: "../../static/logo2.svg",
              "bg-color": "#080d16",
              loading: vue.unref(loading)
            }, null, 8, ["loading"])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 加载无数据 "),
          !vue.unref(loading) && !vue.unref(list).length ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 2,
            class: "not-data"
          }, [
            vue.createElementVNode("image", { src: "/static/search/notDate.svg" }),
            vue.createElementVNode("text", null, "暂无搜索数据")
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 底部遮挡div "),
          vue.createElementVNode("div", { class: "footer-box-bottom" }, [
            vue.createElementVNode(
              "span",
              null,
              vue.toDisplayString(vue.unref(loadingTitle)),
              1
              /* TEXT */
            )
          ])
        ]);
      };
    }
  };
  const PagesSearchSearch = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-c10c040c"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/search/search.vue"]]);
  const props = {
    props: {
      // 是否开启顶部安全区适配
      safeAreaInsetTop: {
        type: Boolean,
        default: props$v.navbar.safeAreaInsetTop
      },
      // 固定在顶部时，是否生成一个等高元素，以防止塌陷
      placeholder: {
        type: Boolean,
        default: props$v.navbar.placeholder
      },
      // 是否固定在顶部
      fixed: {
        type: Boolean,
        default: props$v.navbar.fixed
      },
      // 是否显示下边框
      border: {
        type: Boolean,
        default: props$v.navbar.border
      },
      // 左边的图标
      leftIcon: {
        type: String,
        default: props$v.navbar.leftIcon
      },
      // 左边的提示文字
      leftText: {
        type: String,
        default: props$v.navbar.leftText
      },
      // 左右的提示文字
      rightText: {
        type: String,
        default: props$v.navbar.rightText
      },
      // 右边的图标
      rightIcon: {
        type: String,
        default: props$v.navbar.rightIcon
      },
      // 标题
      title: {
        type: [String, Number],
        default: props$v.navbar.title
      },
      // 背景颜色
      bgColor: {
        type: String,
        default: props$v.navbar.bgColor
      },
      // 标题的宽度
      titleWidth: {
        type: [String, Number],
        default: props$v.navbar.titleWidth
      },
      // 导航栏高度
      height: {
        type: [String, Number],
        default: props$v.navbar.height
      },
      // 左侧返回图标的大小
      leftIconSize: {
        type: [String, Number],
        default: props$v.navbar.leftIconSize
      },
      // 左侧返回图标的颜色
      leftIconColor: {
        type: String,
        default: props$v.navbar.leftIconColor
      },
      // 点击左侧区域(返回图标)，是否自动返回上一页
      autoBack: {
        type: Boolean,
        default: props$v.navbar.autoBack
      },
      // 标题的样式，对象或字符串
      titleStyle: {
        type: [String, Object],
        default: props$v.navbar.titleStyle
      }
    }
  };
  const _sfc_main$a = {
    name: "u-navbar",
    mixins: [mpMixin, mixin, props],
    data() {
      return {};
    },
    methods: {
      // 点击左侧区域
      leftClick() {
        this.$emit("leftClick");
        if (this.autoBack) {
          uni.navigateBack();
        }
      },
      // 点击右侧区域
      rightClick() {
        this.$emit("rightClick");
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_status_bar = resolveEasycom(vue.resolveDynamicComponent("u-status-bar"), __easycom_0$6);
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_1$9);
    return vue.openBlock(), vue.createElementBlock("view", { class: "u-navbar" }, [
      _ctx.fixed && _ctx.placeholder ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: "u-navbar__placeholder",
          style: vue.normalizeStyle({
            height: _ctx.$u.addUnit(_ctx.$u.getPx(_ctx.height) + _ctx.$u.sys().statusBarHeight, "px")
          })
        },
        null,
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass([_ctx.fixed && "u-navbar--fixed"])
        },
        [
          _ctx.safeAreaInsetTop ? (vue.openBlock(), vue.createBlock(_component_u_status_bar, {
            key: 0,
            bgColor: _ctx.bgColor
          }, null, 8, ["bgColor"])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["u-navbar__content", [_ctx.border && "u-border-bottom"]]),
              style: vue.normalizeStyle({
                height: _ctx.$u.addUnit(_ctx.height),
                backgroundColor: _ctx.bgColor
              })
            },
            [
              vue.createElementVNode("view", {
                class: "u-navbar__content__left",
                "hover-class": "u-navbar__content__left--hover",
                "hover-start-time": "150",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.leftClick && $options.leftClick(...args))
              }, [
                vue.renderSlot(_ctx.$slots, "left", {}, () => [
                  _ctx.leftIcon ? (vue.openBlock(), vue.createBlock(_component_u_icon, {
                    key: 0,
                    name: _ctx.leftIcon,
                    size: _ctx.leftIconSize,
                    color: _ctx.leftIconColor
                  }, null, 8, ["name", "size", "color"])) : vue.createCommentVNode("v-if", true),
                  _ctx.leftText ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 1,
                      style: vue.normalizeStyle({
                        color: _ctx.leftIconColor
                      }),
                      class: "u-navbar__content__left__text"
                    },
                    vue.toDisplayString(_ctx.leftText),
                    5
                    /* TEXT, STYLE */
                  )) : vue.createCommentVNode("v-if", true)
                ], true)
              ]),
              vue.renderSlot(_ctx.$slots, "center", {}, () => [
                vue.createElementVNode(
                  "text",
                  {
                    class: "u-line-1 u-navbar__content__title",
                    style: vue.normalizeStyle([{
                      width: _ctx.$u.addUnit(_ctx.titleWidth)
                    }, _ctx.$u.addStyle(_ctx.titleStyle)])
                  },
                  vue.toDisplayString(_ctx.title),
                  5
                  /* TEXT, STYLE */
                )
              ], true),
              _ctx.$slots.right || _ctx.rightIcon || _ctx.rightText ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "u-navbar__content__right",
                onClick: _cache[1] || (_cache[1] = (...args) => $options.rightClick && $options.rightClick(...args))
              }, [
                vue.renderSlot(_ctx.$slots, "right", {}, () => [
                  _ctx.rightIcon ? (vue.openBlock(), vue.createBlock(_component_u_icon, {
                    key: 0,
                    name: _ctx.rightIcon,
                    size: "20"
                  }, null, 8, ["name"])) : vue.createCommentVNode("v-if", true),
                  _ctx.rightText ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 1,
                      class: "u-navbar__content__right__text"
                    },
                    vue.toDisplayString(_ctx.rightText),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true)
                ], true)
              ])) : vue.createCommentVNode("v-if", true)
            ],
            6
            /* CLASS, STYLE */
          )
        ],
        2
        /* CLASS */
      )
    ]);
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$3], ["__scopeId", "data-v-f631659b"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-navbar/u-navbar.vue"]]);
  const _sfc_main$9 = {
    name: "UniTitle",
    props: {
      type: {
        type: String,
        default: ""
      },
      title: {
        type: String,
        default: ""
      },
      align: {
        type: String,
        default: "left"
      },
      color: {
        type: String,
        default: "#333333"
      },
      stat: {
        type: [Boolean, String],
        default: ""
      }
    },
    data() {
      return {};
    },
    computed: {
      textAlign() {
        let align = "center";
        switch (this.align) {
          case "left":
            align = "flex-start";
            break;
          case "center":
            align = "center";
            break;
          case "right":
            align = "flex-end";
            break;
        }
        return align;
      }
    },
    watch: {
      title(newVal) {
        if (this.isOpenStat()) {
          if (uni.report) {
            uni.report("title", this.title);
          }
        }
      }
    },
    mounted() {
      if (this.isOpenStat()) {
        if (uni.report) {
          uni.report("title", this.title);
        }
      }
    },
    methods: {
      isOpenStat() {
        if (this.stat === "") {
          this.isStat = false;
        }
        let stat_type = typeof this.stat === "boolean" && this.stat || typeof this.stat === "string" && this.stat !== "";
        if (this.type === "") {
          this.isStat = true;
          if (this.stat.toString() === "false") {
            this.isStat = false;
          }
        }
        if (this.type !== "") {
          this.isStat = true;
          if (stat_type) {
            this.isStat = true;
          } else {
            this.isStat = false;
          }
        }
        return this.isStat;
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "uni-title__box",
        style: vue.normalizeStyle({ "align-items": $options.textAlign })
      },
      [
        vue.createElementVNode(
          "text",
          {
            class: vue.normalizeClass(["uni-title__base", ["uni-" + $props.type]]),
            style: vue.normalizeStyle({ "color": $props.color })
          },
          vue.toDisplayString($props.title),
          7
          /* TEXT, CLASS, STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$2], ["__scopeId", "data-v-0335e46a"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uni-title/components/uni-title/uni-title.vue"]]);
  const _sfc_main$8 = {
    created() {
      hideSystemNavigation();
    },
    data() {
      return {
        titles: ["1.信息准确性", "2.第三方链接", "3.服务中断", "4.用户行为", "5.免责条款的适用范围", "6.法律适用和争议解决"],
        contents: [
          "本应用致力于提供准确、完整的电视节目信息，但不保证信息的准确性、及时性和完整性。用户在使用本应用提供的信息时，应自行判断其适用性，并承担由此产生的所有风险和责任。",
          "本应用可能包含指向第三方网站或资源的链接，这些链接仅供用户方便参考。对于任何第三方网站或资源的内容、准确性以及使用造成的损失，本应用不承担任何责任。",
          `本应用将尽力保证服务的正常运行，但不对服务的稳定性、及时性、安全性和无中断等方面提供任何明示或暗示的保证。由于不可抗力、计算机病毒、黑客攻击、系统故障、网络问题等因素可能导致服务中断或受限，用户须自行承担由此引起的风险和损失。`,
          `用户须自行承担使用本应用的所有责任和风险。在使用过程中，用户不得利用本应用从事任何违法、违规、侵犯他人权益等非法活动，如有违反，用户将承担相应的法律责任。`,
          `上述免责声明适用于本应用的所有内容、服务和交易。本应用有权在任何时候对免责声明进行修改和更新，并通过适当方式通知用户。`,
          `本免责声明的解释、适用及争议解决均适用中华人民共和国法律。如用户因使用本应用而产生争议，双方应友好协商解决；协商不成的，用户同意将争议提交至本应用所在地有管辖权的人民法院解决。`
        ]
      };
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_navbar = resolveEasycom(vue.resolveDynamicComponent("u-navbar"), __easycom_0$1);
    const _component_uni_title = resolveEasycom(vue.resolveDynamicComponent("uni-title"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "security-box" }, [
      vue.createVNode(_component_u_navbar, {
        placeholder: true,
        title: "免责声明",
        leftIconColor: "white",
        titleStyle: { color: "white", fontSize: "1.3rem", fontWeight: "600" },
        bgColor: "#080d16",
        autoBack: true
      }, null, 8, ["titleStyle"]),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($data.titles, (item, index2) => {
          return vue.openBlock(), vue.createElementBlock("view", null, [
            vue.createVNode(_component_uni_title, {
              style: { "margin-left": "1rem" },
              color: "#88888a",
              type: "h1",
              title: item
            }, null, 8, ["title"]),
            vue.createElementVNode(
              "text",
              { class: "sec_content" },
              vue.toDisplayString($data.contents[index2]),
              1
              /* TEXT */
            )
          ]);
        }),
        256
        /* UNKEYED_FRAGMENT */
      )),
      vue.createElementVNode("view", { class: "footer" }, [
        vue.createElementVNode("text", null, "最终解释权由软件作者所有")
      ])
    ]);
  }
  const PagesSecurity_policySecurity_policy = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$1], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/security_policy/security_policy.vue"]]);
  const _sfc_main$7 = {
    __name: "register",
    setup(__props) {
      let toBack = () => {
        formatAppLog("log", "at pages/register/register.vue:62", "OK啊");
        uni.redirectTo({
          url: "/pages/login/login"
        });
      };
      let account = vue.ref("");
      let password = vue.ref("");
      let password1 = vue.ref("");
      let ruleTitle = vue.ref({
        accountRule: "none",
        accountLengthRule: "none",
        passwordRule: "none",
        passwordRule1: "none",
        passwordIsEques: "none",
        passwordtLengthRule: "none"
      });
      let islogin = vue.ref(false);
      let SubmitLogin = () => {
        if (islogin.value)
          return false;
        if (isNull()) {
          islogin.value = true;
          register(account.value, password.value, password1.value).then((res) => {
            msgSuccess(res.msg);
            uni.redirectTo({
              url: "/pages/login/login"
            });
          }).catch(() => {
            islogin.value = false;
          });
        } else {
          islogin.value = false;
        }
      };
      let clearRule = () => {
        ruleTitle.value = {
          accountRule: "none",
          accountLengthRule: "none",
          passwordRule: "none",
          passwordRule1: "none",
          passwordIsEques: "none",
          passwordtLengthRule: "none"
        };
      };
      let isNull = () => {
        let account_ = account.value.trim();
        let password_ = password.value.trim();
        if (!account_) {
          clearRule();
          ruleTitle.value.accountRule = "block";
          return false;
        } else {
          ruleTitle.value.accountRule = "none";
        }
        if (!password_) {
          clearRule();
          ruleTitle.value.passwordRule = "block";
          return false;
        } else {
          ruleTitle.value.passwordRule = "none";
        }
        if (!password1.value.trim()) {
          clearRule();
          ruleTitle.value.passwordRule1 = "block";
          return false;
        } else {
          ruleTitle.value.passwordRule1 = "none";
        }
        if (password_ !== password1.value) {
          clearRule();
          ruleTitle.value.passwordIsEques = "block";
          return false;
        } else {
          ruleTitle.value.passwordIsEques = "none";
        }
        if (account_.length < 6) {
          clearRule();
          ruleTitle.value.accountLengthRule = "block";
          return;
        } else {
          ruleTitle.value.accountLengthRule = "none";
        }
        if (password_.length < 6) {
          clearRule();
          ruleTitle.value.passwordtLengthRule = "block";
          return;
        } else {
          ruleTitle.value.passwordtLengthRule = "none";
        }
        return true;
      };
      vue.onMounted(() => {
        hideSystemNavigation();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
          vue.createCommentVNode(" 注册页 "),
          vue.createCommentVNode(" 返回按钮 "),
          vue.createElementVNode("div", { class: "back-box" }, [
            vue.createElementVNode("image", {
              onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(toBack)()),
              src: "/static/index/back.svg"
            })
          ]),
          vue.createCommentVNode(" 注册提示标签 "),
          vue.createElementVNode("div", { class: "title-box" }, [
            vue.createElementVNode("span", null, "即刻注册!"),
            vue.createElementVNode("span", null, "享受精彩影视!"),
            vue.createElementVNode("div", { class: "title-item" }, [
              vue.createElementVNode("span", null, "欢迎注册～我们就等你了!")
            ])
          ]),
          vue.createCommentVNode(" 账号密码框 "),
          vue.createElementVNode("div", { class: "account-box" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "account",
                type: "text",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.isRef(account) ? account.value = $event : account = $event),
                placeholder: "请输入账号",
                "placeholder-style": "font-size:0.8rem;"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, vue.unref(account)]
            ]),
            vue.createElementVNode(
              "span",
              {
                style: vue.normalizeStyle({ "display": vue.unref(ruleTitle).accountRule }),
                class: "account-ruleTitle"
              },
              "看官,不能为空哦!",
              4
              /* STYLE */
            ),
            vue.createElementVNode(
              "span",
              {
                style: vue.normalizeStyle({ "display": vue.unref(ruleTitle).accountLengthRule }),
                class: "account-ruleTitle"
              },
              "长度必须是6位!",
              4
              /* STYLE */
            ),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "password",
                type: "password",
                onConfirm: _cache[2] || (_cache[2] = (...args) => vue.unref(SubmitLogin) && vue.unref(SubmitLogin)(...args)),
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.isRef(password) ? password.value = $event : password = $event),
                placeholder: "请输入密码",
                "placeholder-style": "font-size:0.8rem;"
              },
              null,
              544
              /* HYDRATE_EVENTS, NEED_PATCH */
            ), [
              [vue.vModelText, vue.unref(password)]
            ]),
            vue.createElementVNode(
              "span",
              {
                style: vue.normalizeStyle({ "display": vue.unref(ruleTitle).passwordRule }),
                class: "password-ruleTitle"
              },
              "看官,不能为空哦!",
              4
              /* STYLE */
            ),
            vue.createElementVNode(
              "span",
              {
                style: vue.normalizeStyle({ "display": vue.unref(ruleTitle).passwordtLengthRule }),
                class: "password-ruleTitle"
              },
              "长度必须是6位!",
              4
              /* STYLE */
            ),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "password",
                type: "password",
                onConfirm: _cache[4] || (_cache[4] = (...args) => vue.unref(SubmitLogin) && vue.unref(SubmitLogin)(...args)),
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.isRef(password1) ? password1.value = $event : password1 = $event),
                placeholder: "请再次输入密码",
                "placeholder-style": "font-size:0.8rem;"
              },
              null,
              544
              /* HYDRATE_EVENTS, NEED_PATCH */
            ), [
              [vue.vModelText, vue.unref(password1)]
            ]),
            vue.createElementVNode(
              "span",
              {
                style: vue.normalizeStyle({ "display": vue.unref(ruleTitle).passwordRule1 }),
                class: "password-ruleTitle ruleTitle1"
              },
              "看官,不能为空哦!",
              4
              /* STYLE */
            ),
            vue.createElementVNode("strong"),
            vue.createElementVNode(
              "span",
              {
                style: vue.normalizeStyle({ "display": vue.unref(ruleTitle).passwordIsEques }),
                class: "password-ruleTitle ruleTitle1"
              },
              "两次密码输入不一致,请重新输入",
              4
              /* STYLE */
            ),
            vue.createElementVNode("strong")
          ]),
          vue.createCommentVNode(" 注册按钮 "),
          vue.createElementVNode("div", { class: "login-but-box" }, [
            vue.createElementVNode("button", {
              disabled: vue.unref(islogin),
              onClick: _cache[6] || (_cache[6] = (...args) => vue.unref(SubmitLogin) && vue.unref(SubmitLogin)(...args)),
              class: "loginBut"
            }, vue.toDisplayString(vue.unref(islogin) ? "注册中..." : "注册"), 9, ["disabled"])
          ]),
          vue.createElementVNode("div", { class: "regr-box" }, [
            vue.createElementVNode("span", { class: "regr-title" }, "已有账号?"),
            vue.createElementVNode("span", {
              onClick: _cache[7] || (_cache[7] = (...args) => vue.unref(toBack) && vue.unref(toBack)(...args)),
              class: "regr-title",
              style: { "color": "blue" }
            }, "返回登录")
          ])
        ]);
      };
    }
  };
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-bac4a35d"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/register/register.vue"]]);
  const _sfc_main$6 = {
    __name: "collect",
    setup(__props) {
      let list = vue.ref([]);
      let toDetail = (item) => {
        uni.navigateTo({
          url: "/pages/detail/detail?id=" + item.video_id
        });
      };
      let imageLoad = (item) => {
        item.updateTime = true;
      };
      vue.onMounted(() => {
        userFindCollect("list").then((res) => {
          formatAppLog("log", "at pages/collect/collect.vue:56", "res", res);
          list.value = res.data;
        });
      });
      return (_ctx, _cache) => {
        const _component_u_empty = resolveEasycom(vue.resolveDynamicComponent("u-empty"), __easycom_0$2);
        return vue.openBlock(), vue.createElementBlock("view", { class: "discover-box" }, [
          vue.unref(list).length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(vue.unref(list), (item) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: item.cover,
                  class: "list-item"
                }, [
                  vue.createElementVNode("image", {
                    onClick: ($event) => vue.unref(toDetail)(item),
                    onLoad: ($event) => vue.unref(imageLoad)(item),
                    src: !item.updateTime ? "../../static/logo2.svg" : item.cover
                  }, null, 40, ["onClick", "onLoad", "src"]),
                  vue.createElementVNode("div", { class: "footer" }, [
                    vue.createElementVNode(
                      "div",
                      null,
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "div",
                      null,
                      vue.toDisplayString(item.director),
                      1
                      /* TEXT */
                    )
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "list1"
          }, [
            vue.createVNode(_component_u_empty, {
              text: "暂时还没有收藏记录",
              mode: "search"
            })
          ])),
          vue.createCommentVNode(" 底部遮挡div "),
          vue.createElementVNode("div", { class: "footer-box-bottom" })
        ]);
      };
    }
  };
  const PagesCollectCollect = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-b24c290b"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/collect/collect.vue"]]);
  const _sfc_main$5 = {
    __name: "download",
    setup(__props) {
      let list = vue.ref([]);
      let toDetail = (item) => {
        uni.navigateTo({
          url: "/pages/detail/detail?id=" + item.videoId
        });
      };
      let imageLoad = (item) => {
        item.updateTime = false;
      };
      onShow(() => {
        list.value = uni.getStorageSync("user_history_fiml");
      });
      return (_ctx, _cache) => {
        const _component_u_empty = resolveEasycom(vue.resolveDynamicComponent("u-empty"), __easycom_0$2);
        return vue.openBlock(), vue.createElementBlock("view", { class: "discover-box" }, [
          vue.unref(list).length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(vue.unref(list), (item) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: item.cover,
                  class: "list-item"
                }, [
                  vue.createElementVNode("image", {
                    onClick: ($event) => vue.unref(toDetail)(item),
                    onLoad: ($event) => vue.unref(imageLoad)(item),
                    src: item.updateTime ? "../../static/logo2.svg" : item.cover
                  }, null, 40, ["onClick", "onLoad", "src"]),
                  vue.createElementVNode("div", { class: "footer" }, [
                    vue.createElementVNode(
                      "div",
                      null,
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "div",
                      null,
                      vue.toDisplayString(item.director),
                      1
                      /* TEXT */
                    )
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "list1"
          }, [
            vue.createVNode(_component_u_empty, {
              text: "暂时还没有下载记录",
              mode: "search"
            })
          ])),
          vue.createCommentVNode(" 底部遮挡div "),
          vue.createElementVNode("div", { class: "footer-box-bottom" })
        ]);
      };
    }
  };
  const PagesDownloadDownload = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-0927d71d"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/download/download.vue"]]);
  const _sfc_main$4 = {
    __name: "watch_record",
    setup(__props) {
      let list = vue.ref([]);
      let toDetail = (item) => {
        uni.navigateTo({
          url: "/pages/detail/detail?id=" + item.videoId
        });
      };
      let imageLoad = (item) => {
        item.updateTime = true;
      };
      onShow(() => {
        list.value = uni.getStorageSync("user_history_fiml");
      });
      return (_ctx, _cache) => {
        const _component_u_empty = resolveEasycom(vue.resolveDynamicComponent("u-empty"), __easycom_0$2);
        return vue.openBlock(), vue.createElementBlock("view", { class: "discover-box" }, [
          vue.unref(list).length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(vue.unref(list), (item) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: item.cover,
                  class: "list-item"
                }, [
                  vue.createElementVNode("image", {
                    onClick: ($event) => vue.unref(toDetail)(item),
                    onLoad: ($event) => vue.unref(imageLoad)(item),
                    src: !item.updateTime ? "../../static/logo2.svg" : item.cover
                  }, null, 40, ["onClick", "onLoad", "src"]),
                  vue.createElementVNode("div", { class: "footer" }, [
                    vue.createElementVNode(
                      "div",
                      null,
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "div",
                      null,
                      vue.toDisplayString(item.director),
                      1
                      /* TEXT */
                    )
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "list1"
          }, [
            vue.createVNode(_component_u_empty, {
              text: "暂时还没有观看记录",
              mode: "search"
            })
          ])),
          vue.createCommentVNode(" 底部遮挡div "),
          vue.createElementVNode("div", { class: "footer-box-bottom" })
        ]);
      };
    }
  };
  const PagesWatch_recordWatch_record = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-01c6c56c"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/watch_record/watch_record.vue"]]);
  const _sfc_main$3 = {
    name: "UniSection",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      title: {
        type: String,
        required: true,
        default: ""
      },
      titleFontSize: {
        type: String,
        default: "14px"
      },
      titleColor: {
        type: String,
        default: "#333"
      },
      subTitle: {
        type: String,
        default: ""
      },
      subTitleFontSize: {
        type: String,
        default: "12px"
      },
      subTitleColor: {
        type: String,
        default: "#999"
      },
      padding: {
        type: [Boolean, String],
        default: false
      }
    },
    computed: {
      _padding() {
        if (typeof this.padding === "string") {
          return this.padding;
        }
        return this.padding ? "10px" : "";
      }
    },
    watch: {
      title(newVal) {
        if (uni.report && newVal !== "") {
          uni.report("title", newVal);
        }
      }
    },
    methods: {
      onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-section" }, [
      vue.createElementVNode("view", {
        class: "uni-section-header",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
      }, [
        $props.type ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass(["uni-section-header__decoration", $props.type])
          },
          null,
          2
          /* CLASS */
        )) : vue.renderSlot(_ctx.$slots, "decoration", { key: 1 }, void 0, true),
        vue.createElementVNode("view", { class: "uni-section-header__content" }, [
          vue.createElementVNode(
            "text",
            {
              style: vue.normalizeStyle({ "font-size": $props.titleFontSize, "color": $props.titleColor }),
              class: vue.normalizeClass(["uni-section__content-title", { "distraction": !$props.subTitle }])
            },
            vue.toDisplayString($props.title),
            7
            /* TEXT, CLASS, STYLE */
          ),
          $props.subTitle ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              style: vue.normalizeStyle({ "font-size": $props.subTitleFontSize, "color": $props.subTitleColor }),
              class: "uni-section-header__content-sub"
            },
            vue.toDisplayString($props.subTitle),
            5
            /* TEXT, STYLE */
          )) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "uni-section-header__slot-right" }, [
          vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
        ])
      ]),
      vue.createElementVNode(
        "view",
        {
          class: "uni-section-content",
          style: vue.normalizeStyle({ padding: $options._padding })
        },
        [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render], ["__scopeId", "data-v-637fd36b"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uni-section/components/uni-section/uni-section.vue"]]);
  const _sfc_main$2 = {
    __name: "edit_user",
    setup(__props) {
      vue.ref();
      let items = vue.ref([
        {
          value: "1",
          name: "男",
          color: "#007aff"
        },
        {
          value: "0",
          name: "女",
          color: "#d04a92"
        }
      ]);
      vue.ref(0);
      let user = vue.ref({});
      onShow(() => {
        user.value = uni.getStorageSync("userInfo");
      });
      let radioChange = (e) => {
        user.value.user_sex = e.detail.value;
      };
      let isSubmitLoading = vue.ref(false);
      let submit_ = () => {
        let { user_name } = user.value;
        user.value.user_name = user_name.trim();
        if (user_name.trim()) {
          if (user_name.trim().length > 10) {
            msgError("昵称长度不能超过10个字符!");
            return;
          }
        } else {
          msgError("昵称不能为空!");
          return;
        }
        isSubmitLoading.value = true;
        updateUserInfo(user.value).then((res) => {
          uni.setStorageSync("userInfo", user.value);
          msgSuccess(res.msg);
          uni.navigateBack();
        }).catch((err) => {
          isSubmitLoading.value = false;
        });
      };
      return (_ctx, _cache) => {
        const _component_uni_section = resolveEasycom(vue.resolveDynamicComponent("uni-section"), __easycom_0);
        return vue.openBlock(), vue.createElementBlock("view", { class: "discover-box" }, [
          vue.createVNode(_component_uni_section, {
            titleColor: "white",
            style: { "background-color": "#080d16" },
            title: "昵称",
            type: "line"
          }, {
            default: vue.withCtx(() => [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  style: { "padding-left": "1.1rem" },
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(user).user_name = $event),
                  placeholder: "请输入昵称"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, vue.unref(user).user_name]
              ])
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_uni_section, {
            titleColor: "white",
            style: { "background-color": "#080d16", "margin-top": "1rem" },
            title: "性别",
            type: "line"
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode(
                "radio-group",
                {
                  style: { "display": "flex", "justify-content": "space-around" },
                  onChange: _cache[1] || (_cache[1] = (...args) => vue.unref(radioChange) && vue.unref(radioChange)(...args))
                },
                [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(vue.unref(items), (item, index2) => {
                      return vue.openBlock(), vue.createElementBlock("label", {
                        style: { "display": "flex" },
                        key: item.value
                      }, [
                        vue.createElementVNode("view", null, [
                          vue.createElementVNode("radio", {
                            value: item.value,
                            color: item.color,
                            checked: item.value === vue.unref(user).user_sex
                          }, null, 8, ["value", "color", "checked"])
                        ]),
                        vue.createElementVNode(
                          "view",
                          null,
                          vue.toDisplayString(item.name),
                          1
                          /* TEXT */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ],
                32
                /* HYDRATE_EVENTS */
              )
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createElementVNode("button", {
            onClick: _cache[2] || (_cache[2] = (...args) => vue.unref(submit_) && vue.unref(submit_)(...args)),
            disabled: vue.unref(isSubmitLoading),
            loading: vue.unref(isSubmitLoading),
            class: "sub"
          }, "保存", 8, ["disabled", "loading"])
        ]);
      };
    }
  };
  const PagesEdit_userEdit_user = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-702a44f5"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/edit_user/edit_user.vue"]]);
  const hot1 = "/static/hot/hot1.svg";
  const hot2 = "/static/hot/hot2.svg";
  const hot3 = "/static/hot/hot3.svg";
  const _sfc_main$1 = {
    __name: "hot",
    setup(__props) {
      setFullscreen(false);
      let hotFirstListClass = vue.ref([
        {
          class: "hot_top1 hot",
          src: hot1
        },
        {
          class: "hot_top2 hot",
          src: hot2
        },
        {
          class: "hot_top3 hot",
          src: hot3
        }
      ]);
      let imageLoad = (item) => {
        item.updateTime = false;
      };
      let hotList = vue.ref([]);
      let handlerGetHotList = () => {
        getHotList().then((res) => {
          hotList.value = res.data.map((x) => {
            x.updateTime = true;
            return x;
          });
          uni.stopPullDownRefresh();
        });
      };
      vue.onMounted(() => {
        handlerGetHotList();
      });
      onPullDownRefresh(() => {
        handlerGetHotList();
      });
      let toPlay = (item) => {
        uni.navigateTo({
          url: "/pages/detail/detail?id=" + item.hot_video_id
        });
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
          vue.createCommentVNode(" top1 "),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(vue.unref(hotList).slice(0, 3), (item, index2) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                key: item.hot_video_id,
                onClick: ($event) => vue.unref(toPlay)(item),
                class: vue.normalizeClass(vue.unref(hotFirstListClass)[index2].class)
              }, [
                vue.createElementVNode("image", {
                  mode: "aspectFill",
                  src: item.updateTime ? "../../static/logo2.svg" : item.hot_video_img,
                  onLoad: ($event) => vue.unref(imageLoad)(item)
                }, null, 40, ["src", "onLoad"]),
                vue.createElementVNode("div", { class: "footer" }, [
                  vue.createElementVNode(
                    "div",
                    null,
                    vue.toDisplayString(item.hot_video_name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "div",
                    null,
                    vue.toDisplayString(item.hot_video_director || "暂无导演"),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "div",
                  { class: "iocn_hot" },
                  "人气指数:" + vue.toDisplayString(item.hot_play_number),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "div",
                  { class: "hot_number" },
                  "热播榜TOP" + vue.toDisplayString(index2 + 1),
                  1
                  /* TEXT */
                )
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          vue.createCommentVNode(" top1 "),
          vue.createElementVNode("div", { class: "hot_list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(vue.unref(hotList).slice(3, 10), (item) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: item.hot_video_id,
                  onClick: ($event) => vue.unref(toPlay)(item),
                  class: "item"
                }, [
                  vue.createElementVNode("image", {
                    mode: "aspectFill",
                    onLoad: ($event) => vue.unref(imageLoad)(item),
                    src: item.updateTime ? "../../static/logo2.svg" : item.hot_video_img
                  }, null, 40, ["onLoad", "src"]),
                  vue.createElementVNode("div", { class: "item_info" }, [
                    vue.createElementVNode(
                      "span",
                      { class: "title" },
                      vue.toDisplayString(item.hot_video_name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "span",
                      { class: "dra" },
                      vue.toDisplayString(item.hot_video_director || "暂无导演"),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "span",
                      { class: "hot_number" },
                      "人气指数:" + vue.toDisplayString(item.hot_play_number),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("image", {
                    class: "toImg",
                    src: "/static/hot/to.svg",
                    mode: ""
                  })
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          !vue.unref(hotList).length ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            style: { "width": "100%", "height": "100vh", "color": "white", "font-weight": "1rem", "display": "flex", "justify-content": "center", "align-items": "center" }
          }, " 暂无排行榜!")) : vue.createCommentVNode("v-if", true)
        ]);
      };
    }
  };
  const PagesHotHot = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__file", "F:/Qffiction/app1/uni-app/commApp/pages/hot/hot.vue"]]);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/home/home", PagesHomeHome);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/detail/detail", PagesDetailDetail);
  __definePage("pages/search/search", PagesSearchSearch);
  __definePage("pages/security_policy/security_policy", PagesSecurity_policySecurity_policy);
  __definePage("pages/register/register", PagesRegisterRegister);
  __definePage("pages/collect/collect", PagesCollectCollect);
  __definePage("pages/download/download", PagesDownloadDownload);
  __definePage("pages/watch_record/watch_record", PagesWatch_recordWatch_record);
  __definePage("pages/edit_user/edit_user", PagesEdit_userEdit_user);
  __definePage("pages/hot/hot", PagesHotHot);
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      uni.setStorageSync("update_key", "1.0.1");
      return () => {
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "F:/Qffiction/app1/uni-app/commApp/App.vue"]]);
  const { toString } = Object.prototype;
  function isArray(val) {
    return toString.call(val) === "[object Array]";
  }
  function isObject(val) {
    return val !== null && typeof val === "object";
  }
  function isDate(val) {
    return toString.call(val) === "[object Date]";
  }
  function isURLSearchParams(val) {
    return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
  }
  function forEach(obj, fn) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (let i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }
  function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
  }
  function deepMerge$1() {
    const result = {};
    function assignValue(val, key) {
      if (typeof result[key] === "object" && typeof val === "object") {
        result[key] = deepMerge$1(result[key], val);
      } else if (typeof val === "object") {
        result[key] = deepMerge$1({}, val);
      } else {
        result[key] = val;
      }
    }
    for (let i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }
  function isUndefined(val) {
    return typeof val === "undefined";
  }
  function encode(val) {
    return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  function buildURL(url2, params) {
    if (!params) {
      return url2;
    }
    let serializedParams;
    if (isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      const parts = [];
      forEach(params, (val, key) => {
        if (val === null || typeof val === "undefined") {
          return;
        }
        if (isArray(val)) {
          key = `${key}[]`;
        } else {
          val = [val];
        }
        forEach(val, (v) => {
          if (isDate(v)) {
            v = v.toISOString();
          } else if (isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(`${encode(key)}=${encode(v)}`);
        });
      });
      serializedParams = parts.join("&");
    }
    if (serializedParams) {
      const hashmarkIndex = url2.indexOf("#");
      if (hashmarkIndex !== -1) {
        url2 = url2.slice(0, hashmarkIndex);
      }
      url2 += (url2.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url2;
  }
  function isAbsoluteURL(url2) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url2);
  }
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? `${baseURL.replace(/\/+$/, "")}/${relativeURL.replace(/^\/+/, "")}` : baseURL;
  }
  function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }
  function settle(resolve, reject, response) {
    const { validateStatus } = response.config;
    const status = response.statusCode;
    if (status && (!validateStatus || validateStatus(status))) {
      resolve(response);
    } else {
      reject(response);
    }
  }
  const mergeKeys$1 = (keys, config2) => {
    const config3 = {};
    keys.forEach((prop) => {
      if (!isUndefined(config2[prop])) {
        config3[prop] = config2[prop];
      }
    });
    return config3;
  };
  const adapter = (config2) => new Promise((resolve, reject) => {
    const fullPath = buildURL(buildFullPath(config2.baseURL, config2.url), config2.params);
    const _config = {
      url: fullPath,
      header: config2.header,
      complete: (response) => {
        config2.fullPath = fullPath;
        response.config = config2;
        try {
          if (typeof response.data === "string") {
            response.data = JSON.parse(response.data);
          }
        } catch (e) {
        }
        settle(resolve, reject, response);
      }
    };
    let requestTask;
    if (config2.method === "UPLOAD") {
      delete _config.header["content-type"];
      delete _config.header["Content-Type"];
      const otherConfig = {
        filePath: config2.filePath,
        name: config2.name
      };
      const optionalKeys = [
        "files",
        "timeout",
        "formData"
      ];
      requestTask = uni.uploadFile({ ..._config, ...otherConfig, ...mergeKeys$1(optionalKeys, config2) });
    } else if (config2.method === "DOWNLOAD") {
      if (!isUndefined(config2.timeout)) {
        _config.timeout = config2.timeout;
      }
      requestTask = uni.downloadFile(_config);
    } else {
      const optionalKeys = [
        "data",
        "method",
        "timeout",
        "dataType",
        "responseType",
        "sslVerify",
        "firstIpv4"
      ];
      requestTask = uni.request({ ..._config, ...mergeKeys$1(optionalKeys, config2) });
    }
    if (config2.getTask) {
      config2.getTask(requestTask, config2);
    }
  });
  const dispatchRequest = (config2) => adapter(config2);
  function InterceptorManager() {
    this.handlers = [];
  }
  InterceptorManager.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled,
      rejected
    });
    return this.handlers.length - 1;
  };
  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };
  InterceptorManager.prototype.forEach = function forEach2(fn) {
    this.handlers.forEach((h) => {
      if (h !== null) {
        fn(h);
      }
    });
  };
  const mergeKeys = (keys, globalsConfig, config2) => {
    const config3 = {};
    keys.forEach((prop) => {
      if (!isUndefined(config2[prop])) {
        config3[prop] = config2[prop];
      } else if (!isUndefined(globalsConfig[prop])) {
        config3[prop] = globalsConfig[prop];
      }
    });
    return config3;
  };
  const mergeConfig = (globalsConfig, config2 = {}) => {
    const method = config2.method || globalsConfig.method || "GET";
    let config3 = {
      baseURL: globalsConfig.baseURL || "",
      method,
      url: config2.url || "",
      params: config2.params || {},
      custom: { ...globalsConfig.custom || {}, ...config2.custom || {} },
      header: deepMerge$1(globalsConfig.header || {}, config2.header || {})
    };
    const defaultToConfig2Keys = ["getTask", "validateStatus"];
    config3 = { ...config3, ...mergeKeys(defaultToConfig2Keys, globalsConfig, config2) };
    if (method === "DOWNLOAD") {
      if (!isUndefined(config2.timeout)) {
        config3.timeout = config2.timeout;
      } else if (!isUndefined(globalsConfig.timeout)) {
        config3.timeout = globalsConfig.timeout;
      }
    } else if (method === "UPLOAD") {
      delete config3.header["content-type"];
      delete config3.header["Content-Type"];
      const uploadKeys = [
        "files",
        "filePath",
        "name",
        "timeout",
        "formData"
      ];
      uploadKeys.forEach((prop) => {
        if (!isUndefined(config2[prop])) {
          config3[prop] = config2[prop];
        }
      });
      if (isUndefined(config3.timeout) && !isUndefined(globalsConfig.timeout)) {
        config3.timeout = globalsConfig.timeout;
      }
    } else {
      const defaultsKeys = [
        "data",
        "timeout",
        "dataType",
        "responseType",
        "sslVerify",
        "firstIpv4"
      ];
      config3 = { ...config3, ...mergeKeys(defaultsKeys, globalsConfig, config2) };
    }
    return config3;
  };
  const defaults = {
    baseURL: "",
    header: {},
    method: "GET",
    dataType: "json",
    responseType: "text",
    custom: {},
    timeout: 6e4,
    sslVerify: true,
    firstIpv4: false,
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    }
  };
  var clone = function() {
    function _instanceof(obj, type) {
      return type != null && obj instanceof type;
    }
    var nativeMap;
    try {
      nativeMap = Map;
    } catch (_) {
      nativeMap = function() {
      };
    }
    var nativeSet;
    try {
      nativeSet = Set;
    } catch (_) {
      nativeSet = function() {
      };
    }
    var nativePromise;
    try {
      nativePromise = Promise;
    } catch (_) {
      nativePromise = function() {
      };
    }
    function clone2(parent, circular, depth, prototype, includeNonEnumerable) {
      if (typeof circular === "object") {
        depth = circular.depth;
        prototype = circular.prototype;
        includeNonEnumerable = circular.includeNonEnumerable;
        circular = circular.circular;
      }
      var allParents = [];
      var allChildren = [];
      var useBuffer = typeof Buffer != "undefined";
      if (typeof circular == "undefined")
        circular = true;
      if (typeof depth == "undefined")
        depth = Infinity;
      function _clone(parent2, depth2) {
        if (parent2 === null)
          return null;
        if (depth2 === 0)
          return parent2;
        var child;
        var proto;
        if (typeof parent2 != "object") {
          return parent2;
        }
        if (_instanceof(parent2, nativeMap)) {
          child = new nativeMap();
        } else if (_instanceof(parent2, nativeSet)) {
          child = new nativeSet();
        } else if (_instanceof(parent2, nativePromise)) {
          child = new nativePromise(function(resolve, reject) {
            parent2.then(function(value2) {
              resolve(_clone(value2, depth2 - 1));
            }, function(err) {
              reject(_clone(err, depth2 - 1));
            });
          });
        } else if (clone2.__isArray(parent2)) {
          child = [];
        } else if (clone2.__isRegExp(parent2)) {
          child = new RegExp(parent2.source, __getRegExpFlags(parent2));
          if (parent2.lastIndex)
            child.lastIndex = parent2.lastIndex;
        } else if (clone2.__isDate(parent2)) {
          child = new Date(parent2.getTime());
        } else if (useBuffer && Buffer.isBuffer(parent2)) {
          if (Buffer.from) {
            child = Buffer.from(parent2);
          } else {
            child = new Buffer(parent2.length);
            parent2.copy(child);
          }
          return child;
        } else if (_instanceof(parent2, Error)) {
          child = Object.create(parent2);
        } else {
          if (typeof prototype == "undefined") {
            proto = Object.getPrototypeOf(parent2);
            child = Object.create(proto);
          } else {
            child = Object.create(prototype);
            proto = prototype;
          }
        }
        if (circular) {
          var index2 = allParents.indexOf(parent2);
          if (index2 != -1) {
            return allChildren[index2];
          }
          allParents.push(parent2);
          allChildren.push(child);
        }
        if (_instanceof(parent2, nativeMap)) {
          parent2.forEach(function(value2, key) {
            var keyChild = _clone(key, depth2 - 1);
            var valueChild = _clone(value2, depth2 - 1);
            child.set(keyChild, valueChild);
          });
        }
        if (_instanceof(parent2, nativeSet)) {
          parent2.forEach(function(value2) {
            var entryChild = _clone(value2, depth2 - 1);
            child.add(entryChild);
          });
        }
        for (var i in parent2) {
          var attrs = Object.getOwnPropertyDescriptor(parent2, i);
          if (attrs) {
            child[i] = _clone(parent2[i], depth2 - 1);
          }
          try {
            var objProperty = Object.getOwnPropertyDescriptor(parent2, i);
            if (objProperty.set === "undefined") {
              continue;
            }
            child[i] = _clone(parent2[i], depth2 - 1);
          } catch (e) {
            if (e instanceof TypeError) {
              continue;
            } else if (e instanceof ReferenceError) {
              continue;
            }
          }
        }
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(parent2);
          for (var i = 0; i < symbols.length; i++) {
            var symbol = symbols[i];
            var descriptor = Object.getOwnPropertyDescriptor(parent2, symbol);
            if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
              continue;
            }
            child[symbol] = _clone(parent2[symbol], depth2 - 1);
            Object.defineProperty(child, symbol, descriptor);
          }
        }
        if (includeNonEnumerable) {
          var allPropertyNames = Object.getOwnPropertyNames(parent2);
          for (var i = 0; i < allPropertyNames.length; i++) {
            var propertyName = allPropertyNames[i];
            var descriptor = Object.getOwnPropertyDescriptor(parent2, propertyName);
            if (descriptor && descriptor.enumerable) {
              continue;
            }
            child[propertyName] = _clone(parent2[propertyName], depth2 - 1);
            Object.defineProperty(child, propertyName, descriptor);
          }
        }
        return child;
      }
      return _clone(parent, depth);
    }
    clone2.clonePrototype = function clonePrototype(parent) {
      if (parent === null)
        return null;
      var c = function() {
      };
      c.prototype = parent;
      return new c();
    };
    function __objToStr(o) {
      return Object.prototype.toString.call(o);
    }
    clone2.__objToStr = __objToStr;
    function __isDate(o) {
      return typeof o === "object" && __objToStr(o) === "[object Date]";
    }
    clone2.__isDate = __isDate;
    function __isArray(o) {
      return typeof o === "object" && __objToStr(o) === "[object Array]";
    }
    clone2.__isArray = __isArray;
    function __isRegExp(o) {
      return typeof o === "object" && __objToStr(o) === "[object RegExp]";
    }
    clone2.__isRegExp = __isRegExp;
    function __getRegExpFlags(re) {
      var flags = "";
      if (re.global)
        flags += "g";
      if (re.ignoreCase)
        flags += "i";
      if (re.multiline)
        flags += "m";
      return flags;
    }
    clone2.__getRegExpFlags = __getRegExpFlags;
    return clone2;
  }();
  class Request {
    /**
    * @param {Object} arg - 全局配置
    * @param {String} arg.baseURL - 全局根路径
    * @param {Object} arg.header - 全局header
    * @param {String} arg.method = [GET|POST|PUT|DELETE|CONNECT|HEAD|OPTIONS|TRACE] - 全局默认请求方式
    * @param {String} arg.dataType = [json] - 全局默认的dataType
    * @param {String} arg.responseType = [text|arraybuffer] - 全局默认的responseType。支付宝小程序不支持
    * @param {Object} arg.custom - 全局默认的自定义参数
    * @param {Number} arg.timeout - 全局默认的超时时间，单位 ms。默认60000。H5(HBuilderX 2.9.9+)、APP(HBuilderX 2.9.9+)、微信小程序（2.10.0）、支付宝小程序
    * @param {Boolean} arg.sslVerify - 全局默认的是否验证 ssl 证书。默认true.仅App安卓端支持（HBuilderX 2.3.3+）
    * @param {Boolean} arg.withCredentials - 全局默认的跨域请求时是否携带凭证（cookies）。默认false。仅H5支持（HBuilderX 2.6.15+）
    * @param {Boolean} arg.firstIpv4 - 全DNS解析时优先使用ipv4。默认false。仅 App-Android 支持 (HBuilderX 2.8.0+)
    * @param {Function(statusCode):Boolean} arg.validateStatus - 全局默认的自定义验证器。默认statusCode >= 200 && statusCode < 300
    */
    constructor(arg = {}) {
      if (!isPlainObject(arg)) {
        arg = {};
        formatAppLog("warn", "at uni_modules/uview-plus/libs/luch-request/core/Request.js:39", "设置全局参数必须接收一个Object");
      }
      this.config = clone({ ...defaults, ...arg });
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    /**
    * @Function
    * @param {Request~setConfigCallback} f - 设置全局默认配置
    */
    setConfig(f) {
      this.config = f(this.config);
    }
    middleware(config2) {
      config2 = mergeConfig(this.config, config2);
      const chain = [dispatchRequest, void 0];
      let promise2 = Promise.resolve(config2);
      this.interceptors.request.forEach((interceptor) => {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      this.interceptors.response.forEach((interceptor) => {
        chain.push(interceptor.fulfilled, interceptor.rejected);
      });
      while (chain.length) {
        promise2 = promise2.then(chain.shift(), chain.shift());
      }
      return promise2;
    }
    /**
    * @Function
    * @param {Object} config - 请求配置项
    * @prop {String} options.url - 请求路径
    * @prop {Object} options.data - 请求参数
    * @prop {Object} [options.responseType = config.responseType] [text|arraybuffer] - 响应的数据类型
    * @prop {Object} [options.dataType = config.dataType] - 如果设为 json，会尝试对返回的数据做一次 JSON.parse
    * @prop {Object} [options.header = config.header] - 请求header
    * @prop {Object} [options.method = config.method] - 请求方法
    * @returns {Promise<unknown>}
    */
    request(config2 = {}) {
      return this.middleware(config2);
    }
    get(url2, options = {}) {
      return this.middleware({
        url: url2,
        method: "GET",
        ...options
      });
    }
    post(url2, data, options = {}) {
      return this.middleware({
        url: url2,
        data,
        method: "POST",
        ...options
      });
    }
    put(url2, data, options = {}) {
      return this.middleware({
        url: url2,
        data,
        method: "PUT",
        ...options
      });
    }
    delete(url2, data, options = {}) {
      return this.middleware({
        url: url2,
        data,
        method: "DELETE",
        ...options
      });
    }
    options(url2, data, options = {}) {
      return this.middleware({
        url: url2,
        data,
        method: "OPTIONS",
        ...options
      });
    }
    upload(url2, config2 = {}) {
      config2.url = url2;
      config2.method = "UPLOAD";
      return this.middleware(config2);
    }
    download(url2, config2 = {}) {
      config2.url = url2;
      config2.method = "DOWNLOAD";
      return this.middleware(config2);
    }
  }
  class Router {
    constructor() {
      this.config = {
        type: "navigateTo",
        url: "",
        delta: 1,
        // navigateBack页面后退时,回退的层数
        params: {},
        // 传递的参数
        animationType: "pop-in",
        // 窗口动画,只在APP有效
        animationDuration: 300,
        // 窗口动画持续时间,单位毫秒,只在APP有效
        intercept: false
        // 是否需要拦截
      };
      this.route = this.route.bind(this);
    }
    // 判断url前面是否有"/"，如果没有则加上，否则无法跳转
    addRootPath(url2) {
      return url2[0] === "/" ? url2 : `/${url2}`;
    }
    // 整合路由参数
    mixinParam(url2, params) {
      url2 = url2 && this.addRootPath(url2);
      let query = "";
      if (/.*\/.*\?.*=.*/.test(url2)) {
        query = uni.$u.queryParams(params, false);
        return url2 += `&${query}`;
      }
      query = uni.$u.queryParams(params);
      return url2 += query;
    }
    // 对外的方法名称
    async route(options = {}, params = {}) {
      let mergeConfig2 = {};
      if (typeof options === "string") {
        mergeConfig2.url = this.mixinParam(options, params);
        mergeConfig2.type = "navigateTo";
      } else {
        mergeConfig2 = uni.$u.deepMerge(this.config, options);
        mergeConfig2.url = this.mixinParam(options.url, options.params);
      }
      if (mergeConfig2.url === uni.$u.page())
        return;
      if (params.intercept) {
        this.config.intercept = params.intercept;
      }
      mergeConfig2.params = params;
      mergeConfig2 = uni.$u.deepMerge(this.config, mergeConfig2);
      if (typeof uni.$u.routeIntercept === "function") {
        const isNext = await new Promise((resolve, reject) => {
          uni.$u.routeIntercept(mergeConfig2, resolve);
        });
        isNext && this.openPage(mergeConfig2);
      } else {
        this.openPage(mergeConfig2);
      }
    }
    // 执行路由跳转
    openPage(config2) {
      const {
        url: url2,
        type,
        delta,
        animationType,
        animationDuration
      } = config2;
      if (config2.type == "navigateTo" || config2.type == "to") {
        uni.navigateTo({
          url: url2,
          animationType,
          animationDuration
        });
      }
      if (config2.type == "redirectTo" || config2.type == "redirect") {
        uni.redirectTo({
          url: url2
        });
      }
      if (config2.type == "switchTab" || config2.type == "tab") {
        uni.switchTab({
          url: url2
        });
      }
      if (config2.type == "reLaunch" || config2.type == "launch") {
        uni.reLaunch({
          url: url2
        });
      }
      if (config2.type == "navigateBack" || config2.type == "back") {
        uni.navigateBack({
          delta
        });
      }
    }
  }
  const route = new Router().route;
  function colorGradient(startColor = "rgb(0, 0, 0)", endColor = "rgb(255, 255, 255)", step = 10) {
    const startRGB = hexToRgb(startColor, false);
    const startR = startRGB[0];
    const startG = startRGB[1];
    const startB = startRGB[2];
    const endRGB = hexToRgb(endColor, false);
    const endR = endRGB[0];
    const endG = endRGB[1];
    const endB = endRGB[2];
    const sR = (endR - startR) / step;
    const sG = (endG - startG) / step;
    const sB = (endB - startB) / step;
    const colorArr = [];
    for (let i = 0; i < step; i++) {
      let hex = rgbToHex(`rgb(${Math.round(sR * i + startR)},${Math.round(sG * i + startG)},${Math.round(sB * i + startB)})`);
      if (i === 0)
        hex = rgbToHex(startColor);
      if (i === step - 1)
        hex = rgbToHex(endColor);
      colorArr.push(hex);
    }
    return colorArr;
  }
  function hexToRgb(sColor, str = true) {
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    sColor = String(sColor).toLowerCase();
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = "#";
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      const sColorChange = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`));
      }
      if (!str) {
        return sColorChange;
      }
      return `rgb(${sColorChange[0]},${sColorChange[1]},${sColorChange[2]})`;
    }
    if (/^(rgb|RGB)/.test(sColor)) {
      const arr = sColor.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
      return arr.map((val) => Number(val));
    }
    return sColor;
  }
  function rgbToHex(rgb) {
    const _this = rgb;
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (/^(rgb|RGB)/.test(_this)) {
      const aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
      let strHex = "#";
      for (let i = 0; i < aColor.length; i++) {
        let hex = Number(aColor[i]).toString(16);
        hex = String(hex).length == 1 ? `${0}${hex}` : hex;
        if (hex === "0") {
          hex += hex;
        }
        strHex += hex;
      }
      if (strHex.length !== 7) {
        strHex = _this;
      }
      return strHex;
    }
    if (reg.test(_this)) {
      const aNum = _this.replace(/#/, "").split("");
      if (aNum.length === 6) {
        return _this;
      }
      if (aNum.length === 3) {
        let numHex = "#";
        for (let i = 0; i < aNum.length; i += 1) {
          numHex += aNum[i] + aNum[i];
        }
        return numHex;
      }
    } else {
      return _this;
    }
  }
  function colorToRgba(color2, alpha) {
    color2 = rgbToHex(color2);
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    let sColor = String(color2).toLowerCase();
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = "#";
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      const sColorChange = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`));
      }
      return `rgba(${sColorChange.join(",")},${alpha})`;
    }
    return sColor;
  }
  const colorGradient$1 = {
    colorGradient,
    hexToRgb,
    rgbToHex,
    colorToRgba
  };
  function email(value2) {
    return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value2);
  }
  function mobile(value2) {
    return /^1[23456789]\d{9}$/.test(value2);
  }
  function url(value2) {
    return /^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z].[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/.test(value2);
  }
  function date(value2) {
    if (!value2)
      return false;
    if (number(value2))
      value2 = +value2;
    return !/Invalid|NaN/.test(new Date(value2).toString());
  }
  function dateISO(value2) {
    return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value2);
  }
  function number(value2) {
    return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value2);
  }
  function string(value2) {
    return typeof value2 === "string";
  }
  function digits(value2) {
    return /^\d+$/.test(value2);
  }
  function idCard(value2) {
    return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(
      value2
    );
  }
  function carNo(value2) {
    const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
    const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
    if (value2.length === 7) {
      return creg.test(value2);
    }
    if (value2.length === 8) {
      return xreg.test(value2);
    }
    return false;
  }
  function amount(value2) {
    return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value2);
  }
  function chinese(value2) {
    const reg = /^[\u4e00-\u9fa5]+$/gi;
    return reg.test(value2);
  }
  function letter(value2) {
    return /^[a-zA-Z]*$/.test(value2);
  }
  function enOrNum(value2) {
    const reg = /^[0-9a-zA-Z]*$/g;
    return reg.test(value2);
  }
  function contains(value2, param) {
    return value2.indexOf(param) >= 0;
  }
  function range$1(value2, param) {
    return value2 >= param[0] && value2 <= param[1];
  }
  function rangeLength(value2, param) {
    return value2.length >= param[0] && value2.length <= param[1];
  }
  function landline(value2) {
    const reg = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
    return reg.test(value2);
  }
  function empty(value2) {
    switch (typeof value2) {
      case "undefined":
        return true;
      case "string":
        if (value2.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, "").length == 0)
          return true;
        break;
      case "boolean":
        if (!value2)
          return true;
        break;
      case "number":
        if (value2 === 0 || isNaN(value2))
          return true;
        break;
      case "object":
        if (value2 === null || value2.length === 0)
          return true;
        for (const i in value2) {
          return false;
        }
        return true;
    }
    return false;
  }
  function jsonString(value2) {
    if (typeof value2 === "string") {
      try {
        const obj = JSON.parse(value2);
        if (typeof obj === "object" && obj) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }
    return false;
  }
  function array(value2) {
    if (typeof Array.isArray === "function") {
      return Array.isArray(value2);
    }
    return Object.prototype.toString.call(value2) === "[object Array]";
  }
  function object(value2) {
    return Object.prototype.toString.call(value2) === "[object Object]";
  }
  function code(value2, len = 6) {
    return new RegExp(`^\\d{${len}}$`).test(value2);
  }
  function func(value2) {
    return typeof value2 === "function";
  }
  function promise(value2) {
    return object(value2) && func(value2.then) && func(value2.catch);
  }
  function image(value2) {
    const newValue = value2.split("?")[0];
    const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
    return IMAGE_REGEXP.test(newValue);
  }
  function video(value2) {
    const VIDEO_REGEXP = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv|m3u8)/i;
    return VIDEO_REGEXP.test(value2);
  }
  function regExp(o) {
    return o && Object.prototype.toString.call(o) === "[object RegExp]";
  }
  const test = {
    email,
    mobile,
    url,
    date,
    dateISO,
    number,
    digits,
    idCard,
    carNo,
    amount,
    chinese,
    letter,
    enOrNum,
    contains,
    range: range$1,
    rangeLength,
    empty,
    isEmpty: empty,
    jsonString,
    landline,
    object,
    array,
    code,
    func,
    promise,
    video,
    image,
    regExp,
    string
  };
  let timeout = null;
  function debounce(func2, wait = 500, immediate = false) {
    if (timeout !== null)
      clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow)
        typeof func2 === "function" && func2();
    } else {
      timeout = setTimeout(() => {
        typeof func2 === "function" && func2();
      }, wait);
    }
  }
  let flag;
  function throttle(func2, wait = 500, immediate = true) {
    if (immediate) {
      if (!flag) {
        flag = true;
        typeof func2 === "function" && func2();
        setTimeout(() => {
          flag = false;
        }, wait);
      }
    } else if (!flag) {
      flag = true;
      setTimeout(() => {
        flag = false;
        typeof func2 === "function" && func2();
      }, wait);
    }
  }
  function strip(num, precision = 15) {
    return +parseFloat(Number(num).toPrecision(precision));
  }
  function digitLength(num) {
    const eSplit = num.toString().split(/[eE]/);
    const len = (eSplit[0].split(".")[1] || "").length - +(eSplit[1] || 0);
    return len > 0 ? len : 0;
  }
  function float2Fixed(num) {
    if (num.toString().indexOf("e") === -1) {
      return Number(num.toString().replace(".", ""));
    }
    const dLen = digitLength(num);
    return dLen > 0 ? strip(Number(num) * Math.pow(10, dLen)) : Number(num);
  }
  function checkBoundary(num) {
    {
      if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
        formatAppLog("warn", "at uni_modules/uview-plus/libs/function/digit.js:45", `${num} 超出了精度限制，结果可能不正确`);
      }
    }
  }
  function iteratorOperation(arr, operation) {
    const [num1, num2, ...others] = arr;
    let res = operation(num1, num2);
    others.forEach((num) => {
      res = operation(res, num);
    });
    return res;
  }
  function times(...nums) {
    if (nums.length > 2) {
      return iteratorOperation(nums, times);
    }
    const [num1, num2] = nums;
    const num1Changed = float2Fixed(num1);
    const num2Changed = float2Fixed(num2);
    const baseNum = digitLength(num1) + digitLength(num2);
    const leftValue = num1Changed * num2Changed;
    checkBoundary(leftValue);
    return leftValue / Math.pow(10, baseNum);
  }
  function divide(...nums) {
    if (nums.length > 2) {
      return iteratorOperation(nums, divide);
    }
    const [num1, num2] = nums;
    const num1Changed = float2Fixed(num1);
    const num2Changed = float2Fixed(num2);
    checkBoundary(num1Changed);
    checkBoundary(num2Changed);
    return times(num1Changed / num2Changed, strip(Math.pow(10, digitLength(num2) - digitLength(num1))));
  }
  function round(num, ratio) {
    const base = Math.pow(10, ratio);
    let result = divide(Math.round(Math.abs(times(num, base))), base);
    if (num < 0 && result !== 0) {
      result = times(result, -1);
    }
    return result;
  }
  function range(min = 0, max = 0, value2 = 0) {
    return Math.max(min, Math.min(max, Number(value2)));
  }
  function getPx(value2, unit = false) {
    if (test.number(value2)) {
      return unit ? `${value2}px` : Number(value2);
    }
    if (/(rpx|upx)$/.test(value2)) {
      return unit ? `${uni.upx2px(parseInt(value2))}px` : Number(uni.upx2px(parseInt(value2)));
    }
    return unit ? `${parseInt(value2)}px` : parseInt(value2);
  }
  function sleep(value2 = 30) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, value2);
    });
  }
  function os() {
    return uni.getSystemInfoSync().platform.toLowerCase();
  }
  function sys() {
    return uni.getSystemInfoSync();
  }
  function random(min, max) {
    if (min >= 0 && max > 0 && max >= min) {
      const gab = max - min + 1;
      return Math.floor(Math.random() * gab + min);
    }
    return 0;
  }
  function guid(len = 32, firstU = true, radix = null) {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    const uuid = [];
    radix = radix || chars.length;
    if (len) {
      for (let i = 0; i < len; i++)
        uuid[i] = chars[0 | Math.random() * radix];
    } else {
      let r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
      uuid[14] = "4";
      for (let i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[i == 19 ? r & 3 | 8 : r];
        }
      }
    }
    if (firstU) {
      uuid.shift();
      return `u${uuid.join("")}`;
    }
    return uuid.join("");
  }
  function $parent(name = void 0) {
    let parent = this.$parent;
    while (parent) {
      if (parent.$options && parent.$options.name !== name) {
        parent = parent.$parent;
      } else {
        return parent;
      }
    }
    return false;
  }
  function addStyle(customStyle, target = "object") {
    if (test.empty(customStyle) || typeof customStyle === "object" && target === "object" || target === "string" && typeof customStyle === "string") {
      return customStyle;
    }
    if (target === "object") {
      customStyle = trim(customStyle);
      const styleArray = customStyle.split(";");
      const style = {};
      for (let i = 0; i < styleArray.length; i++) {
        if (styleArray[i]) {
          const item = styleArray[i].split(":");
          style[trim(item[0])] = trim(item[1]);
        }
      }
      return style;
    }
    let string2 = "";
    for (const i in customStyle) {
      const key = i.replace(/([A-Z])/g, "-$1").toLowerCase();
      string2 += `${key}:${customStyle[i]};`;
    }
    return trim(string2);
  }
  function addUnit(value2 = "auto", unit = "") {
    if (!unit) {
      unit = uni.$u.config.unit || "px";
    }
    value2 = String(value2);
    return test.number(value2) ? `${value2}${unit}` : value2;
  }
  function deepClone(obj) {
    if ([null, void 0, NaN, false].includes(obj))
      return obj;
    if (typeof obj !== "object" && typeof obj !== "function") {
      return obj;
    }
    const o = test.array(obj) ? [] : {};
    for (const i in obj) {
      if (obj.hasOwnProperty(i)) {
        o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
      }
    }
    return o;
  }
  function deepMerge(target = {}, source = {}) {
    target = deepClone(target);
    if (typeof target !== "object" || typeof source !== "object")
      return false;
    for (const prop in source) {
      if (!source.hasOwnProperty(prop))
        continue;
      if (prop in target) {
        if (typeof target[prop] !== "object") {
          target[prop] = source[prop];
        } else if (typeof source[prop] !== "object") {
          target[prop] = source[prop];
        } else if (target[prop].concat && source[prop].concat) {
          target[prop] = target[prop].concat(source[prop]);
        } else {
          target[prop] = deepMerge(target[prop], source[prop]);
        }
      } else {
        target[prop] = source[prop];
      }
    }
    return target;
  }
  function error(err) {
    {
      formatAppLog("error", "at uni_modules/uview-plus/libs/function/index.js:238", `uView提示：${err}`);
    }
  }
  function randomArray(array2 = []) {
    return array2.sort(() => Math.random() - 0.5);
  }
  if (!String.prototype.padStart) {
    String.prototype.padStart = function(maxLength, fillString = " ") {
      if (Object.prototype.toString.call(fillString) !== "[object String]") {
        throw new TypeError(
          "fillString must be String"
        );
      }
      const str = this;
      if (str.length >= maxLength)
        return String(str);
      const fillLength = maxLength - str.length;
      let times2 = Math.ceil(fillLength / fillString.length);
      while (times2 >>= 1) {
        fillString += fillString;
        if (times2 === 1) {
          fillString += fillString;
        }
      }
      return fillString.slice(0, fillLength) + str;
    };
  }
  function timeFormat(dateTime = null, formatStr = "yyyy-mm-dd") {
    let date2;
    if (!dateTime) {
      date2 = new Date();
    } else if (/^\d{10}$/.test(dateTime.toString().trim())) {
      date2 = new Date(dateTime * 1e3);
    } else if (typeof dateTime === "string" && /^\d+$/.test(dateTime.trim())) {
      date2 = new Date(Number(dateTime));
    } else {
      date2 = new Date(
        typeof dateTime === "string" ? dateTime.replace(/-/g, "/") : dateTime
      );
    }
    const timeSource = {
      "y": date2.getFullYear().toString(),
      // 年
      "m": (date2.getMonth() + 1).toString().padStart(2, "0"),
      // 月
      "d": date2.getDate().toString().padStart(2, "0"),
      // 日
      "h": date2.getHours().toString().padStart(2, "0"),
      // 时
      "M": date2.getMinutes().toString().padStart(2, "0"),
      // 分
      "s": date2.getSeconds().toString().padStart(2, "0")
      // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (const key in timeSource) {
      const [ret] = new RegExp(`${key}+`).exec(formatStr) || [];
      if (ret) {
        const beginIndex = key === "y" && ret.length === 2 ? 2 : 0;
        formatStr = formatStr.replace(ret, timeSource[key].slice(beginIndex));
      }
    }
    return formatStr;
  }
  function timeFrom(timestamp = null, format = "yyyy-mm-dd") {
    if (timestamp == null)
      timestamp = Number(new Date());
    timestamp = parseInt(timestamp);
    if (timestamp.toString().length == 10)
      timestamp *= 1e3;
    let timer = new Date().getTime() - timestamp;
    timer = parseInt(timer / 1e3);
    let tips = "";
    switch (true) {
      case timer < 300:
        tips = "刚刚";
        break;
      case (timer >= 300 && timer < 3600):
        tips = `${parseInt(timer / 60)}分钟前`;
        break;
      case (timer >= 3600 && timer < 86400):
        tips = `${parseInt(timer / 3600)}小时前`;
        break;
      case (timer >= 86400 && timer < 2592e3):
        tips = `${parseInt(timer / 86400)}天前`;
        break;
      default:
        if (format === false) {
          if (timer >= 2592e3 && timer < 365 * 86400) {
            tips = `${parseInt(timer / (86400 * 30))}个月前`;
          } else {
            tips = `${parseInt(timer / (86400 * 365))}年前`;
          }
        } else {
          tips = timeFormat(timestamp, format);
        }
    }
    return tips;
  }
  function trim(str, pos = "both") {
    str = String(str);
    if (pos == "both") {
      return str.replace(/^\s+|\s+$/g, "");
    }
    if (pos == "left") {
      return str.replace(/^\s*/, "");
    }
    if (pos == "right") {
      return str.replace(/(\s*$)/g, "");
    }
    if (pos == "all") {
      return str.replace(/\s+/g, "");
    }
    return str;
  }
  function queryParams(data = {}, isPrefix = true, arrayFormat = "brackets") {
    const prefix = isPrefix ? "?" : "";
    const _result = [];
    if (["indices", "brackets", "repeat", "comma"].indexOf(arrayFormat) == -1)
      arrayFormat = "brackets";
    for (const key in data) {
      const value2 = data[key];
      if (["", void 0, null].indexOf(value2) >= 0) {
        continue;
      }
      if (value2.constructor === Array) {
        switch (arrayFormat) {
          case "indices":
            for (let i = 0; i < value2.length; i++) {
              _result.push(`${key}[${i}]=${value2[i]}`);
            }
            break;
          case "brackets":
            value2.forEach((_value) => {
              _result.push(`${key}[]=${_value}`);
            });
            break;
          case "repeat":
            value2.forEach((_value) => {
              _result.push(`${key}=${_value}`);
            });
            break;
          case "comma":
            let commaStr = "";
            value2.forEach((_value) => {
              commaStr += (commaStr ? "," : "") + _value;
            });
            _result.push(`${key}=${commaStr}`);
            break;
          default:
            value2.forEach((_value) => {
              _result.push(`${key}[]=${_value}`);
            });
        }
      } else {
        _result.push(`${key}=${value2}`);
      }
    }
    return _result.length ? prefix + _result.join("&") : "";
  }
  function toast(title, duration = 2e3) {
    uni.showToast({
      title: String(title),
      icon: "none",
      duration
    });
  }
  function type2icon(type = "success", fill = false) {
    if (["primary", "info", "error", "warning", "success"].indexOf(type) == -1)
      type = "success";
    let iconName = "";
    switch (type) {
      case "primary":
        iconName = "info-circle";
        break;
      case "info":
        iconName = "info-circle";
        break;
      case "error":
        iconName = "close-circle";
        break;
      case "warning":
        iconName = "error-circle";
        break;
      case "success":
        iconName = "checkmark-circle";
        break;
      default:
        iconName = "checkmark-circle";
    }
    if (fill)
      iconName += "-fill";
    return iconName;
  }
  function priceFormat(number2, decimals = 0, decimalPoint = ".", thousandsSeparator = ",") {
    number2 = `${number2}`.replace(/[^0-9+-Ee.]/g, "");
    const n = !isFinite(+number2) ? 0 : +number2;
    const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    const sep = typeof thousandsSeparator === "undefined" ? "," : thousandsSeparator;
    const dec = typeof decimalPoint === "undefined" ? "." : decimalPoint;
    let s = "";
    s = (prec ? round(n, prec) + "" : `${Math.round(n)}`).split(".");
    const re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, `$1${sep}$2`);
    }
    if ((s[1] || "").length < prec) {
      s[1] = s[1] || "";
      s[1] += new Array(prec - s[1].length + 1).join("0");
    }
    return s.join(dec);
  }
  function getDuration(value2, unit = true) {
    const valueNum = parseInt(value2);
    if (unit) {
      if (/s$/.test(value2))
        return value2;
      return value2 > 30 ? `${value2}ms` : `${value2}s`;
    }
    if (/ms$/.test(value2))
      return valueNum;
    if (/s$/.test(value2))
      return valueNum > 30 ? valueNum : valueNum * 1e3;
    return valueNum;
  }
  function padZero(value2) {
    return `00${value2}`.slice(-2);
  }
  function formValidate(instance, event) {
    const formItem = uni.$u.$parent.call(instance, "u-form-item");
    const form = uni.$u.$parent.call(instance, "u-form");
    if (formItem && form) {
      form.validateField(formItem.prop, () => {
      }, event);
    }
  }
  function getProperty(obj, key) {
    if (!obj) {
      return;
    }
    if (typeof key !== "string" || key === "") {
      return "";
    }
    if (key.indexOf(".") !== -1) {
      const keys = key.split(".");
      let firstObj = obj[keys[0]] || {};
      for (let i = 1; i < keys.length; i++) {
        if (firstObj) {
          firstObj = firstObj[keys[i]];
        }
      }
      return firstObj;
    }
    return obj[key];
  }
  function setProperty(obj, key, value2) {
    if (!obj) {
      return;
    }
    const inFn = function(_obj, keys, v) {
      if (keys.length === 1) {
        _obj[keys[0]] = v;
        return;
      }
      while (keys.length > 1) {
        const k = keys[0];
        if (!_obj[k] || typeof _obj[k] !== "object") {
          _obj[k] = {};
        }
        keys.shift();
        inFn(_obj[k], keys, v);
      }
    };
    if (typeof key !== "string" || key === "")
      ;
    else if (key.indexOf(".") !== -1) {
      const keys = key.split(".");
      inFn(obj, keys, value2);
    } else {
      obj[key] = value2;
    }
  }
  function page() {
    const pages2 = getCurrentPages();
    return `/${pages2[pages2.length - 1].route || ""}`;
  }
  function pages() {
    const pages2 = getCurrentPages();
    return pages2;
  }
  function setConfig({
    props: props2 = {},
    config: config2 = {},
    color: color2 = {},
    zIndex: zIndex2 = {}
  }) {
    const {
      deepMerge: deepMerge2
    } = uni.$u;
    uni.$u.config = deepMerge2(uni.$u.config, config2);
    uni.$u.props = deepMerge2(uni.$u.props, props2);
    uni.$u.color = deepMerge2(uni.$u.color, color2);
    uni.$u.zIndex = deepMerge2(uni.$u.zIndex, zIndex2);
  }
  const index = {
    range,
    getPx,
    sleep,
    os,
    sys,
    random,
    guid,
    $parent,
    addStyle,
    addUnit,
    deepClone,
    deepMerge,
    error,
    randomArray,
    timeFormat,
    timeFrom,
    trim,
    queryParams,
    toast,
    type2icon,
    priceFormat,
    getDuration,
    padZero,
    formValidate,
    getProperty,
    setProperty,
    page,
    pages,
    setConfig
  };
  const zIndex = {
    toast: 10090,
    noNetwork: 10080,
    // popup包含popup，actionsheet，keyboard，picker的值
    popup: 10075,
    mask: 10070,
    navbar: 980,
    topTips: 975,
    sticky: 970,
    indexListSticky: 965
  };
  let platform = "none";
  platform = "vue3";
  platform = "plus";
  const platform$1 = platform;
  const $u = {
    route,
    date: index.timeFormat,
    // 另名date
    colorGradient: colorGradient$1.colorGradient,
    hexToRgb: colorGradient$1.hexToRgb,
    rgbToHex: colorGradient$1.rgbToHex,
    colorToRgba: colorGradient$1.colorToRgba,
    test,
    type: ["primary", "success", "error", "warning", "info"],
    http: new Request(),
    config,
    // uView配置信息相关，比如版本号
    zIndex,
    debounce,
    throttle,
    mixin,
    mpMixin,
    props: props$v,
    ...index,
    color,
    platform: platform$1
  };
  uni.$u = $u;
  const install = (Vue2) => {
    Vue2.config.globalProperties.$u = $u;
    Vue2.config.globalProperties.$nextTick = (cb) => {
      cb();
    };
    Vue2.mixin(mixin);
  };
  const uviewPlus = {
    install
  };
  function createApp() {
    const app = vue.createVueApp(App);
    app.use(uviewPlus);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue, uni.VueShared);
