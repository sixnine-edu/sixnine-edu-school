/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-01-14 10:45:04
 * @LastEditors: yongqing
 * @LastEditTime: 2021-01-14 11:33:03
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
    column: [
        {
            label: "机构名称",
            prop: "corpName",
            search: true
        },
        {
            label: "联系人",
            prop: "linkMan",
            search: true
        },
        {
            label: "手机号",
            prop: "mobile",
            search: true
        },
        {
            label: "状态",
            prop: "state",
            search: true,
            slot: true,
            type: "select",
            dicData: [
                {
                    label: "禁用",
                    value: 0
                },
                {
                    label: "启用",
                    value: 1
                }
            ]
        }
    ]
}
