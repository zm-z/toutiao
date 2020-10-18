<template>
  <div class="publish">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }"
            >首页</el-breadcrumb-item
          >
          <el-breadcrumb-item>发布文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        :model="article"
        label-width="80px"
        :rules="formRules"
        ref="article"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="article.content"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="face">
          <div class="upLoad">
            <img @click="uploadImg" src="../assets/upload.png" />
          </div>
          <div v-show="article.face.length" class="show_img">
            <img :src="article.face" />
          </div>
        </el-form-item>
        <el-form-item label="频道" prop="path">
          <el-select v-model="article.path" placeholder="请选择活动区域">
            <el-option label="js" value="js"></el-option>
            <el-option label="c" value="c"></el-option>
            <el-option label="c++" value="c++"></el-option>
            <el-option label="java" value="java"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addArticle('article')"
            >发表</el-button
          >
          <el-button>存入草稿</el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        title="选择封面"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
        append-to-body
        top="5vh"
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
             <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="素材库" name="first">
                  <image-list :isshowAdd="false" :isshowAction="false" ref="image-list" />
                  <!-- ref有两个作用，
                  1作用到标签上可以获取DOM元素
                  2作用到组件上可以直接访问子组件的数据 -->
                </el-tab-pane>
                <el-tab-pane label="上传图片" name="second">
                  <img width="200" height="200" ref="preview-image">
                  <input type="file"  ref="file" @change="onFileChange()">
                </el-tab-pane>
              </el-tabs>
          </div>         
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onCoverfirm"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>

import ImageList from '../components/image-list'
export default {
  components: {
    ImageList
  },
  data() {
    return {
      article: {
        title: "",
        content: "",
        face: "",
        path: "",
      },
      formRules: {
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          {
            min: 5,
            max: 30,
            message: "长度在 5 到 30 个字符",
            trigger: "blur",
          },
        ],
        content: [
          { required: true, message: "请输入文章内容", trigger: "blur" },
          {
            min: 5,
            max: 50,
            message: "长度在 5 到 560 个字符",
            trigger: "blur",
          },
        ],
        path: [{ required: true, message: "请选择文章频道", trigger: "blur" }],
      },
      dialogVisible: false,
      activeName: 'first',
    };
  },
  methods: {
    addArticle(article) {
      this.$refs[article].validate((valid) => {
        if (valid) {
          if (this.article.face.length) {
            this.axios
              .post("http://localhost:888/addArticle", { data: this.article })
              .then((res) => {
                this.article = {
                  title: "",
                  content: "",
                  face: "",
                  path: "",
                };
              });
          } else {
            this.$message({
              message: "请选择图片上传",
              type: "warning",
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //文件上传
    uploadImg() {
      this.dialogVisible = true;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    handleClick(tab, event) {

      },
    onFileChange(){
      const file=this.$refs.file.files[0]
      //图片预览
      const blob=window.URL.createObjectURL(file)
      this.$refs['preview-image'].src=blob
      //防止选择同一文件不触发事件
      //this.$refs.file.value=''
    },
    //对话框确定
    onCoverfirm(){
      //判断有没有选择照片
      //判断是否来自本地照片
      if(this.activeName=='second'){
        const file=this.$refs.file.files[0]
        if(!file){
          this.$message('请选择文件')
          return 
        }
        const fd=new FormData()
        fd.append('file',file)
        this.axios.post('http://localhost:888/addImg',fd).then(res=>{
          this.article.face=res.data
          this.dialogVisible=false
        })
      }else{
        //还有一种通信方式，父组件可以直接访问子组件的数据
        const imageList=this.$refs['image-list']
        const selected=imageList.selected
        if(selected==null){
          this.$message('请选择文件')
          return 
        }
        imageList.messages.forEach(v=>{
          if(v.id==selected){
            this.article.face=v.url
            this.dialogVisible=false
          }
        })
      }
    }
  },
};
</script>

<style scoped>
.content {
  height: 300px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.upLoad {
  width: 148px;
  height: 148px;
  border: 1px solid rgb(238, 232, 232);
  float: left;
}
.upLoad img {
  width: 100%;
  height: 100%;
}
.show_img {
  width: 148px;
  height: 148px;
  margin-left: 200px;
}
.show_img img {
  width: 100%;
  height: 100%;
}
</style>