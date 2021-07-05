/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-21 15:03:52
 * @LastEditors: yongqing
 * @LastEditTime: 2021-02-27 11:33:47
 */
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
    column: [
        {
            width: 150,
            label: "封面",
            prop: "coverImg",
            slot: true
        },
        {
            label: "课程名称",
            prop: "title"
        },
        {
            label: "课程简介",
            prop: "info",
            slot: true
        },
        {
            label: "购买时间",
            prop: "createTime"
        },
        {
            label: "过期时间",
            prop: "expireTime"
        },
        {
            label: "购买数量",
            prop: "courseCount"
        },
        {
            label: "剩余可分配数量",
            prop: "leftCount"
        }
    ]
}
