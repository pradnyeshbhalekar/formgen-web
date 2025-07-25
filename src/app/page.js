"use client"
import React, { useState } from 'react';
import { Github, Copy, Code2, Package } from 'lucide-react';

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
      // Call the actual API endpoint
      const response = await fetch('http://127.0.0.1:5000/generatedOutput', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonInput
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedJSX(data.jsx || 'No JSX returned from API');
    } catch (err) {
      setError(`Failed to generate form: ${err.message}`);
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
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      setJsonInput(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    } else if (e.key === '{') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      const newValue = value.substring(0, start) + '{}' + value.substring(end);
      setJsonInput(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1;
      }, 0);
    } else if (e.key === '[') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      const newValue = value.substring(0, start) + '[]' + value.substring(end);
      setJsonInput(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1;
      }, 0);
    } else if (e.key === '"') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      const newValue = value.substring(0, start) + '""' + value.substring(end);
      setJsonInput(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1;
      }, 0);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-900 text-xl font-bold">FormGen</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/pradnyeshbhalekar/formgen"
                className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-300"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a 
                href="https://pypi.org/project/pyformgen/"
                className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-300"
              >
                <Package className="w-5 h-5" />
                <span>PyPI</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
          
          {/* Left Panel - JSON Input */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-gray-100 border-b border-gray-200 p-4 flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">JSON Schema Input</h2>
            </div>
            
            <div className="flex-1 flex flex-col">
              <textarea
                value={jsonInput}
                onChange={handleJsonChange}
                onKeyDown={handleKeyDown}
                className={`flex-1 p-4 font-mono text-sm resize-none border-none outline-none text-gray-900 ${
                  !isValidJson ? 'border-l-4 border-red-500 bg-red-50' : 'bg-white'
                }`}
                placeholder="Enter your JSON schema here..."
                style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
              />
              
              <button
                onClick={generateForm}
                disabled={isLoading || !isValidJson}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-4 font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Code2 className="w-5 h-5" />
                    <span>Generate React Form</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - JSX Output */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-gray-100 border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Generated React JSX</h2>
              </div>
              {generatedJSX && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copySuccess ? 'Copied!' : 'Copy Code'}</span>
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-hidden">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}
              
              {isLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Calling API: http://127.0.0.1:5000/generatedOutput</p>
                  </div>
                </div>
              )}
              
              {!isLoading && !error && generatedJSX && (
                <div className="h-full overflow-auto bg-gray-900">
                  <pre className="text-cyan-400 p-4 text-sm leading-relaxed h-full overflow-auto">
                    <code>{generatedJSX}</code>
                  </pre>
                </div>
              )}
              
              {!isLoading && !error && !generatedJSX && (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Code2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Generated JSX will appear here</p>
                    <p className="text-sm mt-2">Enter a valid JSON schema and click "Generate"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Powered by pyformgen Python Library</h3>
          <p className="text-gray-600">
            FormGen uses the pyformgen library to automatically convert JSON schemas into production-ready React forms.
            No manual coding required - just paste your schema and get instant JSX output!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormGenerator;