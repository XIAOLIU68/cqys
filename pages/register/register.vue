<template>
	<view class="content">
		<!-- 注册页 -->
		<!-- 返回按钮 -->
		<div class='back-box'>
			<image @click.native="toBack()" src="../../static/index/back.svg"></image>
		</div>
		<!-- 注册提示标签 -->
		<div class="title-box">
			<span>即刻注册!</span>
			<span>享受精彩影视!</span>
			<div class="title-item">
				<span>欢迎注册～我们就等你了!</span>
			</div>
		</div>

		<!-- 账号密码框 -->
		<div class="account-box">
			<input class="account" type="text" v-model="account" placeholder="请输入账号"
				placeholder-style="font-size:0.8rem;" />
			<span :style="{'display':ruleTitle.accountRule}" class="account-ruleTitle">看官,不能为空哦!</span>
			<span :style="{'display':ruleTitle.accountLengthRule}" class="account-ruleTitle">长度必须是6位!</span>
			<input class="password" type="password" @confirm="SubmitLogin" v-model="password" placeholder="请输入密码"
				placeholder-style="font-size:0.8rem;" />
			<span :style="{'display':ruleTitle.passwordRule}" class="password-ruleTitle">看官,不能为空哦!</span>
			<span :style="{'display':ruleTitle.passwordtLengthRule}" class="password-ruleTitle">长度必须是6位!</span>
			<input class="password" type="password" @confirm="SubmitLogin" v-model="password1" placeholder="请再次输入密码"
				placeholder-style="font-size:0.8rem;" />
			<span :style="{'display':ruleTitle.passwordRule1}"
				class="password-ruleTitle ruleTitle1">看官,不能为空哦!</span><strong></strong>
			<span :style="{'display':ruleTitle.passwordIsEques}"
				class="password-ruleTitle ruleTitle1">两次密码输入不一致,请重新输入</span><strong></strong>
		</div>

		<!-- 注册按钮 -->
		<div class="login-but-box">
			<button :disabled="islogin" @click="SubmitLogin" class="loginBut">
				{{ islogin ? '注册中...' : '注册' }}
			</button>
		</div>

		<div class="regr-box">
			<span class="regr-title">已有账号?</span>
			<span @click="toBack" class="regr-title" style="color: blue;">返回登录</span>
		</div>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue'
	import {
		hideSystemNavigation
	} from '@/utils/page.js'
	import {msgSuccess} from '@/utils/toast.js'
	import {
		register
	} from '@/api/user.js'
	let toBack = () => {
		console.log('OK啊');
		uni.redirectTo({
			url: '/pages/login/login'
		})
	}

	// 跳转用户协议
	let toSecurity_policy = () => {
		uni.navigateTo({
			url: '/pages/security_policy/security_policy',
			animationType: 'slide-in-bottom'
		})
	}

	// 注册回调
	// 账号/密码
	let account = ref('')
	let password = ref('')
	let password1 = ref('')
	// 提示语
	let ruleTitle = ref({
		accountRule: 'none',
		accountLengthRule: 'none',

		passwordRule: 'none',
		passwordRule1: 'none',
		passwordIsEques: 'none',
		passwordtLengthRule: 'none'
	})
	// 注册点击禁用标志
	let islogin = ref(false)
	let SubmitLogin = () => {
		if (islogin.value) return false;
		if (isNull()) {
			islogin.value = true
			register(account.value, password.value,password1.value).then(res => {
				msgSuccess(res.msg)
				uni.redirectTo({
					url:'/pages/login/login'
				})
			}).catch(() => {
				islogin.value = false
			})
		} else {
			islogin.value = false
		}
	}


	// 每次显示其他的之前 先清除所有的警告
	let clearRule = () => {
		ruleTitle.value = {
			accountRule: 'none',
			accountLengthRule: 'none',

			passwordRule: 'none',
			passwordRule1: 'none',
			passwordIsEques: 'none',
			passwordtLengthRule: 'none'
		}
	}

	// 监测注册输入字段是否为空
	let isNull = () => {
		let account_ = account.value.trim()
		let password_ = password.value.trim()
		if (!account_) {
			clearRule()
			ruleTitle.value.accountRule = 'block'
			return false;
		} else {
			ruleTitle.value.accountRule = 'none'
		}

		if (!password_) {
			clearRule()
			ruleTitle.value.passwordRule = 'block'
			return false;
		} else {
			ruleTitle.value.passwordRule = 'none'
		}

		if (!password1.value.trim()) {
			clearRule()
			ruleTitle.value.passwordRule1 = 'block'
			return false;
		} else {
			ruleTitle.value.passwordRule1 = 'none'
		}


		// 密码是否相等
		if (password_ !== password1.value) {
			clearRule()
			ruleTitle.value.passwordIsEques = 'block'
			return false;
		} else {
			ruleTitle.value.passwordIsEques = 'none'
		}

		// 账号 密码长度是否都为六位
		if (account_.length < 6) {
			clearRule()
			ruleTitle.value.accountLengthRule = 'block'
			return;
		} else {
			ruleTitle.value.accountLengthRule = 'none'
		}

		if (password_.length < 6) {
			clearRule()
			ruleTitle.value.passwordtLengthRule = 'block'
			return;
		} else {
			ruleTitle.value.passwordtLengthRule = 'none'
		}



		return true;
	}


	onMounted(() => {
		hideSystemNavigation()
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
			赶紧注册吧!*/
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

			.ruleTitle1 {
				top: 13.7rem;
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
			margin-top: 3rem;

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
	// 嘿感觉注册吧动画
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