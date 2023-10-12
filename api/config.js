// 定义全局拦截器
import {
	msgError
} from '@/utils/toast.js'
uni.addInterceptor('request', {
	invoke(args) {
		// request 触发前拼接 url 
		// args.url = 'http://192.168.215.195:10086' + args.url
		args.url = 'http://192.168.10.13:10001' + args.url
		// args.url = 'http://47.101.56.97:10001' + args.url
	}
})

// 只要调用uni.xx方法都会触发
uni.addInterceptor('request', {
	returnValue(response) {
		return new Promise((succ, err) => {
			response.then(res => {
				let ret = res.data
				if (typeof plus !== 'undefined') {
					if (ret.code !== 200 && ret.code !== 0) {
						msgError(ret.msg)
						err(new Error(ret.msg))
					}
				} else {
					if (ret.code !== 200 && ret.code !== 0) {
						uni.showToast({
							title: ret.msg,
							icon: "error",
							image: '/static/toast/error.png'
						});
						err(new Error(ret.msg))
					}
				}
				succ(ret)
			})
		})
	}
})