// ==UserScript==
// @name		bilibiliDanmaku
// @namespace	https://github.com/sakuyaa/gm_scripts
// @author		sakuyaa
// @description	在哔哩哔哩视频标题下方增加弹幕查看和下载
// @include		http*://www.bilibili.com/video/av*
// @version		2017.7.8
// @grant		none
// @run-at		document-end
// ==/UserScript==
(function() {
	let node;
	let code = setInterval(() => {
		node = document.querySelector('.tminfo');
		if (node) {
			clearInterval(code);
			//查看弹幕
			let view = document.createElement('a');
			view.setAttribute('href', 'https://comment.bilibili.com/' + window.cid + '.xml');
			view.setAttribute('target', '_blank');
			view.style.marginLeft = '44px';   //与前面链接间隔保持一致
			view.textContent = '查看弹幕';
			//下载弹幕
			let download = document.createElement('a');
			download.setAttribute('href', 'javascript:;');
			download.textContent = '下载弹幕';
			download.addEventListener('click', () => {
				let xhr = new XMLHttpRequest();
				xhr.responseType = 'blob';
				xhr.open('GET', 'https://comment.bilibili.com/' + window.cid + '.xml', true);
				xhr.onload = () => {
					if (xhr.status == 200) {
						let a = document.createElement('a');
						a.setAttribute('download', document.title.split('_')[0] + '.xml');
						a.setAttribute('href', URL.createObjectURL(xhr.response));
						a.dispatchEvent(new MouseEvent('click'));
					} else {
						console.log(new Error(xhr.statusText));
					}
				};
				xhr.send(null);
			}, false);
			node.appendChild(view);
			node.appendChild(document.createTextNode(' | '));
			node.appendChild(download);
		}
	}, 500);
})();
