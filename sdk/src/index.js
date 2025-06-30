import './styles.css';

class DocuBotWidget {
  constructor() {
    this.isOpen = false;
    this.config = {};
    this.apiBaseUrl = 'https://api.docubot.ai';
    this.messages = [];
    this.isTyping = false;
  }

  init(config) {
    this.config = {
      apiKey: '',
      documentId: '',
      theme: 'light',
      position: 'bottom-right',
      allowUpload: false,
      primaryColor: '#2563eb',
      accentColor: '#7c3aed',
      ...config
    };

    this.createWidget();
    this.attachEventListeners();
    this.loadInitialMessage();
  }

  createWidget() {
    // Create widget container
    this.container = document.createElement('div');
    this.container.className = `docubot-widget docubot-${this.config.position} docubot-${this.config.theme}`;
    this.container.innerHTML = this.getWidgetHTML();

    // Add to DOM
    document.body.appendChild(this.container);

    // Get references to elements
    this.bubble = this.container.querySelector('.docubot-bubble');
    this.chatWindow = this.container.querySelector('.docubot-chat-window');
    this.messagesContainer = this.container.querySelector('.docubot-messages');
    this.input = this.container.querySelector('.docubot-input');
    this.sendButton = this.container.querySelector('.docubot-send-btn');
    this.closeButton = this.container.querySelector('.docubot-close-btn');
  }

  getWidgetHTML() {
    return `
      <!-- Chat Bubble -->
      <div class="docubot-bubble">
        <div class="docubot-bubble-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="docubot-bubble-pulse"></div>
      </div>

      <!-- Chat Window -->
      <div class="docubot-chat-window">
        <div class="docubot-header">
          <div class="docubot-header-info">
            <div class="docubot-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <div class="docubot-title">DocuBot AI</div>
              <div class="docubot-subtitle">Ask me anything</div>
            </div>
          </div>
          <button class="docubot-close-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="docubot-messages"></div>

        <div class="docubot-input-area">
          <div class="docubot-input-container">
            <input type="text" class="docubot-input" placeholder="Ask about your document...">
            <button class="docubot-send-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="docubot-powered-by">
            Powered by DocuBot.AI
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Bubble click to toggle chat
    this.bubble.addEventListener('click', () => this.toggleChat());

    // Close button
    this.closeButton.addEventListener('click', () => this.closeChat());

    // Send message
    this.sendButton.addEventListener('click', () => this.sendMessage());
    
    // Enter key to send
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });

    // Prevent input focus from scrolling page
    this.input.addEventListener('focus', (e) => {
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isOpen = true;
    this.container.classList.add('docubot-open');
    this.input.focus();
    
    // Scroll to bottom if there are messages
    setTimeout(() => this.scrollToBottom(), 100);
  }

  closeChat() {
    this.isOpen = false;
    this.container.classList.remove('docubot-open');
  }

  async loadInitialMessage() {
    const welcomeMessage = {
      id: 'welcome',
      type: 'bot',
      content: `Hi! I'm your AI assistant for this document. I can help you find information, answer questions, and provide summaries. What would you like to know?`,
      timestamp: new Date()
    };
    
    this.addMessage(welcomeMessage);
  }

  async sendMessage() {
    const content = this.input.value.trim();
    if (!content) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    this.addMessage(userMessage);
    this.input.value = '';
    this.showTyping();

    try {
      // Call API
      const response = await this.callAPI(content);
      
      // Add bot response
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date()
      };

      this.hideTyping();
      this.addMessage(botMessage);
      
    } catch (error) {
      this.hideTyping();
      this.addMessage({
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      });
      console.error('DocuBot API Error:', error);
    }
  }

  async callAPI(message) {
    // Simulate API call for demo - replace with actual AWS Lambda endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          content: this.generateDemoResponse(message)
        });
      }, 1000 + Math.random() * 1500);
    });

    /* Real API call implementation:
    const response = await fetch(`${this.apiBaseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        documentId: this.config.documentId,
        message: message,
        sessionId: this.getSessionId()
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
    */
  }

  generateDemoResponse(input) {
    const responses = [
      "Based on the document, I found relevant information about your question. Here are the key points...",
      "Let me search through the document for that information. According to section 3.2...",
      "That's a great question! The document mentions this topic in several places. Here's a summary...",
      "I can help you with that. The document provides detailed guidance on this matter..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  addMessage(message) {
    this.messages.push(message);
    
    const messageElement = document.createElement('div');
    messageElement.className = `docubot-message docubot-message-${message.type}`;
    messageElement.innerHTML = `
      <div class="docubot-message-avatar">
        ${message.type === 'user' ? this.getUserIcon() : this.getBotIcon()}
      </div>
      <div class="docubot-message-content">
        <div class="docubot-message-text">${this.formatMessage(message.content)}</div>
        <div class="docubot-message-time">${this.formatTime(message.timestamp)}</div>
      </div>
    `;

    this.messagesContainer.appendChild(messageElement);
    this.scrollToBottom();
  }

  showTyping() {
    this.isTyping = true;
    const typingElement = document.createElement('div');
    typingElement.className = 'docubot-typing';
    typingElement.innerHTML = `
      <div class="docubot-message docubot-message-bot">
        <div class="docubot-message-avatar">
          ${this.getBotIcon()}
        </div>
        <div class="docubot-message-content">
          <div class="docubot-typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    `;

    this.messagesContainer.appendChild(typingElement);
    this.scrollToBottom();
  }

  hideTyping() {
    this.isTyping = false;
    const typingElement = this.messagesContainer.querySelector('.docubot-typing');
    if (typingElement) {
      typingElement.remove();
    }
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  formatMessage(content) {
    return content.replace(/\n/g, '<br>');
  }

  formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getUserIcon() {
    return `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  getBotIcon() {
    return `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  getSessionId() {
    let sessionId = localStorage.getItem('docubot-session-id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('docubot-session-id', sessionId);
    }
    return sessionId;
  }
}

// Initialize global DocuBot object
window.DocuBot = new DocuBotWidget();

// Auto-initialize if config is found in script tag
document.addEventListener('DOMContentLoaded', () => {
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    if (script.textContent.includes('DocuBot.init')) {
      // Configuration will be called from the inline script
    }
  });
});