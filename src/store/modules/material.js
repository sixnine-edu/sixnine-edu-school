/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-12-24 17:25:59
 * @LastEditors: yongqing
 * @LastEditTime: 2021-12-26 15:15:01
 */
import http from "@/utils/httpRequest"
export default {
    namespaced: true,
    state: {
        materialGroupList: [],
        materialList: {},
        materialGroupId: 0,
        materialType: 1,
        dataListLoading: false,
        dataList: [],
        page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
        }
    },

    mutations: {
        setMaterialgroup(state, data) {
            state.materialGroupList = data
        },
        setDataList(state, data) {
            state.dataList = data
        },
        setPage(state, payload) {
            state.page = payload
        },
        setMaterialGroupId(state, payload) {
            state.materialGroupId = payload
        },
        setMaterialType(state, payload) {
            state.materialType = payload
        },
        setDataListLoading(state, payload) {
            state.dataListLoading = payload
        }
    },
    actions: {
        /**
         * 8、	素材中心分组-列表查询
         * @param {*} param0
         * @param {*} param1
         */
        queryMaterialgroup({ commit, state }, { materialGroupName = "" }) {
            http({
                url: http.adornUrl(`/corp/materialgroup/list/`),
                method: "get",
                params: http.adornParams({
                    materialType: state.materialType, //1-视频 2-音频 3-课件 4-图片
                    materialGroupName //分组名称，模糊查询
                })
            }).then(({ data }) => {
                commit("setMaterialgroup", data)
            })
        },
        /**
         * 13、	素材中心素材-列表查询（添加权限：corp:materiallib:page）
         * @param {*} param0
         * @param {*} param1
         */
        queryMaterialList({ commit, state }, { materialLibState = "", title = "", status, current = 1, size = 10 }) {
            commit("setDataListLoading", true)
            http({
                url: http.adornUrl(`/corp/materiallib/page`),
                method: "get",
                params: http.adornParams({
                    materialType: state.materialType, //1-视频 2-音频 3-课件 4-图片
                    materialGroupId: state.materialGroupId, // 分组Id
                    title, // 标题 模糊查询
                    materialLibState, // 上传状态：1-上传中  2-转码中 3-完成 4-失败
                    state: status, //上下架状态0-下架 1-上架
                    current: current, // 当前页
                    size // 每页显示条数
                })
            }).then(({ data }) => {
                commit("setDataList", data.records)
                commit("setPage", { total: data.total, currentPage: current, pageSize: size })
                setTimeout(() => {
                    commit("setDataListLoading", false)
                }, 500)
            })
        }
    }
}
