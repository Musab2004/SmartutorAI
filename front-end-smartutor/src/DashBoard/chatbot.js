import React, { useState } from 'react';
import axios from 'axios';

const ChatbotApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: newMessages,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer add your own`,
          },
        }
      );

      const botMessage = response.data.choices[0].message;
      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Chatbot with GPT-4</h1>
      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={msg.role === 'user' ? styles.userMessage : styles.botMessage}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    width: '600px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
  },
  header: {
    margin: '20px 0',
    fontSize: '24px',
    color: '#333',
  },
  chatWindow: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '10px',
    height: '400px',
    width: '80%',
    overflowY: 'auto',
    backgroundColor: '#fff',
  },
  userMessage: {
    textAlign: 'right',
    color: '#fff',
    backgroundColor: '#007bff',
    padding: '10px',
    borderRadius: '10px',
    margin: '5px 0',
    maxWidth: '70%',
    alignSelf: 'flex-end',
  },
  botMessage: {
    textAlign: 'right',
    color: '#333',
    backgroundColor: '#e9ecef',
    padding: '0px',
    borderRadius: '10px',
    margin: '5px 0',
    maxWidth: '70%',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    display: 'flex',
    width: '80%',
    marginTop: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '10px 0 0 10px',
    border: '1px solid #ccc',
    borderRight: 'none',
    outline: 'none',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '0 10px 10px 0',
    border: '1px solid #ccc',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    outline: 'none',
  },
};

export default ChatbotApp;
