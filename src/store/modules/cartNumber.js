/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-20 15:43:34
 * @LastEditors: yongqing
 * @LastEditTime: 2021-02-20 15:44:15
 */
export default {
  namespaced: true,
  state: {
    cartNumbers: 0
  },
  mutations: {
    changeCartNumber (state, cartNumbers) {
      state.cartNumbers = cartNumbers
    }
  }
}
