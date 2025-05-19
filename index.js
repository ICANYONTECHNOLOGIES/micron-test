const express = require('express');
const path = require('path');
const cors = require("cors");
const app = express();
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const connection = require("./db");
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const cookieParser = require("cookie-parser"); // ✅ import it\
var createError = require('http-errors');





app.use(cookieParser()); // ✅ use it before any route

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Set up handlebars with prototype access
// in your app.js or wherever you do `app.engine('hbs', …)`
const hbs = engine({
  extname: '.hbs',
  defaultLayout: 'user-layout',
  layoutsDir: path.join(__dirname, 'views/layout'),
  partialsDir: path.join(__dirname, 'views/partials'),
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    json: (ctx) => JSON.stringify(ctx)
  }
});

app.engine('hbs', hbs);


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

require("dotenv").config();
connection();

app.use('/',userRouter);
app.use('/admin',adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{notShow:true,notShowB:true});
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Connected to Port ${port}`));
