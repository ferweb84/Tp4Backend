import express from "express";
import handlebars from 'express-handlebars'
import __dirname, { uploader}  from "./dirname.js";

import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import database from "./db.js";
import config from "./config.js";
import { winstonLogger } from "./utils/logger.js";
import routesFunction from "./routes/app.router.js";
import passport from "passport";
import initializePassport from "./auth/passport.js";

import bodyParser from "body-parser";


//Initialization
const app = express();
//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(winstonLogger)
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

app.use(cookieParser())
initializePassport()



database.connect();

routesFunction(app)
app.use(passport.initialize())
app.use(passport.session())

//View engine
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

const httpServer = app.listen(8080, (req, res) => {
  try {
    console.log("Listening on port 8080")
  } catch (error) {
   console.log(error)
    return res.status(500).send({
      status: "error",
      error: "Failed to the connect to the server",
  });
  }
});


//socket.connect(httpServer)




