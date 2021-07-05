/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-21 14:53:38
 * @LastEditors: yongqing
 * @LastEditTime: 2021-02-26 20:52:23
 */
export const tableOption = {
    border: true,
    selection: false,
    index: false,
    indexLabel: "序号",
    stripe: true,
    align: "center",
    refreshBtn: true,
    searchSize: "mini",
    addBtn: false,
    editBtn: false,
    delBtn: false,
    viewBtn: false,
    menu: false,
    props: {
        label: "label",
        value: "value"
    },

    column: [
        {
            label: "订单号",
            prop: "payNo",
            search: false
        },
        {
            label: "余额变动值（元）",
            prop: "changeBalance"
        },

        {
            label: "余额变动日期",
            prop: "createTime"
        },
        {
            label: "收支类型",
            prop: "ioType",
            slot: true
        },
        {
            label: "类型",
            prop: "changeMethod",
            dicData: [
                {
                    label: "充值",
                    value: 1
                },
                {
                    label: "赠送",
                    value: 2
                },
                {
                    label: "支付",
                    value: 3
                },
                {
                    label: "退款",
                    value: 4
                },
                {
                    label: "平台手动修改",
                    value: 5
                },
                {
                    label: "创建新用户扣费",
                    value: 6
                },
                {
                    label: "续费",
                    value: 7
                }
            ]
        }
    ]
}
