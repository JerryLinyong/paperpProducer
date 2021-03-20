import Vue from 'vue'
import Router from 'vue-router'
import { hasLogin } from '@/settings'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!) 需要显示的页面需要添加 name 属性
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * 固定路由,无需后台权限
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export let constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    name: 'Main',
    path: '/',
    component: () => import('@/views/main/index'),
    meta: { title: '', icon: 'user' }
  },
  {
    name: 'Paper',
    path: '/paper',
    component: () => import('@/views/paper/index'),
    meta: { title: '', icon: 'user' },
    props: true
  }
]

if (hasLogin) {
  constantRoutes.push(
    {
      path: '/login',
      component: () => import('@/views/login/index'),
      hidden: true
    })
}
/**
 * 异步路由,需要后台权限
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = {
  Main: {
    name: 'Main',
    path: '/Main',
    component: () => import('@/views/main/index'),
    meta: { title: '主页', icon: 'user' }
  }
}

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
