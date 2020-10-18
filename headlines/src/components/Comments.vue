<template>
  <div class="comments">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="comment_count" label="总评论数">
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝论数">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.state ? "正常" : "关闭" }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled='loading'
              @change="stateChange(scope.row.id,scope.row.state)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <br />
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="page.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :disabled="loading"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getComment();
  },
  data() {
    return {
      tableData: [],
      page: {
        pagenum: 1,
        pagesize: 5,
      },
      loading:false,
      total: 0,
    };
  },
  methods: {
    //获取数据
    getComment() {
      this.loading=true
      this.axios.post("http://localhost:888/getComment",{page:this.page}).then((res) => {
        this.tableData = res.data.data;
        this.total=res.data.total
        this.loading=false
      });
    },
    //分页
    handleSizeChange(val) {
      this.page.pagesize=val
      this.getComment()
    },
    handleCurrentChange(val) {
      this.page.pagenum=val
      this.getComment()
    },
    //状态改变
    stateChange(id,state){
      this.axios.post('http://localhost:888/stateChange',{id:id,state:state})
    }
  },
};
</script>

<style>
</style>