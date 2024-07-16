const { UserModel } = require("../user/user.model");
const {randomInt} = require("crypto")
const httpError = require("http-errors")
const jwt = require("jsonwebtoken")
const {StatusCodes} = require("http-status-codes");
const CookieNames = require("../../common/constants/cookie.enum");
const NodeEnv = require("../../common/constants/env.enum");

class UserAuthController {
async getOTP(req, res, next){
    try {
        const {mobile} = req.body;
        const user = await UserModel.findOne({mobile})
        const now = new Date().getTime()
        const otp = {
            code: randomInt(10000, 99999),
            expiresIn: now + (1000 * 60 * 2)
        }
        if(!user){
            const newUser = await UserModel.create({mobile, otp})
            return newUser
        }
        if(user.otp && user.otp.expiresIn > now){
            throw new error(httpError.BadRequest("کد شما هنوز منقضی نشده"))
        }
        user.otp = otp
        await user.save()
        return res.status(StatusCodes.OK).json({
            message: "کد ارسال شد"
        })
    } catch (error) {
        next(error)
    }
}

async checkOTP(req, res, next, ){
    try {
        const {mobile, code} = req.body;
        const user = await this.checkExistByMobile(mobile)
        const now = new Date().getTime()
        if( user?.otp?.expiresIn < now) throw new httpError.Unauthorized( "کد شما منقضی شده")
        if( user?.otp?.code !== code ) throw new httpError.Unauthorized( "کد وارد شده اشتباه است")
        if(!user.verifiedMobile){
            user.verifiedMobile = true
        }
        const accessToken = this.signToken({mobile, id: user._id})
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

async checkExistByMobile(mobile){
    const user = await UserModel.findOne({mobile})
    if(!user){
        throw new error(httpError.NotFound("کاربری با این شماره موبایل وجود ندارد"))
    }
        return user
    }

signToken(payload){
    return jwt.sign(payload, "secret_key", {expiresIn: '4d'})
}
}

module.exports = {
    UserAuthController: new UserAuthController()
}