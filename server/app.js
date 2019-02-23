var express = require('express');
var multer  = require('multer')
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

// 注册users接口
var users = require('./routes/users');
app.use('/users', users);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


var storage = multer.diskStorage({
  //確定圖片儲存的位置
  destination: function (req, file, cb){
  cb(null, 'upload/')
  },
  //確定圖片儲存時的名字,注意，如果使用原名，可能會造成再次上傳同一張圖片的時候的衝突
  filename: function (req, file, cb){
    cb(null, Date.now() +'_'+ file.originalname)
  }
  });
  //生成的專門處理上傳的一個工具，可以傳入storage、limits等配置
  var upload = multer({storage: storage});

// var upload = multer({ dest: 'upload/' });

// 多图上传
app.post('/upload-multi', upload.array('filegroup', 2), function(req, res, next){
  console.log('---------------------------');
  var files = req.files;

for(i in files){
  console.log('文件类型：%s', files[i].mimetype);
  console.log('原始文件名：%s', files[i].originalname);
  console.log('文件大小：%s', files[i].size);
  console.log('文件保存路径：%s', files[i].path);
}
    

    res.send({ret_code: '0', success: true});
});

// 访问静态资源
app.use(express.static(path.resolve(__dirname, '../dist')));
app.use('/drag', express.static(path.resolve(__dirname, '../public')));
// 访问单页
app.get('*', function (req, res) {
  var html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
  res.send(html);
});




// 监听
app.listen(process.env.PORT || 8081, function () {
    console.log('success listen...8081');
  });
