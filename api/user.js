import './config.js'

// get方法封装
function getRequist(url, data = {}, method = 'get') {
	return uni.request({
		method,
		url: url,
		header: {
			"Authorization": uni.getStorageSync('token')
		},
		data
	})
}

// 上传头像
function postRequist(url, data) {
	return new Promise((reslove, reject) => {
		uni.uploadFile({
			url: 'http://47.101.56.97:10001' +  url,
			filePath: data,
			name: 'file',
			success: (res) => {
				let resp = JSON.parse(res.data)
				reslove(resp)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})

}


// 登录
export function login(userAccount, userPassword) {
	return getRequist(`/login/${userAccount}/${userPassword}`)
}

// 注册
export function register(userAccount, userPassword, userPassword1) {
	return uni.request({
		method: 'post',
		url: `/register`,
		data: {
			userAccount,
			userPassword,
			userPassword1
		}
	})
}

// 上传文件
export function uploadTx(data, userId, fieldName) {
	return postRequist(`/userUploadTx/${userId}/${fieldName}`, data)
}

// 用户收藏影片
export function userCollect(data) {
	return getRequist(`/userCollect`, data, 'POST')
}

// 用户取消收藏影片
export function userCancelCollect({videoId, userId}) {
	return getRequist(`/userCancelCollect/${videoId}/${userId}`)
}


// 获取用户信息
export function getUserInfo(userId) {
	return getRequist(`/getUserInfo/${userId}`)
}

// 获取用户收藏信息
export function userFindCollect(type = 'list') {
	let {user_id} = uni.getStorageSync('userInfo')
	return getRequist(`/userFindCollect/${user_id}/${type}`)
}


// 获取图片
export function getimg(userId) {
	return uni.request({
		method: "GET",
		url: 'https://wallhaven.cc/search?q=4K&page=2',
	})
}


// 获取图片
export function updateUserInfo(user) {
	return getRequist(`/userUpdateInfo`,user,'POST')
}

// 更新影片热度
export function addHot(video) {
	return getRequist(`/AddHot`,video,'POST')
}

// 查询热度 前10
export function getHotList() {
	return getRequist(`/getHotList`)
}

// 用户反馈问题
export function handleFeedback(data) {
	return getRequist(`/feedback`,data,'GET')
}

// 监测用户更新
export function isUpdate(key) {
	return getRequist(`/isUpdate/${key}`)
}

// 用户评论
export function comment(data) {
	return getRequist(`/userComment`,data,'POST')
}

// 查询用户评论
export function queryUserComment(film_id) {
	return getRequist(`/queryUserComment/${film_id}`)
}


