import { BASE_URL } from "../general/api.js";
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
  const token = sessionStorage.getItem("token");
  if (!token) return null;
  try {
    let res = await axios.get(`${BASE_URL}/api/users/me`, {
      "headers": { "Authorization": "bearer " + sessionStorage.getItem("token") }
    });
    if (res.status === 200) {
      const profileLink = profileBtn?.querySelector("a");
      if (profileLink) profileLink.textContent = res.data.username;
      return await res.data.id;
    }
  } catch (error) {
    if (error.response?.status === 401) sessionStorage.removeItem("token");
    showWhenLoggedOut();
  }
  return null;
}

export async function isLoggedIn() {
  return (await getUserId()) !== null;
}

export async function setLoggedInState() {
  if (await isLoggedIn()) {
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
  const themes = ['Default', 'Summer', 'Winter', 'Dark'];
  const applyTheme = (theme) => {
    for (const element of [document.body, header, footer, nav, main]) {
      element?.classList.remove(...themes);
      element?.classList.add(theme);
    }
  };
  applyTheme('Default');
  try {
    const res = await axios.get(`${BASE_URL}/api/site-setting`);
    const theme = res.data.data?.ChangeTheme;
    if (themes.includes(theme)) applyTheme(theme);
  }catch(error) {
    console.log("Could not get theme: " + error.message);
  }
};
