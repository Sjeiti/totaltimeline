/**
 * node task/serve dist 8383
 */

const fs = require('fs')
    ,express    = require('express')
    ,bodyParser = require('body-parser')
    ,serveStatic = require('serve-static')
    ,openBrowser = require('open')
    ,root = process.argv[2]||'src'
    ,port = process.argv[3]||8183
    ,router = express.Router()
    ,path = require('path')

express()
    .use(serveStatic('./'+root+'/'))
    .use(bodyParser.urlencoded({ extended: true }))
    .get('/*', function(req, res) {
       res.sendFile(path.join(__dirname + '/../dist/index.html'))
    })
    .use(bodyParser.json())
    .use('/api', router)
    .listen(port);

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});
router.get('*', function(req, res){
  res.render('index.html');
});

openBrowser('http://localhost:'+port);

