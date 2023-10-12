"use strict";
const uni_modules_uviewPlus_libs_config_props = require("../../libs/config/props.js");
const props = {
  props: {
    // 滑块的移动过渡时间，单位ms
    duration: {
      type: Number,
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabs.duration
    },
    // tabs标签数组
    list: {
      type: Array,
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabs.list
    },
    // 滑块颜色
    lineColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabs.lineColor
    },
    // 菜单选择中时的样式
    activeStyle: {
      type: [String, Object],
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabs.activeStyle
    },
    // 菜单非选中时的样式
    inactiveStyle: {
      type: [String, Object],
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabs.inactiveStyle
    },
    // 滑块长度
    lineWidth: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabs.lineWidth
    },
    // 滑块高度
    lineHeight: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabs.lineHeight
    },
    // 滑块背景显示大小，当滑块背景设置为图片时使用
    lineBgSize: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabs.lineBgSize
    },
    // 菜单item的样式
    itemStyle: {
      type: [String, Object],
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabs.itemStyle
    },
    // 菜单是否可滚动
    scrollable: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabs.scrollable
    },
    // 当前选中标签的索引
    current: {
      type: [Number, String],
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabs.current
    },
    // 默认读取的键名
    keyName: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabs.keyName
    }
  }
};
exports.props = props;
