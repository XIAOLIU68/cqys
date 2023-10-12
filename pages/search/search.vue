<template>
	<view class="search-box">
		<!-- 搜索栏 -->
		<u-sticky>
			<div class="search-box">
				<image src="../../static/logo2.svg"></image>
				<div class="search">
					<u-search v-model="searchValue" bgColor="#28304c" color="white" :actionStyle="{color:'white'}"
						:showAction="true" actionText="搜索" @search="searchCustom" @custom="searchCustom"
						:animation="true" shape="round"></u-search>
				</div>
			</div>
			<u-subsection style="padding-bottom: 0.5rem; height: 2.5rem;" bgColor="#080d16" bold activeColo="#0962EA"
				inactiveColor="white" :list="subList" :current="subCurrent" @change="sectionChange"></u-subsection>
		</u-sticky>
		<div v-if="!loading && list.length" class="list-box-item">
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
		<div v-if="loading" class="loading-box">
			<u-loading-page iconSize="100" fontSize="15" loadingText="搜索中" image="../../static/logo2.svg"
				bg-color="#080d16" :loading="loading"></u-loading-page>
		</div>
		<!-- 加载无数据 -->
		<div v-if="!loading && !list.length" class="not-data">
			<image src='../../static/search/notDate.svg'>
			</image>
			<text>暂无搜索数据</text>
		</div>
		<!-- 底部遮挡div -->
		<div class="footer-box-bottom">
			<span>{{loadingTitle}}</span>
		</div>
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";
	import {
		onLoad,
		onReachBottom
	} from "@dcloudio/uni-app"
	import {
		getFindBySearch
	} from '@/api/get.js'
	import {
		msgError
	} from '@/utils/toast.js'
	let searchValue = ref('')
	let list = ref([])
	// 没有更多的标识 如果是true 则不再请求 直接提示无数据
	let isNextPage = true
	// 提示语
	let loadingTitle = ref('正在加载中....')
	//是否展示加载中
	let loading = ref(true)
	onLoad((options) => {
		searchValue.value = options.searchValue
		if(options.type){
			subCurrent.value = options.type
		}
		getList()
	})

	let getList = () => {
		if (!isNextPage) {
			msgError('没有更多了')
			return false;
		}
		// 获取传过来的搜索值
		getFindBySearch(searchValue.value, indexPage, subList.value[subCurrent.value].type).then(res => {
			if (!res.data && indexPage !== 1) {
				isNextPage = false
				loadingTitle.value = '没有更多啦!'
				loading.value = false
				flage.value = false
				return false;
			}

			// 这里是搜索无数据
			if (!res.data && indexPage === 1) {
				isNextPage = false
				loadingTitle.value = '...'
				loading.value = false
				flage.value = false
				list.value = []
				return false;
			}
			// 判断是否为第一次加载数据
			flage.value = true
			loading.value = false
			if (indexPage === 1) {
				list.value = res.data
			} else {
				list.value = [...list.value, ...res.data]
			}
		})
	}

	// 图片点击事件
	let toDetail = (item) => {
		uni.navigateTo({
			url: '/pages/detail/detail?id=' + item.videoId,
		})
	}

	// 触底加载更多
	// 记载中标记
	let flage = ref(true)
	// 页码
	let indexPage = 1
	onReachBottom(() => {
		if (flage.value) {
			// 请求下一页数据
			indexPage += 1
			getList()
		}
	})
	// 图片加载回调
	let imageLoad = (item) => {
		item.updateTime = false
	}

	// 搜索点击事件
	let searchCustom = (e) => {
		if (e.trim() !== '') {
			setTimeout(() => {
				uni.pageScrollTo({
					offsetTop: 0,
					duration: 0,
				})
			})
			debounce(() => {
				searchInit()
				getList()
			})
		} else {
			msgError('输入不能为空!')
		}
	}

	// 封装搜索初始化
	let searchInit = () => {
		// 初始化操作
		isNextPage = true
		indexPage = 1
		loading.value = true
		list.value = []
		loadingTitle.value = '正在加载中....'
	}

	// 分段器
	let subList = ref([{
			name: '标题',
			type: 'title'
		},
		{
			name: '导演',
			type: 'director'
		},
		{
			name: '主演',
			type: 'actor'
		},
		{
			name: '地区',
			type: 'region'
		},
		{
			name: '上映',
			type: 'releaseTime'
		},
		{
			name: '分类',
			type: 'videoType'
		}
	])
	let subCurrent = ref(0)
	// 改变事件
	let sectionChange = (e) => {
		subCurrent.value = e
		debounce(() => {
			searchInit()
			getList()
		})
	}


	// 防抖
	let timer = null
	let debounce = (fn) => {
		clearTimeout(timer)
		timer = setTimeout(fn, 500)
	}
</script>

<style lang="less" scoped>
	.search-box {
		width: 100%;
		background-color: #080d16;
		height: auto;

		.footer-box-bottom {
			width: 100%;
			height: 3rem;
			background-color: #080d16;
			margin-bottom: -3rem;
			text-align: center;
			color: #ccc;
			line-height: 3rem;
			font-size: 0.8rem;
		}

		.loading-box {
			width: 100%;
			height: 50rem;
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

		/deep/.u-subsection__bar {
			background-color: #28304c !important;
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
			background-color: #080d16;
			padding-bottom: 0.5rem;

			image {
				width: 10%;
			}

			.search {
				width: 85%;
			}
		}

		.list-box-item {
			flex-shrink: 0;
			width: 100%;
			min-height: calc(100vh);
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

		.not-data {
			width: 100%;
			min-height: calc(100vh - 50rpx);
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			color: white;
			font-size: 0.8rem;

			image {
				width: 8rem;
				height: 8rem;
			}
		}

	}
</style>