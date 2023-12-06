const initMogoDB = require('../utils/initMogoDB')
const { responseCode } = require("../utils/resMap")

exports.confirmOTP = async (req, res, next) => { 
    const {userOTP , uid } = req.body
    if(!userOTP || !uid) {
        return res.status(400).json({
            note: 'req資料有誤',
            code: responseCode.reqErr
        });
    }

    const userInfo = await checkIsUser(uid)
    if(!userInfo) {
        return res.status(404).json({
            note: '該帳號尚未進行otp',
            code: responseCode.reqNotFound
        });
    } else {
        console.log(userInfo)
        console.log(userInfo.otpcode)
        if(userInfo.otpcode == userOTP) {
            const isExpire = new Date() > new Date(userInfo.expired)
            if(isExpire) {
                res.status(200).json({
                    note: '驗證碼過期',
                    code: responseCode.otpExpire
                });
            } else{
                res.status(200).json({
                    note: '成功驗證',
                    code: responseCode.success
                });
            }
            deleteOTP(uid)
            return
        } else {
            return res.status(200).json({
                note: '驗證失敗',
                code: responseCode.otpfail
            });
        }
    }
}

const checkIsUser = (userID) => {
    const findData = {userID}
    const mogoInstance = new initMogoDB()
    return mogoInstance.findOneData('chatRoom_activeRecord','otpCode',findData)
}

const deleteOTP = (userID) => {
    const deleteData = {userID}
    const mogoInstance = new initMogoDB()
    return mogoInstance.deleteOne('chatRoom_activeRecord','otpCode',deleteData)
}