import type { PlasmoCSConfig } from "plasmo";
import Light from "data-base64:~/assets/light.svg";
import Pencil from "data-base64:~/assets/pencil.svg";
import { Configuration, OpenAIApi } from "openai";
import Loading from "data-base64:~/assets/loading.gif";

const configuration = new Configuration({
  apiKey: process.env.PLASMO_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
 
export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/*"],
}
let isLoading = false;
// Add comments tools icons
const AddCommentsTools = () => {
  const commentBoxes = document.querySelectorAll(
    ".comments-comment-box-comment__text-editor + .display-flex.mlA"
  );
  // Loop through each element and remove it
  commentBoxes.forEach((commentBox) => {
    if(commentBox.childElementCount !== 3){
      const commentsTools = document.createElement("ul");

      const suggestComment = document.createElement("li");
      suggestComment.style.display = "flex";
      suggestComment.style.alignItems = "center";
      suggestComment.style.padding = "0 8px";
      suggestComment.style.height = "24px";
      suggestComment.style.cursor = "pointer";

      const lightIcon = document.createElement("img");
      lightIcon.src = Light;
      lightIcon.alt = "Suggérer";
      lightIcon.title = "Suggérer un commentaire";
      lightIcon.style.height = "20px";
      lightIcon.onclick = async function () {
        if(!isLoading){
          isLoading = true;
          const LoadingIcon  = document.createElement("img");
          LoadingIcon .src = Loading;
          LoadingIcon .alt = "En cours";
          LoadingIcon .title = "En cours";
          LoadingIcon .style.height = "20px";
          commentsTools.insertBefore(LoadingIcon, commentsTools.firstChild);

          if (!configuration.apiKey) {
            throw new Error("OpenAI API key not configured");
          }
          const publication = commentBox.closest(".social-details-social-activity").parentNode;
          
          let publicationParent = publication;
          let replies = []
          let principalComment;
  
          if(publication.querySelector(".update-components-text.feed-shared-update-v2__commentary ") === null){
            let comment =  publication.querySelector(".comments-comment-item-content-body.break-words");
            if(comment === null){
              comment =  publication.querySelector(".comments-highlighted-comment-item-content-body.break-words")
            }
            principalComment = {
              name: publication.querySelector(".comments-post-meta__name-text.hoverable-link-text").textContent.replace(/\s+/g, ' ').trim(),
              content: comment.textContent.replace(/\s+/g, ' ').trim()
            };
  
            let listComments = publication.querySelectorAll(".social-details-social-activity.comment-social-activity article")
            listComments.forEach(comment => {
              replies.push({
                name: comment.querySelector(".comments-post-meta__name-text.hoverable-link-text").textContent.replace(/\s+/g, ' ').trim(),
                content: comment.querySelector(".comments-reply-item-content-body.break-words").textContent.replace(/\s+/g, ' ').trim()
              })
            });
  
            publicationParent = (publication as HTMLElement).closest(".social-details-social-activity").parentNode;
          }
  
          const publicationContent  = publicationParent.querySelector(".update-components-text.feed-shared-update-v2__commentary").textContent.replace(/\s+/g, ' ').trim();
          const publicationAuthor  = publicationParent.querySelector(".update-components-actor__title").textContent.replace(/\s+/g, ' ').trim();
          const commentInput = commentBox.parentNode.querySelector(".comments-comment-box-comment__text-editor .editor-content.ql-container .ql-editor");
          let replyTo = commentInput.textContent; 
          let filter = (document.getElementById("gpt_link_select_input") as HTMLInputElement).value;
          let prompt = generateCommentPrompt(publicationAuthor, publicationContent, filter,principalComment,replies, replyTo)
            
          try {
            await openai.createCompletion({
              model: "text-davinci-003",
              prompt: prompt,
              temperature: 0,
              max_tokens: 500,
            }).then((explanation)=>{
              const gptExplanation = explanation.data.choices[0].text.replaceAll("\n\n", "");
              if(localStorage.getItem("gptSuggestion")){
                let gptSuggestion = localStorage.getItem("gptSuggestion").split("[GPT-Link]");
                gptSuggestion.push(gptExplanation);
                localStorage.setItem("gptSuggestion", gptSuggestion.join("[GPT-Link]") )
              }
              else{
                localStorage.setItem("gptSuggestion", gptExplanation + "[GPT-Link]");
              }
              commentInput.innerHTML =`${gptExplanation}`;
            })
          } catch(error) {
            commentInput.innerHTML = "Une erreur est survenue";
          }
          isLoading = false;
          commentsTools.removeChild(LoadingIcon);
        }
      };

      suggestComment.appendChild(lightIcon);

      const rephraseComment  = document.createElement("li");
      rephraseComment .style.display = "flex";
      rephraseComment .style.alignItems = "center";
      rephraseComment .style.padding = "0 8px";
      rephraseComment .style.height = "24px";
      rephraseComment .style.cursor = "pointer";

      const pencilIcon  = document.createElement("img");
      pencilIcon .src = Pencil;
      pencilIcon .alt = "Reformuler";
      pencilIcon .title = "Reformuler un commentaire";
      pencilIcon .style.height = "20px";
      pencilIcon .onclick = async function () {
        if(!isLoading){
          isLoading = true;
          const LoadingIcon  = document.createElement("img");
          LoadingIcon .src = Loading;
          LoadingIcon .alt = "En cours";
          LoadingIcon .title = "En cours";
          LoadingIcon .style.height = "20px";
          commentsTools.insertBefore(LoadingIcon, commentsTools.firstChild);

          if (!configuration.apiKey) {
            throw new Error("OpenAI API key not configured");
          }
          const commentInput = commentBox.parentNode.querySelector(".comments-comment-box-comment__text-editor .editor-content.ql-container .ql-editor");
            
          try {
            await openai.createCompletion({
              model: "text-davinci-003",
              prompt: `Bonjour ChatGPT, reformule moi ce commentaire à poster sur LinkedIn "${commentInput.textContent}"`,
              temperature: 0,
              max_tokens: 500,
            }).then((explanation)=>{
              const gptExplanation = explanation.data.choices[0].text.replaceAll("\n\n", "");
              if(localStorage.getItem("gptSuggestion")){
                let gptSuggestion = localStorage.getItem("gptSuggestion").split("[GPT-Link]");
                gptSuggestion.push(gptExplanation);
                localStorage.setItem("gptSuggestion", gptSuggestion.join("[GPT-Link]") )
              }
              else{
                localStorage.setItem("gptSuggestion", gptExplanation + "[GPT-Link]");
              }
              commentInput.innerHTML =`${gptExplanation}`;
            })
          } catch(error) {
            commentInput.innerHTML = "Une erreur est survenue";
          }
          isLoading = false;
          commentsTools.removeChild(LoadingIcon);
        }
      };
      rephraseComment .appendChild(pencilIcon );
      commentsTools.style.display = "inline-flex";
      commentsTools.style.listStyleType = "none";
      commentsTools.style.paddingTop = "8px";
      commentsTools.appendChild(suggestComment);
      commentsTools.appendChild(rephraseComment );
      commentBox.insertBefore(commentsTools, commentBox.firstChild);
    }
  });
};

function generateCommentPrompt(author, content, filter, parentComment = null, subComments = [], suggestedAuthor = '') {
  let prompt = `Bonjour ChatGPT, sur LinkedIn, l'auteur ${author} a publié : "${content}".`;
  
  if (parentComment !== null) {
    prompt += `Cette publication a reçu l'avis de ${parentComment.name} qui a exprimé son point de vue comme suit : "${parentComment.content}". `;
    if (suggestedAuthor === '') {
      suggestedAuthor = parentComment.name;
    }
  }
  
  // Ajouter les sous-commentaires
  if (subComments.length > 0) {
    prompt += "Voici les commentaires qu'il a reçus : ";
    subComments.forEach((commentaire) => {
      prompt += `Pour ${commentaire.name} : "${commentaire.content}" `;
    });
  }

  prompt += `J'aimerais donc avoir une suggestion de commentaire pour `;
  switch (filter) {
    case 'Avis positif':
      prompt += 'exprimer un avis positif. ';
      break;
    case 'Avis négatif':
      prompt += 'exprimer un avis négatif. ';
      break;
    case 'Féliciter':
      prompt += 'féliciter. ';
      break;
    case 'Poser une question':
      prompt += 'poser une question. ';
      break;
    case 'Partager une expérience':
      prompt += 'partager mon expérience. ';
      break;
    case 'Contribuer':
      prompt += 'apporter ma contribution. ';
      break;
    case 'Suggérer':
      prompt += 'suggérer une amélioration. ';
      break;
    default:
      prompt += 'réagir à ce propos. ';
      break;
  }
    
  if (suggestedAuthor !== '') {
    prompt += `Je voudrais que ce commentaire soit adressé à ${suggestedAuthor}. `;
  }
  prompt += `Propose-moi un commentaire qui comporte moins de 200 mots. Merci beaucoup ChatGPT!`;
  
  return prompt;
}

// Create a new observer instance
const observer = new MutationObserver((mutationsList, observer) => {
  // Iterate through the mutations that have been observed
  for (let mutation of mutationsList) {
    // Check if the target node or comments container has been changed
    const target = mutation.target;
    if (target === document.body || (target instanceof Element && 
        target.matches('.feed-shared-update-v2__comments-container, .comments-comment-item__nested-items'))) {
      AddCommentsTools();
    }
  }
});
// Start observing changes to the body and comments container
observer.observe(document.body, { subtree: true, childList: true });