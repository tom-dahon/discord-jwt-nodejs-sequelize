import { setCookie } from '../cookies.js';

const form = document.querySelector("form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const form_error = document.querySelector("#form_error");

form.addEventListener("submit", signIn);


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
        setCookie('userId', infos.id, 1);
        window.location.replace('../home/index.html');
        } else {
          form_error.classList.replace('d-none','d-block');
        }
        
}