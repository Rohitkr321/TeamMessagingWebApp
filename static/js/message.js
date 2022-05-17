const socket = io("http://localhost:3000");
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message_area')



let data;
let userInformation;
let postIdFormessage = [];
let request = new XMLHttpRequest();
request.open("get", `/userdetails`)
request.send();
request.addEventListener("load", () => {
    userInformation = JSON.parse(request.responseText)
    console.log(userInformation.userdata)
    data = userInformation.userdata;
    postIdFormessage.push(userInformation.postIdFormessages);
})

socket.on('returnmessage', (msg) => {
    for (let i = 0; i < msg.length; i++) {
        if (JSON.parse(msg[i].postId)[0] === postIdFormessage[0]) {
            if(userInformation.userdata === msg[i].username)
            appendMessage(msg[i], 'outgoing')
            else
            appendMessage(msg[i], 'incoming')
        }
        else{
            console.log("glt kiaa tum")
        }
    }

})

var time;
textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        var today = new Date();
        time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        sendMessage(e.target.value);
    }
})



function sendMessage(message) {
    let msg = {
        username: data,
        message: message.trim(),
        time: time,
        postIdFormessages: postIdFormessage,
        type:'incoming' ,
    }
    appendMessage(msg, 'outgoing')
    textarea.value = ""
    //send to server
    socket.emit('message', msg)
}
function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')

    let className = type;

    mainDiv.classList.add(className, 'message')


    let markup = `
    <p class="text-red">${msg.username}</p> 
    <p>${msg.message}</p>
    <p style="margin-left:195px;font-size:12px;"class="text-white">${msg.time}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv);
}

//listen from server.
socket.on('message', (msg) => {
    console.log("hello haa bolo")
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}

