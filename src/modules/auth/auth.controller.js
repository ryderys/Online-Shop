const { UserModel } = require("../user/user.model");
const {randomInt} = require("crypto")
const httpError = require("http-errors")
const jwt = require("jsonwebtoken")
const {StatusCodes} = require("http-status-codes");
const CookieNames = require("../../common/constants/cookie.enum");
const NodeEnv = require("../../common/constants/env.enum");
const autoBind = require("auto-bind");
const { getOtpSchema, checkOtpSchema } = require("../../common/validations/auth.validation");
const CartModel = require("../cart/cart.model");
const { savedItemsModel } = require("../savedItems/savedItem.model");

class UserAuthController {
    constructor(){
        autoBind(this)
    }
async getOTP(req, res, next){
    
    try {
        await getOtpSchema.validateAsync(req.body)

        const {mobile} = req.body;
        if(!mobile){
            throw new httpError.BadRequest("شماره موبایل ضروری است")
        }
        
        const user = await UserModel.findOne({mobile})
        const now = new Date().getTime()
        const otp = {
            code: randomInt(10000, 99999),
            expiresIn: now + 1000 * 60 * 3
        }

        if(!user){
            const newUser = await UserModel.create({mobile, otp})
            //creating an empty cart and saved items list for the new user
            const cart = new CartModel({userId: newUser._id, items: []})
            const savedItems = new savedItemsModel({userId: newUser._id, items: []})
            //save the cart and saved items
            await cart.save()
            await savedItems.save()
            // linking the cart and saved items to the new user

            newUser.cart = cart._id
            newUser.savedItems = savedItems._id;
            //saving the new user
            await newUser.save()
            
            return res.status(StatusCodes.CREATED).json({
                message: "کد تایید برای شما ارسال شد",
                data: newUser
            })
            
        }
        if(user.otp && user.otp.expiresIn > now){
            throw new httpError.BadRequest("کد شما هنوز منقضی نشده")
        }
        
        user.otp = otp
        await user.save()

        return res.status(StatusCodes.OK).json({
            message: "کد ارسال شد",
            data: {
                user
            }
        })
    } catch (error) {
        next(error)
    }
}

async checkOTP(req, res, next ){
    try {
        await checkOtpSchema.validateAsync(req.body)
        const {mobile, code} = req.body;
        if(!mobile || !code){
            throw new httpError.BadRequest("شماره موبایل و کد ضروری است")
        }
        const user = await UserModel.findOne({mobile})
        if(!user){
            throw new httpError.NotFound("کاربری با این شماره موبایل وجود ندارد")
        }
        const now = new Date().getTime()
        if( user?.otp?.expiresIn < now) throw new httpError.Unauthorized( "کد شما منقضی شده")
        if( user?.otp?.code !== code ) throw new httpError.Unauthorized( "کد وارد شده اشتباه است")
        if(!user.verifiedMobile){
            user.verifiedMobile = true
        }
        const accessToken = await this.signToken({mobile, id: user._id})
        user.accessToken = accessToken
        await user.save()
        return res.cookie(CookieNames.AccessToken, accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === NodeEnv.Production
        }).status(StatusCodes.OK).json({
            message: "با موفقیت وارد حساب کاربری خود شدید"
        })
    } catch (error) {
      next(error)  
    }
}

async logout(req, res, next){
    try {
        return res.clearCookie(CookieNames.AccessToken).status(StatusCodes.OK).json({
            message: "با موفقیت خارج شدید"
        })
    } catch (error) {
        next(error)
    }
}



async signToken(payload){
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '4d' });
}
}

module.exports = {
    UserAuthController: new UserAuthController()
}