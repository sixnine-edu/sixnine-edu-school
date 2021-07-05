<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-24 15:01:56
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-11 15:06:44
-->
<template>
    <div>
        <div class="trading-record">
            <div class="blue"></div>
            <span class="record-txt">专栏课</span>
        </div>
        <div class="coruse" v-if="courseList.length > 0">
            <div class="coruse-item" v-for="(item, index) in courseList" :key="item.courseId" @click="toDetail(item.courseId)">
                <img :src="item.coverImg" class="image" />
                <div class="info-box">
                    <div class="title ellipsis-2 ">{{ item.title }}</div>
                    <div class="desc ellipsis-2 ">{{ item.info }}</div>
                </div>
            </div>
        </div>
        <div class="empty-tip" v-else>
            <div class="el-icon-receiving"></div>
            <div class="empty-text">暂无课程数据</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            courseList: [],
            courseId: ""
        }
    },
    mounted() {
        this.getCourseList()
    },
    methods: {
        async getCourseList() {
            let res = await this.$http({
                url: this.$http.adornUrl("/corp/teacher/courses"),
                method: "get",
                params: this.$http.adornParams()
            })
          this.courseList = res.data

            // this.courseList = [
            //     {
            //         courseId: 4,
            //         coverImg: "https://janbird-img.mayuwl.com/4b1c33a7b02246c7a4b5d088975f473f.jpg",
            //         title: "日系二次元眼睛绘画教程",
            //         info: "眼睛总是画不好，学不会？快来海洋老师的温馨小课堂学习日系二次元眼睛绘制教程，教你一步搞定线稿，光影！",
            //         courseCategoryId: 7,
            //         state: 1,
            //         createTime: "2021-02-27 11:15:36",
            //         createBy: 1,
            //         updateTime: "2021-02-27 11:15:36",
            //         updateBy: 1
            //     },
            //     {
            //         courseId: 3,
            //         coverImg: "https://janbird-img.mayuwl.com/4cf71fcd5c1f4d9abcbb69e90bd7a72e.jpg",
            //         title: "人体结构基础绘画公开课",
            //         info: "就是不会画人，不知道怎样训练？手把手带你训练人体结构，变身原创绘画大触！",
            //         courseCategoryId: 7,
            //         state: 1,
            //         createTime: "2021-02-27 10:51:18",
            //         createBy: 1,
            //         updateTime: "2021-02-27 10:51:29",
            //         updateBy: 1
            //     },
            //     {
            //         courseId: 2,
            //         coverImg: "https://janbird-img.mayuwl.com/9f0e92f1c5d84b1ab406352074abbf3f.png",
            //         title: "素描·石膏像雕塑",
            //         info: "艺术高考美术专业素描示范课程——素描石膏雕塑",
            //         courseCategoryId: 11,
            //         state: 1,
            //         createTime: "2021-02-25 14:17:50",
            //         createBy: 1,
            //         updateTime: "2021-02-25 14:21:33",
            //         updateBy: 1
            //     },
            //     {
            //         courseId: 1,
            //         coverImg: "https://janbird-img.mayuwl.com/beb5b7531df8423a90f97e456e2ab844.jpg",
            //         title: "系统教学·绘画基础高阶课程·色彩课【祝凯教学】",
            //         info:
            //             "油画基础班所讲的内容为欧洲的绘画体系，这套系统中的绘画思路、观察方法等都有别于传统的俄罗斯体统，欧洲绘画系统可以让学员在短时间内了解掌握绘画知识及培养提高绘画自学能力。（本期课程所讲知识是整套欧洲体系的基础课程。）",
            //         courseCategoryId: 3,
            //         state: 1,
            //         createTime: "2021-02-25 14:00:08",
            //         createBy: 1,
            //         updateTime: "2021-02-25 14:21:47",
            //         updateBy: 1
            //     }
            // ]
        },
        toDetail(courseId) {
            this.$router.push({
                name: "courseDetail",
                query: {
                    courseId
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
