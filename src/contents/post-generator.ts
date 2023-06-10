import { Configuration, OpenAIApi } from "openai";
import type { PlasmoCSConfig } from "plasmo";
import Loading from "data-base64:~/assets/loading.gif";
 
export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/*"],
}

const configuration = new Configuration({
  apiKey: process.env.PLASMO_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
 

let buttonExist = false;
let isLoading = false;
// Get the target element

const postBoxSelector = ".share-creation-state__comment-controls-container";

const generatePost = async (theme) =>{
  try {
    await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `En tant que professionnel sur LinkedIn, je souhaite partager mes réflexions sur "${theme}".\
              Génère moi un texte pour une publication LinkedIn qui doit comporter au minimum 40 à 70 mots \
              et au maximum 1,300 caractères ou 250 mots \
              Le texte dolt être suffisament claire avec des emojis par exemple et de l'espacement entre \
              les paragraphes courts afin de donner envie de lire.
              `,
      temperature: 1,
      max_tokens: 2500,
    }).then((post)=>{
      const gptPost = post.data.choices[0].text.trim();
      let gptSuggestion = localStorage.getItem("gptSuggestion").split("[GPT-Link]");
      gptSuggestion.push(gptPost);
      document.querySelector(".ql-editor").textContent =`${gptPost}`;
    })
  } catch(error) {
    document.querySelector(".ql-editor").textContent = "Une erreur est survenue";
  } finally{
    isLoading= false;
  }
}

const addPostGeneratorButton = async() =>{
  if(!buttonExist){
    // Loading icon 
    const LoadingIcon  = document.createElement("img");
    LoadingIcon .src = Loading;
    LoadingIcon .alt = "En cours";
    LoadingIcon .title = "En cours";
    LoadingIcon .style.height = "20px";
    LoadingIcon .style.display = "none";

    // Create the button element
    var button = document.createElement("button");
    
    // Set the button text
    button.innerText = "Suggérer";
    
    // Add a click event listener
    button.addEventListener("click", async() => {
      if(!isLoading){
        isLoading = true;
        LoadingIcon.style.display="block";
        await generatePost(document.querySelector(".ql-editor").textContent)
        LoadingIcon.style.display="none";
      }
    });
    
    // Apply styles to the button
    button.style.borderRadius = "50%";
    button.style.backgroundColor = "#0a66c2";
    button.style.color = "white";
    button.style.padding = "6px 16px";
    button.style.borderRadius = "30px";
    
    let targetElement = document.querySelector(postBoxSelector);
    // Insert the button after the target element
    targetElement.insertAdjacentElement("afterend", button);
    buttonExist= true;
    
    // Insert the loading icon
    targetElement.insertAdjacentElement("afterend", LoadingIcon);
  }
}


// Create a new observer instance
const observer = new MutationObserver((mutationsList, observer) => {
  if(!buttonExist){
    // Iterate through the mutations that have been observed
    for (let mutation of mutationsList) {
      // Check if the target node or comments container has been changed
      const target = mutation.target;
      if (target === document.body || (target instanceof Element && 
          target.matches(postBoxSelector))) {
            addPostGeneratorButton();
      }
    }
  }
});
// Start observing changes to the body and comments container
observer.observe(document.body, { subtree: true, childList: true });