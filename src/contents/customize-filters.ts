import type { PlasmoCSConfig } from "plasmo";
 
export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/*"],
}

let isLoading = false;
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
input.id = "gpt_link_select_input";
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
LIST_SUGGESTION.style.maxHeight = "200px";
LIST_SUGGESTION.style.overflow = "auto";
LIST_SUGGESTION.style.padding = "5px";

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
  LIST_SUGGESTION.innerHTML = "";
  const MOCKUP = [
    "Je trouve que le travail de Mag LANHA est très impressionnant. Les méthodes informatiques et statistiques qu'il propose sont très utiles et bien documentées. Les rapports, mémoires, thèses et articles qu'il propose sont très bien écrits et très bien documentés. Il est clair que Mag LANHA a une grande connaissance et une grande expérience dans le domaine des méthodes informatiques et statistiques. Je recommande vivement son travail à tous ceux qui cherchent à améliorer leurs compétences en informatique et en statistiques.",
    "Je suis déçu par le contenu proposé par Mag LANHA sur LinkedIn. Les méthodes informatiques et statistiques sont des outils puissants, mais le contenu proposé ne semble pas être à la hauteur des attentes. Les rapports, mémoires, thèses et articles proposés ne sont pas assez détaillés et ne fournissent pas suffisamment d'informations pour être utiles. De plus, le site Web est très basique et ne propose pas de fonctionnalités supplémentaires pour aider les utilisateurs à trouver ce dont ils ont besoin. Enfin, le contenu est très limité et ne couvre pas tous les sujets liés aux méthodes informatiques et statistiques.",
    "Félicitations à Mag LANHA pour avoir partagé ses connaissances et ses recherches sur les méthodes informatiques et statistiques. Votre contribution à la communauté scientifique est très appréciée et votre travail est une source d'inspiration pour les autres. Votre site Web est une excellente ressource pour les chercheurs et les étudiants qui cherchent à en apprendre davantage sur ces sujets. Merci pour votre partage et votre engagement à partager vos connaissances avec le monde.",
    "Salut Mag LANHA, je suis très intéressé par votre travail sur les méthodes informatiques et statistiques. J'aimerais en savoir plus sur votre travail et comment vous l'utilisez pour résoudre des problèmes. Pouvez-vous me donner plus de détails sur votre travail et comment vous l'utilisez pour résoudre des problèmes ? Merci d'avance !",
    "Je viens de découvrir le site Web de Mag LANHAMag LANHA • 2nd • 2nd et je suis très impressionné par ses méthodes informatiques et statistiques. J'ai trouvé des rapports, des mémoires, des thèses et des articles très intéressants et utiles. Je suis sûr que ces informations seront très utiles pour les étudiants et les chercheurs. Je recommande vivement ce site à tous ceux qui sont intéressés par les méthodes informatiques et statistiques.",
    "Félicitations à Mag LANHA pour avoir partagé cette ressource précieuse sur LinkedIn! Les méthodes informatiques et statistiques sont des outils essentiels pour comprendre et analyser les données. La publication de Mag LANHA offre une excellente occasion de s'informer sur les rapports, mémoires, thèses et articles disponibles sur le sujet. Je suis sûr que cette ressource sera très utile pour les chercheurs et les étudiants qui s'intéressent aux méthodes informatiques et statistiques. Merci à Mag LANHA pour cette contribution précieuse!",
    "Je trouve que le contenu de Mag LANHA est très intéressant et utile. Je suggère d'ajouter des liens vers des articles et des ressources supplémentaires pour aider les lecteurs à en apprendre davantage sur les méthodes informatiques et statistiques. De plus, je suggère d'ajouter des exemples concrets pour illustrer comment ces méthodes peuvent être appliquées dans des contextes réels. Cela aiderait les lecteurs à mieux comprendre et à appliquer ces méthodes."
  ]
  LIST_SUGGESTION.style.listStyleType = "decimal";
    for (let i = 0; i < MOCKUP.length; i++) {
      let li = document.createElement("li");
      li.innerHTML = MOCKUP[i];
      li.title = `${i+1}. ${MOCKUP[i]}`
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
        navigator.clipboard.writeText(li.innerHTML);
        alert(`Copié dans le presse-pappier : ${li.innerHTML}`)
        LIST_SUGGESTION.style.display = "none";
      };
      LIST_SUGGESTION.appendChild(li);
    }
  // if(localStorage.getItem("gptSuggestion")){
  //   const SUGGESTIONS = localStorage.getItem("gptSuggestion").split("[GPT-Link]");
  //   LIST_SUGGESTION.style.listStyleType = "decimal";
  //   for (let i = 0; i < SUGGESTIONS.length; i++) {
  //     let li = document.createElement("li");
  //     li.innerHTML = SUGGESTIONS[i];
  //     li.title = `${i+1}. ${SUGGESTIONS[i]}`
  //     li.style.padding = "5px";
  //     li.style.cursor = "pointer";
  //     li.style.display = '-webkit-box';
  //     li.style.webkitLineClamp = '3';
  //     li.style.webkitBoxOrient = 'vertical';
  //     li.style.overflow = 'hidden';
  //     li.onmouseover = function() {
  //       li.style.backgroundColor = "#f6f6f6";
  //     };
  //     li.onmouseout = function() {
  //       li.style.backgroundColor = "white";
  //     };
  //     li.onclick = function() {
  //       navigator.clipboard.writeText(li.innerHTML);
  //       alert(`Copié dans le presse-pappier : ${li.innerHTML}`)
  //       LIST_SUGGESTION.style.display = "none";
  //     };
  //     LIST_SUGGESTION.appendChild(li);
  //   }
  // }
  // else{
  //   LIST_SUGGESTION.style.listStyleType = "none";
  //   let li = document.createElement("li");
  //   li.innerHTML = "Aucune suggestion";
  //   LIST_SUGGESTION.appendChild(li);
  // }
  LIST_SUGGESTION.style.display = LIST_SUGGESTION.style.display === 'none' ? 'block' : 'none'; // toggle display state
};

label.addEventListener('click', toggleSuggestions);
svg.addEventListener('click', toggleSuggestions);

// Ajout de la balise label à l'élément article
article.appendChild(label);

// Ajout de l'élément article à l'élément nav
nav.appendChild(article);

// Ajout de l'élément nav au DOM
document.body.appendChild(nav);