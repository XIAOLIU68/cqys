<template>
	<view @touchend="touchend" class="home-box">
		<div ref="bg_ref" @click="touchmove" @longpress="checkImg('更换背景','user_bg')"
			:style="{backgroundImage:`url(${userInfo.user_bg})`,height:`${bg_height}rem`}" class="user-bg-box">
			<!-- 导航栏nav -->
			<div class="nav-box">
				<div class="nav-item" @click.stop="button_show = false">

				</div>
				<div class="nav-item" @click.stop="button_show = false" style=" padding: 0.5rem;">
					<u-icon color="#f9f9f9" size="30" name="setting"></u-icon>
				</div>
			</div>
		</div>
		<!-- 头像 -->
		<div class="user-tx-box">
			<image :style="{height:`${user_img_height}rem`,width:`${user_img_width}rem`,zIndex:'20'}"
				@click="checkImg('更换头像','user_image')" mode="aspectFill" class="user_image" :src="userInfo.user_image">
			</image>
			<div class="user-LV">
				<image :src="lvs[collectNumber >= 100 ? 9 : (Math.floor(collectNumber/10))]" class="LV"
					style="z-index: 20;"></image>
				<div class="lv_name">
					<span>{{userInfo.user_name}}</span>
					<image :src="userInfo.user_sex === '0' ? GenderFemale : GenderMale" class="user-sex"></image>
				</div>
				<!-- 编辑资料 -->
				<button @click="navTo('/pages/edit_user/edit_user')" class="edit-user">编辑资料</button>

			</div>
		</div>

		<!-- 我发布的 关注 粉丝 -->
		<div class="user-nav-box">
			<div class="issue-box" @click="navTo('/pages/collect/collect')">
				<span class="number">{{collectNumber}}</span>
				<span>我的收藏</span>
			</div>
			<div class="issue-box" @click="navTo('/pages/watch_record/watch_record')">
				<span class="number">{{historyNumber}}</span>
				<span>观看记录</span>
			</div>
			<div class="issue-box" @click="toDownload">
				<span class="number">1</span>
				<span>我的下载</span>
			</div>
		</div>
		<div class="function-list-box">
			<div class="item">
				<div class="item-left-box">
					<image src="../../static/home/user.svg"></image>
					<span class="item-title">我的ID：0000{{userInfo.user_id}}</span>
				</div>
				<span></span>
			</div>
			<div @click="toDownload" class="item">
				<div  class="item-left-box">
					<image src="../../static/home/user-aq.svg"></image>
					<span class="item-title">账号与安全</span>
				</div>
				<span></span>
			</div>
			<div @click="toDownload" class="item">
				<div class="item-left-box">
					<image src="../../static/home/ys.svg"></image>
					<span class="item-title">隐私设置</span>
				</div>
				<span></span>
			</div>
			<div @click="feedback" class="item">
				<div class="item-left-box">
					<image src="../../static/home/yjfk.svg"></image>
					<span class="item-title">反馈问题</span>
				</div>
				<span></span>
			</div>
			<div @click="logOut" class="item">
				<div class="item-left-box">
					<image src="../../static/home/user-logout.svg"></image>
					<span class="item-title">退出登录</span>
				</div>
				<span></span>
			</div>
		</div>
		<!-- 底部弹出框 -->
		<u-popup :round='10' safeAreaInsetBottom closeable :show="button_show" @close="close">
			<view class="check_tx">
				<u-button :text="button_showValue" @click="chooseImage"
					color="linear-gradient(to right, #D94BC6, #F9F871)">
				</u-button>
				<u-button text="保存" @click="saveImg" color="linear-gradient(to right, #FF5997, #0078F5)"></u-button>
			</view>
		</u-popup>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from "vue";
	import {
		onLoad,
		onShow,
		onPageScroll,
		onPullDownRefresh
	} from "@dcloudio/uni-app"

	import {
		msgError, msgSuccess
	} from '@/utils/toast.js'

	import {
		setFullscreen
	} from '@/utils/page.js'

	import GenderFemale from '@/static/home/GenderFemale.svg'
	import GenderMale from '../../static/home/GenderMale.svg'


	import {
		uploadTx,
		getUserInfo,
		getimg,
		userFindCollect,
		handleFeedback
	} from '@/api/user.js'
	import LV1 from '../../static/index/LV_1.svg'
	import LV2 from '../../static/index/LV_2.svg'
	import LV3 from '../../static/index/LV_3.svg'
	import LV4 from '../../static/index/LV_4.svg'
	import LV5 from '../../static/index/LV_5.svg'
	import LV6 from '../../static/index/LV_6.svg'
	import LV7 from '../../static/index/LV_7.svg'
	import LV8 from '../../static/index/LV_8.svg'
	import LV9 from '../../static/index/LV_9.svg'
	import LV10 from '../../static/index/LV_10.svg'
	let lvs = ref([
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
	])
	// 用户背景的ref
	let bg_ref = ref(null)

	// 页面加载
	onMounted(() => {
		userInfo.value = uni.getStorageSync('userInfo')
		getClloectNumber()
	})
	// 页面显示时
	let home_ref = ref(null)
	onShow(() => {
		getClloectNumber()
		userInfo.value = uni.getStorageSync('userInfo')
		setFullscreen(false)
	})
	
	let handelGetUserInfo = ()=>{
		getUserInfo(userInfo.value.user_id).then(res => {
			userInfo.value = res.data
			userInfo.value.user_image += '?' + new Date().getTime()
			uni.setStorageSync('userInfo', res.data)
			uni.stopPullDownRefresh()
		})
	}
	
	// 反馈问题
	let feedback = ()=>{
		plus.nativeUI.prompt('简单表述刚才遇到的问题', (res)=>{
			if(res.index === 0){
				// 提交反馈问题
				console.log('，',res.value);
				handleFeedback({
					content:res.value,
					userId:uni.getStorageSync('userInfo').user_id
				}).then(res=>{
					msgSuccess(res.msg)
				})
			}
		}, '提示!', '请在此输入问题', ['提交','取消']);
	}

	// 页面下拉刷新
	onPullDownRefresh(() => {
		handelGetUserInfo()
		getClloectNumber()
	})
	// 背景图高度
	let bg_height = ref(12)
	// 手指开始触摸时触发
	let key = ''
	// 用户头像高度
	let user_img_height = ref(5)
	let user_img_width = ref(5)
	let touchmove = (ev) => {
		clearTimeout(key)
		key = setTimeout(() => {
			bg_height.value = 20
		}, 10)
	}
	let touchend = () => {
		bg_height.value = 12
	}
	// 底部弹出popup
	let button_show = ref(false)
	//底部展示文字 
	let button_showValue = ref('更换头像')
	// 操作的是哪个字段
	let fieldName = ''
	let close = () => {
		button_show.value = false
	}

	// 打开更换头像或背景
	let checkImg = (title, field) => {
		fieldName = field
		button_showValue.value = title
		button_show.value = true
	}

	// 更换头像 / 背景
	let chooseImage = () => {
		try {
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: (res, tempFiles) => {
					uni.showLoading({
						title: '正在上传中..'
					})
					uploadTx(res.tempFilePaths[0], userInfo.value.user_id, fieldName).then(res => {
						plus.nativeUI.toast(res.msg, {
							align: 'center',
							icon: '/static/toast/success.png',
							style: 'inline',
							iconWidth: '20px',
							iconHeight: '20px',
						});
						let time = new Date().getTime()
						if (fieldName == 'user_bg') {
							userInfo.value.user_bg = res.img_url + '?time=' + time
						} else {
							userInfo.value.user_image = res.img_url + '?time=' + time
						}
						handelGetUserInfo()
					}).catch(err => {
						if (err.msg) {
							msgError(err.msg)
						}
					})
					uni.hideLoading();
					button_show.value = false
				}
			})
		} catch (e) {
			//TODO handle the exception
		}
	}

	// 保存头像/背景
	let saveImg = () => {
		plus.gallery.save(userInfo.value.user_image, () => {
			plus.nativeUI.toast('已经在相册里躺好啦')
			button_show.value = false
		}, (err) => {
			plus.nativeUI.toast('保存好像失败了', err)
		});
	}

	// 用户参数对象
	let userInfo = ref({})

	let logOut = () => {
		uni.setStorageSync('isAuthLogin',false)
		uni.redirectTo({
			url: '../login/login'
		})
	}

	// 用户跳转不同页面
	let navTo = (pageUrl) => {
		uni.navigateTo({
			url: pageUrl,
			animationType: "pop-in",

		})
	}

	let collectNumber = ref(0)
	let historyNumber = ref(0)
	// 获取用户的收藏数量
	let getClloectNumber = () => {
		// 同步获取本地缓存的历史记录
		let TempList = uni.getStorageSync('user_history_fiml')
		if (TempList !== null && TempList !== undefined) {
			historyNumber.value = TempList.length
		}
		userFindCollect('number').then(res => {
			collectNumber.value = res.data.total
		})
	}
	
	// 跳转下载页面
	let toDownload = ()=>{
		msgError('功能暂时不可用,敬请期待!')
	}
</script>

<style lang="less">
	::-webkit-scrollbar {
		display: none;
	}

	.home-box {
		background-color: #080d16;
		overflow: hidden;
		height: 100vh;

		.check_tx {
			width: 50%;
			height: 10rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: auto;
			justify-content: space-around;
		}


		.user-bg-box {
			padding-top: var(--status-bar-height); //给组件加个上边距
			width: 100%;
			height: 12rem;
			background-size: cover;
			background-repeat: no-repeat;
			background-color: #f9f9f9;
			transition: 1s;
			background-position: center;

			.nav-box {
				width: 90%;
				height: 3rem;
				color: white;
				font-size: 1rem;
				margin: auto;
				display: flex;
				justify-content: space-between;

				.nav-item {
					padding: 0.5rem;
					backdrop-filter: blur(0.1rem);
					border-radius: 1rem;
				}
			}
		}

		.user-tx-box {
			width: 100%;
			height: 4rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
			margin-top: -10px;

			.progr-box {
				width: 100%;
				height: 2rem;
				text-align: center;
				font-size: 0.7rem;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				color: #ccc;
			}

			.user_image {
				width: 5rem;
				height: 5rem;
				border-radius: 50%;
				border: 0.2rem solid white;
				transition: 1s;
				position: absolute;
				left: 1rem;
				top: -2rem;
				box-shadow: 0px 0px 10px #ccc;
			}

			.user-LV {
				width: 100%;
				height: 4rem;
				display: flex;
				align-items: flex-start;
				justify-content: center;
				font-size: 0.8rem;
				color: #ccc;
				position: relative;

				.LV {
					width: 2rem;
					height: 2rem;
					position: absolute;
					left: 4.5rem;
					top: 1.5rem;
				}

				.lv_name {
					width: 9rem;
					height: 2rem;
					display: flex;
					position: absolute;
					left: 8rem;
					top: 1rem;
					align-items: center;
				}

				.lv_name span {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.user-sex {
					height: 1.5rem;
					width: 1.5rem;
					margin-left: 0.2rem;
				}

				.edit-user {
					position: absolute;
					right: 1rem;
					top: 1.3rem;
					height: 1.6rem;
					width: 5rem;
					font-size: 0.7rem;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #409EFF;
					color: white;
					border-radius: 2rem;
				}
			}
		}

		.user-nav-box {
			width: 95%;
			margin: auto;
			display: flex;
			justify-content: space-around;
			background-color: pink;
			border-radius: 1rem;
			padding: 0.5rem 0rem;
			background-color: #15191f;

			.issue-box {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				color: #999999;
				font-weight: 600;
				font-size: 0.7rem;
			}

			.number {
				color: #409EFF;
				padding-bottom: 0.8rem;
				font-size: 1.5rem;
			}
		}


		.function-list-box {
			width: 100%;
			height: 23rem;
			margin-top: 2rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			margin-bottom: 3rem;
			color: #f8f8f8;

			.item:active {
				background-color: #1d232c;
				color: #3b3e9a;
			}

			.item {
				width: 90%;
				height: 3.5rem;
				border-radius: .5rem;
				overflow: hidden;
				display: flex;
				align-items: center;
				justify-content: space-around;
				background-color: #15191f;

				.item-left-box {
					height: 100%;
					width: 80%;
					display: flex;
					align-items: center;

					.item-title {
						font-size: 0.8rem;
						font-weight: 600;
						margin-left: 1rem;
						color: #999999;
					}
				}

				image {
					width: 1.5rem;
					height: 1.5rem;
				}
			}
		}


	}
</style>