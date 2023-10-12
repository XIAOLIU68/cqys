<template>
	<view class="content">
		<!-- 登录页 -->
		<!-- 返回按钮 -->
		<div class='back-box'>
			<image  src="../../static/index/back.svg"></image>
		</div>
		<!-- 登录提示标签 -->
		<div class="title-box">
			<span>嘿!</span>
			<span>欢迎登录苍穹影视!</span>
			<div class="title-item">
				<span>欢迎回来～我们等你好久了!</span>
			</div>
		</div>

		<!-- 账号密码框 -->
		<div class="account-box">
			<input type="text" v-model="account" class="account" placeholder="请输入账号"
				placeholder-style="font-size:0.8rem;" />
			<span :style="{'display':ruleTitle.accountRule}" class="account-ruleTitle">看官,不能为空哦!</span>
			<input type="password" @confirm="SubmitLogin" v-model="password" class="password" placeholder="请输入密码"
				placeholder-style="font-size:0.8rem;" />
			<span :style="{'display':ruleTitle.passwordRule}" class="password-ruleTitle">看官,不能为空哦!</span>
			<div class="wj-password">
				<checkbox-group @change="isCheckChange">
					<label>
						<checkbox style="transform:scale(0.7)" color="#5d68b6" value="login" />
						我已同意<b style="color: blue;" @click="toSecurity_policy">用户协议</b>
					</label>
				</checkbox-group>
				<span>忘记密码</span>
			</div>
		</div>

		<!-- 登录按钮 -->
		<div class="login-but-box">
			<button :disabled="islogin" @click="SubmitLogin" class="loginBut">
				{{ islogin ? '登录中...' : '登录' }}
			</button>
		</div>

		<!-- 第三方登录 -->
		<div class="dsf">
			<span class="dsf-item">第三方登录</span>
		</div>

		<!-- QQ OR 微信 -->

		<div class="qq-weix-box">
			<image src="../../static/index/qq.svg"></image>
			<image src="../../static/index/wx.svg"></image>
		</div>
		<div class="regr-box">
			<span class="regr-title">没有账号?</span>
			<span @click.native="toRegister" class="regr-title" style="color: blue;">点击这里</span>
		</div>
	</view>
</template>

<script setup>
	import {
		hideSystemNavigation
	} from '@/utils/page.js'
	import { msgError } from '@/utils/toast.js'
	import {
		onMounted,
		ref
	} from 'vue'
	import {
		login
	} from '@/api/user.js'

	// 跳转用户协议
	let toSecurity_policy = () => {
		uni.navigateTo({
			url: '/pages/security_policy/security_policy',
			animationType: 'slide-in-bottom'
		})
	}

	// 跳转注册页面
	let toRegister = () => {
		uni.redirectTo({
			url: '/pages/register/register',
		})
	}

	// 登录回调
	// 账号/密码
	let account = ref('')
	let password = ref('')
	// 是否同意用户协议
	let isCheck = ref([])
	// 协议切换触发事件
	let isCheckChange = (e) => {
		isCheck.value = e.detail.value
	}
	// 提示语
	let ruleTitle = ref({
		accountRule: 'none',
		passwordRule: 'none'
	})
	// 登录点击禁用标志
	let islogin = ref(false)
	let SubmitLogin = () => {
		if (islogin.value) return false;
		
		if (isNull()) {
			// 判断用户是否勾选用户协议
			if(!isCheck.value.length){
				msgError('请勾选用户协议后,进行登录!')
				return;
			}else{
				// 设置自动登录
				uni.setStorageSync('isAuthLogin',true)
				// 存储本地账号密码
				uni.setStorageSync('accountInfo',{
					account:account.value,
					password:password.value
				})
			}
			islogin.value = true
			login(account.value, password.value).then(res => {
				// 保存用户信息,token
				uni.setStorageSync('userInfo', res.data.userInfo)
				uni.setStorageSync('token', res.data.token)
				uni.switchTab({
					url: '../index/index'
				})
				islogin.value = false
			}).catch(() => {
				islogin.value = false
			})
		} else {
			islogin.value = false
		}
	}

	// 监测登录输入字段是否为空
	let isNull = () => {
		if (!account.value) {
			ruleTitle.value.accountRule = 'block'
			return false;
		} else {
			ruleTitle.value.accountRule = 'none'
		}
		if (!password.value) {
			ruleTitle.value.passwordRule = 'block'
			return false;
		} else {
			ruleTitle.value.passwordRule = 'none'
		}
		return true;
	}

	onMounted(() => {
		hideSystemNavigation()
		
		let isAuthLogin =  uni.getStorageSync('isAuthLogin')
		let accountInfo =  uni.getStorageSync('accountInfo')
		if(isAuthLogin){
			isCheckChange({detail:{value:["login"]}})
			account.value = accountInfo.account
			password.value = accountInfo.password
			SubmitLogin()
		}
	})
</script>

<style lang="less" scoped>
	.content {
		overflow: hidden;
		height: calc(100vh);
		background-color: #fafbff;

		.back-box {
			padding-top: var(--status-bar-height); //给组件加个上边距
		}

		.back-box {
			width: 100%;
			height: 6rem;
			display: flex;
			align-items: center;
			position: relative;

			image {
				width: 2.5rem;
				height: 2.5rem;
				margin-left: 2rem;
			}
		}

		.title-box {
			position: relative;
			margin-top: 2rem;
			padding-left: 2rem;
			width: 100%;
			height: 10rem;
			/*嘿！
			赶紧登录吧!*/
			/** 文本1 */
			font-size: 1.9rem;
			font-weight: 700;
			color: rgba(93, 104, 182, 1.0);
			text-align: left;
			opacity: 0;
			animation: in_keyframes1 1s .1s forwards;

			span {
				display: block;
			}

			.title-item {
				/*欢迎回来～
				我们等你好久了!*/
				opacity: 0.5;
				/** 文本1 */
				font-size: 0.4em;
				font-weight: 400;
				color: rgba(52, 57, 101, 1);
				text-align: left;
				vertical-align: top;
				margin-top: 1rem;
			}
		}

		.account-box {
			width: 100%;
			height: 13rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			color: #5d68b6;
			
			.account-ruleTitle {
				position: absolute;
				top: 3.3rem;
				right: 3rem;
				font-size: 0.7rem;
				color: red;
				animation: rule .5s;
			}

			@keyframes rule {
				25% {
					right: 3.5rem;
				}

				50% {
					right: 3rem;
				}

				75% {
					right: 3.5rem;
				}

				100% {
					right: 3rem;
				}
			}

			.password-ruleTitle {
				position: absolute;
				top: 8.5rem;
				right: 3rem;
				font-size: 0.7rem;
				color: red;
				animation: rule .5s;
			}

			.account {
				/*rectangle 29*/
				width: 14rem;
				height: 3.2rem;
				background: rgba(236, 242, 255, 1);
				border-radius: 1.5rem;
				position: relative;
				padding-left: 4rem;
				padding-right: 1rem;
			}

			.account::before {
				content: '账号 :';
				position: absolute;
				left: 1rem;
				top: 50%;
				transform: translateY(-50%);
				/*邮箱 */
				color: rgba(52, 57, 101, 1);
				opacity: 0.6;
			}


			.password {
				margin-top: 2rem;
				/*rectangle 29*/
				width: 14rem;
				height: 3.2rem;
				background: rgba(236, 242, 255, 1);
				border-radius: 1.5rem;
				position: relative;
				padding-left: 4rem;
				padding-right: 1rem;
			}

			.password::after {
				content: '密码 :';
				position: absolute;
				left: 1rem;
				top: 50%;
				transform: translateY(-50%);
				/*邮箱 */
				color: rgba(52, 57, 101, 1);
				opacity: 0.6;
			}

			.wj-password {
				width: 17.5rem;
				margin-top: 2rem;
				position: relative;
				/*忘记密码?*/
				opacity: 0.5;
				/** 文本1 */
				font-size: 0.7rem;
				font-weight: 400;
				color: rgba(52, 57, 101, 1);
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}

		.login-but-box {
			width: 100%;
			height: 5rem;

			.loginBut {
				/*rectangle 33*/
				width: 19rem;
				height: 2.8rem;
				opacity: 1;
				background: rgba(88, 92, 229, 1);
				box-shadow: 0 0.5rem 1rem 0 rgba(0, 29, 176, 0.3);
				color: white;
				font-weight: 600;
			}

			.loginBut:active {
				background: rgba(59, 62, 154, 1.0);
			}
		}

		.dsf {
			width: 100%;
			height: 0.05rem;
			background-color: aqua;
			font-size: 0.8rem;
			font-weight: 400;
			position: relative;
			background-color: #979AB2;
			margin-top: 3rem;

			.dsf-item {
				color: #979AB2;
				background-color: #fafbff;
				padding: 0 1rem;
				position: absolute;
				left: 50% - 13rem;
				top: -0.6rem;
			}
		}

		.qq-weix-box {
			margin: auto;
			margin-top: 1.5rem;
			width: 70%;
			height: 5rem;
			display: flex;
			justify-content: center;
			align-items: center;
			pointer-events: none;
		}

		.regr-box {
			width: 100%;
			text-align: center;
			position: absolute;
			bottom: 3rem;

			.regr-title {
				/*没有账号? 点击这里*/
				/** 文本1 */
				font-size: 0.7em;
				font-weight: 400;
				color: rgba(52, 57, 101, 1);
			}
		}

	}



	/**
	 * @进入动画定义
	 */
	// 嘿感觉登录吧动画
	@keyframes in_keyframes1 {
		from {
			top: 3rem;
			opacity: 0.1;
		}

		to {
			top: 0;
			opacity: 1;
		}
	}
</style>