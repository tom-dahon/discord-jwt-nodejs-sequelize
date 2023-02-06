import { setCookie } from '../cookies.js';

const form = document.querySelector("form");
const email = document.querySelector("#username");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const form_error = document.querySelector("#form_error");

form.addEventListener("submit", signUp);

async function signUp(e) {
    e.preventDefault();
    const data = { "email": email.value, "username": username.value, "password": password.value };
    var headers = new Headers();
    headers.append("Content-Type","application/json");
    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      };
      
    let res = await fetch('/api/auth/signup',requestOptions)
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