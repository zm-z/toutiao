<template>
  <div class="my">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="15">
          <el-form ref="form" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="编号:"> {{ form.id }} </el-form-item>
            <el-form-item label="手机:"> {{ form.mobile }}</el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍" prop="intro">
              <el-input type="textarea" v-model="form.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('form')" :disabled="loading">修改</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" :offset="2">
          <div class="block">
            <el-image
              style="width: 180px; height: 200px"
              :src="form.photo"
              fit="cover"
            ></el-image>
            <br />
            <p @click="$refs.file.click()" class="change_img">点击修改头像</p>
            <input type="file" hidden ref="file" @change="onFileChange()" />
          </div>
        </el-col>
      </el-row>
      <el-dialog
        title="修改头像"
        :visible.sync="dialogVisible"
        append-to-body
        @opened="dialodOpened"
        @closed="dialodClose"
      >
        <div class="preview_img_wrap">
          <img class="preview_img" :src="previewImage" ref="preview-image" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="upLoadPhoto">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
//发布通信事件
import globalBus from '@/util/global-bus'
export default {
  data() {
    return {
      form: {
        name: "",
        intro: "",
        email: "",
        mobile: "",
        id: "",
        photo: "",
      },
      rules:{
        name:[
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        intro:[
          { required: true, message: '请输入媒体介绍', trigger: 'blur' },
          { min: 10, max: 50, message: '长度在 10 到 50 个字符', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      loading:false,
      dialogVisible: false,
      previewImage: "", //预览照片,
      cropper: null, //裁切器
    };
  },
  created() {
    this.getMyMessage();
  },
  methods: {
    //获取用户信息
    getMyMessage() {
      this.loading=true
      let mobile = sessionStorage.getItem("token");
      this.axios
        .post("http://localhost:888/getMyMessage", { mobile: mobile })
        .then((res) => {
          this.form = res.data.msg[0];
          this.loading=false
        });
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post('http://localhost:888/upMyMessage',{data:this.form}).then(res=>{
              this.getMyMessage()
              //发布通知
              globalBus.$emit('update-user',this.form)
            })
          } else {
            return false;
          }
        });
    },
    //跟换头像
    onFileChange() {
      //图片预览
      const file = this.$refs.file;
      const blobData = window.URL.createObjectURL(file.files[0]);
      this.previewImage = blobData;
      this.dialogVisible = true;
      //防止选择相同文件事件不触发
      this.$refs.file.value = "";
    },
    //dialod完全打开，img可见状态
    dialodOpened() {
      //图片裁切器必须在img可见状态才能初始化
      //获取dom元素
      //第一次初始化后，如果裁切器的照片发生了变化，裁切器默认不会更新
      //如果需要预览图片发生变化更换裁切器，
      //  方式一：裁切器.replace方法
      //  方式二：销毁裁切器，重新初始化

      // if(this.cropper){
      //   //替换
      //   this.cropper.replace(this.previewImage)
      //   return
      // }
      const image = this.$refs["preview-image"];
      //初始化数据
      this.cropper = new Cropper(image, {
        aspectRatio: 1, //初始化裁切长宽比，改变时大小比例相等
        viewMode: 1, //裁切框不能移出照片范围
        aspectRatio: 1,
        cropBoxResizable: false,
        background: false,
        movable: true,
      });
    },
    //dialod销毁
    dialodClose() {
      //销毁裁切器
      this.cropper.destroy();
    },
    //上传头像
    upLoadPhoto() {
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        const formData = new FormData();
        //转类型 
        formData.append("file", blob,'example.png');
      // //获取裁剪的照片对象
       this.axios.post('http://localhost:888/editUserImg',formData,{processData: false,contentType: false}).then(res=>{
         this.form.photo=res.data
       })
      }, 'image/png' )
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped>
.preview_img {
  display: block;
  max-width: 100%;
  height: 280px;
}
.change_img{
  text-align: center;
}
</style>