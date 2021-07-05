/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-12-07 09:40:11
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-11 11:15:27
 */
export default {
    namespaced: true,
    state: {
        id: 0,
        userName: "",
        empName: ""
    },
    mutations: {
        updateId(state, id) {
            state.id = id
        },
        updateUserName(state, name) {
            state.userName = name
        },
        updateEmpName(state, name) {
            state.empName = name
        }
    }
}
