import { setLoggedInState } from "../general/general.js";
import { changeTheme } from "../general/general.js";
const BASE_URL = "http://localhost:1337";
setLoggedInState();
changeTheme();

const heroBox = document.querySelector("#heroBox");
const heroText = document.querySelector("#heroText");

const getHeroImg = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/home-page?populate[Theme][populate]=Image`);
    const hero = res.data.data;
    const heroImg = document.createElement("img");
    heroImg.src = `${BASE_URL}${hero.Theme.Image?.url}`;
    heroBox.append(heroImg);

    const heading = document.createElement("h2");
    heading.textContent = `${hero.Theme.Heading}`;
    heroText.append(heading);
    console.log(heading);

    const subHeading = document.createElement("h3");
    subHeading.textContent = `${hero.Theme.Subheading}`;
    heroText.append(subHeading);
    console.log(subHeading);

    
  } catch(error) {
    console.log("Could not get Hero: " + error.message);
  }
};
getHeroImg();


