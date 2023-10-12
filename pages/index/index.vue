<template>
	<view class="index-box">
		<u-sticky>
			<div class="search-box">
				<image src="../../static/logo2.svg"></image>
				<div class="search">
					<u-search bgColor="#28304c" color="white" :actionStyle="{color:'white'}" :showAction="true"
						actionText="搜索" @search="searchCustom" @custom="searchCustom" :animation="true"
						shape="round"></u-search>
				</div>
			</div>
			<u-notice-bar style="background-color:  #15191f;" color="#0962EA" class="custom-notice-bar"
				:text="text1"></u-notice-bar>
		</u-sticky>
		<u-swiper @click="toDetai2" bgColor="#15191f" show-title previousMargin="50" nextMargin="50" circular
			img-mode="aspectFill" height='400' radius='4' :loading="!list.length" keyName="cover"
			:list="list"></u-swiper>
		<!-- 分类列表div -->
		<div class="list-box">
			<u-tabs @change="tabChange" :lineColor="`url(${lineBg}) 100% 100%`" :current="tabsCurrent"
				:activeStyle="{color: '#0962EA'}" :inactiveStyle="{ color: '#606266' }" lineColor="#6764f6"
				:list="list1"></u-tabs>
			<scroll-view :scroll-y="true" :scroll-x="true" id="swipt" class="swipt">
				<swiper :current="swiperCurrent" @change="scrollChange" class="swipt1">
					<swiper-item v-for="i in list1">
						<mySwipter :type='i.name'></mySwipter>
					</swiper-item>
				</swiper>
			</scroll-view>
		</div>
		<!-- 底部遮挡div -->
		<div class="footer-box-bottom"></div>
		<!-- 返回顶部按钮 -->
		<button @click="toTop" v-if="scrollTop > 300" class="up_but">
			<u-icon size="20" name="arrow-upward"></u-icon>
		</button>

		<u-modal confirmColor="#15191f" :show="updateIsShow" @confirm="update_app" confirmText="立即更新" title="更新提示!">
			<view class="slot-content" style="width: 100%;">
				<view v-for="i in update_contens">
					<u--text type="info" prefixIcon="level" iconStyle="font-size: 19px"
						:text="i.time + '更新清单如下:'"></u--text>
					<view class="text-in" style="max-height: calc(80vh - 10rem); overflow: auto;">
						<u--text v-for="contentVla in i.content" type="info" lineHeight="30" size="13"
							:text="contentVla"></u--text>
						<view class="footer_thore">
							<u--text align="right" type="primary" lineHeight="30" size="13"
								:text="i.footer+i.time"></u--text>
						</view>
					</view>
				</view>
			</view>
		</u-modal>

		<u-modal :show="update_modu" title="苍穹影视更新" :confirmText="downText" @confirm="down_abort">
			<view class="slot-content" style="width: 100%;">
				<u--text type="primary" size="13" :text="'总大小'+down_max+'MB'"></u--text>
				<u--text type="success" size="13" :text="'已下载'+down_byte+'MB'"></u--text>
				<u-line-progress :percentage="downloadProgress" activeColor="#73cf45"></u-line-progress>
			</view>
		</u-modal>
		
		<!-- 上次观看 -->
		<view :style="{'right':isShowHistPLay ? '0px' : '-10rem'}" class="last_viewed" @click="toDetail">
			<img :src="histPLay.cover" alt="">
			<view class="last_info_box">
				<span class="fiml_name fi">{{histPLay.title}}</span>
				<view class="fiml_title fi">点击<span class="active_">继续观看</span></view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref,
		getCurrentInstance,
		nextTick
	} from "vue";
	import {
		getTypeList
	} from '@/api/get.js'
	import {
		isUpdate
	} from '@/api/user.js'
	import {
		onPullDownRefresh,
		onPageScroll,
		onReachBottom,
		onShow
	} from "@dcloudio/uni-app"

	// 组件引入
	import mySwipter from './swiper.vue'

	// 是否全屏显示
	import {
		setFullscreen
	} from '@/utils/page.js'
	// 提示语句
	import {
		msgError
	} from '@/utils/toast.js'

	onShow(() => {
		setFullscreen(false)
	})


	// tabs背景图
	const lineBg =
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII=";

	// tabs
	let list1 = ref([{
		name: '动漫',
	}, {
		name: '动作片'
	}, {
		name: '科幻片'
	}, {
		name: '动画'
	}, {
		name: '日韩动漫'
	}, {
		name: '欧美动漫'
	}, {
		name: '国产动漫'
	}, {
		name: '奇幻'
	}, {
		name: '国产剧'
	}, {
		name: '喜剧'
	}, {
		name: '韩国剧'
	}, {
		name: '爱情片'
	}, {
		name: '战争片'
	}, {
		name: '恐怖片'
	}, {
		name: '喜剧片'
	}, {
		name: '日剧'
	}, {
		name: '犯罪'
	}, {
		name: '日本'
	}, {
		name: '香港剧'
	}, {
		name: '海外动漫'
	}])

	// 轮播图数据
	let list = ref([])
	// 轮播消息
	let text1 = '通告:请仔细甄别视频内网站地址,防止上当受骗,违者后果自负。需要软件定制开发VX:s9080700'

	// 页数 默认是1
	let page = 1
	// tabs改变事件
	let tab_index = 0

	//轮播图点击事件
	let toDetai2 = (item) => {
		uni.navigateTo({
			url: '/pages/detail/detail?id=' + list.value[item].videoId,
		})
	}

	// 滚动条滚动事件
	let scrollTop = ref(0)
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop;
	})

	//返回顶部
	let toTop = () => {
		uni.pageScrollTo({
			scrollTop: 0,
			duration: 500,
		})
	}


	// 下拉刷新
	onPullDownRefresh(() => {
		getList()
		uni.stopPullDownRefresh()
	})

	// swipter改变事件
	//TABS当前索引
	let tabsCurrent = ref(0)
	// swipter当前索引
	let swiperCurrent = ref(0)
	let scrollChange = (event) => {
		tabsCurrent.value = event.detail.current
		// 派发任务加载
		uni.$emit(list1.value[tabsCurrent.value].name)
		list.value = []
		getList(list1.value[tabsCurrent.value].name)
	}
	// tabs改变事件
	let tabChange = (e) => {
		// 通知swipte改变
		swiperCurrent.value = e.index
	}

	// 获取数据
	let getList = (name = '动漫') => {
		getTypeList(name, 1).then(res => {
			list.value = res.data
		}).catch(err => {
			// 继续请求
			getList(name)
		})
	}

	// 搜索点击事件
	let searchCustom = (e) => {
		if (e.trim() !== '') {
			// 跳转搜索页
			uni.navigateTo({
				url: '../search/search?searchValue=' + e
			})
		} else {
			msgError('输入不能为空!')
			console.log(this);
		}
	}

	// 是否弹出更新窗口
	let updateIsShow = ref(false)
	// 更新的列表
	let update_contens = ref([{
		time: '2023/10/8',
		content: [
			'1.全新UI界面,优化体验。',
			'2.新增账号管理,注册,登录。',
			'3.搜索新增分类。',
			'4.新增热度榜。',
			'5.新增收藏功能。',
			'6.新增播放记忆功能,自动追溯到上次播放,以及选集。',
		],
		footer: '苍穹影视团队-'
	}])


	// 开始更新
	let url_ = ''
	let update_modu = ref(false) //下载弹出层
	let downloadProgress = ref(0) //下载进度
	let downText = ref('取消下载') //下载按钮文字
	let is_down = ref(false) //是否正在下载
	let downloadTask = null //下载队列对象

	let down_max = ref(0) //最大下载字节
	let down_byte = ref(0) //已下载字节

	let tempFilePath = null // 下载完成的路径
	let update_app = () => {
		// 下载安装包
		update_modu.value = true
		updateIsShow.value = false
		is_down.value = true
		downloadTask = uni.downloadFile({
			url: url_, // 替换为实际安装包的下载链接
			success(res) {
				// plus.nativeUI.closeWaiting()
				if (res.statusCode === 200) {
					tempFilePath = res.tempFilePath; // 下载完成后的临时文件路径
					downText.value = '立即安装'
					plus.runtime.install(tempFilePath, {
						force: false
					});
				} else {
					msgError('更新失败,请联系作者!');
				}
			},
			fail(err) {
				update_modu.value = false
				msgError('下载错误:' + err);
			}
		});

		downloadTask.onProgressUpdate((e) => {
			downloadProgress.value = e.progress
			down_max.value = (e.totalBytesExpectedToWrite / (1024 * 1024)).toFixed(2)
			down_byte.value = (e.totalBytesWritten / (1024 * 1024)).toFixed(2)
		})
	}


	// 取消 / 重新下载
	let down_abort = () => {
		if (tempFilePath !== null) {
			plus.runtime.install(tempFilePath, {
				force: false
			});
			return;
		}
		let flag = is_down.value
		downText.value = flag ? '立即更新' : '取消下载'
		flag ? downloadTask.abort() : update_app()
		plus.nativeUI.toast(flag ? '已取消下载!' : '开始下载')
		downloadProgress.value = 0
		is_down.value = !is_down.value
	}
	
	// 上次观看记录
	let histPLay = ref({})
	
	let isShowHistPLay = ref(true)

	onMounted(() => {
		// 通知第一页数据开始加载
		// 开始派发任务 而且是tab的索引
		uni.$emit(list1.value[tabsCurrent.value].name)
		// 单独加载首页数据
		getList()

		// 检查是否更新
		let key_ = uni.getStorageSync('update_key')
		isUpdate(key_).then(res => {
			if (!res.data.isUpdate) return;
			url_ = res.data.url
			updateIsShow.value = true
		})
		
		histPLay.value = uni.getStorageSync('user_history_fiml')[0]
		
		setTimeout(()=>{
			isShowHistPLay.value = false
		},5000)
	})
	
	// 点击上次观看记录
	let toDetail = () => {
		uni.navigateTo({
			url: '/pages/detail/detail?id=' + histPLay.value.videoId,
		})
	}
	
</script>

<style lang="less" scoped>
	// 更新弹窗样式覆盖
	:deep(.u-modal__title) {
		color: #2080f0;
	}

	.footer_thore {
		text-align: right;
		color: red;
	}
	
	.last_viewed{
		position: fixed;
		bottom: 1rem;
		right: 0px;
		width: 40%;
		height: 3rem;
		background-color: #272e3a;
		box-shadow: 0 0 10px #86a2ff;
		transition:all 1s ease-in-out;
		img{
			width: 30%;
			position: absolute;
			bottom: -0.2rem;
			border-radius: 2px;
		}
		
		.last_info_box{
			width: 70%;
			height: 100%;
			position: absolute;
			right: 0px;
			text-indent: 0.2rem;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			color: white;
			font-size: 0.7rem;
			.fiml_title{
				font-size: 0.6rem;
			}
			.active_{
				color: #2080f0;
			}
			.fiml_name{
				line-height: 1.4rem;
			}
			.fi{
				margin-top: 5px;
			}
		}
	}

	.text-in {
		text-indent: 1rem;
	}

	.index-box {
		width: 100%;
		background-color: #15191f;
		height: auto;

		.custom-notice-bar {
			margin-bottom: 0.5rem;
		}

		.footer-box-bottom {
			width: 100%;
			height: 3rem;
			margin-bottom: -3rem;
			background-color: #15191f;
		}

		.page-box {
			width: 100%;
			height: 4rem;
			background-color: #28304c;
			margin-top: -1rem;
			display: flex;
			align-items: center;
			justify-content: center;
		}



		.up_but {
			position: sticky;
			bottom: 1rem;
			right: 0rem;
			height: 2.5rem;
			width: 2.5rem;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #28304c;
			box-shadow: 0 1rem 1rem #86a2ff;
			animation: but_key .5s;
			border: 1px solid #86a2ff;
		}

		// 入场动画
		@keyframes but_key {
			0% {
				bottom: -10rem;
			}

			100% {
				right: 1rem;
			}
		}

		.search-box {
			padding-top: var(--status-bar-height); //给组件加个上边距
			width: 100%;
			margin: auto;
			display: flex;
			align-items: center;
			height: 2rem;
			display: flex;
			justify-content: space-around;
			background-color: #15191f;

			image {
				width: 10%;
			}

			.search {
				width: 85%;
			}
		}

		.list-box {
			width: 100%;
			background-color: #15191f;
			margin-top: 0.5rem;
			border-top-left-radius: 1rem;
			border-top-right-radius: 1rem;
			height: auto;


			.swipt {
				// display: flex;
				width: 100%;

				// overflow: auto;
				// overflow-y: hidden;
				// scroll-snap-type: x mandatory;
				.swipt1 {
					width: 100%;
					height: 122rem;
				}
			}
		}

	}
</style>