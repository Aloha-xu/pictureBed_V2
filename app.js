const express = require('express')
const app = express()
const multer = require('multer')
const upload = multer({ dest: './uploads' });
const bodyParser = require("body-parser")
const fs = require('fs')
const path = require("path")
const ejs = require('ejs');
const port = 3000
const {getLocalImg, saveLocalImg } = require('./db')

app.use(express.static('./uploads'))

app.set('views', path.join(__dirname, './views'));
app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: false
}))

// app.use(bodyParser.json())
const mysql = require('mysql')

app.get('/', (req, res) => {
  res.type('html');
  res.render('user')
})

app.get('/user', (req, res) => {
  res.type('html');
  res.render('user')
})

app.get('/getpic/:id', (req, res) => {
  console.log(req.params.id)
  fs.readFile(`./uploads/${req.params.id}`, (err, data) => {
    res.set('Content-Type', 'image/jpeg')
    res.send(data)
  })
})

// v2 --- upload 10<= picture in same time 
app.post('/addpic', upload.array('file', 10), async (req, res) => {
  var imges = req.files
  var allurl = []
  for (let i = 0; i < imges.length; i++) {
    let imgdata = await getLocalImg(imges[i].path)
    var imgesori = imges[i].originalname
    var radname = Date.now() + parseInt(Math.random() * 999)
    var oriname = imgesori.lastIndexOf('.')
    var fne = imgesori.substring(oriname, oriname.length)
    var picname = radname + fne
    await saveLocalImg(path.join(__dirname, './uploads/' + picname), imgdata)
    var picPath = "http://localhost:3000" + '/getpic/' + picname
    var post = { http_src: picPath, pic_name: picname };
    allurl.push(picPath)
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'picture_database'
    })
    connection.connect()
    connection.query("INSERT INTO pic_store SET ?", post, function (error, results, fields) { });
    connection.end()
  }
  res.render('home', { url: allurl })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})