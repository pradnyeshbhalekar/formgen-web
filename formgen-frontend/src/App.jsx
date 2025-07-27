"use client"
import React, { useState } from 'react';
import { Github, Copy, Package,Braces, AlertCircle, Moon, Sun, Mail, ExternalLink } from 'lucide-react';

const FormGenerator = () => {
  const [jsonInput, setJsonInput] = useState(`{
  "first_name": {
    "label": "First Name",
    "type": "text",
    "placeholder": "Enter your first name",
    "required": true
  },
  "age": {
    "label": "Age",
    "type": "number",
    "placeholder": "Enter your age",
    "required": true,
    "min": 0
  },
  "gender": {
    "label": "Gender",
    "type": "select",
    "required": true,
    "options": [
      { "value": "male", "label": "Male" },
      { "value": "female", "label": "Female" },
      { "value": "other", "label": "Other" }
    ]
  },
  "subscribe": {
    "label": "Subscribe to Newsletter",
    "type": "checkbox",
    "required": false
  }
}`);

  const [generatedJSX, setGeneratedJSX] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const validateJson = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  };

  const generateForm = async () => {
    if (!validateJson(jsonInput)) {
      setError('Invalid JSON format');
      setIsValidJson(false);
      return;
    }

    setIsLoading(true);
    setError('');
    setIsValidJson(true);

    try {
      // Parse the JSON input to ensure it's valid, then stringify it properly
      const parsedJson = JSON.parse(jsonInput);
      
      const response = await fetch(`${import.meta.env.VITE_BACKENDURI}/generatedOutput`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedJson)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      setGeneratedJSX(data.jsx || 'No JSX returned from API');
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error: Unable to connect to the API. Please check your internet connection.');
      } else if (err.message.includes('API Error')) {
        setError(`Server error: ${err.message}`);
      } else {
        setError(`Failed to generate form: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleJsonChange = (e) => {
    const value = e.target.value;
    setJsonInput(value);
    setIsValidJson(validateJson(value));
    if (error) setError('');
  };

  const handleKeyDown = (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const value = e.target.value;

    // Handle Tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      setJsonInput(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
      return;
    }

    // Auto-closing brackets, braces, and quotes
    const autoCloseMap = {
      '{': '}',
      '[': ']',
      '(': ')',
      '"': '"',
      "'": "'"
    };

    if (autoCloseMap[e.key]) {
      e.preventDefault();
      const closeChar = autoCloseMap[e.key];
      
      // For quotes, check if we're closing an existing quote
      if ((e.key === '"' || e.key === "'") && value[start] === e.key) {
        // Move cursor past the existing quote
        e.target.selectionStart = e.target.selectionEnd = start + 1;
        return;
      }

      const newValue = value.substring(0, start) + e.key + closeChar + value.substring(end);
      setJsonInput(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1;
      }, 0);
      return;
    }

    // Handle Enter key for auto-indentation
    if (e.key === 'Enter') {
      e.preventDefault();
      const lines = value.substring(0, start).split('\n');
      const currentLine = lines[lines.length - 1];
      const indentMatch = currentLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : '';
      
      // Add extra indent if the previous character is an opening bracket
      const prevChar = value[start - 1];
      const extraIndent = (prevChar === '{' || prevChar === '[') ? '  ' : '';
      
      const newValue = value.substring(0, start) + '\n' + currentIndent + extraIndent + value.substring(end);
      setJsonInput(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1 + currentIndent.length + extraIndent.length;
      }, 0);
      return;
    }

    // Handle closing brackets - skip if next character is the same
    const closingChars = ['}', ']', ')'];
    if (closingChars.includes(e.key) && value[start] === e.key) {
      e.preventDefault();
      e.target.selectionStart = e.target.selectionEnd = start + 1;
      return;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedJSX);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Theme colors - Claude-inspired dark mode
  const lightTheme = {
    bg: '#f8fafc',
    cardBg: '#ffffff',
    headerBg: '#f1f5f9',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    primary: '#4D3A6E',
    secondary: '#06b6d4',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b'
  };

  const darkTheme = {
    bg: '#191919',           // Deep charcoal like Claude
    cardBg: '#2a2a2a',       // Slightly lighter charcoal for cards
    headerBg: '#333333',     // Medium gray for headers
    text: '#ffffff',         // Pure white text
    textLight: '#b3b3b3',    // Light gray for secondary text
    border: '#404040',       // Subtle border in dark gray
    primary: '#956CE0',      // Keep the purple
    secondary: '#22d3ee',    // Keep the cyan
    success: '#10b981',      // Keep the green
    danger: '#f87171',       // Keep the red
    warning: '#fbbf24'       // Keep the yellow
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <div>
      <style>{`
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .container {
          min-height: 100vh;
          background-color: ${theme.bg};
          transition: background-color 0.3s ease;
        }
        
        .navbar {
          background-color: ${theme.cardBg};
          border-bottom: 1px solid ${theme.border};
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .navbar-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .navbar-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 4rem;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .logo-icon {
          background-color: ${theme.primary};
          padding: 0.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .logo-text {
          color: ${theme.text};
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          font-family: 'SF Mono', 'Monaco', 'Consolas', 'Roboto Mono', monospace;
        }
        
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: ${theme.textLight};
          text-decoration: none;
          padding: 0.625rem 0.875rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }
        
        .nav-link:hover {
          background-color: ${isDarkMode ? '#404040' : '#f1f5f9'};
          color: ${theme.primary};
        }
        
        .theme-toggle {
          background: none;
          border: 2px solid ${theme.border};
          border-radius: 0.5rem;
          padding: 0.75rem;
          color: ${theme.text};
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }
        
        .theme-toggle:hover {
          background-color: ${theme.primary};
          color: white;
          border-color: ${theme.primary};
        }
        
        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.5rem;
        }
        
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        @media (min-width: 768px) {
          .grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        .panel {
          background-color: ${theme.cardBg};
          border-radius: 1rem;
          border: 1px solid ${theme.border};
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.1'});
          transition: all 0.3s ease;
          height: 500px;
        }
        
        .panel:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, ${isDarkMode ? '0.4' : '0.15'});
        }
        
        .panel-header {
          background-color: ${theme.headerBg};
          border-bottom: 1px solid ${theme.border};
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .panel-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .panel-title h2 {
          color: ${theme.text};
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
        }
        
        .json-logo {
          color: ${theme.warning};
          font-family: 'SF Mono', 'Monaco', 'Consolas', 'Roboto Mono', monospace;
          font-weight: 700;
          font-size: 1.4rem;
          letter-spacing: -0.02em;
        }
        
        .jsx-logo {
          color: ${theme.secondary};
          font-family: 'SF Mono', 'Monaco', 'Consolas', 'Roboto Mono', monospace;
          font-weight: 700;
          font-size: 1.4rem;
          letter-spacing: -0.02em;
        }
        
        .textarea {
          width: 100%;
          flex: 1;
          padding: 1rem;
          font-family: 'SF Mono', 'Monaco', 'Consolas', 'Roboto Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          resize: none;
          border: none;
          outline: none;
          color: ${theme.text};
          background-color: ${theme.cardBg};
        }
        
        .textarea-invalid {
          border-left: 4px solid ${theme.danger};
          background-color: ${isDarkMode ? '#4a2c2c' : '#fef2f2'};
        }
        
        .generate-button {
          background: linear-gradient(135deg, ${theme.success}, #059669);
          color: white;
          padding: 1rem 1.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
        }
        
        .generate-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        .generate-button:disabled {
          background: ${theme.textLight};
          cursor: not-allowed;
          transform: none;
        }
        
        .copy-button {
          background-color: ${theme.primary};
          color: white;
          padding: 0.625rem 1.125rem;
          border-radius: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .copy-button:hover {
          background-color: ${isDarkMode ? '#9333ea' : '#7c3aed'};
          transform: translateY(-1px);
        }
        
        .output-area {
          flex: 1;
          overflow: hidden;
        }
        
        .error {
          background-color: ${isDarkMode ? '#4a2c2c' : '#fef2f2'};
          border-left: 4px solid ${theme.danger};
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: ${theme.danger};
        }
        
        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 3rem;
        }
        
        .loading-content {
          text-align: center;
          color: ${theme.textLight};
        }
        
        .spinner {
          width: 2rem;
          height: 2rem;
          border: 3px solid ${theme.border};
          border-top: 3px solid ${theme.primary};
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .code-output {
          height: 100%;
          overflow: auto;
          background-color: ${isDarkMode ? '#1a1a1a' : '#1e293b'};
        }
        
        .code {
          color: ${isDarkMode ? '#e6e6e6' : theme.secondary};
          padding: 1.5rem;
          font-size: 0.85rem;
          line-height: 1.6;
          font-family: 'Monaco', 'Consolas', monospace;
          white-space: pre-wrap;
          margin: 0;
        }
        
        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 3rem;
          color: ${theme.textLight};
        }
        
        .empty-state-content {
          text-align: center;
        }
        
        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          color: ${theme.border};
        }
        
        .footer {
          background-color: ${theme.cardBg};
          border-top: 1px solid ${theme.border};
          padding: 2rem 1.5rem;
          margin-top: 2rem;
        }
        
        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        @media (min-width: 768px) {
          .footer-content {
            grid-template-columns: 2fr 1fr;
          }
        }
        
        .footer-section h3 {
          color: ${theme.text};
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .footer-section p {
          color: ${theme.textLight};
          margin: 0 0 1.5rem 0;
          line-height: 1.6;
        }
        
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .footer-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: ${theme.textLight};
          text-decoration: none;
          padding: 0.75rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          border: 1px solid ${theme.border};
        }
        
        .footer-link:hover {
          background-color: ${isDarkMode ? '#404040' : '#f1f5f9'};
          color: ${theme.primary};
          border-color: ${theme.primary};
        }
        
        .footer-link-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .footer-link-title {
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        .footer-link-desc {
          font-size: 0.75rem;
          opacity: 0.8;
        }
        
        @media (max-width: 768px) {
          .logo-text {
            display: none;
          }
          
          .nav-links {
            gap: 0.25rem;
          }
          
          .nav-link {
            padding: 0.5rem;
            font-size: 0.8rem;
          }
          
          .nav-link span {
            display: none;
          }
          
          .main-content {
            padding: 1rem;
          }
          
          .grid {
            gap: 1rem;
          }
        }
      `}</style>

      <div className="container">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-content">
            <div className="navbar-inner">
              <div className="logo">
                <div className="logo-icon">
                  <Braces style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
                <span className="logo-text">FormGen</span>
              </div>
              
              <div className="nav-links">
                <a href="https://github.com/pradnyeshbhalekar/formgen" className="nav-link" target="_blank" rel="noopener noreferrer">
                  <Github size={18} />
                  <span>GitHub</span>
                </a>
                <a href="https://pypi.org/project/pyformgen/" className="nav-link" target="_blank" rel="noopener noreferrer">
                  <Package size={18} />
                  <span>PyPI</span>
                </a>
                <a href="mailto:pradnyeshbhalekar78@gmail.com" className="nav-link">
                  <Mail size={18} />
                  <span>Contact</span>
                </a>
                <button onClick={toggleDarkMode} className="theme-toggle">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="main-content">
          <div className="grid">
            
            {/* Left Panel - JSON Input */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="json-logo">{'{}'}</div>
                  <h2>JSON Schema Input</h2>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <textarea
                  value={jsonInput}
                  onChange={handleJsonChange}
                  onKeyDown={handleKeyDown}
                  className={`textarea ${!isValidJson ? 'textarea-invalid' : ''}`}
                  placeholder="Enter your JSON schema here..."
                />
                
                <button
                  onClick={generateForm}
                  disabled={isLoading || !isValidJson}
                  className="generate-button"
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <div className="json-logo" style={{ fontSize: '1rem', color: 'white' }}>{'{}'}</div>
                      <span>Generate React Form</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Panel - JSX Output */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="jsx-logo">&lt;/&gt;</div>
                  <h2>Generated React JSX</h2>
                </div>
                {generatedJSX && (
                  <button onClick={copyToClipboard} className="copy-button">
                    <Copy size={16} />
                    <span>{copySuccess ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                )}
              </div>
              
              <div className="output-area">
                {error && (
                  <div className="error">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                )}
                
                {isLoading && (
                  <div className="loading">
                    <div className="loading-content">
                      <div className="spinner"></div>
                      <p>Generating Output.....</p>
                    </div>
                  </div>
                )}
                
                {!isLoading && !error && generatedJSX && (
                  <div className="code-output">
                    <pre className="code">
                      <code>{generatedJSX}</code>
                    </pre>
                  </div>
                )}
                
                {!isLoading && !error && !generatedJSX && (
                  <div className="empty-state">
                    <div className="empty-state-content">
                      <div className="empty-state-icon">&lt;/&gt;</div>
                      <p>Generated JSX will appear here</p>
                      <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Enter a valid JSON schema and click "Generate"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="footer">
            <div className="footer-content">
              <div className="footer-section">
                <h3>Powered by pyformgen Python Library</h3>
                <p>
                  FormGen uses the pyformgen library to automatically convert JSON schemas into production-ready React forms.
                  No manual coding required - just paste your schema and get instant JSX output!
                </p>
              </div>
              
              <div className="footer-section">
                <h3>Connect & Resources</h3>
                <div className="footer-links">
                  <a href="https://github.com/pradnyeshbhalekar/formgen" className="footer-link" target="_blank" rel="noopener noreferrer">
                    <Github size={20} />
                    <div className="footer-link-text">
                      <span className="footer-link-title">View Source Code</span>
                      <span className="footer-link-desc">Contribute to the project</span>
                    </div>
                  </a>
                  
                  <a href="https://pypi.org/project/pyformgen/" className="footer-link" target="_blank" rel="noopener noreferrer">
                    <Package size={20} />
                    <div className="footer-link-text">
                      <span className="footer-link-title">Python Package</span>
                      <span className="footer-link-desc">Install via pip</span>
                    </div>
                  </a>
                  
                  <a href="mailto:pradnyeshbhalekar78@gmail.com" className="footer-link">
                    <Mail size={20} />
                    <div className="footer-link-text">
                      <span className="footer-link-title">Contact Developer</span>
                      <span className="footer-link-desc">Get support or feedback</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default FormGenerator;