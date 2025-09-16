// AI Email Reader - Content Script
class EmailReader {
  constructor() {
    this.buttonAdded = false;
    this.init();
  }
  
  async init() {
    console.log('🚀 AI Email Reader: Initializing...');
    await this.waitForChromeAPIs();
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupEmailReader());
    } else {
      this.setupEmailReader();
    }
  }
  
  async waitForChromeAPIs() {
    return new Promise((resolve) => {
      const checkAPIs = () => {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
          console.log('✅ Chrome extension context detected');
          resolve(true);
        } else {
          console.log('⏳ Waiting for Chrome APIs...');
          setTimeout(checkAPIs, 100);
        }
      };
      checkAPIs();
    });
  }
  
  setupEmailReader() {
    console.log('🔧 AI Email Reader: Setting up...');
    this.addReadButton();
    
    // More aggressive observer to handle Gmail's dynamic updates
    const observer = new MutationObserver(() => {
      // Always try to re-add button if it's missing
      setTimeout(() => {
        if (!document.querySelector('.ai-read-btn')) {
          this.buttonAdded = false; // Reset flag
          this.addReadButton();
        }
      }, 100);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true
    });
    
    // Also add button periodically as fallback
    setInterval(() => {
      if (!document.querySelector('.ai-read-btn')) {
        this.buttonAdded = false;
        this.addReadButton();
      }
    }, 2000);
    
  console.log('AI Email Reader: Setup complete');
  }
  
  addReadButton() {
    if (this.buttonAdded || document.querySelector('.ai-read-btn')) {
      console.log('AI Read button already exists, skipping...');
      return;
    }
    
    const toolbar = document.querySelector('.nH .bHJ') || 
                   document.querySelector('[role="toolbar"]');
    
    if (!toolbar) {
      console.log('Gmail toolbar not found yet');
      return;
    }
    
  console.log('Adding AI Read button to Gmail toolbar');
    
    const readButton = document.createElement('button');
  readButton.innerHTML = 'AI Read';
    readButton.className = 'ai-read-btn';
    readButton.style.cssText = `
      margin: 0 8px;
      padding: 6px 12px;
      background: #1a73e8;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      height: 32px;
      position: relative;
      z-index: 1000;
    `;
    
    readButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.processEmail();
    });
    
    const buttonWrapper = document.createElement('span');
    buttonWrapper.style.cssText = 'display: inline-flex; align-items: center;';
    buttonWrapper.appendChild(readButton);
    toolbar.appendChild(buttonWrapper);
    
    this.buttonAdded = true;
  console.log('AI Read button added to Gmail toolbar');
  }
  
  async processEmail() {
    const button = document.querySelector('.ai-read-btn');
    
    if (!button) {
      console.error('Could not find AI Read button');
      alert('Error: Button not found. Please refresh the page and try again.');
      return;
    }
    
    const originalText = button.innerHTML;
    button.innerHTML = 'Processing...';
    button.disabled = true;
    
    try {
  console.log('Processing email...');
      
      const emailData = this.extractEmailData();
  console.log('Extracted email data:', emailData);
      
      if (!emailData.content || emailData.content.length < 10) {
        throw new Error('Could not extract meaningful email content. Please try selecting an email first.');
      }
      
      button.innerHTML = 'Summarizing...';
      const summary = await this.generateSummary(emailData);
  console.log('Generated summary:', summary);
      
      button.innerHTML = 'Creating audio...';
      const audioUrl = await this.generateAudio(summary);
  console.log('Generated audio URL:', audioUrl);
      
      this.showResults(summary, audioUrl);
      
    } catch (error) {
  console.error('Error processing email:', error);
      alert('Error processing email: ' + error.message);
    } finally {
      if (button) {
        button.innerHTML = originalText;
        button.disabled = false;
      }
    }
  }
  
  extractEmailData() {
  console.log('Extracting email data...');
    
    const subjectElement = document.querySelector('.hP') || 
                          document.querySelector('h2[data-thread-perm-id]');
    const subject = subjectElement ? subjectElement.textContent.trim() : 'No subject';
    
    const senderElement = document.querySelector('.gD span') || 
                         document.querySelector('.go .g2') ||
                         document.querySelector('[email]');
    const sender = senderElement ? senderElement.textContent.trim() : 'Unknown sender';
    
    // Enhanced content extraction - try multiple approaches
    let content = '';
    
    // First try: Main email content
    const contentSelectors = [
      '.ii.gt .a3s.aiL',
      '.a3s.aiL', 
      '.ii.gt div[dir="ltr"]',
      '.ii.gt .a3s',
      '.adn.ads .a3s',
      '.ii.gt'
    ];
    
    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim().length > 50) {
        content = element.textContent.trim();
  console.log('Using content from selector:', selector);
        break;
      }
    }
    
    // If still no good content, try getting all email content from the main container
    if (!content || content.length < 50) {
      const emailContainer = document.querySelector('#\\:20 ') || // Gmail's main content div
                            document.querySelector('.ii.gt') ||
                            document.querySelector('[role="listitem"]');
      
      if (emailContainer) {
        content = emailContainer.textContent.trim();
  console.log('Using content from email container');
      }
    }
    
    if (content) {
      // Enhanced cleanup patterns
      const cleanupPatterns = [
        /Download.*?Add to Drive.*?Save to Photos/g,
        /Reply.*?Reply all.*?Forward/g,
        /Show quoted text/g,
        /Hide quoted text/g,
        /\d+:\d+\s*(AM|PM)\s*\(\d+\s*hours?\s*ago\)/g,
        /Print all.*?In new window/g,
        /Not starred.*?You can't react/g,
        /One attachment.*?Scanned by Gmail/g,
        /Attachment scanning in Gmail.*?Learn more/g
      ];
      
      cleanupPatterns.forEach(pattern => {
        content = content.replace(pattern, '');
      });
      
      // Remove extra whitespace and newlines
      content = content.replace(/\s+/g, ' ').trim();
    } else {
      content = 'No content available';
    }
    
    const result = { subject, sender, content };
  console.log('Extracted:', {
      subject: subject.substring(0, 50) + '...',
      sender: sender.substring(0, 30) + '...',
      contentLength: content.length
    });
    
    return result;
  }
  
  async generateSummary(emailData) {
    console.log('Calling Backend API for summarization...');
    // Import backend URL from config
    // eslint-disable-next-line no-undef
    const url = (typeof BACKEND_BASE_URL !== 'undefined' ? BACKEND_BASE_URL : 'http://localhost:8000') + '/api/v1/email/summarize';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_content: emailData.content,
        sender: emailData.sender,
        subject: emailData.subject,
        context: "email"
      })
    });
    if (!response.ok) {
      throw new Error(`Failed to generate summary: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(`Backend error: ${data.message || 'Unknown error'}`);
    }
    return data.summary;
  }

  async generateAudio(text) {
    console.log('Calling Backend API for audio generation...');
    // Import backend URL from config
    // eslint-disable-next-line no-undef
    const url = (typeof BACKEND_BASE_URL !== 'undefined' ? BACKEND_BASE_URL : 'http://localhost:8000') + '/api/v1/email/generate-audio';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voice_id: 'en-US-ken',
        style: 'Conversational'
      })
    });
    if (!response.ok) {
      throw new Error(`Failed to generate audio: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(`Backend error: ${data.message || 'Unknown error'}`);
    }
    return data.audio_url || data.audio_data;
  }
  
  showResults(summary, audioUrl) {
  console.log('Showing results...');
    
    // Remove existing results
    const existingResults = document.querySelector('.ai-results');
    if (existingResults) {
      existingResults.remove();
    }
    
    // Find the best place to insert results - before email body
    let insertTarget = null;
    
    // Try to find the email header area (before content)
    const emailHeader = document.querySelector('.gs .gE') || 
                       document.querySelector('.adn.ads') ||
                       document.querySelector('.gK');
                       
    const emailContent = document.querySelector('.ii.gt') || 
                        document.querySelector('[role="main"]');
    
    if (emailHeader) {
      insertTarget = emailHeader;
  console.log('Inserting results after email header');
    } else if (emailContent) {
      insertTarget = emailContent;
  console.log('Inserting results in email content area');
    } else {
  console.error('Could not find email content area');
      alert('Summary: ' + summary + '\n\nAudio URL: ' + audioUrl);
      return;
    }
    
    // Create results container
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'ai-results';
    resultsDiv.style.cssText = `
      margin: 15px 10px;
      padding: 15px;
      background: #f0f7ff;
      border-radius: 8px;
      border-left: 4px solid #1a73e8;
      box-shadow: 0 2px 8px rgba(26, 115, 232, 0.1);
      position: relative;
      z-index: 1000;
    `;
    
    resultsDiv.innerHTML = `
      <div class="ai-summary" style="margin-bottom: 15px;">
        <h4 style="margin: 0 0 8px 0; color: #1a73e8; font-size: 16px; font-weight: 600;">AI Summary</h4>
        <p style="margin: 0; line-height: 1.6; color: #333; font-size: 14px;">${summary}</p>
      </div>
      <div class="ai-audio">
        <h4 style="margin: 0 0 8px 0; color: #1a73e8; font-size: 16px; font-weight: 600;">Listen</h4>
        <audio controls style="width: 100%; max-width: 400px; height: 40px;">
          <source src="${audioUrl}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </div>
    `;
    
    // Insert results at the top of the email content
    if (emailHeader) {
      // Insert after the header but before the content
      emailHeader.insertAdjacentElement('afterend', resultsDiv);
    } else {
      // Insert at the beginning of the content
      emailContent.insertBefore(resultsDiv, emailContent.firstChild);
    }
    
    // Scroll to results smoothly
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

console.log('AI Email Reader: Starting...');
new EmailReader();
