var express = require('express');
var router = express.Router();
var cate = require('../controllets/cateControllet')
var dbCongif = require('../util/dbconfig')

//修改头像
let multer = require('multer')
    //let upload = multer({ dest: './public/uploads/' }).single('file')
let uploadMore = multer({ dest: './public/uploads/' }).array('file', 10)
let upload = multer({ dest: './public/uploads/' }).single('file')
    /* GET home page. */
router.post('/sendCode', cate.sendCode)
router.post('/sendCoreCode', cate.sendCoreCode)
router.post('/phoneLogin', cate.phoneLogin)
router.post('/setUserMsg', cate.setUserMsg)
router.post('/getGoods', cate.getGoods)
router.post('/delectArticle', cate.delectArticle)
router.post('/addArticle', cate.addArticle)
router.post('/getImage', cate.getImage)
router.post('/uploadMoreImg', uploadMore, cate.uploadMoreImg)
router.post('/collectChange', cate.collectChange)
router.post('/deleteImage', cate.deleteImage)
router.post('/getComment', cate.getComment)
router.post('/stateChange', cate.stateChange)
router.post('/getMyMessage', cate.getMyMessage)
router.post('/editUserImg', upload, cate.editUserImg)
router.post('/upMyMessage', upload, cate.upMyMessage)
router.post('/getFansMsg', cate.getFansMsg)
router.post('/changeFocus', cate.changeFocus)
router.post('/addImg', upload, cate.addImg)
module.exports = router;