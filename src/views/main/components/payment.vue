<template>
  <div class="payment-container">
    <div class="title">​{{ title }}</div>
    <div class="payment-img-container">
      <img
        src="https://static.wixstatic.com/media/1aeb14_28bf5cc8528247ee9f6d251fe8971b92~mv2.png/v1/fill/w_315,h_315,al_c,lg_1,q_85/alipay.webp"
      />
      <img
        src="https://static.wixstatic.com/media/1aeb14_60ceeff9c6df43a5b8ed61b38005d67a~mv2.jpg/v1/crop/x_137,y_0,w_482,h_482/fill/w_450,h_450,al_c,q_80,usm_0.66_1.00_0.01/wechat%20pay.webp"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Payment",
  props: {
    title: { type: String, default: "" },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss">
.payment-container {
  .title {
    font-size: 40px;
    font-weight: 600;
  }
  .payment-img-container {
    img {
      width: 300px;
      height: 300px;
      margin-top: 20px;
      margin-right: 20px;
    }
  }
}
</style>
