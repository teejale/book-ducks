import { setLoggedInState } from "../general/general.js";
import { changeTheme } from "../general/general.js";
import { BASE_URL, mediaUrl } from "../general/api.js";
setLoggedInState();
changeTheme();

const heroBox = document.querySelector("#heroBox");
const heroText = document.querySelector("#heroText");

const getHeroImg = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/home-page?populate[Theme][populate]=Image`);
    const hero = res.data.data;
    const heroImg = document.createElement("img");
    heroImg.src = mediaUrl(hero.Theme.Image?.url);
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
    const message = document.createElement('p');
    message.textContent = 'Welcome to Book Ducks. Our collection is temporarily unavailable. Please try again later.';
    heroBox.replaceChildren(message);
    console.log("Could not get Hero: " + error.message);
  }
};
getHeroImg();

