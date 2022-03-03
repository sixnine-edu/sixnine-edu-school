/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-07-31 21:17:28
 * @LastEditors: yongqing
 * @LastEditTime: 2021-01-10 23:54:50
 */
export const tableOption = {
  border: true,
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  menuWidth: 350,
  align: "center",
  refreshBtn: true,
  searchSize: "mini",
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: false,
  props: {
    label: "label",
    value: "value"
  },
  column: [
    {
      label: "产品名字",
      prop: "prodName",
      search: true
    },
    {
      label: "商品原价",
      prop: "oriPrice"
    },
    {
      label: "商品现价",
      prop: "price"
    },
    // {
    //   label: "成本价",
    //   prop: "costPrice"
    // },
    {
      label: "商品库存",
      prop: "totalStocks"
    },
    {
      label: "产品图片",
      prop: "pic",
      type: "upload",
      width: 150,
      listType: "picture-img"
    },
    {
      width: 150,
      label: "状态",
      prop: "state",
      search: true,
      slot: true,
      type: "select",
      dicData: [
        {
          label: "下架",
          value: 0
        },
        {
          label: "上架",
          value: 1
        }
      ]
    },
   
   
  ]
};
