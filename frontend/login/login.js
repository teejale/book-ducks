import { setLoggedInState } from "../general/general.js";
import { changeTheme } from "../general/general.js";
const BASE_URL = "http://localhost:1337";
setLoggedInState();
changeTheme();


const inputEmail = document.querySelector("#input-email");
const inputPassword = document.querySelector("#input-password");
const applyForm = document.querySelector("#apply-form");
const loginBtn = document.querySelector("#login-btn");

/*password visibility here, also use 
<i class="fa-solid fa-eye-slash"></i> */

/* check if password and repeat password are the same */

function logInUser() {
  if (sessionStorage.getItem("token")) {

    window.location.href = "../profile/profile.html";

  }
}

const login = async (e) => {
  e.preventDefault();

  const user = {
    identifier: inputEmail.value,
    password: inputPassword.value
  }

  try {
    let res = await axios.post(`${BASE_URL}/api/auth/local`, user);
    sessionStorage.setItem("token", res.data.jwt);

    if (res.status === 200) {
      console.log("login succeeded");
      logInUser();
      window.location.href="../profile/profile.html";
    }


  } catch (error) {
    console.log(error.response);
  }

};

applyForm.addEventListener("submit", login);

