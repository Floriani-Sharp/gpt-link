import type { PlasmoCSConfig } from "plasmo";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
 
export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/*"],
}

let showContextMenu = true;
let termToExplain = "";
let contextOfTerm = "";

// Create the context menu 

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

// Get the term and the text that contains it
document.addEventListener("selectionchange", () => {
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
EXPLAIN_TOOL.addEventListener('click', function() {

  // Request to get explanation
  const REQUEST = ExplainTerms();

  console.log("Request", REQUEST)
  const RESULT = `<p>CoffeeScript est un langage de programmation qui compile en JavaScript, créé par Jeremy Ashkenas. Backbone quant à lui, est une librairie JavaScript qui permet de structurer les applications en utilisant le modèle MVC.</p>
  <ul style="padding-left: 10px;">
    <li>CoffeeScript permet d'écrire du code JavaScript plus rapidement et plus efficacement.</li>
    <li>Backbone facilite la création d'applications web en fournissant des outils pour organiser le code.</li>
    <li>En utilisant CoffeeScript avec Backbone, il est possible de créer des applications web rapidement et facilement.</li>
  </ul>
  <p>Pour en savoir plus sur CoffeeScript et Backbone, consultez le site officiel de CoffeeScript à l'adresse <a href="https://coffeescript.org/">https://coffeescript.org/</a>.</p>`

  // Adds relevant text and links to the pop-up window
  EXPLANATION.innerHTML = `
    <strong>${termToExplain}</strong>
    ${RESULT}
  `;

  showContextMenu= false;
  document.body.appendChild(BACKGROUND_EXPLANATION);
  document.body.appendChild(EXPLANATION);
});

// Remove the popup
BACKGROUND_EXPLANATION.addEventListener('click', function() {
  showContextMenu = true;
  document.body.removeChild(EXPLAIN_TOOL);
  document.body.removeChild(BACKGROUND_EXPLANATION);
  document.body.removeChild(EXPLANATION);
});


async function ExplainTerms() {
  try {
    const response = await fetch("/api/explain-terms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ term: termToExplain, context: contextOfTerm }),
    });

    const data = await response.json();
    console.log("result", data);
    if (response.status !== 200) {
      throw data.error || new Error(`Request failed with status ${response.status}`);
    }

  } catch(error) {
    // Consider implementing your own error handling logic here
    console.error(error);
    alert(error.message);
  }
}