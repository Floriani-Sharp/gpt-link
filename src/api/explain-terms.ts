import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      }
    });
    return;
  }

  const term = req.body.term || '';
  const context = req.body.context || '';
  if (term.trim().length === 0 || context.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid term",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(term, context),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(term,context) {
  return `
    Pouvez-vous m'expliquer le terme "${term}" tel qu'utilisé dans le texte suivant : 
    [${context}] ? Je souhaiterais obtenir une réponse en français de moins de 70 mots, 
    avec des exemples d'utilisation et un lien externe pour en savoir plus. 
    Merci de bien vouloir formater votre réponse dans des balises HTML.
  `;
}
