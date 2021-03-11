<template>
  <div class="resulting-container">
    <el-progress
      :key="title"
      type="circle"
      :percentage="percentage"
      :status="status"
    ></el-progress>
    <div class="progress-title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  name: "Resulting",
  props: {
    progress: { type: Array, default: () => [] },
  },
  data() {
    this.progressTimer = null;
    return {
      percentage: 0,
      title: "",
      status: undefined,
      index: 0,
    };
  },
  created() {
    this.setProgress(this.index);
  },
  mounted() {},
  methods: {
    setProgress(index) {
      if (this.progressTimer) clearInterval(this.progressTimer);
      if (index === this.progress.length) {
        this.status = "success";
        return setInterval(() => this.$emit("next"), 500);
      }
      let progress = this.progress[index];
      this.title = progress.title;
      let time = 100;
      let animeTime = 700;
      let duration = progress.duration - animeTime;
      if (duration < 500) duration = 500;
      let step = parseInt(100 * (100 / duration));
      this.percentage = 0;
      this.progressTimer = setInterval(() => {
        this.percentage = this.percentage + step;
        if (this.percentage >= 100) {
          this.percentage = 100;
          setTimeout(() => {
            this.setProgress(index + 1);
          }, animeTime);
        }
      }, time);
    },
  },
};
</script>
<style lang="scss">
.resulting-container {
  text-align: center;
  .progress-title {
    margin-top: 10px;
    font-size: 20px;
  }
}
</style>
