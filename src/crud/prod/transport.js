/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-07-18 22:34:25
 * @LastEditors: yongqing
 * @LastEditTime: 2021-01-09 22:12:28
 */
export const tableOption = {
  border: false,
  index: false,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menuWidth: 350,
  align: 'center',
  refreshBtn: true,
  searchSize: 'mini',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: false,
  props: {
    label: 'label',
    value: 'value'
  },
  column: [{
    label: '模板名称',
    prop: 'transName',
    search: true
  }]
}
