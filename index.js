var express = require( "express" );
var app = express();
var bodyParser = require( "body-parser" );
var request = require("request");
const nodemailer = require('nodemailer');
var fs = require('fs');
var currentDate = new Date();

app.set( "view engine", "ejs" );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {extended:true} ) );
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/image'));

var reviews = [
	{ title: "Igoor", content: "The Bridge on the River Kwai (1957), the memorable, epic World War II adventure/action, anti-war drama, was the first of director David Lean's major multi-million dollar, wide-screen super-spectaculars (his later epics included Lawrence of Arabia (1962) and Doctor Zhivago (1965)).The screenplay was based upon French author Pierre Boulle's 1954 novel of the same name. [Boulle was better known for his screenplay for Planet of the Apes (1963).] Although he received sole screenplay credit, other deliberately uncredited, blacklisted co-scripting authors (exiled Carl Foreman - who scripted High Noon (1952) - and Michael Wilson) had collaborated with him, but were denied elibigility. They were post-humously credited years later, in late 1984, in a special Academy ceremony" },
	{ title: "Rusya", content: "Bonnie and Clyde (1967) is one of the sixties' most talked-about, volatile, controversial crime/gangster films combining comedy, terror, love, and ferocious violence. It was produced by Warner Bros. - the studio responsible for the gangster films of the 1930s, and it seems appropriate that this innovative, revisionist film redefined and romanticized the crime/gangster genre and the depiction of screen violence forever. Its producer, 28 year-old Warren Beatty, was also its title-role star Clyde Barrow, and his co-star Bonnie Parker, newcomer Faye Dunaway, became a major screen actress as a result of her breakthrough in this influential film. Likewise, unknown Gene Hackman was recognized as a solid actor and went on to star in many substantial roles (his next major role was in The French Connection (1971))." },
	{ title: "Ivan", content: "The classic and much-loved romantic melodrama Casablanca (1942), always found on top-ten lists of films, is a masterful tale of two men vying for the same woman's love in a love triangle. The story of political and romantic espionage is set against the backdrop of the wartime conflict between democracy and totalitarianism. [Note: The date given for the film is often either 1942 and 1943. That is because its limited premiere was in 1942, but the film did not play nationally, or in Los Angeles, until 1943. With rich and smoky atmosphere, anti-Nazi propaganda, Max Steiner's superb musical score, suspense, unforgettable characters (supposedly 34 nationalities are included in its cast) and memorable lines of dialogue (e.g., 'Here's lookin' at you, kid,' and the inaccurately-quoted 'Play it again, Sam'), it is one of the most popular, magical (and flawless) films of all time - focused on the themes of lost love, honor and duty, self-sacrifice and romance within a chaotic world." }
];//здесь хранится все что постится на страницу reviews 


var posts = [
	{ title: "second.jpg", content: "Gianni Nunnari’s Hollywood Gang has optioned Second Coming, the satirical novel by Scottish author John Niven. Italian filmmaker Paolo Genovese (Perfect Strangers) is circling the project to write and direct.", content1:"In Second Coming, God takes a much needed holiday, which in Heaven-lapsed time is a leisurely week of celestial relaxation. But on Earth, several hundred years have passed. When God returns from his break, he discovers a modern day world gone awry and littered with contemporary societal issues from war and genocides to racism, violence, terrorism and an unhealthy obsession with celebrity culture. So who best to fix today’s problems of the here and now? God sends his dope smoking son to straighten things out. Niven is best known for his music industry novel Kill Your Friends. “This is the book of mine that has sold by far the most copies around the world,” he said. “I have long thought it would make a great feature and I’m incredibly excited that Gianni and Paolo are starting to make this a reality.’"},
	{ title: "getout.jpg", content: "Get Out is a 2017 American horror film written and directed by Jordan Peele in his directorial debut.", content1:"Get Out premiered at the Sundance Film Festival on January 24, 2017, and was theatrically released in the United States on February 24, 2017, by Universal Pictures. Critics praised its screenplay, direction, Kaluuya's performance and satirical themes, and it was chosen by the National Board of Review, the American Film Institute and Time magazine as one of the top 10 films of the year. The film was also a box office success, grossing $255 million worldwide on a $4.5 million budget. It turned a net profit of $124 million, becoming the tenth most profitable film of 2017 and one of the most profitable horror films in recent years."},
	{ title: "pulp.jpg", content: "Pulp Fiction is a 1994 American crime film written and directed by Quentin Tarantino and starring John Travolta, Samuel L. Jackson, Bruce Willis", content1:"Pulp Fiction won the Palme d'Or at the 1994 Cannes Film Festival, and was a major critical and commercial success upon its U.S. release. It was nominated for seven Oscars, including Best Picture; Tarantino and Avary won for Best Original Screenplay. John Travolta, Samuel L. Jackson, and Uma Thurman each received Academy Award nominations for their roles and revitalized and/or elevated their careers. The nature of its development, marketing, and distribution — and its consequent profitability — had a sweeping effect on the field of independent cinema. Since its release, Pulp Fiction has been widely regarded as Tarantino's masterpiece, with particular praise singled out for its screenwriting."},
	{ title: "monocle.jpg", content: "The Black Monocle (French: Le monocle noir) is a 1961 French comedy crime film.", content1:"The Black Monocle (French: Le monocle noir) is a 1961 French comedy crime film directed by Georges Lautner and starring Paul Meurisse, Elga Andersen and Bernard Blier.[1] It was followed by two sequels The Eye of the Monocle (1962) and The Monocle Laughs (1964). Cast: Paul Meurisse as Le commandant Théobald Dromard dit 'Le Monocle', Elga Andersen as Martha, Bernard Blier as Commissaire Tournmire, Pierre Blanchar as le marquis de Villemaur, Jacques Marin as Trochu, Jacques Dufilho as Charvet, le guide, Albert Rémy as Mérignac - le bibliothécaire, Nico Pepe as Brozzi, Raymond Meunier as Raymond"},
	{ title: "logan.jpg", content: "Logan is a 2017 American neo-western superhero film, produced by Marvel Entertainment, TSG Entertainment and The Donners' Company, and distributed by 20th Century Fox.", content1:"It is the tenth installment in the X-Men film series, as well as the third and final Wolverine solo film following X-Men Origins: Wolverine (2009) and The Wolverine (2013). The film, which takes inspiration from 'Old Man Logan' by Mark Millar and Steve McNiven, follows an aged Wolverine and an extremely ill Professor X defending a young mutant named Laura from the villainous Reavers and Alkali-Transigen led by Donald Pierce and Zander Rice, respectively. The film is directed by James Mangold, who co-wrote the screenplay with Michael Green and Scott Frank, from a story by Mangold. The film stars Hugh Jackman, Patrick Stewart, Boyd Holbrook, and Dafne Keen."},
	{ title: "birdman.jpg", content: "Birdman or (The Unexpected Virtue of Ignorance), commonly known simply as Birdman, is a 2014 American dark comedy film directed by Alejandro G. Iñárritu.", content1:"The film covers the period of previews leading to the play's opening, and with a brief exception appears as if filmed in a single shot, an idea Iñárritu had from the film's conception. Emmanuel Lubezki, who won the Academy Award for his cinematography in Birdman, believed that the recording time necessary for the long take approach taken in Birdman could not have been made with older technology. The film was shot in New York City during the spring of 2013 with a budget of $16.5 million jointly financed by Fox Searchlight Pictures, New Regency Pictures and Worldview Entertainment. It premiered the following year in August where it opened the 71st Venice International Film Festival."},
	{ title: "escape.jpg", content: "Escape from New York is a 1981 American post-apocalyptic science-fiction action film co-written, co-scored and directed by John Carpenter.", content1:"Carpenter wrote the film in the mid-1970s as a reaction to the Watergate scandal. He had enough influence to begin production and filmed it mainly in St. Louis, Missouri on an estimated budget of $6 million. Escape from New York was released in the United States on July 10, 1981. The film received positive reviews from critics and was a commercial success, grossing over $25 million at the box office.[3] The film was nominated for four Saturn Awards, including Best Science Fiction Film and Best Direction. The film became a cult classic and was followed by a sequel, Escape from L.A. (1996), which was also directed and written by Carpenter and starred Russell but was much less favorably received."},
	{ title: "predator.jpg", content: "Predator is a 1987 American science fiction action horror film directed by John McTiernan and written by brothers Jim and John Thomas.", content1:"The film's budget was around $15 million. 20th Century Fox released it in the United States on June 12, 1987, where it grossed $59,735,548. Initial critical reaction was mixed; criticism focused on the thin plot. In subsequent years, critics' attitudes toward the film became positive, and it has appeared on a number of 'best of' lists and is now considered one of the best action films of all time[5]. It spawned three sequels, Predator 2 (1990), Predators (2010) and The Predator (2018). A crossover with the Alien franchise produced the Alien vs. Predator films, which includes Alien vs. Predator (2004) and Aliens vs. Predator: Requiem (2007)."}
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
			user: 'rorykory@outlook.com', 
			pass: 'Kryptonite' 
		}
	});

	let mailOptions = {//для отправки данных с страницы post
		from: 'rorykory@outlook.com', //введите здесь свой email
		to: 'mrgandhubas@gmail.com',  
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