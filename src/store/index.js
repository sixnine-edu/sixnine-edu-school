/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-12-07 09:40:11
 * @LastEditors: yongqing
 * @LastEditTime: 2021-02-20 15:44:36
 */
import Vue from "vue"
import Vuex from "vuex"
import cloneDeep from "lodash/cloneDeep"
import common from "./modules/common"
import user from "./modules/user"
import prod from "./modules/prod"
import material from "./modules/material"
import cartNumber from "./modules/cartNumber"
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        common,
        user,
        prod,
        material,
        cartNumber
    },
    mutations: {
        // 重置vuex本地储存状态
        resetStore(state) {
            Object.keys(state).forEach(key => {
                state[key] = cloneDeep(window.SITE_CONFIG["storeState"][key])
            })
        }
    },
    strict: process.env.NODE_ENV !== "production"
})
