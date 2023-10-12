"use strict";
const uni_modules_uviewPlus_libs_config_props = require("../../libs/config/props.js");
const props = {
  props: {
    // 操作菜单是否展示 （默认false）
    show: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.actionSheet.show
    },
    // 标题
    title: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.actionSheet.title
    },
    // 选项上方的描述信息
    description: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.actionSheet.description
    },
    // 数据
    actions: {
      type: Array,
      default: uni_modules_uviewPlus_libs_config_props.defprops.actionSheet.actions
    },
    // 取消按钮的文字，不为空时显示按钮
    cancelText: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.actionSheet.cancelText
    },
    // 点击某个菜单项时是否关闭弹窗
    closeOnClickAction: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.actionSheet.closeOnClickAction
    },
    // 处理底部安全区（默认true）
    safeAreaInsetBottom: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.actionSheet.safeAreaInsetBottom
    },
    // 小程序的打开方式
    openType: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.actionSheet.openType
    },
    // 点击遮罩是否允许关闭 (默认true)
    closeOnClickOverlay: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.actionSheet.closeOnClickOverlay
    },
    // 圆角值
    round: {
      type: [Boolean, String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.actionSheet.round
    }
  }
};
exports.props = props;
