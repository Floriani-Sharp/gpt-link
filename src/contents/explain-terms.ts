import type { PlasmoCSConfig } from "plasmo";
import { Configuration, OpenAIApi } from "openai";
import Loading from "data-base64:~/assets/loading.gif";

const configuration = new Configuration({
  apiKey: process.env.PLASMO_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/*"],
}

let showContextMenu = true;
let termToExplain = "";
let contextOfTerm = "";
let isLoading = false;

// Create the context menu 
// Code to create a context menu for explaining terms


const EXPLAIN_TOOL = document.createElement("button");
EXPLAIN_TOOL.innerHTML = `
  <span>Expliquer ce terme</span>
  <span style="position: absolute; bottom: -0.5rem; border-left: solid 10px transparent; border-right: solid 10px transparent;border-top: solid 10px black"></span>
`;

EXPLAIN_TOOL.style.position = "absolute";
EXPLAIN_TOOL.style.display = "flex";
EXPLAIN_TOOL.style.background= "black"
EXPLAIN_TOOL.style.color= "white"
EXPLAIN_TOOL.style.padding= "1rem"
EXPLAIN_TOOL.style.borderRadius= "0.375rem"
EXPLAIN_TOOL.style.cursor= "pointer"
EXPLAIN_TOOL.style.zIndex = "999";

let EXPLAIN_TOOL_CONTENT = EXPLAIN_TOOL.innerHTML;

// Get the term and the text that contains it
document.addEventListener("selectionchange", () => {
  EXPLAIN_TOOL.innerHTML = EXPLAIN_TOOL_CONTENT;
  const selection = window.getSelection();
  if (showContextMenu){
    if (selection.toString().length) {
      // Get term to explain
      termToExplain = selection.toString();

      // Set position of explain tool 
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      const scrollY = rect.top + window.scrollY;
      const scrollX = rect.left + window.scrollX;
      EXPLAIN_TOOL.style.top = `${scrollY - 40}px`;
      EXPLAIN_TOOL.style.left = `${scrollX}px`;
      EXPLAIN_TOOL.style.opacity = `1`;

      // Get parent content of all selected tool 
      let parentElement = selection.getRangeAt(0).commonAncestorContainer.parentNode;
      contextOfTerm = parentElement.textContent;

      // Display explain tool
      document.body.appendChild(EXPLAIN_TOOL);
    } else { // hide explain tool
      EXPLAIN_TOOL.style.opacity = "0";
    }
  }
});

// Create a pop-up window background 
const BACKGROUND_EXPLANATION = document.createElement('div');

// Style for background
BACKGROUND_EXPLANATION.style.position = "fixed";
BACKGROUND_EXPLANATION.style.top = "0";
BACKGROUND_EXPLANATION.style.left = "0";
BACKGROUND_EXPLANATION.style.width = "100%";
BACKGROUND_EXPLANATION.style.height = "100%";
BACKGROUND_EXPLANATION.style.padding = "10px";
BACKGROUND_EXPLANATION.style.backgroundColor = "rgba(0,0,0,0.5)";
BACKGROUND_EXPLANATION.style.opacity = "1";
BACKGROUND_EXPLANATION.style.boxShadow = "2px 2px 5px rgba(0,0,0,.2)";
BACKGROUND_EXPLANATION.style.transition = "opacity 0.2s ease-out";
BACKGROUND_EXPLANATION.style.zIndex = "999";

// Create a pop-up window

const EXPLANATION = document.createElement('div');
EXPLANATION.classList.add('EXPLANATION');

// Style for the pop-up window
EXPLANATION.style.position = "fixed";
EXPLANATION.style.top = "50%";
EXPLANATION.style.left = "50%";
EXPLANATION.style.width = "50%";
EXPLANATION.style.maxWidth = "500px";
EXPLANATION.style.maxHeight = "80%";
EXPLANATION.style.overflowY = "auto";
EXPLANATION.style.padding = "30px";
EXPLANATION.style.backgroundColor = "#fff";
EXPLANATION.style.border = "1px solid #ccc";
EXPLANATION.style.boxShadow = "2px 2px 5px rgba(0,0,0,.2)";
EXPLANATION.style.transform = "translate(-50%, -50%)";
EXPLANATION.style.zIndex = "999";

// Adds the popup to the parent element
EXPLAIN_TOOL.addEventListener('click', async function () {
  if(!isLoading){
    isLoading = true;
    const LoadingIcon  = document.createElement("img");
    LoadingIcon .src = Loading;
    LoadingIcon .alt = "En cours";
    LoadingIcon .title = "En cours";
    LoadingIcon .style.height = "20px";
    EXPLAIN_TOOL.innerHTML = ``;
    EXPLAIN_TOOL.appendChild(LoadingIcon);
    if (!configuration.apiKey) {
      throw new Error("OpenAI API key not configured");
    }
  
    try {
      await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(termToExplain, contextOfTerm),
        temperature: 0,
        max_tokens: 500,
      }).then((explanation)=>{
        EXPLANATION.innerHTML = `
          <strong>${termToExplain}</strong> <br/>
          ${explanation.data.choices[0].text}
        `;
      })
      EXPLAIN_TOOL.innerHTML = EXPLAIN_TOOL_CONTENT;
    } catch(error) {
      EXPLAIN_TOOL.innerHTML = "Une erreur est survenue";
    }
    isLoading = false;
    showContextMenu= false;
    document.body.appendChild(BACKGROUND_EXPLANATION);
    document.body.appendChild(EXPLANATION);
  }
});

// Remove the popup
BACKGROUND_EXPLANATION.addEventListener('click', function() {
  showContextMenu = true;
  document.body.removeChild(EXPLAIN_TOOL);
  document.body.removeChild(BACKGROUND_EXPLANATION);
  document.body.removeChild(EXPLANATION);
});

function generatePrompt(term, context) {
  return `
    Veuillez me fournir une explication concise, en français, du terme "${term}" dans le contexte de "${contexte}" sur LinkedIn. 
    Il serait utile que vous incluiez trois exemples d'utilisation du terme, présentés sous forme de puces. En outre, veuillez inclure un lien externe qui s'ouvre dans un nouvel onglet pour plus d'informations. 
    Veuillez formater votre réponse en utilisant les balises HTML. La réponse ne doit pas dépasser 70 mots.
  ` ;
}

