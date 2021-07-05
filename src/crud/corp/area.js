import i18n from '../../i18n/i18n'
export const tableOption = {
  border: true,
  index: true,
  indexLabel: i18n.t('sysManagement.serialNumber'),
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  addBtn: false,
  editBtn: false,
  column: [
    {
      label: '',
      prop: 'areaId'
    },
    {
      label: '',
      prop: 'areaName'
    },
    {
      label: '',
      prop: 'parentId'
    },
    {
      label: '',
      prop: 'level'
    }
  ]
}
