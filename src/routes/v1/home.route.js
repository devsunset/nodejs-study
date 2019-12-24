import express from 'express'
const request = require('request')
const request_promise = require('request-promise-native')
const path = require('path')
const multer = require('multer')
const cheerio = require('cheerio')
const nodemailer = require("nodemailer")
const QRCode = require('qrcode')
const mybatisMapper = require('mybatis-mapper')

const router = express.Router()

mybatisMapper.createMapper([ './sql/testMapper.xml' ]);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello World NodeServer (with Express)' })
});

//PATH
router.get('/htmlps',function(req,res, next){
  res.sendFile(path.resolve(__dirname,'../../public/','html','index.html'))
})

router.get('/imagesps',function(req,res, next){
  res.sendFile(path.resolve(__dirname,'../../public/','images','sunset.jpg'))
})

//UPLOAD - https://github.com/expressjs/multer
var upload = multer({ dest: 'uploads/' })
router.post('/upload', upload.single('avatar'), function (req, res, next) {
  // req.file 은 `avatar` 라는 필드의 파일 정보입니다.
  // 텍스트 필드가 있는 경우, req.body가 이를 포함할 것입니다.
  console.log(req.file)
})

//REQUEST
router.get('/request',function(req,res, next){
  
  request('http://localhost:3000/html', function (error, response, body) {
      console.log(response)
  })

  //GET
  const get_options = {
      uri: "http://localhost:3000/html",
      qs:{
        page:1
      }
    }
    request(get_options,function(err,response,body){
      console.log(response.statusCode)
    })

  //POST
   const post_options = {
      uri:'http://localhost:3000/v1/users/user', 
      method: 'POST',
      form: {
        user_id:'request',
        user_pwd:'request',
      }
   }

   request.post(post_options, function(err,res,body){ 
       console.log(res.statusCode)
   })

  /*
  //POST - MULTIPART
  const formData = {
      attachments: [
      fs.createReadStream(__dirname + '/sunset.jpg'),
      ],
  }

  const formData={
      attachments: {
      value:  fs.createReadStream(__dirname),
      options: {
          filename: 'sunset.jpg',
          contentType: 'image/jpeg'
      }
      }
  }
  
  request.post({url:'http://localhost:3000/v1/home/upload', formData: formData}, function callback(err, httpResponse, body) {
      console.log(response.statusCode)
  })

  //POST - JSON
  let json_options = {
      uri: url,
      method: 'POST',
      body:{
      key:value
      },
      json:true
  }

  //POST - CUSTOMER HEADER OPTION
  let customer_options = {
      uri: url,
      method: 'POST',
      headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1 WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      json:true 
  }

  //TRANSFORMATION
  const transformation_options = {
          encoding:null,
          transform: function(body) {
              return iconv.decode(body, "EUC-KR")
          }
  }

  request.post(___options___, function(err,response,body){ 
       console.log(response.statusCode)
  })

  //REQUEST - PROMISE
  const request = require('request-promise-native')
  const result = await request(options)
  request(options).then().catch(err => callback(err))
  */

  res.send("OK")
})

//CRAWLING
router.get('/crawling',function(req,res, next){

  const get_options = {
      uri: "http://localhost:3000/html"
    }

  request_promise(get_options)
  .then(function (htmlString) {
      console.log(htmlString)
      const $ = cheerio.load(htmlString)

      console.log($('.apple', '#fruits').text())
      //=> Apple        
      console.log($('ul .pear').attr('class'))
      //=> pear        
      console.log( $('li[class=orange]').html())
      //=> Orange

      res.send("success")
  })
  .catch(function (err) {
      res.send("fail")
  })    
})

//NODEMAILER - https://nodemailer.com/about/
router.get('/nodemailer',function(req,res, next){
  sendMail().catch(console.error)    
  res.send("OK")
})

async function sendMail() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

//QRCODE
router.get('/qrcode/:qrcode',function(req,res, next){          
  let inputStr = req.params.qrcode;
  /*
  QRCode.toDataURL(inputStr, function (err, url) {
      console.log(url)
      res.send("<img src="+url+">")  
  })    
  */    
  QRCode.toDataURL(inputStr,function(err,url){
      let data = url.replace(/.*,/,'')
      let img = new Buffer(data,'base64')

      res.writeHead(200,{
          'Content-Type':'image/png',
          'Content-Length' : img.length

      })
      res.end(img)
  })
})

//GM - https://github.com/aheckmann/gm
router.get('/gm',function(req,res, next){
 res.send("OK")
})

//REDIS
router.get('/setcache',function(req,res, next){
      var key = "k_data"
      var value = "v_data";          
      req.cache.set(key,value,function(err,data){
           if(err){
                 console.log(err);
                 res.send("error "+err);
                 return;
           }
           req.cache.expire(key,60);
           res.send(value);
      });
})

router.get('/getcache',function(req,res, next){
  var key = "k_data"
  req.cache.get(key,function(err,data){
           if(err){
                 console.log(err)
                 res.send("error "+err)
                 return;
           }
           res.send(data)
      })
})

//MYBATIS-MAPPER
router.get('/sql',function(req,res, next){
  
  var param = {
      email : 'test@test.com'
  }
 
  var format = {language: 'sql', indent: '  '};
  var query = mybatisMapper.getStatement('testMapper', 'testBasic', param, format);

  console.log(query);  
  
  req.pool.getConnection()
      .then(conn => {    
        conn.query(query)
          .then((rows) => {
            console.log(rows)
            conn.end()
            res.send(rows)
          })
          .catch(err => {
            //handle error
            console.log(err) 
            conn.end()
          })        
      }).catch(err => {
        //not connected
        console.log(err) 
     });
})

export default router
