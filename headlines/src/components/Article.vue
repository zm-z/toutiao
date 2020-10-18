<template>
  <div class="article">
    <el-card class="box-card">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item> </el-breadcrumb
      ><br />
      <el-form ref="form" :model="form" label-width="80px" size="mini">
        <el-form-item label="状态:">
          <el-radio-group v-model="states">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="region" placeholder="全部">
            <el-option :label="null" value="全部"></el-option>
            <el-option label="js" value="js"></el-option>
            <el-option label="c" value="c"></el-option>
            <el-option label="c++" value="c++"></el-option>
            <el-option label="java" value="java"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit()">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <br />
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>根据筛选结果共查询到{{ total }}条结果:</span>
      </div>
      <el-table :data="tableData" stripe style="width: 100%" size="mini" v-loading="loading">
        <el-table-column label="封面" width="180">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.face"
              fit="cover"
              lazy
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state == 0">草稿</el-tag>
            <el-tag v-else-if="scope.row.state == 1" type="success"
              >待审核</el-tag
            >
            <el-tag v-else-if="scope.row.state == 2" type="info"
              >审核通过</el-tag
            >
            <el-tag v-else-if="scope.row.state == 3" type="warning"
              >审核失败</el-tag
            >
            <el-tag v-else-if="scope.row.state == 4" type="danger"
              >已删除</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="path" label="频道"> </el-table-column>
        <el-table-column prop="data" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="delectArticle(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="page.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :disabled='loading'
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
      },
      states: null,
      region: null,
      tableData: [],
      loading:true,
      rangeDate:[],
      page: {
        pagesize: 5, //每页几条
        pagenum: 1, //第几页
      },
      total: 0,
    };
  },
  created() {
    this.getMsg();
  },

  methods: {
    getMsg() {
      this.loading=true
      this.axios
        .post("http://localhost:888/getGoods", {
          data: this.page,
          states: this.states,
          region:this.region,
          date:this.form.date,
          begin_pubdate:this.rangeDate?this.rangeDate[0]:null,
          end_pubdate:this.rangeDate?this.rangeDate[1]:null,
        })
        .then((res) => {
          this.tableData = res.data.msg;
          this.total = res.data.total;
          this.loading=false
        });
    },
    onSubmit() {
      this.getMsg();
    },
    handleSizeChange(val) {
      this.page.pagesize = val;
      this.getMsg();
    },
    handleCurrentChange(val) {
      this.page.pagenum = val;
      this.getMsg();
    },
    //删除
    delectArticle(id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('http://localhost:888/delectArticle',{id:id}).then(res=>{
          this.getMsg()
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
};
</script>

<style scoped>
.face {
  width: 80px;
  height: 100px;
}
</style>