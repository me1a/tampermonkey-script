// ==UserScript==
// @name         getLeetCode popular solution
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       meihuan
// @match        https://leetcode-cn.com/problems/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
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
    window.addEventListener('popstate', e => {
        a.href = getQuestionUrl()
    })

    clone.querySelector('span div').innerHTML = '讨论'
    item.parentNode.appendChild(clone)




    function getQuestionCN() {
        return new Promise((resolve, reject) => {
            $.ajax('/graphql', {
                data: {
                    "operationName": "getQuestionTranslation",
                    "variables": {},
                    "query": "query getQuestionTranslation($lang: String) {\n  translations: allAppliedQuestionTranslations(lang: $lang) {\n    title\n    questionId\n     __typename\n  }\n}\n"
                },
                success({ data: { translations } }) {
                    resolve(translations)
                },
                error() {
                    reject('getQuestion error')
                }
            })
        })
    }


    function getQuestionEN() {
        return new Promise((resolve, reject) => {
            $.ajax('/api/problems/all/', {
                success(string) {
                    const { stat_status_pairs } = JSON.parse(string)
                    resolve(stat_status_pairs)
                },
                error(e) {
                    reject(e)
                }
            })
        })
    }

    Promise.all([getQuestionCN(), getQuestionEN()]).then(([cn, en]) => {
        let obj = {}
        cn.forEach((item) => {
            obj[item.questionId] = {
                title: item.title,
                questionId: item.questionId,
                url: '',
                titleEN: ''
            }
        })
        en.forEach(item => {
            const { stat } = item

            let o = {
                url: `/problems/${stat.question__title_slug}/`,
                titleEN: stat.question__title,
                title: stat.question__title,
                questionId: stat.question_id
            }

            let c = obj[stat.question_id]
            if (c === undefined) {
                obj[stat.question_id] = o
            } else {
                obj[stat.question_id] = {
                    ...c, ...{
                        url: `/problems/${stat.question__title_slug}/`,
                        titleEN: stat.question__title,
                    }
                }
            }
        })
        const data = Object.values(obj)
        dom(data)
    })





    function dom(data) {
        const el = document.querySelector('div[data-show-mask]')
        const div = document.createElement('div')
        const input = document.createElement('input')
        const result = document.createElement('div')
        div.classList.add('box')
        input.classList.add('input')
        result.classList.add('result')

        div.style.cssText = `
            position: relative;
            padding: 0px 24px;
            height: 30px;
            width: 400px
        `
        input.style.cssText = `
            width: 100%;
            font-size: 12px
        `
        result.style.cssText = `
            posotion: absolute;
            top: 30px;
            left: 24px;
            max-height: 200px;
            overflow: auto;
            background: white;
        `

        div.appendChild(input)
        div.appendChild(result)
        el.appendChild(div)

        let time = null
        let time1 = null
        input.addEventListener('input', e => {
            const v = e.target.value
            result.innerHTML = ''
            if (v.trim() === '') return
            clearTimeout(time1)
            time1 = setTimeout(() => {
                let html = ''

                data.filter(item => {
                    return item.title.includes(v) || item.titleEN.includes(v) || item.questionId == v
                }).forEach(item => {
                    console.log(item)
                    html += `<div style='padding: 6px 8px;font-size: 12px;'><a href='${item.url}'>${item.title}</a></div>`
                })


                clearTimeout(time)
                time = setTimeout(() => {
                    if (html === '' && v !== '') {
                        search(v).then(res => {
                            data.filter(item => {
                                return res.includes(+item.questionId)
                            }).forEach(item => {
                                html += `<div style='padding: 6px 8px;font-size: 12px;'><a href='${item.url}'>${item.title}</a></div>`
                            })
                            result.innerHTML = html
                        })
                    }
                }, 1000)
                result.innerHTML = html
            }, 400)
        })
        input.addEventListener('blur', e => {
            setTimeout(() => {
                result.style.display = 'none'
            }, 100)
        })
        input.addEventListener('focus', e => {
            result.style.display = 'block'
        })
    }

    function search(v) {
        return new Promise((resolve, reject) => {
            $.ajax('/problems/api/filter-questions/' + v, {
                success(data) {
                    resolve(data)
                },
                error() {
                    reject('search error')
                }
            }
            )
        })
    }
})();