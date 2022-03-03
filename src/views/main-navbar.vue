<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-12-07 09:40:11
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-11 11:17:47
-->
<template>
    <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
        <div class="site-navbar__header">
            <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
                <!-- <a class="site-navbar__brand-lg" href="javascript:;">简鸟云课平台</a>
                <a class="site-navbar__brand-mini" href="javascript:;">简鸟</a> -->
                <img  src="../assets/img/login-logo.png" width="80px"/>
            </h1>
        </div>
        <div class="site-navbar__body">
            <!-- <el-menu class="site-navbar__menu" mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
         
      </el-menu> -->
            <el-menu router default-active="1"  mode="horizontal">
                <!-- <el-menu-item index="1">学校管理</el-menu-item>
                <el-menu-item index="2" :route="{ name: 'storeHome' }">在线商城</el-menu-item>
                <el-menu-item index="3" :route="{ name: 'storeAbout' }">关于我们</el-menu-item> -->
            </el-menu>
            <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
                <el-menu-item class="site-navbar__avatar" index="3">
                    <el-dropdown :show-timeout="0" placement="bottom">
                        <span class="el-dropdown-link">{{ empName }}</span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
                            <el-dropdown-item @click.native="logoutHandle()">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-menu-item>
            </el-menu>
        </div>
        <!-- 弹窗, 修改密码 -->
        <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
    </nav>
</template>

<script>
import UpdatePassword from "./main-navbar-update-password"
import { clearLoginInfo } from "@/utils"
export default {
    data() {
        return {
            updatePassowrdVisible: false
        }
    },
    components: {
        UpdatePassword
    },
    computed: {
        navbarLayoutType: {
            get() {
                return this.$store.state.common.navbarLayoutType
            }
        },
        sidebarFold: {
            get() {
                return this.$store.state.common.sidebarFold
            },
            set(val) {
                this.$store.commit("common/updateSidebarFold", val)
            }
        },
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs
            },
            set(val) {
                this.$store.commit("common/updateMainTabs", val)
            }
        },
        empName: {
            get() {
                return this.$store.state.user.empName
            }
        }
    },
    methods: {
        // 修改密码
        updatePasswordHandle() {
            this.updatePassowrdVisible = true
            this.$nextTick(() => {
                this.$refs.updatePassowrd.init()
            })
        },
        switchLang(lang) {
            localStorage.setItem("lang", lang)
            window.location.reload()
        },
        // 退出
        logoutHandle() {
            this.$confirm(this.$i18n.t("homes.isExit"), this.$i18n.t("text.tips"), {
                confirmButtonText: this.$i18n.t("homes.confirm"),
                cancelButtonText: this.$i18n.t("homes.cancel"),
                type: "warning"
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl("/corp/user/logout"),
                        method: "post",
                        data: this.$http.adornData()
                    }).then(({ data }) => {
                        clearLoginInfo()
                        this.$router.push({ name: "login" })
                    })
                })
                .catch(() => {})
        }
    }
}
</script>
