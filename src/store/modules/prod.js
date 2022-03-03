/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-12-07 09:40:11
 * @LastEditors: yongqing
 * @LastEditTime: 2021-01-10 23:35:11
 */
export default {
  namespaced: true,
  state: {
    id: 0,
    skuTags: [],
    defalutSku: {
      price: 0.01, // 销售价
      oriPrice: 0.01, // 市场价
      skuScore: 0, // 积分价
      stocks: 0, // 库存
      properties: '', // 销售属性组合字符串
      skuName: '', // sku名称
      prodName: '', // 商品名称
      // partyCode: '', // 商品编码
      state: 1 // 0 禁用 1 启用
    }
  },
  mutations: {
    updateSkuTags (state, skuTags) {
      state.skuTags = skuTags
    },
    addSkuTag (state, skuTag) {
      state.skuTags.push(skuTag)
    },
    removeSkuTag (state, tagIndex) {
      state.skuTags.splice(tagIndex, 1)
    },
    removeSkuTagItem (state, { tagIndex, tagItemIndex }) {
      state.skuTags[tagIndex].tagItems.splice(tagItemIndex, 1)
    },
    addSkuTagItem (state, { tagIndex, tagItem }) {
      state.skuTags[tagIndex].tagItems.push(tagItem)
    }
  }
}
