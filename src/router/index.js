/* eslint-disable camelcase */
/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from "vue"
import Router from "vue-router"
import http from "@/utils/httpRequest"
import {
  isURL
} from "@/utils/validate"
import {
  clearLoginInfo
} from "@/utils"
Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require("./import-" + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [{
    path: "/404",
    component: _import("common/404"),
    name: "404",
    meta: {
      title: "404未找到"
    }
  },
  {
    path: "/login",
    component: _import("common/login"),
    name: "login",
    meta: {
      title: "登录"
    }
  },
  {
    path: "/test",
    component: _import("common/test"),
    name: "test",
    meta: {
      title: "测试"
    }
  },
  {
    path: "/photo-preview",
    component: _import("common/photo-preview"),
    name: "photoPreview",
    meta: {
      title: "图片预览"
    }
  },

  {
    path: "/store",
    component: _import("main-top-nav"),
    redirect: {
      name: "storeIndex"
    },
    name: "store",
    meta: {
      title: "首页"
    },
    children: [{
        path: "/store/index",
        component: _import("store/home"),
        name: "storeIndex",
        meta: {
          title: "商城"
        }
      },
      {
        path: "/store/course-search",
        component: _import("store/course-search"),
        name: "storeCourseSearch",
        meta: {
          title: "商城搜索"
        }
      },
      {
        path: "/store/detail",
        component: _import("store/detail"),
        name: "storeDetail",
        meta: {
          title: "商品详情"
        }
      },
      {
        path: "/store/about",
        component: _import("store/about"),
        name: "storeAbout",
        meta: {
          title: "关于我们"
        }
      },
      {
        path: "/store/cart",
        component: _import("store/cart"),
        name: "storeCart",
        meta: {
          title: "购物车"
        }
      },
      {
        path: "/store/submit-order",
        component: _import("store/submit-order"),
        name: "submitOrder",
        meta: {
          title: "提交订单"
        }
      },
      {
        path: "/store/payment",
        component: _import("store/payment"),
        name: "payment",
        meta: {
          title: "支付页"
        }
      },
      {
        path: "/store/user-center",
        component: _import("store/user-center"),
        name: "userCenter",
        meta: {
          title: "用户中心"
        },
        redirect: {
          name: "userCenterIndex"
        },
        children: [{
            path: "/store/user-center/index",
            component: _import("store/user-center/index"),
            name: "userCenterIndex",
            meta: {
              title: "用户中心首页"
            }
          },
          {
            path: "/store/user-center/uc-order",
            component: _import("store/user-center/uc-order"),
            name: "ucOrder",
            meta: {
              title: "我的订单"
            }
          },
          {
            path: "/store/user-center/uc-collection",
            component: _import("store/user-center/uc-collection"),
            name: "ucCollection",
            meta: {
              title: "我的收藏"
            }
          },
          {
            path: "/store/user-center/uc-address",
            component: _import("store/user-center/uc-address"),
            name: "ucAddress",
            meta: {
              title: "收货地址"
            }
          }
        ]
      },
      {
        path: "/store/order-detail",
        component: _import("store/order-detail"),
        name: "orderDetail",
        meta: {
          title: "订单详情"
        }
      }
    ]
  },
  {
    path: "/headmaster",
    component: _import("main-top-nav"),
    redirect: {
      name: "headmasterIndex"
    },
    name: "headmaster",
    meta: {
      title: "校长"
    },
    children: [{
        path: "/headmaster/index",
        component: _import("headmaster/home"),
        name: "headmasterIndex",
        meta: {
          title: "校长首页"
        }
      },
      {
        path: "/headmaster/article-detail",
        component: _import("headmaster/article-detail"),
        name: "articleDetail",
        meta: {
          title: "文章详情"
        }
      },
      {
        path: "/headmaster/notice-detail",
        component: _import("headmaster/notice-detail"),
        name: "noticeDetail",
        meta: {
          title: "公告详情"
        }
      },

    ]
  },
  {
    path: "/course",
    component: _import("main-top-nav"),
    redirect: {
      name: "courseIndex"
    },
    name: "course",
    meta: {
      title: "备授课"
    },
    children: [{
        path: "/course/index",
        component: _import("course/home"),
        name: "courseIndex",
        meta: {
          title: "备授课首页"
        }
      },
      {
        path: "/course/detail",
        component: _import("course/detail"),
        name: "courseDetail",
        meta: {
          title: "备授课详情"
        }
      }
    ]
  },
  {
    path: "/college",
    component: _import("main-top-nav"),
    redirect: {
      name: "collegeIndex"
    },
    name: "college",
    meta: {
      title: "成长学院"
    },
    children: [{
        path: "/college/index",
        component: _import("college/home"),
        name: "collegeIndex",
        meta: {
          title: "成长学院"
        }
      },
      {
        path: "/college/all-course",
        component: _import("college/all-course"),
        name: "collegeAllCourse",
        meta: {
          title: "成长学院"
        }
      },
      {
        path: "/college/master",
        component: _import("college/master"),
        name: "collegeMaster",
        meta: {
          title: "校长栏"
        }
      },
      {
        path: "/college/teacher",
        component: _import("college/teacher"),
        name: "collegeTeacher",
        meta: {
          title: "老师栏"
        }
      },
      {
        path: "/college/course-detail",
        component: _import("college/course-detail"),
        name: "collegeCourseDetail",
        meta: {
          title: "课程详情"
        }
      },
      {
        path: "/college/my-train",
        component: _import("college/my-train"),
        name: "collegeMyTrain",
        meta: {
          title: "我的培训"
        }
      },
      {
        path: "/college/confirm",
        component: _import("college/confirm"),
        name: "collegeConfirm",
        meta: {
          title: "订单确认"
        }
      },
      {
        path: "/college/pay-success",
        component: _import("college/pay-success"),
        name: "collegePaySuccess",
        meta: {
          title: "支付成功"
        }
      },
    ]
  }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: "/",
  component: _import("main-top-nav"),
  name: "top-main",
  // redirect: {
  //   name: "home"
  // },
  // meta: { title: "主入口整体布局" },
  children: [{
    path: "/school",
    component: _import("main"),
    // name: "main",
    redirect: {
      name: "home"
    },
    meta: {
      title: "主入口整体布局"
    },
    children: [{
        path: "/school/index",
        component: _import("common/home"),
        name: "home",
        meta: {
          title: "首页"
        }
      },
      // { path: "/school/course-detail", component: _import("modules/teacher/course-detail"), name: "courseDetail", meta: { title: "课程详情" } }
    ]
  }],
  beforeEnter(to, from, next) {
    let authorization = Vue.cookie.get("Authorization_vp_corp")
    if (!authorization || !/\S/.test(authorization)) {
      clearLoginInfo()
      next({
        name: "login"
      })
    }
    next()
  }
}

const router = new Router({
  mode: "hash",
  scrollBehavior: () => ({
    y: 0
  }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === "global") {
    next()
  } else {
    http({
        url: http.adornUrl("/corp/menu/nav"),
        method: "get",
        params: http.adornParams()
      })
      .then(({
        data
      }) => {
        sessionStorage.setItem("authorities", JSON.stringify(data.authorities || "[]"))
        fnAddDynamicMenuRoutes(data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem("menuList", JSON.stringify(data.menuList || "[]"))
        next({
          ...to,
          replace: true
        })
      })
      .catch(e => {
        console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, "color:blue")
        router.push({
          name: "login"
        })
      })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return "global"
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : "main"
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, "")
      var route = {
        path: menuList[i].url.replace("/", "-"),
        component: null,
        name: menuList[i].url.replace("/", "-"),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ""
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route["path"] = `i-${menuList[i].menuId}`
        route["name"] = `i-${menuList[i].menuId}`
        route["meta"]["iframeUrl"] = menuList[i].url
      } else {
        try {
          route["component"] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = "main-dynamic"
    console.log("mainRoutes", mainRoutes.children)
    mainRoutes.children[0].children = routes
    console.log("routes", routes)
    router.addRoutes([mainRoutes, {
      path: "*",
      redirect: {
        name: "404"
      }
    }])
    sessionStorage.setItem("dynamicMenuRoutes", JSON.stringify(mainRoutes.children[0].children || "[]"))
  }
}

export default router
