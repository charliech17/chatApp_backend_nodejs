const { Server } = require("socket.io");
const { setRTDB_Data, getRTDB_Data } = require('./initFirebase')

const userLiet = {}
class initSocketIO{
    constructor(httpServer) {
        const io = new Server(httpServer, { 
            cors: {
                origin: process.env.FRONTEND_DOMIN
            }
        });

        io.on("connection", (socket) => {
            socket.on('hello',async (data)=> {
                console.log('connect success',data)
                io.emit('confirmConnection','嘿嘿' + ' ' + data.name)
            })

            socket.on('JoinRoom',async (data)=> {
                // TODO 存入firebase
                const roomPath = `${process.env.FIREBASE_RTDB_KEY}${Object.values(data)[0].roomPath}`
                const roomInfo = await getRTDB_Data(roomPath)
                userLiet[Object.keys(data)[0]] = Object.values(data)[0]
                if(!roomInfo.userList) {
                    setRTDB_Data(roomPath + '/userList', {...data})
                    io.emit('roomJoinSuccess',{})
                } else {
                    const peerIDList = Object.values(roomInfo.userList).map((item) => item.peerID)
                    console.log(peerIDList,Object.values(roomInfo))
                    io.emit('roomJoinSuccess',peerIDList)
                    const newUserList = {...roomInfo.userList,...data}
                    setRTDB_Data(roomPath + '/userList', newUserList)
                }

                // TODO server告訴client已完成&該房間人數
            })

            socket.on('disconnect', async () => {
                if(userLiet[[socket.id]]) {
                    const keyRoomPath = userLiet[[socket.id]].roomPath
                    const FullroomPath = `${process.env.FIREBASE_RTDB_KEY}${keyRoomPath}/userList/` + socket.id
                    delete userLiet[[socket.id]]
                    console.log('user leave',socket.id,userLiet)
                    setRTDB_Data(FullroomPath, null)
                } else {
                    console.log('user leave 變數不見',socket.id,userLiet)
                }
            })
        })
    }
}

module.exports = initSocketIO