import { useState } from "react";
import nlp from "compromise";

function App() {
  const [text, setText] = useState("");
  const [showKeywords, setShowKeywords] = useState(false);

  // Analyze sentiment (positive, negative, or neutral) based on predefined words
  const analyzeSentiment = (text) => {
    const positiveWords = ["good", "happy", "love", "awesome", "great", "amazing"];
    const negativeWords = ["bad", "sad", "hate", "terrible", "awful"];

    let score = 0;
    text.toLowerCase().split(/\s+/).forEach((word) => {
      if (positiveWords.includes(word)) score++;
      if (negativeWords.includes(word)) score--;
    });

    return score > 0 ? "Positive 😊" : score < 0 ? "Negative 😞" : "Neutral 😐";
  };

  // Calculate word count, character count, and reading time
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const charCount = text.length;
  const readingTimeSeconds = Math.ceil((wordCount / 200) * 60); // 200 words per min → convert to seconds

  // Calculate hours, minutes, and seconds for reading time
  const hours = Math.floor(readingTimeSeconds / 3600);
  const minutes = Math.floor((readingTimeSeconds % 3600) / 60);
  const seconds = readingTimeSeconds % 60;

  // Function to highlight general keywords using NLP (compromise)
  const highlightText = (inputText) => {
    const doc = nlp(inputText);
    
    // Get nouns and verbs as keywords (usually most meaningful)
    const keywords = doc.nouns().out("array").concat(doc.verbs().out("array"));

    const words = inputText.split(/\s+/);
    return words
      .map((word) => {
        const lowerWord = word.toLowerCase();
        
        // Highlight the keywords identified by compromise
        if (keywords.includes(lowerWord)) {
          return `<span style="background-color: lightgreen;">${word}</span>`;
        }

        return word;
      })
      .join(" ");
  };

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            padding: 0; 
            height: 100vh;
          }
          .highlighted-text {
            white-space: pre-wrap;
            word-wrap: break-word;
            padding: 10px;
            border-radius: 8px;
            background-color: #f9f9f9;
            font-size: 16px;
            color: #333;
            min-height: 120px;
            margin-top: 20px;
            display: ${showKeywords ? 'block' : 'none'};
          }
          textarea {
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            border: none;
            outline: none;
            font-size: 16px;
            color: #333;
            background-color: #fff;
            min-height: 120px;
            word-wrap: break-word;
          }
          button {
            padding: 10px;
            background-color: #4a90e2;
            color: white;
            border: 2px solidrgb(2, 2, 2); /* Outline border */
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
          }
          button:hover {
            background-color: #357ab7;
            border-color: #357ab7; /* Change outline color on hover */
          }
        `}
      </style>
      <div
        style={{
          height: "100vh", 
          width: "100vw", 
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#add8e6", 
          color: "#ffffff", 
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div style={{ maxWidth: "600px", width: "100%", padding: "20px", backgroundColor: "#4a90e2", borderRadius: "10px" }}>
          <h2 style={{ marginBottom: "20px" }}>Quick Text Analyzer</h2>

          {/* Textarea for user input */}
          <textarea
            rows="6"
            placeholder="Type or paste text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          <h3 style={{ marginTop: "20px" }}>Text Statistics</h3>
          <p><strong>Word Count:</strong> {wordCount}</p>
          <p><strong>Character Count:</strong> {charCount}</p>
          <p><strong>Sentiment:</strong> {analyzeSentiment(text)}</p>
          <p><strong>Reading Time:</strong> {hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}, ` : ""}{minutes} min {seconds} sec</p>

          {/* Button to toggle keyword visibility */}
          <button onClick={() => setShowKeywords(!showKeywords)}>
            {showKeywords ? "Hide Keywords" : "Show Keywords"}
          </button>

          {/* Div to display highlighted version of the input */}
          <div
            className="highlighted-text"
            dangerouslySetInnerHTML={{ __html: highlightText(text) }}
          ></div>

        </div>
      </div>
    </>
  );
}

export default App;
