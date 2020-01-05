// ==UserScript==
// @name         getLeetCode popular solution
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于在leetcode 中文站中查看该问题的英文站的讨论，添加一个跳转按钮
// @author       
// @match        https://leetcode-cn.com/problems/*
// @grant        none
// ==/UserScript==

(function () {
    var item = document.querySelector('div[data-key=submissions]')
    item.parentNode

    var clone = item.cloneNode(true)
    clone.style.backgroundColor = 'transparent'
    clone.style.color = '#39f'

    var url = `https://leetcode.com${window.location.pathname.replace('/submissions/', '/discuss/')}`

    var a = clone.querySelector('a')
    a.href = url
    a.target = '_blank'

    clone.querySelector('span div').innerHTML = '讨论'
    item.parentNode.appendChild(clone)
})();