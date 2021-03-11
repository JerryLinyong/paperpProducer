<template>
  <div class="selection-container">
    <div class="title">​{{ title }}</div>
    <div
      class="description"
      v-for="(item, index) in description"
      :key="'descri_' + index"
    >
      {{ item }}
    </div>
    <div style="display: flex">
      <div v-for="(item, index) in selections" :key="index">
        <el-tooltip
          popper-class="selection-tooltip"
          v-if="item.tooltip"
          effect="dark"
          :content="item.tooltip"
          placement="top"
        >
          <div
            class="selection-item"
            @click="() => onSelect(item)"
            :style="{ background: item.color || 'white' }"
          >
            {{ item.title }}
          </div>
        </el-tooltip>
        <div
          v-else
          class="selection-item"
          @click="() => onSelect(item)"
          :style="{ background: item.color || 'white' }"
        >
          {{ item.title }}
        </div>
      </div>
    </div>
    <div v-show="index && next" class="back-button" @click="$emit('back')">
      *我再检查一下信息，返回上一步
    </div>
  </div>
</template>

<script>
export default {
  name: "Selection",
  props: {
    title: { type: String, default: "" },
    index: { type: Number, default: 0 },
    next: { type: Boolean, default: true },
    childIndex: { type: Number, default: -1 },
    description: { type: Array, default: () => [] },
    selections: { type: Array, default: () => [] },
    data: { type: Object, default: () => ({}) },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    onSelect({ process, type }) {
      this.data.type = type;
      if (process) {
        process.childIndex = this.childIndex;
        this.$emit("setProcess", process);
      } else {
        this.$emit("next", this.childIndex);
      }
    },
  },
};
</script>
<style lang="scss">
.selection-tooltip {
  max-width: 500px;
}
.selection-container {
  .selection-item {
    padding: 50px 20px;
    min-width: 160px;
    margin: 20px;
    text-align: center;
    cursor: pointer;
    border-radius: 20px;
    font-size: 18px;
    &:hover {
      color: #ef9c83;
    }
  }
  .back-button {
    cursor: pointer;
  }
  .back-button {
    margin-top: 20px;
    cursor: pointer;
  }
  .title {
    font-size: 40px;
    font-weight: 600;
  }
  .description {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>
