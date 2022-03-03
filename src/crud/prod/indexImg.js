/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-07-18 22:34:25
 * @LastEditors: yongqing
 * @LastEditTime: 2021-01-08 18:56:21
 */
export const tableOption = {
    index: false,
    indexLabel: "序号",
    stripe: true,
    menuAlign: "center",
    menuWidth: 350,
    align: "center",
    refreshBtn: true,
    searchSize: "mini",
    addBtn: false,
    editBtn: false,
    delBtn: false,
    viewBtn: false,
    props: {
        label: "label",
        value: "value"
    },
    column: [
        {
            label: "标题",
            prop: "title",
            search: true
        },
        {
            label: "轮播图片",
            prop: "img",
            type: "upload",
            slot: true,
            listType: "picture-img"
        },
        {
            label: "链接",
            prop: "href"
        },
        {
            width: 150,
            label: "链接类型",
            prop: "hrefType",
            search: true,
            type: "select",
            dicData: [
                {
                    label: "内链",
                    value: 0
                },
                {
                    label: "外链",
                    value: 1
                }
            ]
        },
        {
            label: "顺序",
            prop: "seq"
        },
        {
            width: 150,
            label: "上架状态",
            prop: "state",
            search: true,
            type: "select",
            dicData: [
                {
                    label: "下架",
                    value: 0
                },
                {
                    label: "上架",
                    value: 1
                }
            ]
        }
    ]
}
