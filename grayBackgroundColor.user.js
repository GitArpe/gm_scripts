// ==UserScript==
// @name		grayBackgroundColor
// @namespace	https://github.com/sakuyaa/gm_scripts
// @author		sakuyaa
// @description	将网页背景色改为护眼灰
// @include		*
// @version		2018.1.18
// @compatible	firefox 22
// @grant		GM_addStyle
// @note		配合browser.display.background_color;#DCDCDC使用
// @run-at		document-end
// ==/UserScript==
(function() {
	var grayValue = 215;
	
	function grayElem(elem) {   //将元素变灰
		var elemStyle = window.getComputedStyle(elem);
		if (!elemStyle) {
			return;
		}
		var rgbaValues = elemStyle.getPropertyValue('background-color').match(/\d+(\.\d+)?/g);
		if (rgbaValues) {
			var red = rgbaValues[0];
			var green = rgbaValues[1];
			var blue = rgbaValues[2];
			if (red < grayValue || green < grayValue || blue < grayValue) {
				return;
			}
			//从215-255压缩到215-225
			if (rgbaValues[3]) {   //有alpha值
				elem.style.backgroundColor = 'rgba( ' +
					Math.floor((red - grayValue) / 4 + grayValue) + ', ' +
					Math.floor((green - grayValue) / 4 + grayValue) + ', ' +
					Math.floor((blue - grayValue) / 4 + grayValue) + ', ' +
					rgbaValues[3] + ')';
			} else {
				elem.style.backgroundColor = 'rgb( ' +
					Math.floor((red - grayValue) / 4 + grayValue) + ', ' +
					Math.floor((green - grayValue) / 4 + grayValue) + ', ' +
					Math.floor((blue - grayValue) / 4 + grayValue) + ')';
			}
		}
	}

	function grayBackgroundColor() {
		for (var elem of document.getElementsByTagName('*')) {
			grayElem(elem);
		}
		(new window.MutationObserver(mutations => {
			for (var mutation of mutations) {
				for (var elem of mutation.addedNodes) {
					if (elem.nodeType == 1) {   //元素节点
						grayElem(elem);
						for (var childNode of elem.getElementsByTagName('*')) {   //遍历所有子节点
							grayElem(childNode);
						}
					}
				}
			}
		})).observe(document, {
			childList: true,
			subtree: true
		});
	}

	function fixNotGray() {   //去除一些背景为空白图的网站
		switch (window.location.hostname) {
		case 'www.w3school.com.cn':
			GM_addStyle('#wrapper {background: #dcdcdc none !important;}');
			return;
		}
		var herf = window.location.href;
		if (/^https?:\/\/tieba\.baidu\.com\/f.+/i.test(herf)) {
			GM_addStyle('.forum_content {background: #dcdcdc none !important;}');
		}
	}

	grayBackgroundColor();
	fixNotGray();
})();
