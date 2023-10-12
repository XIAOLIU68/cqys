// 隐藏手机底部状态栏
export function hideSystemNavigation(){
	if (typeof plus !== 'undefined') {
		plus.navigator.hideSystemNavigation();
	}
}

//显示手机底部状态栏
export function setFullscreen(fullscreen){
	if (typeof plus !== 'undefined') {
		plus.navigator.setFullscreen(fullscreen);
			plus.navigator.showSystemNavigation();
	}
}