const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoined, getCurrentUser, userLeaves, getRoomUsers} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const bot = 'ChatBot';

//set static folder
app.use(express.static(path.join(__dirname, 'public')));


//run when a client connects
io.on('connection', socket=>{
    socket.on('joinRoom',({username,room})=>{
        const user = userJoined(socket.id,username,room);
        socket.join(user.room);
           //Welcome to current user
        socket.emit('message', formatMessage(bot,'Welcome to chatApp!'));
    
        //boradcast when a user connects
        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(bot,`${user.username} has joined the chat!`));
        //Update the side bar of users list
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })
    
    //Listen for chatMessage
    socket.on('chatMessage', (msg)=>{
        const user = getCurrentUser(socket.id);

        socket.emit('message', formatMessage('You',msg));
        socket.broadcast.to(user.room).emit('message', formatMessage(user.username,msg));
    });
    
    //Runs when a client disconnects
    socket.on('disconnect', ()=>{
        const user = userLeaves(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(bot,`${user.username} has left the chat`));
            //Update the side bar of users list
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT,()=>console.log(`Server running on port ${PORT}`));