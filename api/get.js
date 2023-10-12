import './config.js'

// get方法封装
function getRequist(url) {
	return uni.request({
		method: 'GET',
		url: url,
		header: {
			"Authorization": uni.getStorageSync('token')
		}
	})

}


// 获取首页信息/tab信息  分类
export function getTypeList(type, page) {
	return getRequist(`/getTypeList/${type}/${page}`)
}

// 根据ID获取视频详细信息
export function getFindByVideoId(videoId) {
	return getRequist(`/getFindByVideoId/${videoId}`)
}

// 搜索视频
export function getFindBySearch(name, indexPage,type) {
	return getRequist(`/getFindBySearch/${name}/${indexPage}/${type}`)
}

// 根据分类搜索视频
export function getFindByVideoType(type, indexPage = 1) {
	return getRequist(`/getFindByVideoType/${type}/${indexPage}`)
}