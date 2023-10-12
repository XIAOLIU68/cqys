<template>
	<view class="discover-box">
		<view v-if="list.length" class="list">
			<div v-for="item in list" :key="item.cover" class="list-item">
				<image @click="toDetail(item)" @load="imageLoad(item)"
					:src=" !item.updateTime ? '../../static/logo2.svg' :  item.cover">
				</image>
				<div class="footer">
					<div>{{item.title}} </div>
					<div>{{item.director}}</div>
				</div>
			</div>
		</view>

		<view v-else class="list1">
			<u-empty text="暂时还没有收藏记录" mode="search">
			</u-empty>
		</view>

		<!-- 底部遮挡div -->
		<div class="footer-box-bottom"></div>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from "vue";
	import {
		onShow,
		onReachBottom
	} from "@dcloudio/uni-app"
	import {
		userFindCollect
	} from '@/api/user.js'

	// 本地存储历史记录
	let list = ref([])

	// 图片点击事件
	let toDetail = (item) => {
		uni.navigateTo({
			url: '/pages/detail/detail?id=' + item.video_id,
		})
	}

	// 图片加载回调
	let imageLoad = (item) => {
		item.updateTime = true
	}

	onMounted(() => {
		// 请求用户收藏
		userFindCollect('list').then(res=>{
			console.log('res',res);
			list.value = res.data
		})
	})
</script>

<style lang="less" scoped>
	.discover-box {
		width: 100%;
		background-color: #080d16;
		min-height: calc(100vh);

		.list1 {
			width: 100%;
			min-height: calc(100vh);
			padding-top: var(--status-bar-height); //给组件加个上边距
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.list {
			padding-top: var(--status-bar-height); //给组件加个上边距
			display: grid;
			grid-template-columns: repeat(3,33%);
			.list-item {
				height: 12rem;
				margin-left:0.5rem;
				image {
					width: 100%;
					height: 80%;
					border-radius: 0.5rem;
					will-change: transform;
					animation: list_keyframes 1s;
				}

				@keyframes list_keyframes {
					0% {
						transform: scale(0.1);
					}

					100% {
						transform: scale(1);
					}
				}

				.footer {
					width: 100%;
					height: 20%;
					display: flex;
					flex-direction: column;

					:first-child {
						width: 100%;
						font-size: 0.8rem;
						color: white;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					:last-child {
						width: 100%;
						font-size: 0.7rem;
						color: #5B6783;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}

		}

		.footer-box-bottom {
			width: 100%;
			height: 3rem;
			background-color: #080d16;
			margin-bottom: -3rem;
		}
	}
</style>