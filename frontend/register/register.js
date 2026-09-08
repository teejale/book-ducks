import { setLoggedInState } from "../general/general.js";
import { changeTheme } from "../general/general.js";
const BASE_URL = "https://book-ducks-api.vercel.app";
setLoggedInState();
changeTheme();

const inputEmail = document.querySelector("#input-email");
const inputPassword = document.querySelector("#input-password");
const inputRepPassword = document.querySelector("#rep-input-password");
const applyForm = document.querySelector("#apply-form");
const inputUserName = document.querySelector("#input-username");
const loginBtn = document.querySelector("#login-btn");

const eye = document.querySelector("#eye");
const eyeSlash = document.querySelector("#eyeSlash");
const eye1 = document.querySelector("#eye1");
const eyeSlash1 = document.querySelector("#eyeSlash1");

const pswdVisibility = () => {
  if (inputPassword.type === "password") {
    inputPassword.type = "text";
    eye.classList.add("hidden");
    eyeSlash.classList.remove("hidden");
  } else {
    inputPassword.type = "password";
    eye.classList.remove("hidden");
    eyeSlash.classList.add("hidden");
  }
};
eye.addEventListener("click", pswdVisibility);
eyeSlash.addEventListener("click", pswdVisibility);

const repVisibility = () => {
  if (inputRepPassword.type === "password") {
    inputRepPassword.type = "text";
    eye1.classList.add("hidden");
    eyeSlash1.classList.remove("hidden");
  } else {
    inputRepPassword.type = "password";
    eye1.classList.remove("hidden");
    eyeSlash1.classList.add("hidden");
  }
};
eye1.addEventListener("click", repVisibility);
eyeSlash1.addEventListener("click", repVisibility);

const login = async (e) => {
  e.preventDefault();
  const user = {
    username: inputUserName.value,
    email: inputEmail.value,
    password: inputPassword.value
  }
  try {
    let res = await axios.post(`${BASE_URL}/api/auth/local/register`, user);
    sessionStorage.setItem("token", res.data.jwt);
    if (res.status === 200 || res.status === 201) {
      console.log("register succeeded");
    }
    window.location.href = "../login/login.html";
  } catch (error) {
    console.log(`Register failed${error.response.data}`);
  }
};
applyForm.addEventListener("submit", login);

