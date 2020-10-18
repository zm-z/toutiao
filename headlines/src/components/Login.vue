<template>
  <div class="login">
    <el-form ref="form" class="login_form" :model="form" :rules="rules">
      <el-form-item prop="phone">
        <el-input v-model="form.phone"  placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入验证码"
          class="input-with-select"
          v-model="form.message" 
        >
          <el-button slot="append" @click="sendCode('form')" :disabled='isSend' class="btn_getMessage">{{getMsg}}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked" @click="checkboxChange()"
          >我已阅读并同意用户协议和隐私</el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-button class="login_btn" type="primary" :loading="loginLoading" @click="onSubmit" :disabled='isTestAll'
          >登录</el-button
        >
      </el-form-item>
    </el-form>
    <el-dialog
      title="注册信息"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      append-to-body>
      <!-- 个人信息 -->
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="媒体名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="媒体介绍" prop="intro">
          <el-input type="textarea" v-model="form.intro"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUserMsg('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapMutations} from 'vuex';
export default {
  created() {
  },
  data() {
     var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };
    return {
      form: {
        phone: "",
        message: "",
        name:"",
        intro:"",
        email:""
      },
      checked: false,
      loginLoading:false,
      isSend:false,
      dialogVisible:false,
      getMsg:'获取验证码',
      issetMsg:false,//是否设置了新用户的信息
       rules: {
          phone: [
            {validator: checkPhone, trigger: 'blur'}
          ],
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
        }
    }
  },
  methods: {
    //倒计时
    timerComputer(){
      this.isSend=true
      var num=60
      var timer=setInterval(() => {
        num--
        this.getMsg=num
      }, 1000);
      setTimeout(() => {
        clearInterval(timer)
        this.getMsg='获取验证码'
        this.isSend=false
      }, 60000);
    },
    //发送短信，获取验证码
     sendCode(formName) {
       this.$refs[formName].validate((valid) => {
          if (valid) {
            //验证成功，发送请求
            this.axios.post('http://localhost:888/sendCoreCode',{phone:this.form.phone}).then(res=>{
              if(res.data.code==200){
                this.timerComputer()
              }
            })
          } else {
            return false;
          }
        });
    },
    //是否阅读
    checkboxChange(){
      this.checked=!this.checked
    },
    onSubmit() {
      this.loginLoading=true
        this.axios.post('http://localhost:888/phoneLogin',{phone:this.form.phone,code:this.form.message}).then(res=>{
          if(res.data.code==200){
            if(!res.data.data[0]||this.issetMsg){
              this.dialogVisible=true
              this.loginLoading=false
              return
            }
            window.sessionStorage.setItem('token',this.form.phone)
            this.$router.push({name:'home'})
            this.loginLoading=false
          }else{
            this.$message.error('登陆失败');
            this.loginLoading=false
          }
        })
    },
     handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      //设置个人信息
      setUserMsg(formName){
         this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post('http://localhost:888/setUserMsg',this.form).then(res=>{
              if(res.data.code==200){
                this.onSubmit()
                this.dialogVisible=false
              }
            })
          } else {
            return false;
          }
        });
      }
  },
  computed: {
    isTestAll(){
      if(/^\d{6}$/.test(this.form.message.trim())&&/^\d{11}$/.test(this.form.phone.trim())&&this.checked){
        return false
      }else{
        return true
      }
    }
  },
};
</script>

<style scoped>
.login {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(../assets/login_bg.jpg);
}
.login_form {
  background-color: white;
  padding: 50px;
  min-width: 300px;
}
.login_btn {
  width: 100%;
}
.btn_getMessage{
  width: 108px;
}
</style>