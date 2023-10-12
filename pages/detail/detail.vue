<template>
	<view class="info-box">
		<div v-if="!playObj.cover" class="loading-box">
			<image class="loading-img" src="../../static/logo2.svg"></image>
			<u-button v-show="isShowBut" @click="reloadData" style="width: 50%;" :disabled="isDisplay" :text="butText"
				color="linear-gradient(to right, #7e214d, #db6031)"></u-button>
		</div>
		<template v-else>
			<image v-if="!isPlay" class="videoPlayer" mode="aspectFill" @load="bgImageLoad()"
				:src=" playObj.updateTime ? '../../static/logo2.svg' :  playObj.cover"></image>
			<!-- 播放组件 -->
			<video v-else id="videoRef" @timeupdate="onTimeUpdate" :initial-time="currentTime_" @click="longPress"
				:autoplay="true" :playbackRate="30" class="videoPlayer" vslide-gesture-in-fullscreen object-fit="cover"
				:title="playObj.title+'--'+playObj.chapterList[cutIndex].title" controls :play-strategy="2" codec
				:src="play_path" @ended="ended" :danmu-list="danmuList" enable-danmu danmu-btn="true">
			</video>

			<!-- 播放按钮组 -->
			<div :style="{'margin-top':isPlay ? '0rem' : '-3rem'}" class="brief-box">
				<!-- 左边盒子 -->
				<div class="left">
					<u-icon @click="addCollect" size="32" :color="collectObj.color[playObj.isCollect]"
						:name="collectObj.icon[playObj.isCollect]"></u-icon>
					<span> {{ collectObj.text[playObj.isCollect] }} </span>
				</div>
				<!-- 中间盒子 -->
				<div v-if="!isPlay" @click="play" class="center">
					<image src="../../static/detail/playBut.svg"></image>
					<span>立即播放</span>
				</div>
				<!-- 右边盒子 -->
				<div class="right">
					<u-icon @click="sheetShow = true" size="32" color="white" name="setting"></u-icon>
					<span>播放设置</span>
				</div>
			</div>
			<!-- 片名以及详细信息 -->
			<div class="firm-info-box" :style="{'margin-top':isPlay ? '0rem' : '2rem'}">
				<!-- 片名 -->
				<span class="firm-name">
					{{playObj.title}}
				</span>
				<!-- 地区 -->
				<span>
					{{playObj.region}} | {{playObj.releaseTime}} | {{playObj.videoType.replace(',','') || ''}}
				</span>
				<!-- 介绍 -->
				<div class="descs">
					{{playObj.descs}}
				</div>
			</div>
			<!-- 导演以及演员 -->
			<div class="acts-box">
				<div class="myEllipsis"><span class="Directed">导演</span>&nbsp;&nbsp;&nbsp;
					<span>{{playObj.director}}</span>
				</div>
				<div class="myEllipsis"><span class="Cast">主演</span>&nbsp;&nbsp;&nbsp;
					<span>{{playObj.actor}}</span>
				</div>
				<div class="myEllipsis flx"><span class="Cast">选集</span>
					<image @click="ispopUp = true" src="../../static/detail/gengduo.svg"></image>
				</div>
			</div>

			<!-- 播放列表 -->
			<scroll-view scroll-x="true" :scroll-left="cutIndex * 93.9 - 95" class="play_list">
				<div @click="cut(i.chapterPath,index)" v-for="(i,index) in playObj.chapterList" :key="i.chapterPath"
					:class="{'item-active':index === cutIndex}" class="item">
					{{i.title}}
				</div>
			</scroll-view>

			<!-- 更多标题 -->
			<div class="types_boxs">
				<span>
					更多推荐
				</span>
				<image @click="toType" src="../../static/detail/gengduo.svg"></image>
			</div>

			<!-- 更多列表盒子 -->
			<div class="types_list">
				<div v-for="(item,index) in typesList" @click="checkOutPlay(item)" :ref="'play_'+index"
					:key="item.videoId" class="item">
					<image mode="aspectFill" @load="imageLoad(item)"
						:src="item.updateTime ? '../../static/logo2.svg' :  item.cover"></image>
					<span class="myEllipsis">{{item.title}}</span>
				</div>
			</div>
			<!-- 更多标题 -->
			<div class="types_boxs">
				<span>
					<u-icon label="" size="40" name="../../static/detail/comment.svg"></u-icon>
				</span>
			</div>
			<!-- 无评论 -->
			<u-empty v-if="!comm_countList.length" icon="../../static/detail/noComment.svg" text=" ">
				<slot>
					<u-button @click="commentShow = true" style="margin-top: -1rem; margin-bottom: 1rem;" type="primary"
						size="mini" color="linear-gradient(to right, #4851d6, #ce34bb)" text="评论一下"></u-button>
				</slot>
			</u-empty>
			<u-modal :show="commentShow" @cancel="commentShow = false" @confirm='commentConfirm'
				:showCancelButton="true" title="请输入你对影片的评价">
				<view class="slot-content">
					<u--input style="border: 1rpx solid #ccc;" placeholder="请输入内容" border="surround"
						v-model="comment_val"></u--input>
					<u-rate style="margin-left: 3rem; margin-top: 1rem;" :count="5" v-model="comment_count"></u-rate>
				</view>
			</u-modal>
			<!-- 评论列表 -->

			<view v-if="comm_countList.length" class="comm_container">
				<view v-for="item in comm_countList" :key="item.time" class="item">
					<u-avatar shape="circle" :src="item.user_image"></u-avatar>
					<view class="title">
						<span class="user_name">{{item.user_name}}</span>
						<span class="comment_val">{{item.comment}}</span>
					</view>
					<view class="time">
						<span>{{item.time}}</span>
						<u-rate activeColor="#FFA500" size="13" readonly v-model="item.film_rate"></u-rate>
					</view>
				</view>
			</view>

			<!-- 评论浮动按钮 -->
			<button :style="{'right':isShowCommentBut ? '1rem' :'-5rem'}" @click="commentShow = true"
				class="comment_but">评论一下</button>
		</template>

		<!-- 播放速度设置 -->
		<u-action-sheet :actions="playSettingList" :round="20" @select="sheetClose" @close="sheetClose"
			:safeAreaInsetBottom="true" :closeOnClickOverlay="true" :closeOnClickAction="true" title="播放设置"
			:show="sheetShow"></u-action-sheet>

		<!-- 选集操作 -->
		<u-popup :show="ispopUp" @close="handleClose" :overlay="true" bgColor="#0f161d" :closeable="true"
			:safeAreaInsetBottom="true" mode="bottom">
			<view class="XJ">
				<div @click="cut(i.chapterPath,index)" v-for="(i,index) in playObj.chapterList" :key="i.chapterPath"
					:class="{'item-active':index === cutIndex}" class="XJ_item">
					{{i.title}}
				</div>
			</view>
		</u-popup>
	</view>
</template>

<script setup>
	import {
		markRaw,
		nextTick,
		onMounted,
		ref,
		getCurrentInstance,
		onUnmounted
	} from "vue";
	import {
		onLoad,
		onPageScroll
	} from "@dcloudio/uni-app"
	import {
		getFindByVideoId,
		getFindByVideoType
	} from '@/api/get.js'
	import {
		userCollect,
		userCancelCollect,
		addHot,
		comment,
		queryUserComment
	} from '@/api/user.js'
	import {
		msgSuccess,
		msgError
	} from '@/utils/toast.js'


	// 收藏样式对象
	let collectObj = ref({
		color: {
			'0': '#FFF', //未收藏
			'1': '#D52B4D' //已收藏
		},
		icon: {
			'0': 'heart',
			'1': 'heart-fill'
		},
		text: {
			'0': '立即收藏',
			'1': '已收藏'
		}
	})



	// 播放对象
	let playObj = ref({})
	// 播放地址
	let play_path = ref('')
	// 传过来的id
	let playId = ''
	// 按钮禁用变量
	let isDisplay = ref(false)
	// 按钮文字变量
	let butText = ref('重新加载')
	// 是否显示加载按钮
	let isShowBut = ref(false)
	// 播放设置参数
	let playSettingList = [{
		name: '1X播放',
		value: 1.0
	}, {
		name: '1.25X播放',
		value: 1.25
	}, {
		name: '1.5X播放',
		value: 1.5
	}]


	// 是否显示设置面板
	let sheetShow = ref(false)

	// 分类标题
	let typeTitle = ref('')

	// 分类列表数据
	let typesList = ref([])

	// 当前播放的时长  用于退出存储
	let currentTime_ = ref(0)

	//退出时记录的时长
	let currentTime1_ = ref(0)

	// 选集是否显示
	let ispopUp = ref(false)

	let handleClose = () => {
		ispopUp.value = false
	}

	// 评论列表
	let comm_countList = ref([])

	// 评论的弹幕
	let danmuList = ref([])

	let getCommentList = () => {
		// 查询本影片评论
		queryUserComment(playId).then(res => {
			comm_countList.value = res.data.reverse()
			// 开启评论监听
			interScObserver()
			// 组合评论
			const rgb = []
			for (let i = 0; i < 3; ++i) {
				let color = Math.floor(Math.random() * 256).toString(16)
				color = color.length == 1 ? '0' + color : color
				rgb.push(color)
			}
			danmuList.value = res.data.map(x => {
				return {
					text: x.comment,
					color: '#' + rgb.join(''),
					time: x.film_time
				}
			})
		})
	}


	// 拉取数据方法
	let getInfo = (options, isGetTypes = true) => {
		let {
			id
		} = options
		// 保存id 和 分类
		playId = id
		getFindByVideoId(id).then(res => {
			if (!res.data) {
				// 没有查询到
				plus.nativeUI.toast(res.msg)
				uni.navigateBack()
			}
			playObj.value = res.data
			// 这里给播放对象添加一个属性 区分收藏
			playObj.value.isCollect = '0'

			// 这里要获取本地滚观看列表 如果有 则取观看列表的时长 和 具体哪一集
			let catch_films_ = uni.getStorageSync('user_history_fiml') || [];
			catch_films_.forEach(x => {
				if (x.videoId == playId) {
					// 设置时长与哪一集
					currentTime_.value = x.progress //设置播放进度
					cutIndex.value = x.cutIndex //设置播放是哪一集
					// 直接播放 
					play()
				}
			})
			uni.hideLoading()
			// 请求分类数据
			typeTitle.value = res.data.videoType
			if (isGetTypes) {
				getTypesList()
			} else {
				isPlay.value = false
			}
			// 获取评论
			getCommentList()
		}).catch(err => {
			// 显示点击重试按钮
			butText.value = '重新加载'
			isDisplay.value = false
			isShowBut.value = true
			uni.hideLoading()
		})
	}

	// 请求分类
	let getTypesList = () => {
		// 获取视频分类
		getFindByVideoType(typeTitle.value).then(res => {
			typesList.value = res.data
		}).catch(err => {
			// 显示点击重试按钮
			getTypesList()
		})
	}



	// 重新拉取数据
	let reloadData = () => {
		// 禁用按钮
		isDisplay.value = true
		butText.value = '加载中...'
		getInfo(playId)
	}
	// 页面加载初始数据
	onLoad((options) => {
		getInfo(options)
	})
	// 切换播放
	// 播放索引下表
	let cutIndex = ref(-1)
	let cut = (path, index) => {
		currentTime_.value = 0
		cutIndex.value = index
		play_path.value = path
		play()
	}

	// 背景图片加载回调
	let bgImageLoad = () => {
		playObj.value.updateTime = false
	}

	// 图片加载回调
	let imageLoad = (item) => {
		item.updateTime = false
	}

	// 开始点击播放
	let isPlay = ref(false)
	let play = () => {
		plus.navigator.setFullscreen(true);
		// 移动盒子高度,展示播放控件
		if (!isPlay.value) {
			let {
				videoId,
				title,
				cover,
				director
			} = playObj.value
			// 异步新增热度
			addHot({
				videoId,
				title,
				cover,
				director
			})
		}
		isPlay.value = true
		//默认开始选中第一个样式显示
		if (cutIndex.value < 0) {
			cutIndex.value = 0
		}
		// 开始加载路径
		setTimeout(() => {
			play_path.value = playObj.value.chapterList[cutIndex.value === -1 ? 0 : cutIndex.value].chapterPath
		}, 500)
	}

	let videoContext = uni.createVideoContext('videoRef', getCurrentInstance())
	// 播放速度设置关闭回调
	let sheetClose = (val) => {
		sheetShow.value = false
		if (val) {
			videoContext.playbackRate(val.value)
			plus.nativeUI.toast('设置成功')
		}
	}

	// 跳转分类页面
	let toType = () => {
		// 暂停本页播放
		videoContext.pause()
		uni.navigateTo({
			url: '../search/search?searchValue=' + playObj.value.videoType + '&type=' + 5
		})
	}

	// 播放完成
	let ended = () => {
		if (cutIndex.value + 1 === playObj.value.chapterList.length) {
			// 播放完成
			plus.nativeUI.toast('全部播放完成')
		} else {
			cutIndex.value += 1
			plus.nativeUI.toast('开始播放' + playObj.value.chapterList[cutIndex.value].title)
			play_path.value = playObj.value.chapterList[cutIndex.value].chapterPath
			play()
		}
	}


	// 更多列表切换播放
	let checkOutPlay = (item) => {
		if (playId != item.videoId) {
			cutIndex.value = 0
			currentTime_.value = 0
			uni.showLoading({
				title: '正在加载...',
				mask: true,
			})
			getInfo({
				id: item.videoId,
				type: item.videoType
			}, false)
		}
	}

	// 收藏视频
	let addCollect = () => {
		let AjaxObj = {
			videoId: playId,
			userId: uni.getStorageSync('userInfo').user_id,
			cover: playObj.value.cover,
			videoType: playObj.value.videoType,
			title: playObj.value.title,
		}
		if (playObj.value.isCollect == '0') {
			// 未收藏
			playObj.value.isCollect = '1'
			// 发送请求
			userCollect(
				AjaxObj).then(res => {
				msgSuccess(res.msg)
			})
		} else {
			// 已经收藏 询问是否取消收藏
			plus.nativeUI.confirm('确定要取消收藏这部电影吗？', function({
				index
			}) {
				if (index === 0) {
					userCancelCollect(AjaxObj).then(res => {
						msgSuccess(res.msg)
						playObj.value.isCollect = '0'
					})
				}
			}, '提示', ['我不想看了', '算了还是看吧']);
		}
	}


	// 视频播放时进度条改变回调
	let onTimeUpdate = (event) => {
		currentTime1_.value = event.detail.currentTime
	}

	// 评论
	let commentShow = ref(false)
	let comment_val = ref('')
	let comment_count = ref(5)


	// 发送评论
	let commentConfirm = () => {
		let com = comment_val.value
		if (!com.trim()) {
			msgError('评论不能为空!')
			return false;
		}
		let {
			user_id
		} = uni.getStorageSync('userInfo')
		let data = {
			userId: user_id,
			comment: comment_val.value,
			film_rate: comment_count.value,
			film_time: currentTime1_.value,
			film_id: playId
		}
		plus.nativeUI.showWaiting('正在上传评论...')
		comment(data).then(res => {
			msgSuccess(res.msg)
			comment_val.value = ''
			comment_count.value = 5
			commentShow.value = false
			plus.nativeUI.closeWaiting()
			getCommentList()
		}).catch(e => {
			plus.nativeUI.closeWaiting()
		})
	}


	// 用户滚动页面 是否显示评论按钮
	let isShowCommentBut = ref(false)

	// 开启页面布局相交状态监测
	let interScObserver = ()=>{
		nextTick(() => {
			setTimeout(() => {
				uni.createIntersectionObserver(getCurrentInstance(), {
					initialRatio: 0.5
				}).relativeToViewport('.info-box').observe('.comm_container', (res => {
					isShowCommentBut.value = res.intersectionRatio > 0
				}))
			}, 1000)
		})
	}
	
	onMounted(()=>{
		interScObserver()
	})
	// onPageScroll((e) => {
	// 	// 如果 没有列表  则不需要弹出
	// 	if (!danmuList.value.length) {
	// 		return;
	// 	}

	// 	// 显示 评论按钮
	// 	scrollTop.value = e.scrollTop
	// })



	onUnmounted(() => {
		// 缓存到本地
		// 先取到本地缓存
		if (isPlay.value) {
			let catch_films = uni.getStorageSync('user_history_fiml') || [];
			// 有数据 直接添加
			// 获取播放的进度秒
			playObj.value.progress = currentTime1_.value
			// 获取播放到第几集
			playObj.value.cutIndex = cutIndex.value
			catch_films.unshift(playObj.value)
			const uniqueArr = catch_films.reduce((acc, cur) => {
				acc.has(cur.videoId) ? acc.get(cur.videoId).name = cur.name : acc.set(cur.videoId, cur);
				return acc;
			}, new Map()).values();
			// 刷新缓存
			uni.setStorageSync('user_history_fiml', [...uniqueArr])
		}
	})
</script>

<style lang="less" scoped>
	.myEllipsis {
		overflow: hidden;
		text-overflow: ellipsis; //文本溢出显示省略号
		white-space: nowrap; //文本不会换行

		image {
			height: 1rem;
			width: 1rem;
		}
	}

	.comment_but {
		position: fixed;
		right: -5rem;
		bottom: 5rem;
		font-size: 0.7rem;
		color: white;
		background-color: #1761e1;
		box-shadow: 0 0 10px #196dfc;
		transition: all .3s ease-in-out;
	}

	.comment_but:active {
		background-color: #155ad0;
	}



	.comm_container {
		width: 100%;

		.item {
			width: 95%;
			margin: auto;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			margin-top: 1rem;
			padding-bottom: 1rem;

			.time {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				margin-top: 1rem;
				font-size: 0.6rem;
				color:#8f949a;
			}

			.title {
				margin-left: 0.5rem;
				width: 80%;
				display: flex;
				flex-direction: column;

				.user_name {
					color: #8f949a;
					font-size: 0.8rem;
					margin-bottom: 0.2rem;
				}

				.comment_val {
					display: -webkit-box;
					-webkit-line-clamp: 3;
					/* 显示的最大行数 */
					-webkit-box-orient: vertical;
					overflow: hidden;
					/* 隐藏溢出的内容 */
					text-overflow: ellipsis;
					/* 显示省略号 */
				}
			}
		}
	}

	.XJ {
		height: 18rem;
		width: 100%;
		margin-top: 2rem;
		padding: 0rem 1rem;
		overflow-y: auto;

		.XJ_item {
			display: inline-block;
			width: 3rem;
			height: 3rem;
			text-align: center;
			background-image: linear-gradient(to right, #ff6e39, #7e214d);
			padding: 0 1rem 0 1rem;
			font-size: 0.7rem;
			border-radius: 0.3rem;
			margin: 0.3rem;
			line-height: 3rem;
		}

		.item-active {
			background-image: linear-gradient(to right, rgb(213, 51, 186), rgb(66, 83, 216));
		}
	}


	.flx {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.info-box {
		width: 100%;
		background-color: #0f161d;
		color: white;
		min-height: calc(100vh);
		position: relative;

		.loading-box {
			width: 100%;
			height: calc(100vh - 50px);
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			.loading-img {
				animation: loadingImg 1s linear infinite alternate;
			}
		}

		@keyframes loadingImg {
			0% {
				opacity: 1;
			}

			50% {
				opacity: 0.5;
			}

			100% {
				opacity: 0.1;
			}
		}

		.videoPlayer {
			width: 100%;
			height: 15rem;
		}


		.play_list {
			width: 100%;
			white-space: nowrap;
			margin: auto;
			transition: 1s all;

			.item {
				display: inline-block;
				width: 3rem;
				height: 3rem;
				text-align: center;
				padding: 0 1rem 0 1rem;
				background-image: linear-gradient(to right, #ff6e39, #7e214d);
				font-size: 0.7rem;
				border-radius: 0.3rem;
				margin: 0.3rem;
				line-height: 3rem;
			}

			.item-active {
				background-image: linear-gradient(to right, rgb(213, 51, 186), rgb(66, 83, 216));
			}
		}


		// 点击事件覆盖盒子高度
		.brief-box-play {
			margin-top: 0rem !important;
			color: red !important;
		}

		.brief-box {
			width: 100%;
			height: 5rem;
			display: flex;
			justify-content: space-around;
			position: relative;
			background-image: linear-gradient(to bottom, rgba(19, 29, 19, 0), rgba(15, 22, 29, 1), rgba(15, 22, 29, 1));
			transition: 1s;

			.left {
				height: 70%;
				width: 20%;
				font-size: 0.8rem;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-around;
			}

			.center {
				height: 100%;
				width: 30%;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 150%;
					position: absolute;
				}

				span {
					margin-top: 6rem;
				}
			}

			.right {
				height: 70%;
				width: 20%;
				font-size: 0.8rem;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-around;
			}
		}

		.acts-box {
			width: 95%;
			margin: auto;
			margin-top: 1rem;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			line-height: 2rem;
			color: #8f949a;
			font-size: 0.8rem;

			.Directed,
			.Cast {
				color: #494f55;
				font-size: 0.9rem;
			}
		}

		.firm-info-box {
			width: 95%;
			margin: auto;
			display: flex;
			flex-direction: column;
			color: #5c636a;
			font-size: 0.9rem;

			.firm-name {
				font-size: 1.2rem;
				color: white;
				margin-bottom: .4rem;
			}

			.descs {
				margin-top: 1rem;
				font-size: 0.8rem;
				color: #8f949a;
				max-height: 6rem;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 5;
				-webkit-box-orient: vertical;
			}
		}


		.types_boxs {
			padding-left: 0.3rem;
			width: 96%;
			height: 2rem;
			margin: auto;
			margin-top: 1rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #5c636a;
			margin-bottom: 0.5rem;

			image {
				height: 50%;
				width: 2rem;
			}
		}

		.types_list {
			width: 95%;
			margin: auto;
			height: 11rem;
			margin-bottom: 1rem;
			color: #8f949a;
			font-size: 0.8rem;
			display: flex;
			overflow: auto;

			.item {
				width: 6rem;
				height: 100%;
				display: flex;
				flex-direction: column;
				flex-shrink: 0;
				margin-left: 0.8rem;

				image {
					width: 100%;
					height: 90%;
					border-radius: 0.2rem;
				}

				span {
					margin-top: 0.5rem;
				}
			}
		}
	}
</style>