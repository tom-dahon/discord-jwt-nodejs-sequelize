import { setCookie } from '../cookies.js';

const form = document.querySelector("form");
const email = document.querySelector("#email");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const email_error = document.querySelector("#email_error");
const role = document.querySelector("#role");

form.addEventListener("submit", signUp);

async function signUp(e) {
    e.preventDefault();
    const data = { "email": email.value, "username": username.value, "password": password.value, "roleId": role.value };
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
        setCookie('userId', infos.id, 1);
        window.location.replace('../home/index.html');
        } else if(res.status == 422) {
            email.classList.add('border', 'border-danger');
            email.focus();
            email_error.classList.replace('d-none','d-block');
        }
        
}
