/**
 * node task/serve dist 8383
 */

var fs = require('fs')
		,express    = require('express')
		,bodyParser = require('body-parser')
		,serveStatic = require('serve-static')
		,openBrowser = require('open')
    //,htaccess = require('express-htaccess-middleware')
		,root = process.argv[2]||'src'
		,port = process.argv[3]||8183
		,router = express.Router()

express()
    .use(serveStatic('./'+root+'/'))
		.use(bodyParser.urlencoded({ extended: true }))
    /*.use(htaccess({
      file: './'+root+'/.htaccess',
      verbose: (process.env.ENV_NODE == 'development'),
      watch: (process.env.ENV_NODE == 'development'),
    }))*/
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
