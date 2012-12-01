
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , prd = require('./routes/prd')
  , http = require('http')
  , path = require('path')
  , nodePrd=require('node-prd')
  , fs = require('fs');


//Check if PRD_HOME is correct
var prdHome=process.env.PRD_HOME;
var prdHomeOK=true;

var dirExists=function(path) {
  if (fs.existsSync(path)){
    st = fs.lstatSync(path);
    return st.isDirectory();
  } 
  return false;
}
var fileExists=function(path) {
  if (fs.existsSync(path)){
    st = fs.lstatSync(path);
    return st.isFile();
  } 
  return false;
}

if (!prdHome || prdHome=='') {
  console.warn('Environment variable PRD_HOME not set.');
  prdHomeOK=false;
} else {
  try {
      if (!dirExists(prdHome)) {
          console.warn('Value of PRD_HOME not pointing to a directory');
          console.warn('   Current PRD_HOME value: '+prdHome);
          prdHomeOK=false;
      } else {
        if (!fileExists(prdHome+'/set-pentaho-env.sh') ||
          !fileExists(prdHome+'/set-pentaho-env.sh') || 
          !dirExists(prdHome+'/lib') ||
          !dirExists(prdHome+'/lib/jdbc')) {
            console.warn('Value of PRD_HOME appears not to have a copy of PRD');
            console.warn('   Current PRD_HOME value: '+prdHome);
            prdHomeOK=false;
        }
      }
  } catch (e) {
      console.error(e);
      prdHomeOK=false;
  }

}

//node-prd
var nPrd;
if(prdHomeOK) {
  nPrd=nodePrd.createInstance(
    {},
    {
      prdHomePath : prdHome,
      tmpParentFolder : __dirname
    }
  );
  console.info('node-prd version: '+nPrd.getVersion());
  nPrd.initRaaS(3333,true,true);
}
//end-node-prd

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res, next){
    routes.index(req, res, prdHomeOK);
});
app.post('/list', function(req, res, next){
    prd.list(req, res, nPrd);
});
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
