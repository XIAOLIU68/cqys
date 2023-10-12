<template>
	<view class="discover-box">
		<uni-section titleColor="white" style="background-color: #080d16;" title="昵称" type="line">
			<input style="padding-left: 1.1rem;" v-model="user.user_name" placeholder="请输入昵称" />
		</uni-section>
		<uni-section titleColor="white" style="background-color: #080d16;margin-top: 1rem;" title="性别" type="line">
			<radio-group style="display: flex; justify-content: space-around;" @change="radioChange">
				<label style="display: flex;" v-for="(item, index) in items" :key="item.value">
					<view>
						<radio :value="item.value" :color="item.color" :checked="item.value === user.user_sex" />
					</view>
					<view>{{item.name}}</view>
				</label>
			</radio-group>
		</uni-section>

		<button @click="submit_" :disabled="isSubmitLoading" :loading="isSubmitLoading" class="sub">保存</button>
	</view>
</template>

<script setup>
	import {
		updateUserInfo
	} from '@/api/user.js'
	import {
		ref
	} from "vue";
	import { msgSuccess,msgError } from '@/utils/toast.js'
	import {
		onShow
	} from  "@dcloudio/uni-app"
	let value = ref()
	let items = ref([{
			value: '1',
			name: '男',
			color: '#007aff'
		},
		{
			value: '0',
			name: '女',
			color: '#d04a92'
		}
	])
	let current = ref(0)
	let user = ref({})
	onShow(()=>{
		// 读取用户本地信息
		user.value = uni.getStorageSync('userInfo')
	})
	
	// 性别选择改变事件
	let radioChange = (e)=>{
		user.value.user_sex = e.detail.value
	}
	
	let isSubmitLoading = ref(false)
	// 按钮提交事件
	let submit_ = ()=>{
		let { user_name } = user.value
		user.value.user_name = user_name.trim()
		if(user_name.trim()){
			if(user_name.trim().length > 10){
				msgError('昵称长度不能超过10个字符!')
				return;
			}
		}else{
			msgError('昵称不能为空!')
			return;
		}
		isSubmitLoading.value = true
		updateUserInfo(user.value).then(res=>{
			uni.setStorageSync('userInfo',user.value)
			msgSuccess(res.msg)
			uni.navigateBack()
		}).catch(err=>{
			isSubmitLoading.value = false
		})
	}
</script>

<style lang="less" scoped>
	.discover-box {
		width: 100%;
		background-color: #080d16;
		min-height: calc(100vh);
		color: white;
	}

	.sub {
		width: 19rem;
		height: 2.8rem;
		opacity: 1;
		background: rgba(88, 92, 229, 1);
		box-shadow: 0 0.5rem 1rem 0 rgba(0, 29, 176, 0.3);
		color: white;
		font-weight: 600;
		position: absolute;
		bottom: 5rem;
		left: 50%;
		transform: translateX(-50%);
	}

	.sub:active {
		background: rgba(59, 62, 154, 1.0);
	}
</style>