//Créer un messages
import { getCookie, checkCookie, setCookie } from '../cookies.js';
const form = document.querySelector("form")
const chatMessages = document.querySelector(".chat__messages")
const input = document.querySelector(".sendMessage");
const logoutButton = document.querySelector("#logout");
const createChannelButton = document.querySelector("#createChannelButton");
const searchInput = document.querySelector("#searchInput");
const profilePicture = document.querySelector("#profile_picture");
const settingsButton = document.querySelector("#settingsButton");
const avatar = document.querySelector("#avatar");

let userRole = 3;
let usersList;
//Channels
const divSideBarUsers = document.getElementById("sidebarConv")
let id;
let currentChannel;
let userId;
let user;

window.onload=init;


//Recupération la liste des utilisateur du chat
async function getUserList() {
  var headers = new Headers();
  headers.append("x-access-token", getCookie('token'));
  headers.append("Content-Type","application/json");

  var requestOptions = {
      method: 'GET',
      headers: headers,
  };
        
  let res = await fetch("/api/users/list", requestOptions)
    .catch(err =>{
        console.log(err)
    });

    if(res.status == 200) {
      let users = await res.json();
      usersList = users;
    }
}

//Récupération des channels
async function searchChannels() {
  const data = {
    "channelName": searchInput.value,
  };
        
  var headers = new Headers();
  headers.append("x-access-token", getCookie('token'));
  headers.append("Content-Type","application/json");

  var requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
  };
        
  let res = await fetch("/api/channels/search", requestOptions)
    .catch(err =>{
        console.log(err)
    });

  if(res.status == 200) {
    let channels = await res.json();
    
    divSideBarUsers.innerHTML = '';
    channels.forEach(channel => {
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

  });
}
}


//Popup creation de la liste des utilisateurs dans la popup creation de channel
async function fillUsersSelect() {
  let headers = new Headers();
  headers.append("x-access-token", getCookie('token'));
  headers.append("Content-Type","application/json");

  let requestOptions = {
    method: 'GET',
    headers: headers,
  };

  let res = await fetch('/api/users/all/'+userId, requestOptions)
  .catch(err =>{
    console.log(err)
  });
  if(res.status == 200) {
    let users = await res.json();
    users.forEach(user => {
      //Ajouter une option dans le select pour chaque user
      let userOption = document.createElement("option");
      userOption.id = user.id;
      userOption.innerHTML = user.username;
      document.querySelector("#valid-was-validated-multiple-field").appendChild(userOption);
    });
  }
  
}

/*async function getRoleName(roleId) {
  let headers = new Headers();
  headers.append("x-access-token", getCookie('token'));
  headers.append("Content-Type","application/json");
  const data = {
    "roleId": roleId,
  };
  let requestOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  };

  let res = await fetch('/api/role', requestOptions)
  .catch(err =>{
    console.log(err)
  });

  if(res.status == 200) {
    let role = await res.json();
    return role;
  }
}*/

async function getFirstChannel(username) {
  const data = {
    "username": username,
  };
        
  var headers = new Headers();
  headers.append("x-access-token", getCookie('token'));
  headers.append("Content-Type","application/json");

  var requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
  };
        
  let res = await fetch("/api/channels/first", requestOptions)
    .catch(err =>{
        console.log(err)
    });

  if(res.status == 200) {
    let channel = await res.json();
    currentChannel = channel;
}
}

//Initialisation de la page
async function init() {
  usersList = getUserList();
  const roles = {1: "Admin", 2: "Modérateur", 3: "Invité"}
  getChannels();
  fillUsersSelect();
  userId = getCookie('userId');
  const username = document.getElementById("currentUsername");
  const userTag = document.getElementById("userTag");
  user = await getUser(userId);
  (function my_func() {
    getMessage(currentChannel)
    setTimeout( my_func, 200 );
})();
  //setInterval(getMessage(currentChannel), 5000);
  let roleName = roles[user.roleId];
  userRole = roleName;
  username.innerText = user.username;
  userTag.innerText = "#" + user.id;
  //avatar.src = user.profile_picture;

  
}

async function sendProfilePicture() {
  let headers = new Headers();
  headers.append("x-access-token", getCookie('token'));
  headers.append("Content-Type","application/json");

  
  console.log(profilePicture.files[0].path);

  avatar.src = user.profile_picture;
  const data = {
    "profile_picture_path": path,
    "userId": userId,
  };

  let requestOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  };

  let res = await fetch('/api/users/profile_picture', requestOptions)
  .catch(err =>{
    console.log(err)
  });
  if(res.status == 200) {
    
  }
}

addProfilePicture.addEventListener("click", sendProfilePicture)

searchInput.addEventListener("input", searchChannels);

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
        
  const headers = new Headers();
  headers.append("x-access-token", getCookie('token'));
  headers.append("Content-Type","application/json");

  const requestOptions = {
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
 /*usersList.selectedIndex = 0;
  while(usersList.firstElementChild) {
    usersList.firstElementChild.remove();
 }*/
 
 groupName.value = "";
 fillUsersSelect();
}

//Envoyer un message en récupérant le input
async function sendMessage(e) {
    e.preventDefault();

    if(input.value !== "") {
        //Enregistrement du message au niveau du backend
        let url='/api/channels/'+id+'/sendMessage';
        const data = { "text": input.value,"userId": userId };
        
        const myHeaders = new Headers();
        myHeaders.append("x-access-token", getCookie('token'));
        myHeaders.append("Content-Type","application/json");

        const requestOptions = {
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


//Popup select bootstrap
$( '#valid-was-validated-single-field' ).select2( {
  theme: "bootstrap-5",
  width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
  placeholder: $( this ).data( 'placeholder' ),
  allowClear: true
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
  if(channel) {
  id = channel.id;
  currentChannel = channel;
  document.getElementById('channelName').innerText = channel.name
  let url= '/api/channels/'+channel.id+'/messages'
  let myHeaders = new Headers();
  myHeaders.append("x-access-token", getCookie('token'));
  myHeaders.append("Content-Type","application/json");

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  let res = await fetch(url, requestOptions)
  .catch(err =>{
    console.log(err)
    dispatch(loginFailed())
  });

  let data = await res.json();
  //enlever tous les messages
  document.querySelectorAll(".message").forEach(el => el.remove());

 if (data != null){
  data.forEach(async obj => {
    
    let user = usersList[(obj.userId) - 1];
    let messageDiv = document.createElement("div")
    messageDiv.className = "message"

    let avatar = document.createElement("img")
    avatar.src = "../assets/avatar.png"

    let messageInfo = document.createElement("div")
    messageInfo.className = "message__info"

    let userInfo = document.createElement("h4")
    userInfo.innerHTML = user.username + " [" + userRole + "]"

    let messageTimestamp = document.createElement("span")
    messageTimestamp.className = "message__timestamp"
    
    const date = new Date(obj.createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() +1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    messageTimestamp.innerHTML = day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;

    const message = document.createElement("p")
    message.textContent = obj.text

    userInfo.appendChild(messageTimestamp)
    messageInfo.appendChild(userInfo)
    messageInfo.appendChild(message)

    messageDiv.appendChild(avatar)
    messageDiv.appendChild(messageInfo)

    chatMessages.appendChild(messageDiv)
    chatMessages.scrollBy(0, 10000)

  });
 }
}
}

//Récupération de l'utilisateur par son id pour l'utiliser
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
