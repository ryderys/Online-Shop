const { default: mongoose } = require("mongoose")
const {MongoClient} = require("mongodb")
const dotenv = require("dotenv")
dotenv.config()

// mongoose.connect(process.env.MONGODB_URL).then(() => {
//     console.log("connected to DB");
// }).catch(err => {
//     console.log(err?.message ?? "failed to connect to DB");
// })

mongoose.connect('mongodb+srv://youssefiashkanys:Ashkanys79@first-project.co830.mongodb.net/?retryWrites=true&w=majority&appName=first-project').then(() => {
        console.log("connected DB");
    }).catch(err => {
        console.log(err);
    })

