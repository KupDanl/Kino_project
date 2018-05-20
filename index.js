var express = require( "express" );
var app = express();
var bodyParser = require( "body-parser" );
var request = require("request");
const nodemailer = require('nodemailer');
var fs = require('fs');
var currentDate = new Date();

app.set( "view engine", "ejs" );

var body = fs.readFileSync("courses.html");  
var rate = JSON.parse(body);  

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {extended:true} ) );

var reviews = [
	{ title: "Igoor", content: "Great WEBsite" },
	{ title: "Rusya", content: "Great WEBsite" },
	{ title: "Ivan", content: "Great WEBsite" }
];//здесь хранится все что постится на страницу reviews 

var posts = [
	{ title: rate[0].ccy, content: rate[0].buy, content1: "-", content2: rate[0].sale },//если будешь добавлять здесь content то не забудь сделать это и на странице main там оставлю коммент
	{ title: rate[1].ccy, content: rate[1].buy, content1: "-", content2: rate[1].sale },
	{ title: rate[2].ccy, content: rate[2].buy, content1: "-", content2: rate[2].sale },
];//здесь хранится все что постится на главную страницу в данном случае тут лежат json данные из файлы courses

app.get( "/", function( req, res ) {
	res.render( "main.ejs", {posts: posts} );//делаем доступным posts для использования в стр main
});

app.get( "/reviews", function( req, res ) {
	res.render( "reviews.ejs", {reviews: reviews} );//делаем доступным reviews для использования в стр reviews
});

app.get( "/post/:id", function( req, res ){
	var id = req.params.id;
	res.render("post.ejs", { post: posts[ 0 ] } );
});

app.get( "/post", function(req, res){
	res.render("post.ejs")
});

app.post( "/post", function(req, res){//для постинга на странице reviews и отправки на мыло
	var title = req.body.title;
	var content = req.body.content;

	reviews.push( {title: title, content: content} );

	res.redirect( "/reviews" );

	let transporter = nodemailer.createTransport({//опции для использования почтовика как площадки для отправки
		service: 'outlook',
		auth: {
			user: 'exmple@outlook.com', 
			pass: '' 
		}
	});

	let mailOptions = {//для отправки данных с страницы post
		from: 'example@outlook.com', //введите здесь свой email
		to: 'example@gmail.com',  
		subject: title,
		text: content
	}

	transporter.sendMail(mailOptions, function (err) {
		if(err) return console.log(err);
		console.log('Оправлено');
		});
	});

app.listen( 3000, function() {
	console.log("Example app list on port 3000")
});