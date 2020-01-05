// ==UserScript==
// @name         75team
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在查看奇舞周刊时， 按左移右移进行上一期下一期翻页
// @author       You
// @match        https://weekly.75team.com/*.html
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const now = +document.querySelector('.issue em').innerHTML
    window.addEventListener('keydown', function (e) {
        const op = e.keyCode
        if (op === 39) window.location.href = `https://weekly.75team.com/issue${now + 1}.html`
        if (op === 37) window.location.href = `https://weekly.75team.com/issue${now - 1}.html`
    })
    // Your code here...
})();