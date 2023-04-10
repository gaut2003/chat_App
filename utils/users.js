const users = [];

//join user to chat
function userJoined(id,username,room){
    const user = {id,username,room};
    users.push(user);
    return user;
}

//Function to get the current user
function getCurrentUser(id){
    return users.find(user=>user.id == id);
}

//user leaves chat
function userLeaves(id){
    const index = users.findIndex(user=>user.id == id);
    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

//Get room users
function getRoomUsers(room){
    return users.filter(users=>users.room == room);
}

module.exports = {
    userJoined, 
    getCurrentUser,
    getRoomUsers,
    userLeaves
};