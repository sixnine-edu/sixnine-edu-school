import i18n from '../../i18n/i18n'
export const tableOption = {
  border: true,
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
    label: i18n.t('corp.roleName'),
    prop: 'roleName',
    search: true
  }, {
    label: i18n.t('publics.remark'),
    prop: 'remark'
  }, {
    label: i18n.t('corp.creationTime'),
    prop: 'createTime'
  }]
}
