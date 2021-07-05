/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-01-14 10:45:04
 * @LastEditors: yongqing
 * @LastEditTime: 2021-01-23 23:52:42
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
            label: "手机号",
            prop: "userName",
            search: true
        },
        {
            label: "姓名",
            prop: "empName",
            search: true
        },
        {
            label: "头像",
            prop: "headImg",
            slot: true
        },
        {
            label: "性别",
            prop: "sex",
            type: "select",
            dicData: [
                {
                    label: "女",
                    value: 0
                },
                {
                    label: "男",
                    value: 1
                }
            ]
        },
        {
            label: "职位",
            prop: "postInfo"
        },
        {
            label: "校区",
            prop: "schoolInfo"
        },
        {
            label: "过期时间",
            prop: "expireTime"
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
