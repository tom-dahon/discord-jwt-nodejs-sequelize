const form = document.querySelector("form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const form_error = document.querySelector("#form_error");

form.addEventListener("submit", signIn);

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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

async function signIn(e) {
    e.preventDefault();
    const data = { "username": username.value,"password": password.value };
    var headers = new Headers();
    headers.append("Content-Type","application/json");
    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      };
      
    let res = await fetch('/api/auth/signin',requestOptions)
        .catch(err =>{
          console.log(err);
        });
        if(res.status == 200) {
          let infos = await res.json();
        setCookie('token', infos.accessToken, 1);
        window.location.replace('../home/index.html');
        } else {
          form_error.classList.replace('d-none','d-block');
        }
        
}