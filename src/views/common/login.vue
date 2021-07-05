<template>
  <div class="login">
    <img class="login-illustration" src="~@/assets/img/login_illustration.png" />
    <div class="login-box">
      <div class="top">
        <div class="logo">
          <img width="120px" src="~@/assets/img/login-logo.png" alt />
        </div>
      </div>
      <div class="mid">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
          <el-form-item prop="userName">
            <el-input class="info" v-model="dataForm.userName" placeholder="帐号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="info" v-model="dataForm.password" type="password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item prop="captcha">
            <el-row :gutter="20">
              <el-col :span="14">
                <el-input v-model="dataForm.captcha" placeholder="验证码"></el-input>
              </el-col>
              <el-col :span="10" class="login-captcha">
                <img :src="captchaPath" @click="getCaptcha()" alt />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" round @click="dataFormSubmit()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getUUID
  } from "@/utils"
  export default {
    data() {
      return {
        dataForm: {
          userName: "",
          password: "",
          uuid: "",
          captcha: ""
        },
        isSubmit: false,
        dataRule: {
          userName: [{
            required: true,
            message: "帐号不能为空",
            trigger: "blur"
          }],
          password: [{
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }],
          captcha: [{
            required: true,
            message: "验证码不能为空",
            trigger: "blur"
          }]
        },
        captchaPath: ""
      }
    },
    created() {
      this.getCaptcha()
    },
    menuList: {
      get() {
        return this.$store.state.common.menuList
      },
      set(val) {
        this.$store.commit("common/updateMenuList", val)
      }
    },
    methods: {
      // 提交表单
      dataFormSubmit() {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            if (this.isSubmit) {
              return
            }
            this.isSubmit = true
            this.$http({
                url: this.$http.adornUrl("/corpLogin"),
                method: "post",
                data: this.$http.adornData({
                  principal: this.dataForm.userName,
                  credentials: this.dataForm.password,
                  sessionUUID: this.dataForm.uuid,
                  imageCode: this.dataForm.captcha
                })
              })
              .then(({
                data
              }) => {
                this.$cookie.set("Authorization_vp_corp", "bearer" + data.access_token)
                this.$router.replace({ name: "top-main" })
              })
              .catch(() => {
                this.getCaptcha()
                this.isSubmit = false
              })
          }
        })
      },
      // 获取验证码
      getCaptcha() {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      }
    }
  }
</script>

<style lang="scss">
  .login {
    background: #B3DAFF;
    width: 100vw;
    height: 100vh;

    .login-illustration {
      width: 490px;
      height: 373px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 10%;
    }

    .login-box {
      padding: 30px;
      border-radius: 10px;
      background: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      width: 350px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 15%;

      .top {
        text-align: center;
        margin-bottom: 40px;

        .login {
          widows: 122px;
          height: 83px;
        }
      }

      .el-form-item__content {
        .el-button {
          display: block;
          width: 300px;
          margin: 0 auto;
        }
      }
    }
  }
</style>
