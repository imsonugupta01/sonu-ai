import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';

const API_KEY = 'AIzaSyC9LsdNhtLjSFgI--c2j2UonbV0nlKnj1c'; // ⚠️ Not safe to expose in prod
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

function App() {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: 'user', text: prompt };
    setChatHistory((prev) => [...prev, userMessage]);
    setLoading(true);

    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    try {
      const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not understand.';

      const botMessage = { role: 'bot', text: replyText };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { role: 'bot', text: '⚠️ Error fetching response.' },
      ]);
    }

    setPrompt('');
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="app-container">
      <header className="app-header">🤖 Sonu AI</header>
      <div className="chat-box">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            {msg.role === 'bot' ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.text}
              </ReactMarkdown>
            ) : (
              <span>{msg.text}</span>
            )}
          </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <span>⏳ Thinking...</span>
          </div>
        )}
      </div>

      <div className="input-box">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
