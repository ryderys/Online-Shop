const express = require("express");
const dotenv = require("dotenv")
const {allRoutes} = require("./src/app.routes")
const app = express();
const swaggerSetup = require("./src/config/swagger.config")
dotenv.config()
require("./src/config/database.config")
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(allRoutes)
swaggerSetup(app)
app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
})
