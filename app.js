var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
	Campground    = require("./models/campground"),
	Comment       = require("./models/comment"),
	flash 		  = require("connect-flash"),
	seedDB        = require("./seeds"),
	passport      = require("passport"),
	localStrategy = require("passport-local"),
	User          = require("./models/user"),
	methodOverride =  require("method-override");

//requiring routes	
var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments"),
	indexRoutes      = require("./routes/index");
	 

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v12";
mongoose.connect(process.env.DATABASEURL, { 
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
	useFindAndModify: false,
	useCreateIndex: true
}).then(() => {
	console.log("Connceted to DB");
}).catch(err => {
	console.log("ERROR", err.message)
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({	 
	secret: "ONCE AGAIN, FRAN IS THE CUTEST DOG!",
	resave: false,
	saveUninitialized: false	
}));
app.use(passport.initialize());
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("YelpCamp server has started!");
});

