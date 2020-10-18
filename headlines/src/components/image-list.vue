<template>
  <div class="image_list">
        <div class="btn">
    <el-radio-group v-model="radio1" @change="getImage()">
        <el-radio-button :label="0">全部</el-radio-button>
        <el-radio-button :label="1">收藏</el-radio-button>
    </el-radio-group>
    <el-button v-show="isshowAdd" type="success" @click="dialogTableVisible = true">上传素材</el-button>
    </div>
    <br />
    <el-row :gutter="10">
    <el-col
        :sm="6"
        :xs="12"
        :md="6"
        :lg="4"
        v-for="item in messages"
        :key="item.id"
        class="image_item"
    >
        <el-image
        style="height: 100px; width: 100%"
        :src="item.url"
        fit="cover"
        @click="imgSelect(item.id)"
        >
        </el-image>
        <div class="selected" v-if="selected===item.id&&!isshowAdd"></div>
        <div class="image_action" v-show="isshowAction">
        <i
            v-show="item.is_collect == 0"
            class="el-icon-star-off"
            @click="collectChange(item.id, item.is_collect)"
            :disabled="loading"
        ></i>
        <i
            v-show="item.is_collect == 1"
            class="el-icon-star-on"
            @click="collectChange(item.id, item.is_collect)"
            :disabled="loading"
        ></i>
        <i
            class="el-icon-delete"
            @click="deleteImage(item.id)"
            :disabled="loading"
        ></i>
        </div>
    </el-col>
    </el-row>
    <el-dialog
    title="上传素材"
    :visible.sync="dialogTableVisible"
    :append-to-body="true"
    >
    <el-upload
        :show-file-list="false"
        action="http://localhost:888/uploadMoreImg"
        enctype="multipart/form-data"
        method="post"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        class="iconbig"
        multiple
        :on-success="upLoandSuccess"
    >
        <i class="el-icon-camera-solid"></i>
    </el-upload>
    </el-dialog>
    <br /><br />
    <div class="block">
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pagenum"
        :page-sizes="[2, 4, 6, 12]"
        :page-size="page.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
    >
    </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.getImage();
  },
  data() {
    return {
      radio1: 0,
      messages: [],
      dialogTableVisible: false,
      dialogImageUrl: "",
      loading: false,
      selected:null,//选中哪种图片
      page: {
        pagenum: 1,
        pagesize: 6,
      },
      total: 0,
    };
  },
  props:{
    isshowAdd:{
      type:Boolean,
      default:true
    },
    isshowAction:{
      type:Boolean,
      default:true
    }
  },
  methods: {
    getImage() {
      this.axios
        .post("http://localhost:888/getImage", {
          is_collect: this.radio1,
          page: this.page,
        })
        .then((res) => {
          this.messages = res.data.data;
          this.total = res.data.total;
        });
    },
    //文件上传方法
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    upLoandSuccess() {
      this.dialogTableVisible = false;
      this.getImage();
    },
    //分页
    handleSizeChange(val) {
      this.page.pagesize = val;
      this.getImage();
    },
    handleCurrentChange(val) {
      this.page.pagenum = val;
      this.getImage();
    },
    //改变收藏状态
    collectChange(id, is_collect) {
      this.loading = true;
      this.axios
        .post("http://localhost:888/collectChange", {
          id: id,
          is_collect: is_collect,
        })
        .then((res) => {
          if(res.data.code=200){
             this.getImage();
          }
          this.loading = false;
        });
    },
    //删除素材
    deleteImage(id) {
      this.loading = true;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios
            .post("http://localhost:888/deleteImage", { id: id })
            .then((res) => {
              this.getImage();
              this.loading = false;
            });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //选中照片
    imgSelect(id){
      this.selected=id
    }
  },
};
</script>

<style scoped>
.btn {
  display: flex;
  justify-content: space-between;
}
.image_item {
  position: relative;
}
.image_action {
  /* display: none!important; */
  position: absolute;
  height: 40px;
  background-color: rgb(204, 204, 204, 0.5);
  left: 5px;
  right: 5px;
  bottom: 4px;
  font-size: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
}
.collected {
  color: brown;
}
.selected{
  background: url(../assets/selected.png) no-repeat;
  background-size: 80%;
  position: absolute;
  left: 10%;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>