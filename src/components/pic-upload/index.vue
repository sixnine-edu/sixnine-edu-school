<template>
  <div @click="openImg">
    <el-upload
      class="pic-uploader-component"
      :disabled="disabled"
      :action="$http.adornUrl('/admin/file/upload/element')"
      :headers="{Authorization: $cookie.get('Authorization_vp_corp')}"
      :show-file-list="false"
      :on-success="handleUploadSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="value" :src="resourcesUrl + value" class="pic" />
      <i v-else class="el-icon-plus pic-uploader-icon"></i>
    </el-upload>
    <el-dialog :visible.sync="visible" :append-to-body="visible">
      <img width="100%" :src="resourcesUrl + value" alt />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      resourcesUrl: window.SITE_CONFIG.resourcesUrl,
      visible: false
    }
  },
  props: {
    value: {
      default: '',
      type: String
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    // 图片上传
    handleUploadSuccess (response, file, fileList) {
      this.$emit('input', file.response)
    },
    // 限制图片上传大小
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    openImg () {
      if (this.disabled) {
        this.visible = true
      }
    }
  }
}
</script>

<style lang="scss">
.pic-uploader-component .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  .pic-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .pic {
    width: 178px;
    height: 178px;
    display: block;
  }
}
.pic-uploader-component .el-upload:hover {
  border-color: #409eff;
}
</style>
