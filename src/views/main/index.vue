<template>
  <div id="paperProducer" class="paper-producer-container" @scroll="onScroll">
    <div class="header-container">
      <div class="company-container" @click="backToTop">
        <img :src="header.logo" />
        <div>
          <div class="title">{{ header.title }}</div>
          <div class="subtitle">{{ header.subtitle }}</div>
        </div>
      </div>
      <div class="login-container">
        <div>
          已经填写过了？<span
            class="login-title"
            @click="loginDialogVisible = true"
            >请登录</span
          >
        </div>
      </div>
    </div>
    <div v-show="!isProducing" class="main-producer-container">
      <div
        class="producer-info-container"
        :style="{
          backgroundImage: `url(${section_1.background})`,
          backgroundPosition: '0 ' + imgTop + 'px',
        }"
      >
        <div class="producer-action-bg">
          <div>
            <div class="page-title">{{ section_1.title }}</div>
            <div class="page-subtitle">{{ section_1.subtitle }}</div>
            <el-button
              class="producer-button"
              type="primary"
              @click="producePaper"
              >生成文书</el-button
            >
          </div>
        </div>
      </div>
      <div class="teacher-info-container">
        <div class="img-container">
          <img :src="section_2.avatar" />
        </div>
        <div class="message-container">
          <div
            class="title"
            v-for="(title, index) in section_2.title"
            :key="'title_' + index"
          >
            {{ title }}
          </div>
          <div
            class="subtitle"
            style="margin-top: 20px"
            v-for="(subtitle, index) in section_2.subtitle"
            :key="'subtitle_' + index"
          >
            {{ subtitle }}
          </div>
          <div
            class="describe"
            v-for="(describe, index) in section_2.describe"
            :key="'describe_' + index"
          >
            {{ describe }}
          </div>
        </div>
      </div>
      <div class="guidance-container">
        <div class="title">{{ section_3.title }}</div>
        <div class="process-container">
          <div
            class="process-item"
            v-for="(guidance, index) in section_3.guidance"
            :key="index"
          >
            <div class="process-bg" :style="{ color: guidance.color }">
              {{ "0" + (index + 1) }}
            </div>
            <div class="process-info-container">
              <div
                class="process-info"
                v-for="(msg, i) in guidance.message"
                :key="i"
              >
                {{ msg }}
              </div>
            </div>
          </div>
        </div>
        <el-button
          class="producer-button"
          type="primary"
          style="background: white; border-color: black"
          @click="producePaper"
          >生成文书</el-button
        >
      </div>
      <div class="feedback-container">
        <div class="title">{{ section_4.title }}</div>
        <el-carousel>
          <el-carousel-item
            v-for="(item, index) in section_4.feedback"
            :key="index"
          >
            <div class="message">{{ item.message }}</div>
            <div class="from">{{ item.from }}</div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="receiver-container">
        <div class="title">{{ section_5.title }}</div>
        <div class="offer-container">
          <div
            class="offer-item"
            v-for="(img, index) in section_5.offers"
            :key="index"
          >
            <img :src="img" />
          </div>
        </div>
      </div>
      <div class="contact-container">
        <div class="email-container">
          <div class="title">{{ section_6.titleL }}</div>
          <el-input v-model="email" placeholder="你的邮箱"></el-input>
          <el-button
            class="producer-button"
            type="primary"
            @click="makeAppointment"
            >预约</el-button
          >
          <div>{{ section_6.contact }}</div>
        </div>
        <div class="producer-container">
          <div class="title">{{ section_6.titleR }}</div>
          <div>
            <el-button
              class="producer-button"
              type="primary"
              @click="producePaper"
              >马上生成</el-button
            >
          </div>
          <img :src="section_6.backgroundR" />
        </div>
      </div>
    </div>
    <div v-show="isProducing" class="paper-form-container">
      <Payment
        v-if="processLayout.type === 'payment'"
        v-bind="processLayout"
        @next="onNext"
      />
      <Resulting
        v-else-if="processLayout.type === 'resulting'"
        v-bind="processLayout"
        @next="onNext"
      />
      <Selection
        v-else-if="processLayout.type === 'selection'"
        v-bind="processLayout"
        :index="processIndex"
        :data="processForm"
        @setProcess="setProcess"
        @next="onNext"
        @back="onBack"
      />
      <Process
        v-else
        v-bind="processLayout"
        :data="processForm"
        :index="processIndex"
        @next="onNext"
        @back="onBack"
      />
    </div>
    <el-dialog title="登录" :visible.sync="loginDialogVisible" width="400px">
      <span>别担心，你填写的所有信息都在</span>
      <div style="display: flex; margin: 8px 0; align-items: center">
        <el-input
          style="width: 200px; margin-right: 10px"
          v-model="phone"
          placeholder="请输入手机号码"
        ></el-input>
        <el-button type="primary" @click="getPhoneCode">获取验证码</el-button>
      </div>
      <el-input
        style="width: 200px"
        v-model="phoneCode"
        placeholder="验证码"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="loginDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <div class="footer-container">
      <div v-for="(msg, index) in footer.message" :key="index">{{ msg }}</div>
    </div>
  </div>
</template>

<script>
import Process from "./components/process";
import Selection from "./components/selection";
import Resulting from "./components/resulting";
import Payment from "./components/payment";
import { submitStatement, getStatement } from "@/api/statement";
export default {
  name: "PaperProducer",
  components: { Process, Selection, Resulting, Payment },
  data() {
    this.saveTimer = null;
    this.saveKey = "producing_form_data";
    let processIndex = 0;
    return {
      processIndex,
      isProducing: false,
      processLayout: processLayoutList[processIndex],
      childProcessLayoutList: [],
      processFormList: processLayoutList.map((i) => ({})),
      processForm: {},
      imgTop: 0,
      email: "",
      phone: "",
      phoneCode: "",
      header: {},
      section_1: {},
      section_2: {},
      section_3: {},
      section_4: {},
      section_5: {},
      section_6: {},
      footer: {},
      loginDialogVisible: false,
      ...prodecerPageSettings,
    };
  },
  computed: {},
  watch: {
    processIndex() {
      this.processLayout = processLayoutList[this.processIndex];
      this.processForm = this.processFormList[this.processIndex];
    },
    processFormList: {
      handler() {
        this.saveData();
      },
      deep: true,
    },
  },
  created() {
    this.processForm = this.processFormList[this.processIndex];
    this.setProcessData();
  },
  mounted() {},
  methods: {
    setProcess(process) {
      if (Array.isArray(process)) {
        this.childProcessLayoutList = process;
        this.processLayout = process[0];
        this.processFormList[this.processIndex][0] =
          this.processFormList[this.processIndex][0] || {};
        this.processForm = this.processFormList[this.processIndex][0];
      } else {
        this.processLayout = process;
      }
    },
    setProcessData() {
      // TODO: 模拟取数据
      if (window.localStorage) {
        const data = window.localStorage.getItem(this.saveKey);
        if (data) {
          let savedData = JSON.parse(data);
          if (savedData.length === this.processFormList.length) {
            this.processFormList = savedData;
            this.processForm = savedData[0];
          }
        }
      }
    },
    makeAppointment() {
      let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (!myreg.test(this.email)) {
        this.$message({
          message: "请输入正确邮箱",
          type: "error",
        });
      }
    },
    getPhoneCode() {
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
        this.$message({
          message: "请输入正确手机号码",
          type: "error",
        });
      }
    },

    login() {
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
        this.$message({
          message: "请输入正确手机号码",
          type: "error",
        });
      } else if (!this.phoneCode) {
        this.$message({
          message: "请输入验证码",
          type: "error",
        });
      } else {
      }
    },
    saveData() {
      if (this.saveTimer) clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => {
        // TODO: 模拟储存
        if (window.localStorage) {
          window.localStorage.setItem(
            this.saveKey,
            JSON.stringify(this.processFormList)
          );
        }
      }, 1500);
    },
    onBack() {
      if (this.processLayout === processLayoutList[this.processIndex]) {
        this.processIndex--;
      } else {
        this.processLayout = processLayoutList[this.processIndex];
      }
    },
    onNext(childIndex = -1) {
      if (childIndex !== -1) {
        let processLayout = this.childProcessLayoutList[childIndex + 1];
        if (processLayout) {
          this.processFormList[this.processIndex][childIndex + 1] =
            this.processFormList[this.processIndex][childIndex + 1] || {};
          this.processForm = this.processFormList[this.processIndex][
            childIndex + 1
          ];
          return (this.processLayout = processLayout);
        }
      }
      if (this.processIndex + 1 >= processLayoutList.length) {
        this.processIndex = 0;
        this.isProducing = false;
      } else {
        this.processIndex++;
      }
    },
    producePaper() {
      this.isProducing = true;
    },
    onScroll(e) {
      this.imgTop = e.target.scrollTop / 2;
    },
    backToTop() {
      let paperProducer = document.getElementById("paperProducer");
      paperProducer.scrollTop = 0;
    },
  },
};
</script>
<style lang="scss">
.paper-producer-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  .producer-button {
    font-size: 22px;
    padding: 15px 50px;
    color: black;
    background: #ef9c83;
    border-color: #ef9c83;
    border-radius: 50px;
    &:hover {
      background: white;
      border-color: black;
      color: #ef9c83;
    }
  }
  .header-container {
    width: 100%;
    position: fixed;
    padding: 30px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    .company-container {
      padding-left: 60px;
      display: flex;
      &:hover {
        cursor: pointer;
      }
      .title {
        margin-left: 10px;
        font-size: 24px;
        font-weight: 600;
      }
      .subtitle {
        margin-left: 10px;
      }
    }
    .login-container {
      padding-right: 40px;
      .login-title {
        cursor: pointer;
        border-bottom: 1px solid white;
        padding-bottom: 2px;
      }
    }
  }
  .paper-form-container {
    flex: 1;
    background: #ef9c83;
    & > div {
      padding: 40px;
      padding-top: 100px;
    }
  }
  .main-producer-container {
    .producer-info-container {
      width: 100%;
      height: 100vh;
      background-size: cover;
      overflow: hidden;
      .producer-action-bg {
        width: 100%;
        height: 100%;
        background: rgba($color: #111, $alpha: 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        .page-title {
          font-size: 60px;
        }
        .page-subtitle {
          font-size: 26px;
          margin: 26px 0;
        }
      }
    }
    .teacher-info-container {
      background: white;
      padding: 60px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .img-container {
        flex: 1;
        text-align: center;
        img {
          width: 80%;
          border-radius: 1000px;
        }
      }
      .message-container {
        flex: 1;
        padding: 0 40px;
        .title {
          font-size: 50px;
          font-weight: 600;
        }
        .subtitle {
          font-size: 24px;
        }
        .describe {
          margin-top: 10px;
        }
      }
    }
    .guidance-container {
      text-align: center;
      .title {
        font-size: 40px;
        text-align: center;
        margin: 10px 0;
      }
      .process-container {
        display: flex;
        height: 250px;
        .process-item {
          position: relative;
          flex: 1;
          .process-bg {
            position: absolute;
            width: 100%;
            text-align: center;
            z-index: -1;
            font-size: 200px;
            font-weight: 900;
          }
          .process-info-container {
            width: 100%;
            text-align: center;
            margin-top: 90px;
            .process-info {
              margin-bottom: 6px;
              font-size: 20px;
            }
          }
        }
      }
    }
    .feedback-container {
      margin: 20px 40px;
      padding: 40px;
      background: #a7d1d4;
      font-size: 24px;
      text-align: center;
      .title {
        font-size: 40px;
        margin-bottom: 20px;
      }
      .from {
        font-size: 18px;
        margin-top: 40px;
      }
    }
    .receiver-container {
      text-align: center;
      .title {
        font-size: 40px;
        margin: 20px;
      }
      .offer-container {
        display: flex;
        margin: 0 50px;
        .offer-item {
          padding: 10px;
          flex: 1;
          img {
            width: 80%;
          }
        }
      }
    }
    .contact-container {
      display: flex;
      padding: 40px;
      padding-bottom: 0;
      text-align: center;
      height: 440px;
      .email-container {
        flex: 1;
        padding: 10px 30px;
        color: white;
        background: #1d1e21;
        .title {
          font-size: 24px;
          margin: 30px 0;
        }
        .el-button {
          margin: 30px 0;
        }
      }
      .producer-container {
        flex: 1;
        padding: 10px 30px;
        color: black;
        background: #ef9c83;
        .title {
          font-size: 24px;
          margin: 40px 0;
        }
        .el-button {
          border-color: black;
          margin-bottom: 40px;
        }
      }
    }
  }
  .footer-container {
    text-align: center;
    padding: 20px 0;
  }
}
</style>
