import type { PlasmoCSConfig } from "plasmo";
import Light from "data-base64:~/assets/light.svg";
import Pencil from "data-base64:~/assets/pencil.svg";
 
export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/*"],
}

// Add comments tools icons
const AddCommentsTools = () => {
  const COMMENT_BOXS = document.querySelectorAll(
    ".comments-comment-box-comment__text-editor + .display-flex.mlA"
  );
  // Loop through each element and remove it
  let index = 0;
  COMMENT_BOXS.forEach((commentBox) => {
    if(commentBox.childElementCount !== 3){
      const COMMENTS_TOOLS = document.createElement("ul");

      const SUGGEST_A_COMMENT = document.createElement("li");
      SUGGEST_A_COMMENT.style.display = "flex";
      SUGGEST_A_COMMENT.style.alignItems = "center";
      SUGGEST_A_COMMENT.style.padding = "0 8px";
      SUGGEST_A_COMMENT.style.height = "24px";
      SUGGEST_A_COMMENT.style.cursor = "pointer";

      const LIGHT_ICON = document.createElement("img");
      LIGHT_ICON.src = Light;
      LIGHT_ICON.alt = "Suggérer";
      LIGHT_ICON.title = "Suggérer un commentaire";
      LIGHT_ICON.style.height = "20px";
      LIGHT_ICON.onclick = function () {
        const COMMENT_INPUT = commentBox.parentNode.querySelector(".comments-comment-box-comment__text-editor .editor-content.ql-container .ql-editor");
        COMMENT_INPUT.innerHTML = "SUGGEST_A_COMMENT";
      };

      SUGGEST_A_COMMENT.appendChild(LIGHT_ICON);

      const REPHRASE_A_COMMENT = document.createElement("li");
      REPHRASE_A_COMMENT.style.display = "flex";
      REPHRASE_A_COMMENT.style.alignItems = "center";
      REPHRASE_A_COMMENT.style.padding = "0 8px";
      REPHRASE_A_COMMENT.style.height = "24px";
      REPHRASE_A_COMMENT.style.cursor = "pointer";

      const PENCIL_ICON = document.createElement("img");
      PENCIL_ICON.src = Pencil;
      PENCIL_ICON.alt = "Reformuler";
      PENCIL_ICON.title = "Reformuler un commentaire";
      PENCIL_ICON.style.height = "20px";
      PENCIL_ICON.onclick = function () {
        const PUBLICATION = commentBox.closest(".social-details-social-activity").parentNode;
        console.log("PUBLICATION", PUBLICATION);
        let publicationParent = PUBLICATION;
        if(PUBLICATION.querySelector(".update-components-text.feed-shared-update-v2__commentary ") === null){
          publicationParent = (PUBLICATION as HTMLElement).closest(".social-details-social-activity").parentNode;
        }
        const PUBLICATION_CONTENT  = publicationParent.querySelector(".update-components-text.feed-shared-update-v2__commentary ").textContent;
        console.log("PUBLICATION_CONTENT", PUBLICATION_CONTENT);
        
        const COMMENT_INPUT = commentBox.parentNode.querySelector(".comments-comment-box-comment__text-editor .editor-content.ql-container .ql-editor");
        COMMENT_INPUT.innerHTML = "REPHRASE_A_COMMENT";
      };
      REPHRASE_A_COMMENT.appendChild(PENCIL_ICON);

      COMMENTS_TOOLS.style.display = "inline-flex";
      COMMENTS_TOOLS.style.listStyleType = "none";
      COMMENTS_TOOLS.style.paddingTop = "8px";
      COMMENTS_TOOLS.appendChild(SUGGEST_A_COMMENT);
      COMMENTS_TOOLS.appendChild(REPHRASE_A_COMMENT);

      commentBox.insertBefore(COMMENTS_TOOLS, commentBox.firstChild);
    }
    index+=1;
  });
};



// Create a new observer instance
const observer = new MutationObserver((mutationsList, observer) => {
  // Iterate through the mutations that have been observed
  for (let mutation of mutationsList) {
    // Check if the target node or comments container has been changed
    const target = mutation.target;
    if (target === document.body || (target instanceof Element && 
        target.matches('.feed-shared-update-v2__comments-container, .comments-comment-item__nested-items'))) {
      // Execute your action here
      AddCommentsTools();
    }
  }
});

// Start observing changes to the body and comments container
observer.observe(document.body, { subtree: true, childList: true });
