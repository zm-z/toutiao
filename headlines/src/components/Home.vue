<template>
  <div class="home">
    <el-container class="layout-container">
      <el-aside width="200px">
        <el-menu
          :default-active="this.$route.name"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-menu-item index="welcome">
            <i class="el-icon-setting"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="article">
            <i class="el-icon-menu"></i>
            <span slot="title">内容管理</span>
          </el-menu-item>
          <el-menu-item index="image">
            <i class="el-icon-s-order"></i>
            <span slot="title">素材管理</span>
          </el-menu-item>
          <el-menu-item index="publish">
            <i class="el-icon-s-claim"></i>
            <span slot="title">发布文章</span>
          </el-menu-item>
          <el-menu-item index="comments">
            <i class="el-icon-s-tools"></i>
            <span slot="title">评论管理</span>
          </el-menu-item>
          <el-menu-item index="fans">
            <i class="el-icon-s-order"></i>
            <span slot="title">粉丝管理</span>
          </el-menu-item>
          <el-menu-item index="my">
            <i class="el-icon-user-solid"></i>
            <span slot="title">个人设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="header_left">
            <i class="el-icon-s-unfold"></i>
            <span>个人系统管理</span>
          </div>
          <el-dropdown>
            <div class="header_right_content">
              <img :src="photo" />
              <span class="el-dropdown-link"> {{ name }} </span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="quitOut()"
                >退出</el-dropdown-item
              >
              <el-dropdown-item @click.native="changeMyMsg">设置</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main class="main">
          <!-- 占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
//注册事件
import globalBus from "@/util/global-bus";
export default {
  data() {
    return {
      name: "",
      photo: "",
    };
  },
  created() {
    let mobile = sessionStorage.getItem("token")
    this.axios
      .post("http://localhost:888/getMyMessage", { mobile: mobile })
      .then((res) => {
        this.name = res.data.msg[0].name;
        this.photo = res.data.msg[0].photo;
      })
     // 注册事件
    globalBus.$on("update-user", (msg) => {
      this.photo=msg.photo
      this.name=msg.name
    })
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    quitOut() {
      this.$confirm("是否退出, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          window.sessionStorage.clear();
          this.$router.push("/login");
          this.$message({
            type: "success",
            message: "成功退出!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取退出",
          });
        });
    },
    //跳转到个人设置页面
    changeMyMsg(){
      this.$router.push('/my')
    }
  },
};
</script>

<style scoped>
.layout-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.el-aside {
  background-color: rgb(84, 92, 100);
}
.header {
  background-color: rgb(241, 236, 236);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header_right_content {
  display: flex;
  align-items: center;
}
.header_right_content img {
  border-radius: 50%;
  padding: 10px 10px;
  width: 40px;
  height: 40px;
}
.main {
  /* background-image: url(../assets/login_bg.jpg); */
  background-size: 100% 100%;
}
</style>