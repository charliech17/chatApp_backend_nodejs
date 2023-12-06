const initMogoDB = require('../utils/initMogoDB')
const { sendEmail } = require('../utils/email')
const path = require("path")


exports.updateUserOTP = async (req, res, next) => {
    // TODO安全性設定

    // 已經打過otp狀況 -> 確認次數是否超過3次，確認發送時間是否是兩分鐘內
    // TODO userID 從req.body.uid拿
    const userID = 'testID12334'
    const userData =  await checkIsUser(userID)
    console.log(userID,' userData ',userData)
    // - 非首次驗證碼
    if(userData) {
        const sendTimes = userData.sendTimes
        const expiredTime = new Date(userData.expired)
        const canSendNextTime = new Date() >= expiredTime
        const isExccedTenMinute = (new Date() - expiredTime >= 600000)

        // -- 判斷離上次發送時間有否超過兩分鐘
        if(!canSendNextTime) {
            res.status(200).json({
                note: '離上次發送時間還未超過兩分鐘'
            });
            return
        } 

        // -- 判斷發送次數是否超過三次
        // -- 發送次數超過三次
        if(sendTimes >= 3) {
            // --- 超過三次且小於十分鐘
            if(!isExccedTenMinute) {
                res.status(200).json({
                    note: '已超過驗證碼上限，請稍後再試'
                });
                return
            } 
            // --- 超過三次且大於十分鐘
            else {
                // TODO發信給使用者
                await updateRandomCode(userID,1)
                res.status(200).json({
                    note: '已成功更新'
                });
                return 
            }
        } 
        // -- 發送次數未超過三次
        else {
            // TODO發信給使用者
            await updateRandomCode(userID,Number(sendTimes)+1)
            res.status(200).json({
                note: '已成功更新'
            });
            return 
        }
    } 
    // - 首次驗證碼
    else {
        // 狀況成功 -> 產生六碼隨機數字，存到db中，
        // TODO發信給使用者
        const otpCode = generateRandomCode()
        await saveRandomCodeToDB(userID,1,otpCode)

        const emailInfo = {
            reciver: 'test@gmail.com',
            subject: '登入chatApp的otp碼',
            innerTxt: `您登入chatApp的otp碼為：  ${otpCode}`,
            attachments: [{
                filename: 'index-logo.jpg',
                path: path.join(__dirname, "../static/mailImg/dlimg.jpg"),
                cid: 'dlimg'
            }],
            html: `
            <main style='display:flex;justify-content: center;'>
                <div>您登入chatApp的otp碼為：  ${otpCode}</div>
                <img style="margin-top: 20px;" src="cid:dlimg"/>
            </main>`
        }
        await sendEmail(emailInfo)

        res.status(200).json({
            note: '已發信給使用者'
        });
    }
};




// ##################  其他程式  ##################### //




const generateRandomCode = () => {
    // 產生六碼的otpcode
    return Math.floor(Math.random()*1000000)
}


const saveRandomCodeToDB = async (userID,sendTimes,otpCode) => {
    const insertData = {
        userID,
        otpcode: otpCode,
        expired: new Date(new Date().getTime() + 120000),  // 120000秒為兩分鐘
        sendTimes
    }
    const mogoInstance = new initMogoDB()
    return mogoInstance.insertOneData('chatRoom_activeRecord','otpCode', insertData)
}


const updateRandomCode = async (userID,sendTimes) => {
    const findData = {userID}
    const updateData = {
        userID,
        otpcode: generateRandomCode(),
        expired: new Date(new Date().getTime() + 120000),  // 120000秒為兩分鐘
        sendTimes
    }
    const mogoInstance = new initMogoDB()
    return mogoInstance.updateOne('chatRoom_activeRecord','otpCode',findData ,updateData)
}


const checkIsUser = (userID) => {
    const findData = {userID}
    const mogoInstance = new initMogoDB()
    return mogoInstance.findOneData('chatRoom_activeRecord','otpCode',findData)
}
