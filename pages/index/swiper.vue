<template>
	<template v-if="list.length">
		<div class="list-box-item">
			<div v-for="item in list" :key="item.videoId" class="list-item">
				<image @click="toDetail(item)" @load="imageLoad(item)"
					:src=" item.updateTime ? '../../static/logo2.svg' :  item.cover">
				</image>
				<div class="footer">
					<div>{{item.title}} </div>
					<div>{{item.director}}</div>
				</div>
			</div>
		</div>
	</template>
	<div v-if="!list.length" class="loading-box">
		<image class="loading-img" src="../../static/logo2.svg"></image>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		defineProps
	} from 'vue'
	import {
		getTypeList
	} from '@/api/get.js'

	const props = defineProps({
		type: {
			type: String,
			default: '科幻片'
		}
	})
	// 页数 默认是1
	let page = 1
	// 展示数据
	let list = ref([])
	// 图片点击事件
	let toDetail = (item) => {
		uni.navigateTo({
			url: '/pages/detail/detail?id=' + item.videoId
		})
	}
	// 图片加载回调
	let imageLoad = (item) => {
		item.updateTime = false
	}

	// 获取数据
	let getList = (type, page) => {
		getTypeList(type, page).then(res => {
			list.value = res.data
		}).catch(err => {
			getList(type, page)
		})
	}
	// 请求
	onMounted(() => {
		// 等待派发任务开始加载
		uni.$on(props.type, () => {
			// 有数据不请求
			if (list.value.length) return false;
			getList(props.type, page)
		})
	})
</script>

<style lang="less" scoped>
	.loading-box {
		width: 100%;
		height: 20rem;
		display: flex;
		align-items: center;
		justify-content: center;

		.loading-img {
			animation: loadingImg 1s linear infinite alternate;
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
	}

	.list-box-item {
		flex-shrink: 0;
		width: 100%;
		padding: 1rem 0 0 0;
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		scroll-snap-align: center;

		.list-item {
			width: 30%;
			height: 12rem;

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
</style>