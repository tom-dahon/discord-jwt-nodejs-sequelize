const form = document.querySelector("form")
const chatMessages = document.querySelector(".chat__messages")
const input = document.querySelector(".sendMessage")

//https://www.taniarascia.com/how-to-connect-to-an-api-with-javascript/

function init() {
  console.log("d");
}

setCookie('username','je suis le premier cookie',1);


if(checkCookie()==null){
  window.location.href = "http://127.0.0.1:5500/Front/signup.html";
}

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
  setCookie('username','',0);
  window.location.href = "http://127.0.0.1:5500/Front/signin.html";
}

form.addEventListener("submit", sendMessage)

function sendMessage(e) {
    e.preventDefault()

    if(input.value !== "") {
        var messageDiv = document.createElement("div")
        messageDiv.className = "message"

        var avatar = document.createElement("img")
        avatar.src = "assets/avatar.png"

        var messageInfo = document.createElement("div")
        messageInfo.className = "message__info"

        var userInfo = document.createElement("h4")
        userInfo.innerHTML = "Gamer"

        var messageTimestamp = document.createElement("span")
        messageTimestamp.className = "message__timestamp"

        const date = new Date()
        const year = date.getFullYear()
        const month = String(date.getMonth()).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")

        messageTimestamp.innerHTML = month + "/" + day + "/" + year

        const message = document.createElement("p")
        message.innerHTML = input.value
        input.value = ""

        userInfo.appendChild(messageTimestamp)
        messageInfo.appendChild(userInfo)
        messageInfo.appendChild(message)

        messageDiv.appendChild(avatar)
        messageDiv.appendChild(messageInfo)

        chatMessages.appendChild(messageDiv)
        chatMessages.scrollBy(0, 10000)
    }
}
