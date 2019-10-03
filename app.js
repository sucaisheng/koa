const koa = require('koa');
const mysql = require('mysql');
const json = require('koa-json');
const koaRouter = require('koa-router');
const path = require('path');
const render = require('koa-ejs');
const bodyParser = require('koa-bodyparser');

const app = new koa();
const router = new koaRouter();

//数据连接池
const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '15186478704scs?',
    database : 'news'
});

//链接数据库函数
var query = function(sql, values){
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            if(err){
                reject( err );
            } else {
                connection.query(sql, values, (err,rows) => {

                    if(err){
                        reject(err);
                    } else {
                        resolve( rows );
                }
                connection.release();
                })
            }
        })
    })
}

//查询数据
async function getData(){
    var sql = 'SELECT * FROM user';
    var data = await query(sql);
    console.log(data);
}

//加入数据
async function addData(VALUES){
    var sql = `INSERT INTO user
                (userName,userPassword)
                VALUES
                ( ?, ?)
                `;
    var data = await query(sql,VALUES);
    console.log(data);
}

//删除数据
async function deleteData(VALUES){
    var sql = "DELETE FROM user WHERE userName = ?";
    var data = await query(sql,VALUES);
    console.log(data);
}

//更新数据
async function updateData(VALUES){
    var sql = "UPDATE user SET userPassword = ? WHERE id = ?";
    var data = await query(sql,VALUES);
    console.log(data);
}

//updateData([123456,1]);
//deleteData("苏财胜");
//getData();
//addData(["苏财胜",123456789]);

app.use(json());

app.use(bodyParser());

app.context.user = "苏财胜";

var things = ["my family","chinese","love"];

//配置模板引擎
render(app,{
    root:path.join(__dirname,'views'),
    layout:'layout',
    viewExt:'html',
    cache:false,
    debug:false
});

//路由跳转 index
router.get('/',index);

//函数声明
async function index(ctx){
    await ctx.render('index',{
        title:"things I love...",
        things:things
    });
}

router.get('/add',addShow);
async function addShow(ctx){
    await ctx.render('add');
}

router.get('/text', ctx=> (ctx.body = `Hello ${ctx.user}`));
router.get('/text2/:name', ctx=> (ctx.body = `Hello ${ctx.params.name}`));

//添加路由方法
router.post('/add',add);

async function add(ctx){
    const body = ctx.request.body;
    things.push(body.thing);
       
    ctx.redirect('/');
}

//配置路由
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000,()=>{console.log('serves.start...')});

