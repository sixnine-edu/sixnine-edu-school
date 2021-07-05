import i18n from '../../i18n/i18n'
export const tableOption = {
  border: true,
  menu: false, // 移除操作栏
  selection: true,
  index: false,
  indexLabel: i18n.t('sysManagement.serialNumber'),
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
    label: i18n.t('corp.userName'),
    prop: 'username',
    search: true
  }, {
    label: i18n.t('corp.userAction'),
    prop: 'operation',
    search: true
  }, {
    label: i18n.t('corp.requestMerthod'),
    prop: 'method'
  }, {
    label: i18n.t('corp.requestParameter'),
    prop: 'params'
  }, {
    label: i18n.t('corp.executionTime'),
    prop: 'time'
  }, {
    label: i18n.t('corp.ipAddress'),
    prop: 'ip'
  }, {
    label: i18n.t('corp.creationTime'),
    prop: 'createDate'
  }]
}
