<!--
  头部菜单(author:林永佳)

  props
    menu: array [ {} ] 节点显示的数据
                  {
                    name: string - 菜单的名称
                    path: string - 存在则点击进行路由跳转
                    hide: bool - 是否隐藏
                    highLight: bool false 点击是否高亮
                    click: func - 点击的事件
                    meta: object {} 元信息
                                 {
                                   title: string - 显示的文本
                                   icon: string - 图标名称
                                   iconColor: string - 图标颜色
                                 }
                    children: array [ {} ] 导航项拥有的功能,字段与父元素相同
                  }

  events

  methods

  实例
    <HeaderMenu :menu="[]" />

-->
<template>
  <div class="header-menu">
    <div class="menu-items">
      <div
        v-for="(item, index) in allMenu"
        :key="index"
        class="item"
        :style="
          index === actived
            ? {
              'background-color': theme,
              color: 'white',
            }
            : {}
        "
        @click="() => menuClick(item, index)"
      >
        {{ item.meta.title || "未命名" }}
      </div>
    </div>
    <div v-if="subMenu.length" class="sub-menu">
      <div
        v-for="(item, index) in subMenu"
        :key="index"
        class="item"
        :style="
          item.highLight !== false && actived + '-' + index === subActived
            ? {
              'background-color': theme,
              color: 'white',
            }
            : {}
        "
        @click="() => menuClick(item, index, true)"
      >
        <svg-icon
          :icon-class="item.meta.icon || 'documentation'"
          :color="item.meta.iconColor"
        />
        <div class="title">{{ item.meta.title || "未命名" }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderMenu',
  props: {
    menu: {
      type: Array,
      default: () => []
    },
    defaultActived: {
      type: Number,
      default: 0
    },
    defaultSubActived: {
      type: String,
      default: '0-0'
    }
  },
  data() {
    return {
      actived: this.defaultActived,
      subActived: this.defaultSubActived
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    },
    allMenu() {
      const defaultProps = { meta: {}, hidden: false }
      const propsMenu = this.menu.map((item) =>
        Object.assign({}, defaultProps, item)
      )
      return propsMenu
    },
    subMenu() {
      const activedMenu =
        this.allMenu.filter((i, index) => index === this.actived)[0] || {}
      if (!activedMenu.children) {
        activedMenu.children = []
      }
      return activedMenu.children
        .filter((item) => !item.hidden)
        .map((item) => {
          return item
        })
    }
  },
  created() {},
  methods: {
    // 子菜单点击事件
    menuClick(item, index, isSub) {
      if (isSub) {
        if (item.highLight !== false) {
          this.subActived = this.actived + '-' + index
        }
      } else {
        this.actived = index
      }
      this.$forceUpdate()
      if (typeof item.click === 'function') {
        item.click()
      }
    }
  }
}
</script>

<style lang='scss'>
.header-menu {
  color: #ddd;
  background: #333;
  .menu-items {
    display: flex;
    padding: 4px 10px;
    border-bottom: 1px solid #999;
    .item {
      margin-right: 6px;
      padding: 6px 12px;
      border-radius: 10px;
    }
  }
  .sub-menu {
    display: flex;
    padding: 4px 10px;
    border-bottom: 1px solid #999;
    .item {
      margin-right: 6px;
      padding: 6px 12px;
      border-radius: 4px;
      text-align: center;
    }
  }
  .item:hover {
    background-color: #13ce66;
    cursor: pointer;
  }
}
</style>
