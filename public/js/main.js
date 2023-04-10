const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Getting username and room from the URL
const {username,room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
// console.log({username,room});

const socket = io();

socket.emit('joinRoom',{username,room});

//Get room and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
});


//Message from server
socket.on('message', txt => {
    console.log(txt);
    outputMessage(txt);
    //scroll down everytime a message is displayed
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    //Emit a message to the sever
    socket.emit('chatMessage', msg);
    //clear the input of form
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});


//Output message to DOM
function outputMessage(txt){
    const div  = document.createElement('div');
    if(txt.username == 'You') div.classList.add('message1');
    else if(txt.username == 'ChatBot') div.classList.add('message2');
    else div.classList.add('message3');
    div.innerHTML = `<p class="meta">${txt.username} <span>${txt.time}</span></p>
    <p class="text">
        ${txt.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//Add users to the DOM
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}