/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-12-21 17:04:52
 * @LastEditors: yongqing
 * @LastEditTime: 2021-01-10 23:18:34
 */
export const tableOption = {
    selection: true,
    reserveSelection: false,
    rowKey: "courseId",
    addBtn: false,
    filterBtn: false,
    columnBtn: false,
    refreshBtn: false,
    editBtn: false,
    delBtn: false,
    menu: false,
    menuAlign: "center",
    column: [
        {
            width: 120,
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
            prop: "info"
        },
        {
            label: "分类",
            prop: "categoryName",
            slot: true
        },
        {
            label: "状态",
            prop: "state",
            select: true,
            dicData: [
                {
                    label: "已下架",
                    value: 0
                },
                {
                    label: "已上架",
                    value: 1
                }
            ]
        },
        {
            label: "创建时间",
            prop: "createTime"
        }
    ]
}
