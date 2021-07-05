<template>
  <div>
    <el-dialog
      :title="$t('platform.selectTag')"
      :visible.sync="visible"
      width="36%"
      class="el-upload-list el-upload-list--picture-card"
    >
      <el-form :inline="true" :model="searchForm" class="demo-form-inline form">
        <el-form-item>
          <el-input v-model="tagName" size="medium" :placeholder="$t('user.tagTip1')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="searchChange"
            icon="el-icon-search"
            size="medium"
          >{{$t("pictureManager.query")}}</el-button>
        </el-form-item>
      </el-form>
      <el-main>
        <div class="main">
          <div v-for="item in tagList" :key="item.tagId">
            <span
              :class="active.includes(item)?'active':'Classification'"
              @click="oncheck(item)"
            >{{item.tagName}}</span>
          </div>
        </div>
        <div v-if="tagList.length < 1">{{$t('order.noData')}}</div>
      </el-main>

      <!-- 分页 -->
      <el-pagination
        v-if="tagList.length"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      <!-- /分页 -->
      <el-button @click="visible = false" size="small">{{$t('remindPop.cancel')}}</el-button>
      <el-button type="primary" @click="confirm" size="small">{{$t('remindPop.confirm')}}</el-button>
    </el-dialog>
  </div>
</template>


<script>
export default {

  data () {
    return {
      visible: false,
      dataForm: {
        tagList: [], // 标签
        userIds: []
      },
      tagList: [], // 标签
      selectedTags: [],
      dataRule: {
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false,
      active: [], // 选种的标签
      searchForm: {
        tagType: 0, // 标签类型0手动1条件2系统
        tagName: null
      },
      tagName: null
    }
  },
  components: {
  },
  props: {
    value: {
      default: '',
      type: String
    },
    // 最大上传数量
    limit: {
      default: 9,
      type: Number
    }
  },
  mounted () {
  },
  activated () {
    this.getTagList()
  },
  methods: {
    init () {
      this.visible = true
      this.getTagList()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getTagList(this.page)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getTagList(this.page)
    },
    // 分页获取标签
    getTagList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/user/userTag/byTagType'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.searchForm
          )
        )
      }).then(({ data }) => {
        this.tagList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 搜索
    searchChange () {
      this.searchForm.tagName = this.tagName
      this.getTagList(this.page)
    },
    // 多选
    oncheck (item) {
      if (this.active.includes(item)) {
        let index = this.active.indexOf(item)
        this.active.splice(index, 1)
      } else {
        this.active.push(item)
      }
    },
    confirm () {
      if (!this.active.length) {
        this.visible = false
        return
      }
      this.dataForm.tagList = []
      let arr = []
      this.active.forEach(item => {
        arr.push({ 'userTagId': item.userTagId, 'tagName': item.tagName })
        this.dataForm.tagList.push(item.userTagId)
      })
      this.$emit('refreshTagsArr', arr)
      arr = []
      this.active = []
      this.dataForm.tagList = []
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.active {
  float: left;
  margin-left: 10px;
  padding: 10px;
  background: #e6a23c;
  margin-bottom: 10px;
  border-radius: 4px;
  font-size: 14px;
}
.Classification {
  float: left;
  margin-left: 10px;
  padding: 10px;
  background: #f7f7f7;
  margin-bottom: 10px;
  border-radius: 4px;
  font-size: 14px;
}
</style>
