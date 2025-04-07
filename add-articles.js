const fetch = require('node-fetch');

const articles = [
  {
    title: "Hidden Cracks",
    content: "There’s a quiet storm brewing in the economy, one that won’t make front-page headlines until it’s too late. We talk about recessions like they’re sudden events—one moment, everything is fine, the next, markets collapse. But the truth is, economic downturns don’t happen overnight. They build slowly, like cracks in a foundation, ignored until they can’t be. Look around. Inflation may have cooled on paper, but everyday people still feel squeezed. ...", // Add full content if desired
    date: "2025-03-18"
  },
  {
    title: "Power of Perspective",
    content: "The world doesn’t exist as it is. It exists as you see it. Two people can live through the same experience and walk away with entirely different realities—one feeling broken, the other feeling enlightened. The difference isn’t in what happened. It’s in how it was perceived. Most people go through life believing their thoughts are merely reactions to the world around them. ...", // Add full content if desired
    date: "2025-03-18"
  },
  {
    title: "Brain Computer Interfaces",
    content: "Imagine controlling your phone, computer, or even a prosthetic limb with just your thoughts. No screens, no keyboards—just a direct connection between your brain and the digital world. This is the promise of Brain-Computer Interfaces (BCIs), a technology that once seemed like science fiction but is now becoming a reality. BCIs work by detecting brain signals and translating them into digital commands. ...", // Add full content if desired
    date: "2025-03-18"
  }
];

async function addArticles() {
  for (const article of articles) {
    const response = await fetch('http://localhost:3000/.netlify/functions/addArticle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article)
    });
    const result = await response.json();
    console.log(`Added ${article.title}: ${result.message}`);
  }
}

addArticles().catch(err => console.error(err));