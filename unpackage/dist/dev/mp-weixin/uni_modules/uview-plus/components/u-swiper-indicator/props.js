"use strict";
const uni_modules_uviewPlus_libs_config_props = require("../../libs/config/props.js");
const props = {
  props: {
    // 轮播的长度
    length: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.swiperIndicator.length
    },
    // 当前处于活动状态的轮播的索引
    current: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.swiperIndicator.current
    },
    // 指示器非激活颜色
    indicatorActiveColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.swiperIndicator.indicatorActiveColor
    },
    // 指示器的激活颜色
    indicatorInactiveColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.swiperIndicator.indicatorInactiveColor
    },
    // 指示器模式，line-线型，dot-点型
    indicatorMode: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.swiperIndicator.indicatorMode
    }
  }
};
exports.props = props;
