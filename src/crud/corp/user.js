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
    label: i18n.t('corp.userName'),
    prop: 'username',
    search: true
  }, {
    label: i18n.t('corp.email'),
    prop: 'email'
  }, {
    label: i18n.t('publics.mobilePhone'),
    prop: 'mobile'
  }, {
    label: i18n.t('corp.creationTime'),
    prop: 'createTime'
  }, {
    label: i18n.t('product.status'),
    prop: 'status',
    type: 'select',
    dicData: [
      {
        label: i18n.t('publics.disable'),
        value: 0
      }, {
        label: i18n.t('publics.normal'),
        value: 1
      }
    ]

  }]
}
