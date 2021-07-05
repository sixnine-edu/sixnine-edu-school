/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-01-14 10:45:04
 * @LastEditors: yongqing
 * @LastEditTime: 2021-01-23 23:01:44
 */

export const tableOption = {
  border: true,
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  addBtn: false,
  editBtn: false,
  delBtn: false,
  filterBtn: false,
  columnBtn: false,
  refreshBtn: false,
  column: [{
      label: "教师姓名",
      prop: "empName"
    },
    {
      label: "电话",
      prop: "phone"
    },
    {
      label: "已分配课程数量",
      prop: "distrSum",
    },

  ]
}
