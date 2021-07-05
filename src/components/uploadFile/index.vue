<template>
    <div class="dib upload-con">
        <div>
            <ul class="img-wraaper clearFl" :style="{ minWidth: width + 16 + 'px', minHeight: height + 16 + 'px' }">
                <!--已传图片区-->
                <li
                    class="img-list img-arr"
                    :style="{ width: width + 'px', height: height + 'px' }"
                    v-for="(item, index) in files"
                    :key="'b' + index"
                >
                    <!--X 删除图标处-->
                    <div class="delete" v-if="isCanEdit && isShowDelete" @click="deleteFile(index)">
                        <i class="el-icon-circle-close"></i>
                    </div>

                    <!--展示图片处-->
                    <div class="img-item item-item-bg" @click="showPreviewer(index)">
                        <img
                            :src="item + '?x-oss-process=image/resize,m_fill,h_' + height + ',w_' + width"
                            :alt="item"
                            class="previewer-img"
                        />
                    </div>
                </li>

                <!--正在上传的动画区-->
                <li
                    class="img-list bgImg uploading-img"
                    :style="{ width: width + 'px', height: height + 'px' }"
                    v-show="uploadingFilesArr"
                    v-for="(itm, val) in uploadingFilesArr"
                    :key="'c' + val"
                >
                    <el-progress type="circle" :stroke-width="5" :width="height" :percentage="itm.percent"></el-progress>
                </li>

                <!--上传按钮区-->
                <li
                    class="img-list pointer"
                    :class="{ disabledUpload: isDisabledUpload }"
                    @click="disableUpload"
                    :style="{ width: width + 'px', height: height + 'px' }"
                    v-show="showUploadBtn"
                    ref="selectFile"
                >
                    <slot name="selectFile"></slot>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import plupload from "plupload"
const ICON_DOCTYPE = {
    pdf: window.SITE_CONFIG['cdnUrl'] + "/static/doctype/pdf.png"
}
export default {
    data() {
        return {
            accessTokenObj: {},
            uploadingFilesArr: [],
            uploader: null,
            uploadData: null,
            showImgIndex: null,
            showBtn: true,
            buttonLoading: false
        }
    },

    props: {
        routerName: {
            type: String,
            default: ""
        },
        doctype: {
            //上传类型  是照片还是文件
            type: String,
            default: function() {
                return "photo"
            }
        },
        minLength: {
            //最小能上传文件数
            type: Number,
            default: function() {
                return 1
            }
        },
        maxLength: {
            // 最大能上传文件数
            type: Number,
            default: function() {
                return 1
            }
        },

        maxFileSize: {
            // 最大上传文件大小
            type: String,
            default: function() {
                return "100mb"
            }
        },
        multiSelection: {
            //能否多选
            type: Boolean,
            default: function() {
                return false
            }
        },
        mimeTypes: {
            //上传的文件类型
            default: function() {
                return "image/*"
            }
        },

        files: {
            //  已传文件
            type: Array,
            default: function() {
                return []
            }
        },
        isCanEdit: {
            //是否能编辑
            type: Boolean,
            default: function() {
                return true
            }
        },
        isShowDelete: {
            //是否显示删除按钮
            type: Boolean,
            default: function() {
                return true
            }
        },
        width: {
            //图片上传时 样式宽
            type: Number,
            default: function() {
                return 110
            }
        },
        height: {
            //图片上传时 样式高
            type: Number,
            default: function() {
                return 110
            }
        },
        isDisabledUpload: {
            //是否禁止上传
            type: Boolean,
            default: function() {
                return false
            }
        }
    },

    computed: {
        showUploadBtn() {
            //是否显示图片上传按钮
            return this.showBtn && this.files.length < this.maxLength && this.isCanEdit
        }
    },
    components: {},

    mounted() {
        this.createUploader()
    },
    methods: {
        disableUpload() {
            // 点击上传按钮时  判断是否禁用上传
            if (this.isDisabledUpload) this.uploader.disableBrowse()
        },
        /*获取token*/
        async getToken(fileType) {
            //图片上传
            if (this.doctype == "photo") {
                let { data } = await this.$http({
                    url: this.$http.adornUrl(`/corp/oss/pub/uploadSignUrl/${fileType}`),
                    method: "get",
                    params: this.$http.adornParams({
                        fileType
                    })
                })
                this.accessTokenObj = data || {}
                this.accessTokenObj["host"] = "https://image.mayuwl.com"
            } else {
                //课件上传
                let { data } = await this.$http({
                    url: this.$http.adornUrl(`/corp/oss/prt/uploadSignUrl/${fileType}`),
                    method: "get",
                    params: this.$http.adornParams({
                        fileType
                    })
                })
                this.accessTokenObj = data || {}
                this.accessTokenObj["host"] = "https://pdf.mayuwl.com"
            }
        },
        async getAccessToken(fileType) {
            let _Now = new Date().getTime() / 1000
            if (!!Object.keys(this.accessTokenObj).length) {
                if (_Now + 3 > this.accessTokenObj.expire) {
                    //过期了
                    console.log("过期了,再次获取token")
                    await this.getToken(fileType)
                    return true
                } else {
                    console.log("没过期,不用再次获取token")
                    // return Promise.resolve()
                }
            } else {
                console.log("没有accessTokenObj 获取token...")
                await this.getToken(fileType)
                return true
            }
        },

        //获取文件格式名
        get_suffix(filename) {
            let pos = filename.lastIndexOf(".")
            let suffix = ""
            if (pos != -1) {
                suffix = filename.substring(pos + 1)
            }
            return suffix
        },
        formatFileName(fileId, filename) {
            //格式化文件名
            return this.accessTokenObj.dir + fileId + this.get_suffix(filename)
        },
        //设置上传参数
        set_upload_param(up, fileId, filename) {
            this.uploadData = {
                key: this.accessTokenObj.key,
                policy: this.accessTokenObj.policy,
                OSSAccessKeyId: this.accessTokenObj.accessKeyId,
                success_action_status: "200",
                signature: this.accessTokenObj.signature
            }
            up.setOption({
                url: this.accessTokenObj.host,
                multipart_params: this.uploadData
            })
        },
        createUploader() {
            if (this.routerName === "waiting") {
                return
            }
            let that = this
            that.uploader = new plupload.Uploader({
                runtimes: "html5",
                browse_button: that.$refs.selectFile, //选择文件按钮'selectfile'+this.idx
                multi_selection: this.multiSelection,
                filters: {
                    mime_types: this.mimeTypes,
                    max_file_size: this.maxFileSize
                },
                /*chunk_size: '400kb',*/
                max_retries: 1,
                url: that.accessTokenObj["host"],
                prevent_duplicates: true
            })

            that.uploader.init()
            that.uploader.bind("FilesAdded", async (up, files) => {
                /*that.ulWrapper = that.$refs.ulWrapper*/
                console.log("选择的uploader对象=》", up)
                let stillLength = that.maxLength - that.files.length
                if (files.length > stillLength) {
                    that.$message({
                        message: `最多上传${that.maxLength}文件,还能上传${stillLength}个`,
                        type: "warning"
                    })
                    up.splice(0, up.files.length)
                } else {
                    console.log("选择的文件数量符合。。")
                    that.fileName = files[0].name
                    let fileType = that.get_suffix(that.fileName)
                    await that.getToken(fileType)

                    plupload.each(files, function(file) {
                        that.uploadingFilesArr.push(file)
                    })
                    console.log("文件添加后的数组：", that.uploadingFilesArr)
                    // that.showBtn = false
                    up.start()
                }
            })
            that.uploader.bind("BeforeUpload", (up, file) => {
                that.set_upload_param(up, file.id, file.name, true)
            })
            that.uploader.bind("UploadProgress", (up, file) => {
                that.uploadingFilesArr.forEach((item, index) => {
                    if (item.id == file.id) {
                        item.percent = file.percent
                    }
                })
                console.log("文件上传过程中的数组=》", that.uploadingFilesArr)
            })
            that.uploader.bind("FileUploaded", (up, file, res) => {
                console.log("走到上传最后这一步返回的res", res)
                console.log("走到上传最后这一步返回的uploader", up)
                let obj = {
                    res,
                    accessTokenObj: this.accessTokenObj,
                    fileName: file.id + that.get_suffix(file.name),
                    fileId: file.id
                }
                let cover
                let { resourcesDomain, key } = obj.accessTokenObj
                if (that.doctype !== "photo") {
                    cover = ICON_DOCTYPE[that.doctype]
                } else {
                    cover = resourcesDomain + "/" + key
                }
                that.$emit("uploadedFile", key, cover)
                that.deleteUploadingFile(file.id)
            })

            that.uploader.bind("Error", (up, err) => {
                console.log("plupload错误代码", err)
                let code = err.code
                if (code == -600) {
                    that.$message({
                        message: `上传图片过大`,
                        type: "warning",
                        duration: 3600
                    })
                } else if (code == -602) {
                    that.$message({
                        message: `不能重复上传`,
                        type: "warning",
                        duration: 3600
                    })
                } else {
                    that.$message({
                        message: `上传失败！`,
                        type: "warning",
                        duration: 3600
                    })
                }
                up.splice(0, up.files.length)
                that.uploadingFilesArr = []
                that.showBtn = true
            })
        },
        //  图片上传完成时 删除uploadingFilesArr正在上传中的数组
        deleteUploadingFile(fileId) {
            this.uploadingFilesArr.forEach((item, index) => {
                if (item.id == fileId) {
                    this.uploadingFilesArr.splice(index, 1)
                }
            })
        },
        //删除图片
        deleteFile(index) {
            this.uploader.refresh()
            this.$emit("deleteFile", index)
        },

        _showUploadBtn() {
            //显示上传按钮
            this.showBtn = true
        },

        //预览图片
        showPreviewer(index) {
            this.showImgIndex = index
        }
    }
}
</script>

<style lang="scss" rel="stylesheet/scss">
$margin-left: 16px;
.upload-con {
    .disabledUpload {
        cursor: not-allowed;
    }
}
.img-wraaper {
    // 已传图片区
    .img-list {
        float: left;
        margin-bottom: $margin-left;
        margin-right: $margin-left;
        border: 1px dashed #d9d9d9;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.img-arr {
            position: relative;
            z-index: 100;
            // 删除按钮
            .delete {
                position: absolute;
                font-size: 22px;
                top: -9px;
                right: -9px;
                cursor: pointer;
                background: #ffffff;
                border-radius: 100px;
            }
        }
        .img-item {
            height: 100%;
            // cursor: -webkit-zoom-in;
            img {
                width: 100%;
                height: 100%;
            }
            &.item-item-bg {
                border: none;
            }
        }
        &:nth-child(4n + 0) {
            margin-right: 0;
        }
        &.uploading-img {
            text-align: center;
        }
    }
}
</style>
