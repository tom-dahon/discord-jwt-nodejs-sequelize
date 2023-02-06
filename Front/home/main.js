//Créer un messages
const form = document.querySelector("form")
const chatMessages = document.querySelector(".chat__messages")
const input = document.querySelector(".sendMessage")

//Channels
const divSideBarUsers = document.getElementById("sidebarConv")
var id;


//https://www.taniarascia.com/how-to-connect-to-an-api-with-javascript/
window.onload=init;

function init() {
  setCookie('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvbSIsImlhdCI6MTY3NTY3NzMzMSwiZXhwIjoxNjc1NzYzNzMxfQ.bNWo9-SJebu1yTii6AYhLs6qqXMQGblAwrWvr58x7lw',1);
  getChannels();
}

// if(checkCookie()==null){
//   window.location.href = "http://127.0.0.1:5500/Front/signup.html";
// }

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function checkCookie() {
  let username = getCookie("username");
  if (username != "") {
   return(username);
  } else {
    if (username != "" && username != null) {
      //setCookie("username", username, 365);
      return null;
    }
  }
}

function logout()
{
  setCookie('token','',0);
  window.location.href = "/Front/signin/signin.html";
}

form.addEventListener("submit", sendMessage)

async function sendMessage(e) {
    e.preventDefault()

    if(input.value !== "") {
        // var messageDiv = document.createElement("div")
        // messageDiv.className = "message"

        // var avatar = document.createElement("img")
        // avatar.src = "../assets/avatar.png"

        // var messageInfo = document.createElement("div")
        // messageInfo.className = "message__info"

        // var userInfo = document.createElement("h4")
        // userInfo.innerHTML = "Gamer"

        // var messageTimestamp = document.createElement("span")
        // messageTimestamp.className = "message__timestamp"

        // const date = new Date()
        // const year = date.getFullYear()
        // const month = String(date.getMonth()).padStart(2, "0")
        // const day = String(date.getDate()).padStart(2, "0")

        // messageTimestamp.innerHTML = month + "/" + day + "/" + year

        // const message = document.createElement("p")
        // message.innerHTML = input.value
        // input.value = ""

        // userInfo.appendChild(messageTimestamp)
        // messageInfo.appendChild(userInfo)
        // messageInfo.appendChild(message)

        // messageDiv.appendChild(avatar)
        // messageDiv.appendChild(messageInfo)

        // chatMessages.appendChild(messageDiv)
        // chatMessages.scrollBy(0, 10000)

        //enregistrement du message au niveau du backend
        var url='/api/channels/'+id+'/sendMessage';
        const data = { "text": input.value,"userId": id };
        
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
          getMessage(id);
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

let res = await fetch("http://localhost:8080/api/channels", requestOptions)
.catch(err =>{
  console.log(err)
   dispatch(loginFailed())
});

var data = await res.json();
var data2= Object.entries(data)

data.forEach(obj => {
      console.log(`${obj.createdAt}`);

      const divConv = document.createElement('div')
      divConv.setAttribute('class','sidebar__user')
      divConv.onclick=getMessage;
      const div = document.createElement('div')
      const span = document.createElement('span')
      span.setAttribute('class','status')
      const logo = document.createElement('img')
      logo.src = '../assets/avatar.png'
      logo.alt = 'avatar'
      logo.style.pointerEvents= 'none';
      const h4= document.createElement('h4')
      h4.textContent= obj.name
      h4.style.pointerEvents= 'none';
      const p = document.createElement('p')
      p.setAttribute('id','id')
      p.innerText= obj.id
      p.hidden = true;
      
      div.appendChild(span)
      div.appendChild(logo)
      divConv.appendChild(div)
      divConv.appendChild(h4)
      divConv.appendChild(p)
      divSideBarUsers.appendChild(divConv)
})}

//RECUPERATION DES MESSAGES POUR UNE CONVERSTION DONNEE
async function getMessage(event){
  console.log(event)
  if(isNaN(event) == true)
  {
    id = event.target.querySelector('p').innerHTML;
  }
  console.log(typeof(id))
  var url= 'http://localhost:8080/api/channels/'+id+'/messages'
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
  var data2= Object.entries(data)

  //enlever tous les messages
  document.querySelectorAll(".message").forEach(el => el.remove());

 if (data != null){
  data.forEach(obj => {
    console.log(`${obj.createdAt}`);

    var messageDiv = document.createElement("div")
    messageDiv.className = "message"

    var avatar = document.createElement("img")
    avatar.src = "../assets/avatar.png"

    var messageInfo = document.createElement("div")
    messageInfo.className = "message__info"

    var userInfo = document.createElement("h4")
    userInfo.innerHTML = obj.userId

    var messageTimestamp = document.createElement("span")
    messageTimestamp.className = "message__timestamp"

    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth()).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    messageTimestamp.innerHTML = obj.updatedAt

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
