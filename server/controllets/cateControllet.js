var dbCongif = require('../util/dbconfig')
    //调用阿里大鱼
var Core = require('@alicloud/pop-core')
var config = require('../util/alyconfig')
var client = new Core(config.alicloud)
var requestOption = {
    method: 'POST'
};

//修改头像
let fs = require('fs')


//模拟发送接口哦·
//产生6位随机数
function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}
//设置一个空数组，保存接受的号码和验证码，发送验证码时使用
var vaildatePhoneCode = []

//设置一个空数组，保存验证码，验证时使用
var vaildatePhoneCode1 = []

//验证码一分钟后可以再次发送
function sendAgain() {
    setTimeout(() => {
        vaildatePhoneCode = []
    }, 60000);
}
//验证码在五分钟内有效
function sendAgainP() {
    vaildatePhoneCode = []
}
let sendCodeP = (phone) => {
    //对数组进行遍历，判断号码与验证码是否正确
    for (var item of vaildatePhoneCode) {
        if (phone == item.phone) {
            return true
        }
    }
    return false
}
let sendCodeP1 = (phone) => {
    console.log(vaildatePhoneCode);
    //对数组进行遍历，判断号码与验证码是否正确
    for (var item of vaildatePhoneCode) {
        if (phone == item.phone) {
            return true
        }
    }
    return false
}

var timer = null
sendCode = (req, res) => {
    let phone = req.body.phone;
    if (sendCodeP(phone)) {
        res.send({
            'code': 400,
            'msg': '验证码已发送'
        })
    } else {
        let code = rand(100000, 999999);
        vaildatePhoneCode.push({
                'code': code,
                'phone': phone
            }),
            //再次发送验证码时清空上一个数据
            vaildatePhoneCode1 = []
            //填入型数据
        vaildatePhoneCode1.push({
            'code': code,
            'phone': phone
        })
        res.send({
            'code': 200,
            'msg': '发送成功',
            'data': code
        })
        console.log(code);
        //验证码在一分钟之后可以再次发送
        sendAgain();
        clearTimeout(timer)
        timer = setTimeout(() => {
            sendAgainP()
        }, 300000);
    }
}

//真实验证
sendCoreCode = (req, res) => {
    vaildatePhoneCode = []
    let phone = req.body.phone
    let code = rand(100000, 999999);
    var params = {
        "RegionId": "cn-hangzhou",
        "PhoneNumbers": phone,
        "SignName": "影子商城",
        "TemplateCode": "SMS_204125872",
        "TemplateParam": JSON.stringify({ "code": code })
    }
    client.request('SendSms', params, requestOption).then((result) => {
        if (result.Code == 'OK') {
            res.send({
                'code': 200,
                'msg': '发送成功'
            });
            vaildatePhoneCode.push({
                    'phone': phone,
                    'code': code
                })
                //短信五分钟内有效
            clearTimeout(timer)
            timer = setTimeout(() => {
                sendAgainP()
            }, 300000);
        } else {
            res.send({
                'code': 400,
                'msg': '发送失败'
            })
        }
    })
}

//登陆验证
const codePhoneLoginP = (phone, code) => {
    if (!vaildatePhoneCode) { return 'error' }
    for (var item of vaildatePhoneCode) {
        if (phone == item.phone && code == item.code) {
            return 'login'
        }
    }
    return 'error'
}

//登录
phoneLogin = async(req, res) => {
    let { phone, code } = req.body
        //判断手机是否发送验证码
    if (await sendCodeP1(phone)) {
        let status = await codePhoneLoginP(phone, code)
        if (status == 'login') {
            var data = await firstLogin(phone)
            res.send({
                'code': 200,
                'msg': '登陆成功',
                'data': data
            })
        } else {
            res.send({
                'code': 400,
                'msg': '登陆失败'
            })
        }
    } else {
        res.send('error')
    }
}

//判断是否第一次登陆
firstLogin = async(phone) => {
    let sql = `select * from user where mobile=?`
    var sqlArr = [phone]
    let data = await dbCongif.SySqlConnect(sql, sqlArr)
    return data
}

//获取登陆用户信息
getMyMessage = async(req, res) => {
    let sqlArr = [req.body.mobile]
    let sql = `select * from user where mobile=?`
    let msg = await dbCongif.SySqlConnect(sql, sqlArr)
    if (msg.length) {
        res.send({
            'code': 200,
            'msg': msg
        })
    } else {
        res.send({
            'code': 400,
            'msg': '获取用户信息失败'
        })
    }
}

//设置个人信息
setUserMsg = async(req, res) => {
    let phone = req.body.phone
    let name = req.body.name
    let intro = req.body.intro
    let email = req.body.email
    let sqlArr = [name, intro, 'http://localhost:888/uploads/20120225131321_Ve5E8.jpg', email, phone]
    let sql = `insert into user(name,intro,photo,email,mobile,create_time) values(?,?,?,?,?,now())`
    let msg = await dbCongif.SySqlConnect(sql, sqlArr)
    if (msg.affectedRows) {
        res.send({
            'code': 200,
            'msg': '添加用户成功'
        })
    } else {
        res.send({
            'code': 400,
            'msg': '添加用户信息失败'
        })
    }
}

//获取商品信息
getGoods = async(req, res) => {
    let { pagesize, pagenum } = req.body.data
    let states = req.body.states
    let region = req.body.region
    let begin_pubdate = req.body.begin_pubdate
    let end_pubdate = req.body.end_pubdate
    var sqlArr = []
    let num = (pagenum - 1) * pagesize
    let sql = `select * from  goods`
    let sql1 = `select count(id) as total from goods `
    var isStates = false
    if (states != null) {
        sql += ' where state=?'
        sql1 += ' where state=?'
        sqlArr.push(states)
        isStates = true
    }
    if (region != null && region != '全部') {
        if (isStates) {
            sql += ' and path=?'
            sql1 += ' and path=?'
        } else {
            sql += ' where path=?'
            sql1 += ' where path=?'
            isStates = true
        }
        sqlArr.push(region)
    }
    if (begin_pubdate != null && end_pubdate != null) {
        if (isStates) {
            sql += ' and data>=? and data<=?'
            sql1 += ' and data>=? and data<=?'
        } else {
            sql += ' where data>=? and data<=?'
            sql1 += ' where data>=? and data<=?'
        }
        sqlArr.push(begin_pubdate, end_pubdate)
    }
    sqlArr.push(num, pagesize)
    sql += "  limit ?, ?"
    let total = await dbCongif.SySqlConnect(sql1, sqlArr)
    let totals = total[0].total ? total[0].total : 0
    var msg = await dbCongif.SySqlConnect(sql, sqlArr)
    if (msg.length) {
        res.send({
            'code': 200,
            'msg': msg,
            'total': totals,
        })
    } else {
        res.send({
            'code': 400,
            'msg': [],
            'total': 0
        })
    }
}

//删除商品
delectArticle = async(req, res) => {
    let sqlArr = [req.body.id]
    let sql = 'delete from goods where id=?'
    await dbCongif.SySqlConnect(sql, sqlArr)
    res.send({
        'code': 200,
        'msg': '删除成功'
    })

}

//添加商品
addArticle = async(req, res) => {
    console.log(req.body);
    let { title, content, path, face } = req.body.data
    let sqlArr = [title, content, path, face]
    let sql = `insert into goods(title,content,path,face,data,state) values(?,?,?,?,now(),2)`
    let data = await dbCongif.SySqlConnect(sql, sqlArr)
    res.send({
        'code': 200,
        'msg': '添加成功'
    })
}

//添加商品照片
let addImg = (req, res) => {
    if (req.file.length == 0) {
        res.send('error', { message: '上传图片不能为空' })
        return
    } else {
        let file = req.file
        fs.renameSync('./public/uploads/' + file.filename, './public/uploads/' + file.originalname); //这里修改文件名字，比较随意。
        // 设置响应类型及编码
        res.set({
            'content-type': 'application/json; charset=utf-8'
        });
        let imgUrl = "http://localhost:888/uploads/" + file.originalname
        res.send(imgUrl)
    }
}

//获取照片
getImage = async(req, res) => {
    let { pagenum, pagesize } = req.body.page
    let is_collect = req.body.is_collect
    let sql = `select * from images`
    let sql1 = `select count(*) as total from images`
    var sqlArr = []
    if (is_collect == '1') {
        sql += ' where is_collect=?'
        sql1 += ' where is_collect=?'
        sqlArr.push(is_collect)
    }
    sql += ' limit ?,?'
    let num = (pagenum - 1) * pagesize
    sqlArr.push(num, pagesize)
    let totals = await dbCongif.SySqlConnect(sql1, sqlArr)
    let msg = await dbCongif.SySqlConnect(sql, sqlArr)
    if (msg.length) {
        res.send({
            'code': 200,
            'data': msg,
            'total': totals[0].total
        })
    } else({
        'code': 400,
        'msg': '请求错误'
    })
}

//多图上传
let uploadMoreImg = async(req, res) => {
    let files = req.files;
    if (files.length === 0) {
        res.render("error", { message: "上传文件不能为空！" });
        return
    } else {
        for (var i in files) {
            let file = files[i];
            fs.renameSync('./public/uploads/' + file.filename, './public/uploads/' + file.originalname); //这里修改文件名字，比较随意。
            //获取文件基本信息
            let url = "http://localhost:888/uploads/" + file.originalname
            let sql = `insert into images(url,is_collect) values(?,?)`
            let sqlArr = [url, 0]
            await dbCongif.SySqlConnect(sql, sqlArr)
        }
        // 设置响应类型及编码
        res.set({
            'content-type': 'application/json; charset=utf-8'
        });
        res.send({
            'code': 200,
            'msg': '上传成功',
        })
    }
}

//状态改变
collectChange = async(req, res) => {
    let id = req.body.id
    let is_collect = req.body.is_collect
    is_collect = is_collect == 1 ? 0 : 1
    let sql = `update images set is_collect=? where id=?`
    let sqlArr = [is_collect, id]
    let msg = await dbCongif.SySqlConnect(sql, sqlArr)
    if (msg.affectedRows) {
        res.send({
            'code': 200,
            'msg': '修改成功'
        })
    } else {
        res.send({
            'code': 400,
            'msg': '修改失败'
        })
    }
}

//删除素材
deleteImage = async(req, res) => {
    let id = req.body.id
    let sqlArr = [id]
    let sql = `delete from images where id=?`
    let msg = await dbCongif.SySqlConnect(sql, sqlArr)
    if (msg.length) {
        res.send({
            'code': 200,
            'msg': '删除成功'
        })
    } else {
        res.send({
            'code': 400,
            'msg': '删除失败'
        })
    }
}

//获取评论管理信息
getComment = async(req, res) => {
    let { pagenum, pagesize } = req.body.page
    let num = (pagenum - 1) * pagesize
    let sql = `select * from comments limit ?,?`
    let sql1 = `select count(*) as totals from comments`
    let sqlArr = [num, pagesize]
    let totals = await dbCongif.SySqlConnect(sql1)
    let data = await dbCongif.SySqlConnect(sql, sqlArr)
    if (data.length) {
        res.send({
            'code': 200,
            'data': data,
            'total': totals[0].totals
        })
    } else {
        res.send({
            'code': 400,
            'data': '请求失败'
        })
    }
}

//评论管理状态改变
stateChange = async(req, res) => {
    let id = req.body.id
    var state = req.body.state
    if (state == true) {
        state = 0
    } else {
        state = 1
    }
    let sqlArr = [state, id]
    let sql = `update comments set state=${req.body.state} where id=${req.body.id}`
    let msg = await dbCongif.SySqlConnect(sql)
    console.log();
    if (msg.affectedRows) {
        res.send({
            'code': 200,
            'msg': '修改成功'
        })
    } else {
        res.send({
            'code': 400,
            'msg': "修改失败"
        })
    }
}

//修改头像
let editUserImg = (req, res) => {
    console.log(req.file);
    if (req.file.length == 0) {
        res.send('error', { message: '上传图片不能为空' })
        return
    } else {
        let file = req.file
        fs.renameSync('./public/uploads/' + file.filename, './public/uploads/' + file.filename + file.originalname); //这里修改文件名字，比较随意。
        // 设置响应类型及编码
        res.set({
            'content-type': 'application/json; charset=utf-8'
        });
        let imgUrl = "http://localhost:888/uploads/" + file.filename + file.originalname
        res.send(imgUrl)
    }
}

//修改个人信息
upMyMessage = async(req, res) => {
    let name = req.body.data.name
    let intro = req.body.data.intro
    let photo = req.body.data.photo
    let email = req.body.data.email
    let mobile = req.body.data.mobile
    let sqlArr = [name, intro, photo, email, mobile]
    let sql = `update user set name=?,intro=?,photo=?,email=? where mobile=?`
    let msg = await dbCongif.SySqlConnect(sql, sqlArr)
    if (msg.affectedRows) {
        res.send({
            'code': 200,
            'msg': '修改成功'
        })
    } else {
        res.send({
            'code': 400,
            'msg': '修改失败'
        })
    }
}

//获取粉丝列表
getFansMsg = async(req, res) => {
    let sql = `select * from fans`
    let msg = await dbCongif.SySqlConnect(sql)
    if (msg.length) {
        res.send({
            'code': 200,
            'msg': msg
        })
    } else {
        res.send({
            'code': 400,
            'msg': '请求失败'
        })
    }
}

//粉丝是否关注改变
changeFocus = async(req, res) => {
    let { id, state } = req.body
    let sqlArr = [state, id]
    let sql = `update fans set is_focus=? where id=?`
    let msg = await dbCongif.SySqlConnect(sql, sqlArr)
    if (msg.affectedRows) {
        res.send({
            'code': 200,
            'msg': '修改成功'
        })
    } else {
        res.send({
            'code': 400,
            'msg': '修改失败'
        })
    }
}

//模糊查询
mohu = async(req, res) => {
    console.log(req.query.name);
    let sql = "select * from user where name like '%${req.query.name}%'"
    let msg = await dbCongif.SySqlConnect(sql)
    console.log(sql);
    res.send(msg)
}
module.exports = {
    sendCode,
    sendCoreCode,
    phoneLogin,
    setUserMsg,
    getGoods,
    delectArticle,
    addArticle,
    getImage,
    uploadMoreImg,
    collectChange,
    deleteImage,
    getComment,
    stateChange,
    getMyMessage,
    editUserImg,
    upMyMessage,
    getFansMsg,
    changeFocus,
    addImg,
    mohu
}