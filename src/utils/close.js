// 只能关闭脚本打开的当前页面 
const closeWebPage = () => {
	if (navigator.userAgent.indexOf("MSIE") > 0) {
		if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
			window.opener = null;
			window.close();
		} else {
			window.open('', '_top');
			window.top.close();
		}
	} else if (navigator.userAgent.indexOf("Firefox") > 0) {
		var browserName = navigator.appName;
		if (browserName == "Netscape") {
			window.open('', '_self', '');
			window.close();
		} else {
			if (browserName == "Microsoft Internet Explorer") {
				window.opener = "whocares";
				window.opener = null;
				window.open('', '_top');
				window.close();
			}
		}
	} else {
		window.opener = null;
		window.open('', '_self', '');
		window.close();
	}
}
export {
	closeWebPage
}
