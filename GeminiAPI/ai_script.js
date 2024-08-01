const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run() {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: `
      Lore: Ruled by the wise King Alaric and fiercely defended by Queen Isolde, the kingdom stands strong. 
      Stalwart Sir Cedric, Sir Roland, cunning Lady Seraphina, insightful Lady Elara, and the daring knights 
      Sir Percival and Sir Galahad form the backbone of the kingdom's defense. As the Eternal Kingdom braces 
      for an impending clash, each move on the chessboard becomes a tale of honor, strategy, and loyalty.

      King
      Name: King Alaric
      Personality: Wise, strategic, protective.
      Story: A seasoned leader who values the well-being of his kingdom above all, always planning ahead to protect his people.

      Queen
      Name: Queen Isolde
      Personality: Aggressive, overprotective, loyal.
      Story: A fierce warrior and devoted tactician, driven by her love for King Alaric and her desire to protect their kingdom.

      Rooks
      Name: Sir Cedric & Sir Roland
      Personality: Stalwart, dependable, resolute.
      Story: Both are steadfast defenders of the kingdom, unwavering in their commitment to protect the realm and its rulers.

      Bishops
      Name: Lady Seraphina & Lady Elara
      Personality: Cunning, insightful, emotional.
      Story: Both are strategic masterminds with deep empathy, using their keen minds to protect the kingdom from threats.

      Knights
      Name: Sir Percival & Sir Galahad
      Personality: Brave, boastful, adventurous.
      Story: Both thrive on challenges, with Sir Percival driven by valor and Sir Galahad by a love for adventure.

      Pawns
      Names: Corporal Edmund, Private Thomas, Recruit Henry, Sergeant Wallace, Corporal Alice, Private James, Recruit Olivia, Sergeant Nathaniel
      Personality: Patriotic, courageous, determined.
      Story: These soldiers, ranging from seasoned veterans to eager recruits, are united by their loyalty and dedication to the kingdom, each bringing their unique strengths to the battlefield.
    
      The prompt will be a chess game. Identify the key moves made by each opponent and create a dialogue-based story as if the pieces were talking to each other.
      Each dialogue line for white and black pieces should be outputted in a new line with no markdown. Output should be in the following format: ChessMove: {}; Dialogue: {}
      `,
    generationConfig: { temperature: 1.8 },
  });

  const prompt = `
    1.e4 e5 2.Nf3 f6 3.Nxe5 fxe5 4.Qh5+ Ke7 5.Qxe5+ Kf7 6.Bc4+ d5 7.Bxd5+ Kg6 8.h4 h5 9.Bxb7 Bxb7 10.Qf5+ Kh6 11.d4+ g5 12.Qf7 Qe7 13.hxg5+ Qxg5 14.Rxh5# 1-0
  `;
  
  // Generate content based on the prompt
  const result = await model.generateContent(prompt.trim());
  const text = await result.response.text();

  // Log the generated text to debug
  console.log("Generated Text:", text);

  // Split the generated text into individual lines
  const lines = text.split('\n').filter(line => line.trim() !== '');

  // Initialize an array to hold move-dialogue pairs
  const moveDialoguePairs = [];

  // Iterate over the lines to extract the moves and dialogue
  lines.forEach((line, index) => {
    // Check if the line starts with 'ChessMove:'
    if (line.startsWith('ChessMove:')) {
      // Extract move and dialogue based on the expected pattern
      const parts = line.split('; Dialogue:');
      if (parts.length === 2) {
        const move = parts[0].replace('ChessMove:', '').trim();
        const dialogue = parts[1].trim();

        // Push the matched chess move and dialogue into the array
        moveDialoguePairs.push({ move, dialogue });
      }
    }
  });

  console.log("Move-Dialogue Pairs:", moveDialoguePairs);
}

run();
