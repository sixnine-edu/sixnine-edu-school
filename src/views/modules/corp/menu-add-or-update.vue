<template>
  <el-dialog
    :title="!dataForm.id ? $t('sysManagement.add') : $t('sysManagement.modify')"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="this.$i18n.t('language') === 'English' ? '155px' : '110px'"
    >
      <el-form-item :label="$t('sysManagement.type')" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio
            v-for="(type, index) in dataForm.typeList"
            :label="index"
            :key="index"
          >{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.type] + $t('publics.name')" prop="name">
        <el-input
          v-model="dataForm.name"
          maxlength="30" show-word-limit
          :placeholder="dataForm.typeList[dataForm.type] + $t('publics.name')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.type] + $t('publics.en') + $t('publics.name')">
        <el-input
          v-model="dataForm.nameEn"
          maxlength="50" show-word-limit
          :placeholder="dataForm.typeList[dataForm.type] + $t('publics.en') + $t('publics.name')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('corp.parentMenu')">
        <el-cascader
          expand-trigger="hover"
          :options="menuList"
          :props="menuListTreeProps"
          change-on-select
          :clearable="true"
          v-model="selectedMenu"
          @change="handleSelectMenuChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 1" :label="$t('sysManagement.menuRouter')"  prop="url">
        <el-input v-model="dataForm.url" :placeholder="$t('sysManagement.menuRouter')" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 0" :label="$t('corp.authorization')" prop="perms">
        <el-input v-model="dataForm.perms" :placeholder="$t('corp.separated') + 'user:list,user:create'" maxlength="250" show-word-limit></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" :label="$t('hotSearch.seq')" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" :label="$t('hotSearch.seq')"maxlength="100" show-word-limit></el-input-number>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" :label="$t('corp.menuIcon')" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover
              ref="iconListPopover"
              placement="bottom-start"
              trigger="click"
              popper-class="mod-menu__icon-popover"
            >
              <div class="mod-menu__icon-list">
                <el-button
                  v-for="(item, index) in iconList"
                  :key="index"
                  @click="iconActiveHandle(item)"
                  :class="{ 'is-active': item === dataForm.icon }"
                >
                  <icon-svg :name="item"></icon-svg>
                </el-button>
              </div>
            </el-popover>
            <el-input
              v-model="dataForm.icon"
              v-popover:iconListPopover
              :readonly="true"
              maxlength="30" show-word-limit
              :placeholder="$t('corp.menuIconName')"
              class="icon-list__input"
            ></el-input>
          </el-col>
          <el-col :span="2" class="icon-list__tips">
            <el-tooltip placement="top" effect="light">
              <div slot="content">{{$t('corp.content')}}</div>
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('coupon.cancel')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('coupon.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate, idList } from '@/utils'
import Icon from '@/icons'
export default {
  data () {
    var validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error(this.$i18n.t('corp.menuUrlNoNull')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        id: 0,
        type: 1,
        typeList: [this.$i18n.t('corp.catalog'), this.$i18n.t('corp.menu'), this.$i18n.t('corp.button')],
        name: '',
        nameEn: '',
        parentId: 0,
        url: '',
        perms: '',
        orderNum: 0,
        icon: '',
        iconList: []
      },
      dataRule: {
        name: [
          { required: true, message: this.$i18n.t('corp.menuNameNoNull'), trigger: 'blur' }
        ],
        url: [
          { validator: validateUrl, trigger: 'blur' }
        ]
      },
      isSubmit: false,
      menuList: [],
      selectedMenu: [],
      menuListTreeProps: {
        value: 'menuId',
        label: 'name'
      }
    }
  },
  created () {
    this.iconList = Icon.getNameList()
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.isSubmit = false
      this.dataForm.nameEn = null
      this.$http({
        url: this.$http.adornUrl('/corp/menu/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.menuList = treeDataTranslate(data, 'menuId')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }).then(() => {
        if (this.dataForm.id) {
          // 修改
          this.$http({
            url: this.$http.adornUrl(`/corp/menu/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm.id = data.menuId
            this.dataForm.type = data.type
            this.dataForm.name = data.name
            this.dataForm.nameEn = data.nameEn
            this.dataForm.parentId = data.parentId
            this.dataForm.url = data.url
            this.dataForm.perms = data.perms
            this.dataForm.orderNum = data.orderNum
            this.dataForm.icon = data.icon
            this.selectedMenu = idList(this.menuList, data.parentId, 'menuId', 'children').reverse()
          })
        } else {
          this.selectedMenu = []
        }
      })
    },
    handleSelectMenuChange (val) {
      this.dataForm.parentId = val[val.length - 1]
    },
    // 图标选中
    iconActiveHandle (iconName) {
      this.dataForm.icon = iconName
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl(`/corp/menu`),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData({
              'menuId': this.dataForm.id || undefined,
              'type': this.dataForm.type,
              'name': this.dataForm.name,
              'nameEn': this.dataForm.nameEn || this.dataForm.name,
              'parentId': this.dataForm.parentId,
              'url': this.dataForm.url,
              'perms': this.dataForm.perms,
              'orderNum': this.dataForm.orderNum,
              'icon': this.dataForm.icon
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    max-width: 420px;
  }
  &__icon-list {
    max-height: 180px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
}
</style>
