import type { PlasmoCSConfig } from "plasmo";
 
export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/*"],
}

// Création de l'élément nav
const nav = document.createElement('nav');
nav.style.display = 'flex';
nav.style.alignItems = 'flex-end';
nav.style.position = 'fixed';
nav.style.bottom = '0';
nav.style.left = '50%';
nav.style.transform = 'translateX(-50%)';
nav.style.zIndex = '999';

// Création de la balise select
const options = [
  'Avis positif',
  'Avis négatif',
  'Féliciter',
  'Poser une question',
  'Partager une expérience',
  'Contribuer',
  'Suggérer',
];

let container = document.createElement("div");
container.id = "select-container";
container.style.position = "relative";

let input = document.createElement("input");
input.type = "text";
input.id = "select-input";
input.value = options[0];
input.onclick = function() {
  if (gpt_filters.style.display === "none") {
    gpt_filters.style.display = "block";
  } else {
    gpt_filters.style.display = "none";
  }
};

let gpt_filters = document.createElement("ul");
gpt_filters.id = "select-gpt_filters";
gpt_filters.style.display = "none";
gpt_filters.style.backgroundColor = "white";
gpt_filters.style.listStyle = "none";
gpt_filters.style.padding = "0";
container.appendChild(gpt_filters);

input.style.backgroundColor = "black";
input.style.color = "white";
input.style.paddingRight = "20px";
input.style.backgroundImage = "url('data:image/svg+xml;charset=UTF-8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke-width=\"3\" stroke=\"white\" style=\"height: 15px;\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>')";
input.style.backgroundRepeat = "no-repeat";
input.style.backgroundPosition = "calc(100% - 20px) center";
input.style.backgroundSize = "12px";
input.style.cursor = "pointer";
input.style.caretColor = "transparent";
container.appendChild(input);

input.addEventListener('keydown', function(event) {
  event.preventDefault();
});

for (let i = 0; i < options.length; i++) {
  let li = document.createElement("li");
  li.innerHTML = options[i];
  li.style.padding = "5px";
  li.style.cursor = "pointer";
  li.onmouseover = function() {
    li.style.backgroundColor = "#f6f6f6";
  };
  li.onmouseout = function() {
    li.style.backgroundColor = "white";
  };
  li.onclick = function() {
    input.value = li.innerHTML;
    gpt_filters.style.display = "none";
  };
  gpt_filters.appendChild(li);
}

// Ajout de la balise select à l'élément nav
nav.appendChild(container);

// Création de l'élément article
const article = document.createElement('article');
article.style.marginLeft = "10px";
article.style.width = "200px";

// Création de la balise ul pour la liste de suggestions
const LIST_SUGGESTION = document.createElement('ol');
LIST_SUGGESTION.style.display = 'none'; // initial display state is none
LIST_SUGGESTION.style.marginTop = '10px';
LIST_SUGGESTION.style.backgroundColor = "white";
LIST_SUGGESTION.style.maxWidth = "200px";
LIST_SUGGESTION.style.padding = "5px";

const SUGGESTIONS = [
  `Merci beaucoup pour votre commentaire ! Nous sommes ravis que vous ayez apprécié notre contenu et nous espérons continuer à vous proposer des publications intéressantes à l'avenir.`,
  `Je vous remercie pour votre commentaire et je tiens à préciser que notre entreprise ne propose pas encore cette fonctionnalité. Nous sommes toutefois conscients de son importance pour nos clients et nous sommes en train d'étudier la possibilité de l'ajouter à notre offre à l'avenir.`,
  `Je vous remercie pour votre commentaire et votre intérêt pour notre entreprise. Pour répondre à votre question, oui, nous avons récemment lancé une nouvelle gamme de produits qui a connu un grand succès auprès de nos clients. N'hésitez pas à nous contacter pour en savoir plus sur cette offre ou pour toute autre question que vous pourriez avoir.`,
];

for (let i = 0; i < SUGGESTIONS.length; i++) {
  let li = document.createElement("li");
  li.innerHTML = SUGGESTIONS[i];
  li.title = `${i+1}. ${SUGGESTIONS[i]}`
  li.style.padding = "5px";
  li.style.cursor = "pointer";
  li.style.display = '-webkit-box';
  li.style.webkitLineClamp = '3';
  li.style.webkitBoxOrient = 'vertical';
  li.style.overflow = 'hidden';
  li.onmouseover = function() {
    li.style.backgroundColor = "#f6f6f6";
  };
  li.onmouseout = function() {
    li.style.backgroundColor = "white";
  };
  li.onclick = function() {
    LIST_SUGGESTION.style.display = "none";
  };
  LIST_SUGGESTION.appendChild(li);
}

// Ajout de la balise ul à l'élément article
article.appendChild(LIST_SUGGESTION);

// Création de la balise label pour afficher les suggestions
const label = document.createElement('label');
label.style.backgroundColor = "black";
label.style.color = "white";
label.style.margin = '0';
label.style.display = 'flex';
label.style.alignItems = 'center';
label.style.backgroundColor = "black";
label.style.color = "white";
label.style.padding = "6px 10px";
label.textContent = 'Afficher les suggestions ';

// Création de l'icône SVG pour la balise label
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
svg.setAttribute('viewBox', '0 0 24 24');
svg.setAttribute('stroke-width', '3');
svg.setAttribute('stroke', 'currentColor');
svg.style.height = '15px';
svg.style.marginLeft = "9px";

const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
path.setAttribute('stroke-linecap', 'round');
path.setAttribute('stroke-linejoin', 'round');
path.setAttribute('d', 'M19.5 8.25l-7.5 7.5-7.5-7.5');

svg.appendChild(path);
label.appendChild(svg);

// Toggle the suggestions visibility when we click on "Afficher les suggestions" label or the svg
const toggleSuggestions = () => {
  LIST_SUGGESTION.style.display = LIST_SUGGESTION.style.display === 'none' ? 'block' : 'none'; // toggle display state
  // path.setAttribute('d', LIST_SUGGESTION.style.display === 'none' ? 'M19.5 8.25l-7.5 7.5-7.5-7.5' : 'M19.5 15.75l-7.5-7.5-7.5 7.5'); // reverse svg arrow
};

label.addEventListener('click', toggleSuggestions);
svg.addEventListener('click', toggleSuggestions);

// Ajout de la balise label à l'élément article
article.appendChild(label);

// Ajout de l'élément article à l'élément nav
nav.appendChild(article);

// Ajout de l'élément nav au DOM
document.body.appendChild(nav);