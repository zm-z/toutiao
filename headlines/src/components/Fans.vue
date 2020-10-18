<template>
  <div class="fans">
    <el-card class="box-card" v-show="messageChange">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-radio-group v-model="radio1" @change="msgChange(radio1)">
          <el-radio-button label="粉丝列表"></el-radio-button>
          <el-radio-button label="粉丝画像"></el-radio-button>
        </el-radio-group>
      </div>
      <br />
      <div class="img_box" v-for="item in msg" :key="item.id">
        <img :src="item.url" />
        <span class="fans_name">{{ item.name }}</span>
        <el-button v-if="item.is_focus" size="mini" class="btn_focus" @click="changeFocus(item.id,item.is_focus)">已关注</el-button>
        <el-button v-else size="mini" class="btn" @click="changeFocus(item.id,item.is_focus)">+关注</el-button>
      </div>
    </el-card>
    <el-card class="box-card" v-show="!messageChange">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-radio-group v-model="radio1" @change="msgChange(radio1)">
          <el-radio-button label="粉丝列表"></el-radio-button>
          <el-radio-button label="粉丝画像"></el-radio-button>
        </el-radio-group>
      </div>
      <div ref="main" style="width:600px;height:350px;margin:0 auto;font-size:8px"></div>
      <br><br>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      radio1: "粉丝列表",
      msg: [],
      messageChange: true,
    };
  },
  created() {
    this.getFansMsg();
  },
  mounted() {
    //初始化实例
    var myChart=echarts.init(this.$refs.main)
    //初始化操作DOM一定要写到mouted函数中
    var option = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)'
        }
    }]
};
myChart.setOption(option)
},
  methods: {
    getFansMsg() {
      this.axios.post("http://localhost:888/getFansMsg").then((res) => {
        this.msg = res.data.msg;
      });
    },
    msgChange(val) {
      if (val == "粉丝列表") {
        this.messageChange = true;
      } else {
        this.messageChange = false;
      }
    },
      //改变是否关注
  changeFocus(id,is_focus){
    let state=!is_focus
    this.axios.post('http://localhost:888/changeFocus',{id:id,state:state}).then(res=>{
      if(res.data.code==200){
        this.getFansMsg()
      }
    })
  }
  },
};
</script>

<style scoped>
.img_box {
  width: 100px;
  height: 140px;
  border: 1px solid rgb(247, 242, 242);
  float: left;
  margin-right: 30px;
  margin-bottom: 20px;
  text-align: center;
  padding-top: 10px;
}
.img_box img {
  width: 70%;
  height: 50%;
  border-radius: 50%;
}
.fans_name {
  display: block;
  font-size: 8px;
  padding: 5px 0;
}
.btn {
  color: cyan;
}
.btn_focus {
  color: brown;
}
</style>