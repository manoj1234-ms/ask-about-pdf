"use client";

import React, { useState, useRef, useEffect } from 'react';
import './globals.css';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [asking, setAsking] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadStatus('');

    const formData = new FormData();
    formData.append('file', file); // changed to file, maybe backend expects 'file' (uploadController.js: req.file)

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setUploadStatus('PDF uploaded and embedded successfully!');
        setFile(null);
      } else {
        setUploadStatus('Failed to upload PDF.');
      }
    } catch (error) {
      console.error(error);
      setUploadStatus('Error uploading PDF.');
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQ = question;
    setMessages(prev => [...prev, { role: 'user', content: userQ }]);
    setQuestion('');
    setAsking(true);

    try {
      const res = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userQ }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', content: data.answer || "No response" }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: "Error: " + (data.error || "Unknown error") }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to the server." }]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>RAG Engine</h1>
        <p>Upload your documents and interact with them seamlessly.</p>
      </header>

      <section className="glass-panel upload-section">
        <h2>Knowledge Base Setup</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div className="file-input-wrapper">
            <button className="btn" type="button">
              {file ? file.name : "Choose PDF Document"}
            </button>
            <input 
              type="file" 
              className="file-input" 
              accept=".pdf" 
              onChange={handleFileChange} 
            />
          </div>
          <button 
            className="btn" 
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Processing...' : 'Embed Document'}
          </button>
        </div>
        {uploadStatus && (
          <div className="status-badge">
            {uploadStatus}
          </div>
        )}
      </section>

      <section className="glass-panel chat-section">
        <div className="chat-box">
          {messages.length === 0 ? (
            <div style={{ margin: 'auto', color: '#8b949e', textAlign: 'center' }}>
              No messages yet. Upload a document and start asking questions!
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                {msg.content}
              </div>
            ))
          )}
          {asking && (
            <div className="message ai">
              <span style={{ opacity: 0.6 }}>Thinking...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleAsk} className="input-group">
          <input 
            type="text" 
            className="text-input" 
            placeholder="Ask something about your document..." 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={asking}
          />
          <button type="submit" className="btn" disabled={asking || !question.trim()}>
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
