<template>
  <HeaderMenu ref="headerMenu" :menu="routeMenu" />
</template>

<script>
import HeaderMenu from './components/HeaderMenu'
import { mapGetters } from 'vuex'
import eventbus from '@/eventbus'
export default {
  name: 'TopNavbar',
  components: { HeaderMenu },
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['permission_routes']),
    routeMenu() {
      let routeMenu = this.permission_routes || []
      routeMenu = this.permission_routes.filter((item) => !item.hidden)
      this.setRouteEvent(routeMenu)
      return routeMenu
    }
  },
  watch: {
    '$route.path'() {
      this.setActiveRoute()
    }
  },
  mounted() {
    this.setActiveRoute()
  },
  methods: {
    // 获取默认的点击菜单
    setActiveRoute() {
      let path = this.$route.path
      let defaultActived = -1
      let defaultSubActived = ''
      this.routeMenu.forEach((route, index) => {
        if (route.path === path) {
          defaultActived = index
        }
        if (Array.isArray(route.children)) {
          route.children.forEach((cRoute, Cindex) => {
            if (cRoute.path === path) {
              defaultActived = index
              defaultSubActived = index + '-' + Cindex
            }
          })
        }
      })
      if (this.$route.name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      this.$refs.headerMenu.actived = defaultActived
      this.$refs.headerMenu.subActived = defaultSubActived
    },
    // 设置路由点击跳转事件
    setRouteEvent(routes, parentRoute) {
      if (Array.isArray(routes)) {
        routes.forEach((route) => {
          if (route.redirect) {
            route.click = () => this.$router.push(route.redirect)
          } else if (route.path) {
            route.click = () => {
              if (parentRoute) parentRoute.redirect = route.path
              this.$router.push(route.path)
            }
          } else {
            route.click = () => this.clickUnroute(route)
          }
          if (!route.meta) {
            const firstChild = Array.isArray(route.children)
              ? route.children[0]
              : {}
            route.meta = firstChild.meta
          }
          this.setRouteEvent(route.children, route)
        })
      }
    },
    clickUnroute(route) {
      eventbus.$emit('routeAction', route)
    }
  }
}
</script>

<style lang='scss'>
</style>
