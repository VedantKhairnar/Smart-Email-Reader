document.addEventListener('DOMContentLoaded', async function() {
  console.log('Popup DOM loaded');
  
  // Check backend connection on load
  await checkBackendConnection();
  
  // Add refresh button listener
  document.getElementById('refreshBtn').addEventListener('click', async () => {
    await checkBackendConnection();
  });
});

async function checkBackendConnection() {
  const statusElement = document.getElementById('backendStatus');
  const setupSection = document.getElementById('setupSection');
  const refreshBtn = document.getElementById('refreshBtn');
  
  // Show checking state
  statusElement.className = 'status-indicator status-checking';
  statusElement.innerHTML = `
    <div class="status-dot dot-yellow"></div>
    <span>Checking connection...</span>
  `;
  refreshBtn.disabled = true;
  refreshBtn.textContent = 'Checking...';
  
  try {
    console.log('Checking backend connection...');
    
  // eslint-disable-next-line no-undef
  const backendUrl = (typeof BACKEND_BASE_URL !== 'undefined' ? BACKEND_BASE_URL : 'http://localhost:8000');
  const response = await fetch(backendUrl + '/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Backend response:', data);
      
      // Backend is running
      statusElement.className = 'status-indicator status-connected';
      statusElement.innerHTML = `
        <div class="status-dot dot-green"></div>
        <span>Connected to backend</span>
      `;
      setupSection.style.display = 'none';
      
      // Check if API keys are configured by testing an endpoint
      await checkAPIConfiguration();
      
    } else {
      throw new Error(`Backend returned ${response.status}`);
    }
    
  } catch (error) {
    console.error('Backend connection failed:', error);
    
    // Backend is not running
    statusElement.className = 'status-indicator status-disconnected';
    statusElement.innerHTML = `
      <div class="status-dot dot-red"></div>
      <span>Backend not running</span>
    `;
    setupSection.style.display = 'block';
  }
  
  // Re-enable refresh button
  refreshBtn.disabled = false;
  refreshBtn.textContent = 'Check Connection';
}

async function checkAPIConfiguration() {
  try {
    console.log('Checking API configuration...');
    
    // Try to make a test request to see if API keys are configured
  // eslint-disable-next-line no-undef
  const backendUrl = (typeof BACKEND_BASE_URL !== 'undefined' ? BACKEND_BASE_URL : 'http://localhost:8000');
  const response = await fetch(backendUrl + '/api/v1/email/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_content: 'Test email content',
        sender: 'test@example.com',
        subject: 'Test Subject'
      })
    });
    
    if (response.status === 500) {
      // Check if it's an API key error
      const errorData = await response.json();
      if (errorData.detail && errorData.detail.includes('API key')) {
        console.log('API keys not configured in backend');
        updateStatusForMissingAPIKeys();
      }
    }
    
  } catch (error) {
    console.log('Could not check API configuration:', error);
  }
}

function updateStatusForMissingAPIKeys() {
  const statusElement = document.getElementById('backendStatus');
  const setupSection = document.getElementById('setupSection');
  
  statusElement.className = 'status-indicator status-checking';
  statusElement.innerHTML = `
    <div class="status-dot dot-yellow"></div>
    <span>Backend running - API keys needed</span>
  `;
  
  setupSection.innerHTML = `
    <div class="setup-title">API Keys Required</div>
    <div class="setup-step">1. Configure GEMINI_API_KEY in your backend .env file</div>
    <div class="setup-step">2. Configure MURF_API_KEY in your backend .env file</div>
    <div class="setup-step">3. Restart your Python backend server</div>
  `;
  setupSection.style.display = 'block';
}