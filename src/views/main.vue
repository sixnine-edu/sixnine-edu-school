<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-12-07 09:40:11
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-15 12:30:13
-->
<template>
    <div class="site-wrapper" :class="{ 'site-sidebar--fold': sidebarFold }" v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中">
        <template v-if="!loading">
            <!-- <main-navbar /> -->
            <main-sidebar />
            <div class="site-content__wrapper-module" >
                <main-content />
            </div>
        </template>
    </div>
</template>

<script>
import MainNavbar from "./main-navbar"
import MainSidebar from "./main-sidebar"
import MainContent from "./main-content"
export default {
    data() {
        return {
            loading: false
        }
    },
    components: {
        MainNavbar,
        MainSidebar,
        MainContent
    },
    computed: {
        documentClientHeight: {
            get() {
                return this.$store.state.common.documentClientHeight
            },
            set(val) {
                this.$store.commit("common/updateDocumentClientHeight", val)
            }
        },
        sidebarFold: {
            get() {
                return this.$store.state.common.sidebarFold
            }
        },
        userId: {
            get() {
                return this.$store.state.user.id
            },
            set(val) {
                this.$store.commit("user/updateId", val)
            }
        },
        empName: {
            get() {
                return this.$store.state.user.empName
            },
            set(val) {
                this.$store.commit("user/updateEmpName", val)
            }
        },
        userName: {
            get() {
                return this.$store.state.user.userName
            },
            set(val) {
                this.$store.commit("user/updateUserName", val)
            }
        }
    },
    created() {
       // this.getUserInfo()
    },
    mounted() {
        this.resetDocumentClientHeight()
    },
    methods: {
        // 重置窗口可视高度
        resetDocumentClientHeight() {
            this.documentClientHeight = document.documentElement["clientHeight"]
            window.onresize = () => {
                this.documentClientHeight = document.documentElement["clientHeight"]
            }
        },
        // 获取当前管理员信息
        getUserInfo() {
            this.$http({
                url: this.$http.adornUrl("/corp/user/info"),
                method: "get",
                params: this.$http.adornParams()
            }).then(({ data }) => {
                this.loading = false
                this.userId = data.corpUserId
                this.empName = data.empName
                this.userName = data.userName
            })
        }
    }
}
</script>
