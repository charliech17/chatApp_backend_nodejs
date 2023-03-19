const initMogoDB = require('../utils/initMogoDB')


exports.updateUserOTP = async (req, res, next) => {
    // TODO安全性設定

    // 已經打過otp狀況 -> 確認次數是否超過3次，確認發送時間是否是兩分鐘內
    // TODO userID 從req.body.uid拿
    const userID = 'testID2'
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
        await saveRandomCodeToDB(userID,1)

        res.status(200).json({
            note: 'update Success'
        });
    }
};




// ##################  其他程式  ##################### //




const generateRandomCode = () => {
    // 產生六碼的otpcode
    return Math.floor(Math.random()*1000000)
}


const saveRandomCodeToDB = async (userID,sendTimes) => {
    const insertData = {
        userID,
        otpcode: generateRandomCode(),
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
