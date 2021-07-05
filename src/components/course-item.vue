<template>
  <div class="course-block" v-if="courseList.length > 0">
    <div class="course-item" v-for="(item, index) in courseList" :key="index" @click="toLiveDetail(item.liveId)">
      <img :src="item.coverImg" class="course-img" />
      <div class="course-info">
        <div class="titlebox">
          <div class="multi-ellipsis--l2">
            <el-tag type="primary" size="mini"  v-if="item.liveType==0">直播</el-tag>
            <el-tag type="danger" size="mini"  v-else-if="item.liveType==1">录播</el-tag>
            <el-tag type="success" size="mini"  v-else-if="item.liveType==2">现场</el-tag>
            {{item.title}}
          </div>
          <div class="time" v-if="item.liveTime"> 开始时间：{{item.liveTime}}</div>
        </div>
        <div class="price-box">
          <div class="price">{{item.livePrice==0?'免费':'¥'+item.livePrice}}</div>
          <div class="num">已报名：{{item.signNum}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      courseList: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {

      }
    },
    methods:{
      toLiveDetail(liveId){
        this.$router.push({
          name:"collegeCourseDetail",
          query:{
            liveId
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .course-block {
    display: flex;
    flex-wrap: wrap;
    margin-left: -30px;
    .course-item {
      background: #fff;
      border-radius: 5px;
      width: 210px;
      margin-left: 30px;
      margin-top: 24px;
      cursor: pointer;
      .course-img {
        width: 210px;
        height: 140px;
        flex-shrink: 0;
        border-radius: 10px;
      }

      .course-info {
        display: flex;
        flex-direction: column;
        padding: 5px 5px 8px 5px;
        text-align: left;

        .titlebox {
          color: #333;
          font-size: 14px;
          height: 60px;

          .multi-ellipsis--l2 {
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .time {
            font-size: 12px;
            color: #666;
            padding-top: 5px;
          }
        }



        .price-box {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .price {
            color: #F0584D;
            font-size: 19px;
            font-weight: bold;
          }

          .num {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
</style>
