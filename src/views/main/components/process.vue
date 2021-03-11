<template>
  <div class="process-container">
    <div class="title">​{{ title }}</div>
    <div
      class="description"
      v-for="(item, index) in description"
      :key="'descri_' + index"
    >
      {{ item }}
    </div>
    <div v-for="(item, index) in form" :key="'form_' + index">
      <div class="form-title">{{ item.title }}</div>
      <div
        v-for="(tip, index) in item.tip"
        :key="'tip_' + index"
        class="form-subtitle"
      >
        {{ tip }}
      </div>
      <div class="form-subtitle">{{ item.subtitle }}</div>
      <div
        class="form-error"
        v-if="checkFeedback[index] && checkFeedback[index].error"
      >
        {{ "（ " + checkFeedback[index].error + " ）" }}
      </div>
      <el-select
        v-if="item.type === 'select'"
        :placeholder="item.placeholder"
        v-model="data[index]"
      >
        <el-option
          v-for="item in item.options"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-input
        :type="item.type"
        v-else
        v-model="data[index]"
        :placeholder="item.placeholder || ''"
      ></el-input>
    </div>
    <el-button
      v-show="next"
      @click="onNext"
      class="next-button"
      type="primary"
      >{{ nextName }}</el-button
    >
    <div v-show="index" class="back-button" @click="$emit('back')">
      *我再检查一下信息，返回上一步
    </div>
  </div>
</template>

<script>
export default {
  name: "Process",
  props: {
    index: { type: Number, default: 0 },
    childIndex: { type: Number, default: -1 },
    title: { type: String, default: "" },
    description: { type: Array, default: () => [] },
    form: { type: Array, default: () => [] },
    validate: { type: Object, default: () => ({}) },
    selections: { type: Array, default: () => [] },
    data: { type: Object, default: () => ({}) },
    next: { type: Boolean, default: true },
    nextName: { type: String, default: "下一步" },
  },
  data() {
    return {
      checkFeedback: {},
    };
  },
  created() {},
  mounted() {},
  methods: {
    onNext() {
      let checkFeedback = {};
      let hasError = false;
      for (let key in this.validate) {
        checkFeedback[key] = this.validate[key](this.data[key]);
        if (checkFeedback[key] && checkFeedback[key].error) {
          hasError = true;
        }
      }
      this.checkFeedback = checkFeedback;
      if (hasError) return;
      this.$emit("next", this.childIndex);
    },
  },
};
</script>
<style lang="scss">
.process-container {
  .next-button {
    margin-top: 40px;
    font-size: 22px;
    padding: 15px 50px;
    color: black;
    background: #ef9c83;
    border-color: black;
    border-radius: 50px;
    &:hover {
      background: black;
      color: white;
    }
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
  .form-title {
    margin-top: 20px;
    margin-bottom: 4px;
  }
  .form-subtitle {
    font-size: 14px;
  }
  .form-error {
    margin-top: 4px;
    color: red;
  }
  .el-textarea {
    margin-top: 10px;
    .el-textarea__inner {
      height: 100px;
    }
  }
  .el-input {
    width: 400px;
    .el-input__inner {
      background-color: unset;
      color: white;
      border-color: #ef9c83;
      border-bottom-color: black;
      border-radius: 0;
      &:focus {
        border-bottom-color: #46a6ff;
      }
    }
  }
}
</style>
