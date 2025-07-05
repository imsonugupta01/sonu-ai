import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: 'user', text: prompt };
    setChatHistory([...chatHistory, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('https://gpt-backend-nu.vercel.app/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const botReply = {
        role: 'bot',
        text: data.reply || 'Sorry, I could not understand.',
      };

      setChatHistory((prev) => [...prev, botReply]);
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
