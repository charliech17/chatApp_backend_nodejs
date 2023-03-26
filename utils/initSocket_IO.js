const { Server } = require("socket.io");


class initSocketIO{
    constructor(httpServer) {
        const io = new Server(httpServer, { 
            cors: {
                origin: process.env.FRONTEND_DOMIN
            }
        });

        io.on("connection", (socket) => {
            io.emit('userConnection',)
            socket.on('hello',(data)=> {
                console.log('connect success',data)
                io.emit('confirmConnection','嘿嘿' + ' ' + data.name)
            })

            socket.on('JoinRoom',(data)=> {
                socket.join(data.roomPath)
                io.emit('roomJoinSuccess','成功加入房間' + data.roomPath)
            })

            socket.on('disconnect', () => {
                console.log('user disconnect',socket.id)
            })
        })
    }
}

module.exports = initSocketIO