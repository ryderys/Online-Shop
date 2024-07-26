const autoBind = require("auto-bind");

class UserController{
    constructor(){
        autoBind(this)
    }
    async getUserProfile(req, res, next){
        try {
            
        } catch (error) {
            next(error)
        }
    }
    async updateUserProfile(req, res, next){
        try {
            
        } catch (error) {
            next(error)
        }
    }
    async getAllUsers(req, res, next){
        try {
            
        } catch (error) {
            next(error)
        }
    }
}