<template>
  <div class="paper">
    <div
      class="paper-line"
      v-for="(paragraph, index) in statement"
      :key="index"
    >
      {{ paragraph }}
    </div>
  </div>
</template>

<script>
import { getStatement } from "@/api/statement";
export default {
  name: "Paper",
  props: {},
  data() {
    return {
      statement: ["", ""],
    };
  },
  created() {},
  mounted() {
    this.setStatement();
  },
  methods: {
    async setStatement() {
      try {
        const { data } = await getStatement({
          statementId: this.$route.query.statementId,
          collection: this.$route.query.collection,
        });
        this.statement = data;
      } catch (e) {}
    },
  },
};
</script>
<style lang="scss">
.paper {
  padding: 10px 20px;
  .paper-line {
    margin-bottom: 10px;
    text-indent: 25px;
  }
}
</style>
