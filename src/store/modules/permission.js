import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'

const state = {
  routes: constantRoutes,
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = routes.concat(constantRoutes)
  }
}

const actions = {
  generateRoutes({ commit }, routes) {
    return new Promise(resolve => {
      let accessedRoutes = routes.map(route => {
        route.children = route.children || []
        route.children.unshift(route)
        return {
          path: '',
          component: Layout,
          meta: { title: route.title },
          children: route.children.map(i => {
            const localRoute = asyncRoutes[i.path]
            return localRoute ? {
              ...localRoute,
              meta: Object.assign({ ...localRoute }, { title: i.title, icon: i.icon })
            } : null
          }).filter(i => i)
        }
      }).filter(i => i.children.length)
      if (accessedRoutes.length === 0) {
        accessedRoutes.push({ path: '*', redirect: '/401', hidden: true })
      } else {
        let redirect = accessedRoutes[0].path || accessedRoutes[0].children[0].path
        // 设置默认页
        accessedRoutes.unshift({
          path: '/',
          redirect,
          hidden: true
        })
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
