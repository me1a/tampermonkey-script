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

    var a = clone.querySelector('a')
    a.href = getQuestionUrl()
    a.target = '_blank'

    var _wr = function (type) {
        var orig = history[type];
        return function () {
            var rv = orig.apply(this, arguments);
            var e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };
    history.pushState = _wr('pushState');
    function getQuestionUrl() {
        const path = window.location.pathname.split('/')
        return `https://leetcode.com/${path[1]}/${path[2]}/discuss`
    }

    window.addEventListener('pushState', e => {
        a.href = getQuestionUrl()
    })

    clone.querySelector('span div').innerHTML = '讨论'
    item.parentNode.appendChild(clone)
})();