import Vue from "vue"
import router from "@/router"
import store from "@/store"

export function deepClone(obj) {
    if (Array.isArray(obj)) {
        return obj.map(deepClone)
    } else if (obj && typeof obj === "object") {
        var cloned = {}
        var keys = Object.keys(obj)
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i]
            cloned[key] = deepClone(obj[key])
        }
        return cloned
    } else {
        return obj
    }
}

/**
 * 获取uuid
 */
export function getUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        return (c === "x" ? (Math.random() * 16) | 0 : "r&0x3" | "0x8").toString(16)
    })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth(key) {
    let authorities = JSON.parse(sessionStorage.getItem("authorities") || "[]")
    if (authorities.length) {
        for (const i in authorities) {
            const element = authorities[i]
            if (element.authority === key) {
                return true
            }
        }
    }
    return false
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(arr, id = "id", pid = "parentId") {
    let data=deepClone(arr)
    var res = []
    var temp = {}
    for (var i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i]
    }
    for (var k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
            if (!temp[data[k][pid]]["children"]) {
                temp[data[k][pid]]["children"] = []
            }
            if (!temp[data[k][pid]]["_level"]) {
                temp[data[k][pid]]["_level"] = 1
            }
            data[k]["_level"] = temp[data[k][pid]]._level + 1
            temp[data[k][pid]]["children"].push(data[k])
        } else {
            res.push(data[k])
        }
    }
    return res
}

/**
 * 将数组中的parentId列表取出，倒序排列
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function idList(data, val, id = "id", children = "children") {
    let res = []
    idListFromTree(data, val, res, id)
    return res
}

/**
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
function idListFromTree(data, val, res = [], id = "id", children = "children") {
    for (let i = 0; i < data.length; i++) {
        const element = data[i]
        if (element[children]) {
            if (idListFromTree(element[children], val, res, id, children)) {
                res.push(element[id])
                return true
            }
        }
        if (element[id] === val) {
            res.push(element[id])
            return true
        }
    }
}

/**
 * 清除登录信息
 */
export function clearLoginInfo() {
    Vue.cookie.delete("Authorization_vp_corp")
    store.commit("resetStore")
    router.options.isAddDynamicMenuRoutes = false
}

export function formatHtml(content) {
    content = content.replace(/\<img/gi, '<img style="width:100% !important;height:auto !important;margin:0;display:flex;" ')
    content = content.replace(/style="/gi, 'style="max-width:100% !important;table-layout:fixed;word-wrap:break-word;word-break;break-all;')
    // content = content.replace(/\<table/gi, '<table style="table-layout:fixed;word-wrap:break-word;word-break;break-all;" ');
    // content = content.replace(/\<td/gi, '<td  cellspacing="0" cellpadding="0" border="0" style="display:block;vertical-align:top;margin: 0px; padding: 0px; border: 0px;outline-width:0px;" ');
    content = content.replace(/width=/gi, "sss=")
    content = content.replace(/height=/gi, "sss=")
    content = content.replace(/ \/\>/gi, ' style="max-width:100% !important;height:auto !important;margin:0;display:block;" />')
    return content
}

/**
 * 防抖
 */
export function _debounce(fn, delay) {
    var delay = delay || 200
    var timer
    return function() {
        var th = this
        var args = arguments
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(function() {
            timer = null
            fn.apply(th, args)
        }, delay)
    }
}

/**
 * 手机号正则校验
 */
export function checkPhoneNumber(phoneNumber) {
    var regexp = /^[1]([3-9])[0-9]{9}$/
    return regexp.test(phoneNumber)
}

function timeFormat(times) {
    return times < 10 ? "0" + times : times
}

/**
 * 根据相隔时间戳，计算相隔时间
 */
export function betweenTime(betweenTimestamp) {
    // 正的时间还是负的时间
    let signs = 1
    if (betweenTimestamp < 0) {
        betweenTimestamp = -betweenTimestamp
        signs = 0
    }

    if (betweenTimestamp > 1000) {
        let time = betweenTimestamp / 1000
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24))
        let hou = parseInt((time % (60 * 60 * 24)) / 3600)
        let min = parseInt(((time % (60 * 60 * 24)) % 3600) / 60)
        let sec = parseInt(((time % (60 * 60 * 24)) % 3600) % 60)
        return {
            day: `${timeFormat(day)}`,
            hou: `${timeFormat(hou)}`,
            min: `${timeFormat(min)}`,
            sec: `${timeFormat(sec)}`,
            signs: signs
        }
    }
    return {
        day: "00",
        hou: "00",
        min: "00",
        sec: "00",
        signs: signs
    }
}
/**
 * 计算相隔时间戳
 */
export function betweenTimestamp(startTime, endTime) {
    let newTime = new Date().getTime()
    let betweenTime = 0
    // 还没开始 相差时间为负数
    if (newTime < startTime) {
        betweenTime = startTime - newTime
    }
    // 还没结束
    else {
        betweenTime = endTime - newTime
    }
    return betweenTime
}

export function dateToTimestamp(dateStr) {
    if (!dateStr) {
        return ""
    }
    let newDataStr = dateStr.replace(/\.|\-/g, "/")
    let date = new Date(newDataStr)
    let timestamp = date.getTime()
    return timestamp
}
