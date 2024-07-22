const express = require("express");
const dotenv = require("dotenv")
const app = express();
const swaggerSetup = require("./src/config/swagger.config")
const path = require("path");
const mainRouter = require("./src/app.routes");
const { NotFoundHandler, AllExceptionHandler } = require("./src/common/utils/error.handler");
const cookieParser = require("cookie-parser");

dotenv.config()
require("./src/config/database.config")

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser(process.env.COOKIE_SECRET_KEY))
app.use(express.static(("public")))


swaggerSetup(app)

app.use(mainRouter)

NotFoundHandler(app)
AllExceptionHandler(app)
app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
})
