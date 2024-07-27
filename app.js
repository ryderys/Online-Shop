const express = require("express");
const dotenv = require("dotenv")
const app = express();
const swaggerSetup = require("./src/config/swagger.config")
const path = require("path");
const mainRouter = require("./src/app.routes");
const { NotFoundHandler, AllExceptionHandler } = require("./src/common/utils/error.handler");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const session = require("express-session")
const cors = require("cors")
const adminRateLimiter = require("./src/common/middleware/rate-limit");
const { default: helmet } = require("helmet");

dotenv.config()
require("./src/config/database.config")

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser(process.env.COOKIE_SECRET_KEY))
app.use(express.static(path.join(__dirname, "public")))

swaggerSetup(app)
app.use(adminRateLimiter)
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({mongoUrl: process.env.MONGODB_URL}),
//     cookie: {
//         secure: process.env.NODE_ENV === "production",
//         maxAge: 1000 * 60 * 60 * 24, //1 day
//         httpOnly: true
//     }
// }))
app.use(mainRouter)

NotFoundHandler(app)
AllExceptionHandler(app)
app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
})
