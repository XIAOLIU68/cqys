<template>
	<view class="container">
		<!-- top1 -->
		<div v-for="(item,index) in hotList.slice(0,3)" :key="item.hot_video_id" @click="toPlay(item)"
			:class="hotFirstListClass[index].class">
			<image mode="aspectFill" :src="item.updateTime ? '../../static/logo2.svg' : item.hot_video_img "
				@load="imageLoad(item)">
				</image>
			<div class="footer">
				<div>{{item.hot_video_name}}</div>
				<div>{{item.hot_video_director || '暂无导演'}}</div>
			</div>
			<div class="iocn_hot">人气指数:{{item.hot_play_number}}</div>
			<div class="hot_number">热播榜TOP{{index+1}}</div>
		</div>

		<!-- top1 -->
		<div class="hot_list">
			<div v-for="item in hotList.slice(3,10)" :key="item.hot_video_id" @click="toPlay(item)" class="item">
				<image mode="aspectFill" @load="imageLoad(item)"
					:src="item.updateTime ? '../../static/logo2.svg' : item.hot_video_img"></image>
				<div class="item_info">
					<span class="title">{{item.hot_video_name}}</span>
					<span class="dra">{{item.hot_video_director || '暂无导演'}}</span>
					<span class="hot_number">人气指数:{{item.hot_play_number}}</span>
				</div>
				<image class="toImg" src="../../static/hot/to.svg" mode=""></image>
			</div>
		</div>
		<div v-if="!hotList.length"
			style=" width: 100%; height: 100vh; color: white; font-weight: 1rem; display: flex;justify-content: center;align-items: center;">
			暂无排行榜!</div>
	</view>
</template>

<script setup>
	import {
		getHotList,
		uploadTx
	} from '@/api/user.js'
	import {
		onMounted,
		ref
	} from "vue";
	import {
		setFullscreen
	} from '@/utils/page.js'
	import {
		onPullDownRefresh
	} from "@dcloudio/uni-app"

	import hot1 from '../../static/hot/hot1.svg'
	import hot2 from '../../static/hot/hot2.svg'
	import hot3 from '../../static/hot/hot3.svg'

	// 退出全屏显示
	setFullscreen(false)

	// 定义前三的数据class
	let hotFirstListClass = ref([{
			class: 'hot_top1 hot',
			src: hot1,
		}, {
			class: 'hot_top2 hot',
			src: hot2,
		},
		{
			class: 'hot_top3 hot',
			src: hot3,
		}
	])



	// 图片加载回调
	let imageLoad = (item) => {
		item.updateTime = false
	}

	let hotList = ref([])

	// 请求hot数据

	let handlerGetHotList = () => {
		getHotList().then(res => {
			hotList.value = res.data.map(x => {
				x.updateTime = true
				return x
			})
			uni.stopPullDownRefresh()
		})
	}

	onMounted(() => {
		handlerGetHotList()
	})


	// 页面下拉刷新
	onPullDownRefresh(() => {
		handlerGetHotList()
	})

	// 跳转播放页
	let toPlay = (item) => {
		uni.navigateTo({
			url: '/pages/detail/detail?id=' + item.hot_video_id
		})
	}
</script>

<style lang="less">
	.container {
		width: 100%;
		background-color: #080d16;
		min-height: calc(100vh);
		font-family: 'douyuFont-2';
		.hot {
			width: 7rem;
			height: 12rem;
			position: absolute;

			image {
				height: 80%;
				width: 100%;
				border-radius: 1rem;
			}

			.iocn_hot {
				hieght: 2rem;
				width: 5rem;
				position: absolute;
				border-radius: 1rem;
				left: 45%;
				top: 0.5rem;
				font-size: 0.5rem;
				text-align: center;
				color: #FF9900;
				transform: rotate(30deg);
				background-color: rgba(0, 0, 0, 0.5);
			}

			.hot_number {
				position: absolute;
				width: 100%;
				background-color: rgba(0, 0, 0, 0.5);
				bottom: 2.4rem;
				color: #FF9900;
				font-size: 0.7rem;
				padding: 0.2rem;
				display: flex;
				align-items: center;
				justify-content: center;
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

		.hot_top1 {
			top: 2rem;
			left: 50%;
			transform: translateX(-50%);
		}

		.hot_top2 {
			top: 15rem;
			left: 10%;
		}

		.hot_top3 {
			top: 15rem;
			right: 10%;
		}

		.hot_list {
			width: 100%;
			position: absolute;
			top: 28rem;
			background-color: #080d16;
			margin-bottom: 1rem;

			.item {
				width: 90%;
				margin: auto;
				height: 8rem;
				background-color: #080d16;
				display: flex;
				align-items: center;
				margin-bottom: 1rem;
				position: relative;

				.toImg {
					position: absolute;
					right: 1rem;
					top: 50%;
					transform: translateY(-50%);
					width: 1.5rem;
					height: 1.5rem;
				}

				image {
					width: 30%;
					height: 100%;
					border-radius: 0.5rem;
				}

				.item_info {
					width: 80%;
					height: 70%;
					border-top-right-radius: 0.5rem;
					border-bottom-right-radius: 0.5rem;
					box-shadow: 0 0 1rem #2a333f inset;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					text-indent: 1rem;
					overflow: hidden;
					.title {
						width: 100%;
						font-size: 0.8rem;
						color: white;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.dra {
						width: 80%;
						font-size: 0.7rem;
						color: #5B6783;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.hot_number {
						color: #FF9900;
						font-size: 0.7rem;
					}
				}
			}
		}
	}
</style>