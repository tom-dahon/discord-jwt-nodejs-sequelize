//Créer un messages
import { getCookie, checkCookie, setCookie } from '../cookies.js';
const form = document.querySelector("form")
const chatMessages = document.querySelector(".chat__messages")
const input = document.querySelector(".sendMessage");
const logoutButton = document.querySelector("#logout");
const createChannelButton = document.querySelector("#createChannelButton");

//Channels
const divSideBarUsers = document.getElementById("sidebarConv")
let id;
let currentChannel;
let userId;


//https://www.taniarascia.com/how-to-connect-to-an-api-with-javascript/
window.onload=init;


async function getUsers() {
  var headers = new Headers();
  headers.append("x-access-token", getCookie('token'));
  headers.append("Content-Type","application/json");

  var requestOptions = {
    method: 'GET',
    headers: headers,
  };

  let res = await fetch('/api/users/all/'+userId, requestOptions)
  .catch(err =>{
    console.log(err)
  });
  if(res.status == 200) {
    let users = await res.json();
    return users;
  }
  
}

async function init() {
  getChannels();
  userId = getCookie('userId');
  let users = await getUsers();
  console.log(users);
  users.forEach(user => {
    //Ajouter une option dans le select pour chaque user
    let userOption = document.createElement("option");
    userOption.id = user.id;
    userOption.innerHTML = user.username;
    document.querySelector("#valid-was-validated-multiple-field").appendChild(userOption);
  });

  console.log(users);
}

// if(checkCookie()==null){
//   window.location.href = "http://127.0.0.1:5500/Front/signup.html";
// }

logoutButton.addEventListener("click", logout)

function logout()
{
  setCookie('token','',-1);
  setCookie('userId', '', -1);
  window.location.href = "/Front/signin/signin.html";
}

form.addEventListener("submit", sendMessage)
createChannelButton.addEventListener("click", createChannel);

function getSelectValues(select) {
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(parseInt(opt.id));
    }
  }
  return result;
}

async function createChannel(e) {
  e.preventDefault();
  let groupName = document.querySelector("#groupName");
  let usersList = document.querySelector("#valid-was-validated-multiple-field");
  console.log(getSelectValues(usersList));
  const data = {
    "name": groupName.value,
    "users": getSelectValues(usersList),
    "loggedUserId": userId
  };
        
  var headers = new Headers();
  headers.append("x-access-token", getCookie('token'));
  headers.append("Content-Type","application/json");

  var requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
  };
        
  let res = await fetch("/api/channels/createChannel", requestOptions)
    .catch(err =>{
        console.log(err)
    });

  if(res.status == 200) {
    getChannels();
  }
  document
}

async function sendMessage(e) {
    e.preventDefault();

    if(input.value !== "") {
        //Enregistrement du message au niveau du backend
        var url='/api/channels/'+id+'/sendMessage';
        const data = { "text": input.value,"userId": userId };
        
        var myHeaders = new Headers();
        myHeaders.append("x-access-token", getCookie('token'));
        myHeaders.append("Content-Type","application/json");

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(data),
        };
        
        let res = await fetch(url,requestOptions)
        .catch(err =>{
          console.log(err)
           dispatch(loginFailed())
        });
        input.value = ""

        if (res.ok)
        {
          getMessage(currentChannel);
        }
    }
}


$( '#valid-was-validated-single-field' ).select2( {
  theme: "bootstrap-5",
  width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
  placeholder: $( this ).data( 'placeholder' ),
} );

$( '#valid-was-validated-multiple-field' ).select2( {
  theme: "bootstrap-5",
  width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
  placeholder: $( this ).data( 'placeholder' ),
  closeOnSelect: false,
} );

$(document).ready(function() {

  $("#valid-was-validated-multiple-field").on("change", function() {
    $(this).find("option:selected").each(function() {
      console.log(this.text);
    });
  })

});

//CREATION DE LA LISTE DES CHANNELS
async function getChannels(){
var myHeaders = new Headers();
myHeaders.append("x-access-token", getCookie('token'));
myHeaders.append("Content-Type","application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
};

let res = await fetch("/api/channels", requestOptions)
.catch(err =>{
  console.log(err)
   dispatch(loginFailed())
});

var data = await res.json();

data.forEach(channel => {
      console.log(`${channel.createdAt}`);

      const divConv = document.createElement('div')
      divConv.id = 'channel'+channel.id; // L'id de chaque div de channel sera channel{id}
      divConv.addEventListener('click', () => getMessage(channel))

      divConv.setAttribute('class','sidebar__user')
      const div = document.createElement('div')
      const span = document.createElement('span')
      span.setAttribute('class','status')
      const logo = document.createElement('img')
      logo.src = '../assets/avatar.png'
      logo.alt = 'avatar'
      logo.style.pointerEvents= 'none';
      const h4= document.createElement('h4')
      h4.textContent= channel.name
      h4.style.pointerEvents= 'none';
      const p = document.createElement('p')
      p.setAttribute('id','id')
      p.innerText= channel.id
      p.hidden = true;
      
      div.appendChild(span)
      div.appendChild(logo)
      divConv.appendChild(div)
      divConv.appendChild(h4)
      divConv.appendChild(p)
      divSideBarUsers.appendChild(divConv)
})}

//RECUPERATION DES MESSAGES POUR UNE CONVERSTION DONNEE
async function getMessage(channel){
  id = channel.id;
  currentChannel = channel;
  document.getElementById('channelName').innerText = channel.name
  var url= '/api/channels/'+channel.id+'/messages'
  var myHeaders = new Headers();
  myHeaders.append("x-access-token", getCookie('token'));
  myHeaders.append("Content-Type","application/json");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  let res = await fetch(url, requestOptions)
  .catch(err =>{
    console.log(err)
    dispatch(loginFailed())
  });

  var data = await res.json();
  //enlever tous les messages
  document.querySelectorAll(".message").forEach(el => el.remove());

 if (data != null){
  data.forEach(async obj => {
    
    let user = await getUser(obj.userId);
    var messageDiv = document.createElement("div")
    messageDiv.className = "message"

    var avatar = document.createElement("img")
    avatar.src = "../assets/avatar.png"

    var messageInfo = document.createElement("div")
    messageInfo.className = "message__info"

    var userInfo = document.createElement("h4")
    userInfo.innerHTML = user.username

    var messageTimestamp = document.createElement("span")
    messageTimestamp.className = "message__timestamp"

    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth()).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    messageTimestamp.innerHTML = obj.createdAt

    const message = document.createElement("p")
    message.textContent = obj.text

    userInfo.appendChild(messageTimestamp)
    messageInfo.appendChild(userInfo)
    messageInfo.appendChild(message)

    messageDiv.appendChild(avatar)
    messageDiv.appendChild(messageInfo)

    chatMessages.appendChild(messageDiv)
    chatMessages.scrollBy(0, 10000)

  })
 }
}

async function getUser(userId) {
  var headers = new Headers();
  headers.append("x-access-token", getCookie('token'));
  headers.append("Content-Type","application/json");

  var requestOptions = {
    method: 'GET',
    headers: headers,
  };

  let res = await fetch('/api/message/sender/'+userId, requestOptions)
  .catch(err =>{
    console.log(err)
  });
  if(res.status == 200) {
    let user = await res.json();
    return user;
  }
  
}
