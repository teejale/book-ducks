const BASE_URL = "https://book-ducks-api.vercel.app";
const logOutBtn = document.querySelector("#logout");
const logInBtn = document.querySelector("#logInBtn");
const profileBtn = document.querySelector("#profileBtn");

profileBtn?.addEventListener("click", () => {
  window.location.href = "../profile/profile.html"
});

logOutBtn?.addEventListener("click", () => {
  sessionStorage.removeItem("token")
  alert("You logged out");
  window.location.href = "../login/login.html";
})

const showWhenLoggedIn = () => {
  console.log("Showing state when logged in");
  logInBtn?.classList.add("hidden");
  logOutBtn?.classList.remove("hidden");
  profileBtn?.classList.remove("hidden");
};

const showWhenLoggedOut = () => {
  console.log("Showing state when logged out");
  logInBtn?.classList.remove("hidden");
  logOutBtn?.classList.add("hidden");
  profileBtn?.classList.add("hidden");
};

export const getUserId = async () => {
  try {
    let res = await axios.get(`${BASE_URL}/api/users/me`, {
      "headers": { "Authorization": "bearer " + sessionStorage.getItem("token") }
    });
    if (res.status === 200) {
      profileBtn.innerHTML = `<i class="fa-solid fa-circle-user"></i> ${res.data.username}`;
      return await res.data.id;
    }
  } catch (error) {
    console.log(error.response);
    showWhenLoggedIn();
  }
  return null;
}

export function isLoggedIn() {
  console.log("Checking if logged in");
  const token = sessionStorage.getItem("token");
  if (token !== null) {
    console.log("we have token: " + token)
    console.log("user is logged in");
    if (getUserId() !== null) {
      return true;
    }
  }
  else {
    if (sessionStorage.getItem("token")) {
      console.log(getUserId());
      // läs av token och se om den är expired
      // gör en request som på /me/user, om den returnerar något annat än 200 ok så betyder det att din token inte är valid
      // då kan du ta bort från sessionStorage och skicka ut en alert
      // sessionStorage.removeItem("token");
      // alert("You logged out during inactivity");
      // logOutBtns();
    }
    return false;
  }
}

export function setLoggedInState() {
  if (isLoggedIn()) {
    showWhenLoggedIn();
  } else {
    showWhenLoggedOut();
  }
}

const header = document.querySelector("header");
const nav = document.querySelector("nav");
const footer = document.querySelector("footer");
const main = document.querySelector("main");

export const changeTheme = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/site-setting`);
    const theme = res.data.data.ChangeTheme; 
    console.log(theme);
    document.body.classList.add(theme);
    header.classList.add(theme);
    footer.classList.add(theme);
    nav.classList.add(theme);
    main.classList.add(theme);
  }catch(error) {
    console.log("Could not get theme: " + error.message);
  }
};
