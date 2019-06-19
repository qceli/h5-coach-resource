import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: "/",
      name: "HelloWorld",
      component: HelloWorld,
      meta: {
        index: 0
      }
    },
    {
      path: "/choosephoto",
      name: "ChoosePhoto",
      component: () => import("@/components/ChoosePhoto"),
      meta: {
        index: 1
      }
    },
    {
      path: "/choosealbum",
      name: "ChooseAlbum",
      component: () => import("@/components/ChooseAlbum"),
      meta: {
        index: 2
      }
    },
    {
      path: "/dealphoto",
      name: "DealPhoto",
      component: () => import("@/components/DealPhoto"),
      meta: {
        index: 3
      }
    },
    {
      path: "/sharephoto",
      name: "SharePhoto",
      component: () => import("@/components/SharePhoto"),
      meta: {
        index: 4
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  }
});

// var firstEnter = true

// router.beforeEach((to, from, next) => {
//   console.log(to.path)
//   console.log(to)
//   let toPath = location.origin + (location.pathname + (location.hash ? '?from=singlemessage#' : '') + to.fullPath).replace('//', '/')
//   if (to.path === '/sharephoto') {
//     // 他人打开分享页面后，else中的内容会让第一个页面加载两次(应该是微信默认跳转引起的，else中明明已经禁用了vue的跳转)
//     // firstEnter = false
//     next(false)
//     location.href = toPath
//     return
//   }
//   // else {
//   // 不采用vue默认跳转方式，使用原生跳转，解决复制链接或在其他浏览器中打开时，链接错误
//   // next(false)
//   // location.href = toPath
//   // return
//   // }
//   next()
// })

export default router
