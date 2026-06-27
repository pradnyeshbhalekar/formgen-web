import React, { useState, useEffect, useCallback } from 'react';
import { Github, Copy, Package, AlertCircle, Moon, Sun, Mail, BookOpen, ArrowRight, Zap, Layers, Check, Code2 } from 'lucide-react';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import './index.css';

// ── Logo — </> mark ───────────────────────────────────────────────────────────
function Logo({ size = 26 }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* < */}
      <path d="M13 4L3 14L13 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      {/* / */}
      <path d="M20 24L28 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      {/* > */}
      <path d="M35 4L45 14L35 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Default JSON ──────────────────────────────────────────────────────────────
const DEFAULT_JSON = `{
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
}`;

// ── Docs data ─────────────────────────────────────────────────────────────────
const FIELD_TYPES = [
  {
    type: 'text', desc: 'Single-line text input for short strings like names, usernames, or search queries.',
    attrs: [
      { name: 'placeholder', type: 'string', desc: 'Hint shown when the field is empty.' },
      { name: 'required', type: 'boolean', desc: 'Makes the field mandatory.' },
      { name: 'minlength', type: 'string', desc: 'Minimum number of characters.' },
      { name: 'maxlength', type: 'string', desc: 'Maximum number of characters.' },
      { name: 'pattern', type: 'string', desc: 'Regex the value must match.' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the input.' },
      { name: 'readonly', type: 'boolean', desc: 'Makes the input read-only.' },
    ],
    example: `"username": {\n  "label": "Username",\n  "type": "text",\n  "placeholder": "Enter username",\n  "required": true,\n  "maxlength": "20"\n}`,
    output: `<div>\n  <label>Username</label>\n  <input\n    name="username"\n    type="text"\n    value={username}\n    onChange={(e) => setUsername(e.target.value)}\n    placeholder="Enter username"\n    required\n    maxlength="20"\n  />\n</div>`,
  },
  {
    type: 'number', desc: 'Numeric input. Restricts entry to numbers and supports min, max, and step.',
    attrs: [
      { name: 'placeholder', type: 'string', desc: 'Hint shown when the field is empty.' },
      { name: 'required', type: 'boolean', desc: 'Makes the field mandatory.' },
      { name: 'min', type: 'string', desc: 'Minimum allowed value.' },
      { name: 'max', type: 'string', desc: 'Maximum allowed value.' },
      { name: 'step', type: 'string', desc: 'Increment step between values.' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the input.' },
    ],
    example: `"age": {\n  "label": "Age",\n  "type": "number",\n  "min": "0",\n  "max": "120",\n  "required": true\n}`,
    output: `<div>\n  <label>Age</label>\n  <input\n    name="age"\n    type="number"\n    value={age}\n    onChange={(e) => setAge(e.target.value)}\n    min="0"\n    max="120"\n    required\n  />\n</div>`,
  },
  {
    type: 'email', desc: 'Email input with built-in browser format validation (must contain @ and a domain).',
    attrs: [
      { name: 'placeholder', type: 'string', desc: 'Hint shown when the field is empty.' },
      { name: 'required', type: 'boolean', desc: 'Makes the field mandatory.' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the input.' },
    ],
    example: `"email": {\n  "label": "Email Address",\n  "type": "email",\n  "placeholder": "you@example.com",\n  "required": true\n}`,
    output: `<div>\n  <label>Email Address</label>\n  <input\n    name="email"\n    type="email"\n    value={email}\n    onChange={(e) => setEmail(e.target.value)}\n    placeholder="you@example.com"\n    required\n  />\n</div>`,
  },
  {
    type: 'password', desc: 'Password field — characters are masked. Use minlength to enforce strength.',
    attrs: [
      { name: 'placeholder', type: 'string', desc: 'Hint shown when the field is empty.' },
      { name: 'required', type: 'boolean', desc: 'Makes the field mandatory.' },
      { name: 'minlength', type: 'string', desc: 'Minimum number of characters.' },
      { name: 'maxlength', type: 'string', desc: 'Maximum number of characters.' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the input.' },
    ],
    example: `"password": {\n  "label": "Password",\n  "type": "password",\n  "minlength": "8",\n  "required": true\n}`,
    output: `<div>\n  <label>Password</label>\n  <input\n    name="password"\n    type="password"\n    value={password}\n    onChange={(e) => setPassword(e.target.value)}\n    minlength="8"\n    required\n  />\n</div>`,
  },
  {
    type: 'select', desc: 'Dropdown menu. The options array is required — each item needs a value and label.',
    attrs: [
      { name: 'options', type: 'array', desc: 'Array of { value, label } pairs. Required.' },
      { name: 'required', type: 'boolean', desc: 'Makes the field mandatory.' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the select.' },
    ],
    example: `"country": {\n  "label": "Country",\n  "type": "select",\n  "required": true,\n  "options": [\n    { "value": "us", "label": "United States" },\n    { "value": "in", "label": "India" }\n  ]\n}`,
    output: `<div>\n  <label>Country</label>\n  <select\n    name="country"\n    value={country}\n    onChange={(e) => setCountry(e.target.value)}\n    required\n  >\n    <option value="us">United States</option>\n    <option value="in">India</option>\n  </select>\n</div>`,
  },
  {
    type: 'checkbox', desc: 'Boolean toggle — checked or unchecked. Good for agreements or feature flags.',
    attrs: [
      { name: 'required', type: 'boolean', desc: 'Makes the checkbox mandatory (must be checked).' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the checkbox.' },
    ],
    example: `"terms": {\n  "label": "I agree to the Terms",\n  "type": "checkbox",\n  "required": true\n}`,
    output: `<div>\n  <label>I agree to the Terms</label>\n  <input\n    name="terms"\n    type="checkbox"\n    value={terms}\n    onChange={(e) => setTerms(e.target.value)}\n    required\n  />\n</div>`,
  },
  {
    type: 'date', desc: 'Native date picker. Use min/max to restrict the selectable date range.',
    attrs: [
      { name: 'required', type: 'boolean', desc: 'Makes the field mandatory.' },
      { name: 'min', type: 'string', desc: 'Earliest selectable date (YYYY-MM-DD).' },
      { name: 'max', type: 'string', desc: 'Latest selectable date (YYYY-MM-DD).' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the input.' },
    ],
    example: `"dob": {\n  "label": "Date of Birth",\n  "type": "date",\n  "required": true,\n  "max": "2006-01-01"\n}`,
    output: `<div>\n  <label>Date of Birth</label>\n  <input\n    name="dob"\n    type="date"\n    value={dob}\n    onChange={(e) => setDob(e.target.value)}\n    max="2006-01-01"\n    required\n  />\n</div>`,
  },
  {
    type: 'textarea', desc: 'Multi-line text input for longer content like bios, messages, or descriptions.',
    attrs: [
      { name: 'placeholder', type: 'string', desc: 'Hint shown when the field is empty.' },
      { name: 'required', type: 'boolean', desc: 'Makes the field mandatory.' },
      { name: 'minlength', type: 'string', desc: 'Minimum number of characters.' },
      { name: 'maxlength', type: 'string', desc: 'Maximum number of characters.' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the input.' },
      { name: 'readonly', type: 'boolean', desc: 'Makes the input read-only.' },
    ],
    example: `"bio": {\n  "label": "Bio",\n  "type": "textarea",\n  "placeholder": "Tell us about yourself",\n  "maxlength": "500"\n}`,
    output: `<div>\n  <label>Bio</label>\n  <input\n    name="bio"\n    type="textarea"\n    value={bio}\n    onChange={(e) => setBio(e.target.value)}\n    placeholder="Tell us about yourself"\n    maxlength="500"\n  />\n</div>`,
  },
  {
    type: 'tel', desc: 'Telephone number input. Use pattern to enforce a specific phone format.',
    attrs: [
      { name: 'placeholder', type: 'string', desc: 'Hint shown when the field is empty.' },
      { name: 'required', type: 'boolean', desc: 'Makes the field mandatory.' },
      { name: 'pattern', type: 'string', desc: 'Regex the phone number must match.' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the input.' },
    ],
    example: `"phone": {\n  "label": "Phone Number",\n  "type": "tel",\n  "placeholder": "+1 (555) 000-0000",\n  "pattern": "[+]?[0-9]{10,15}"\n}`,
    output: `<div>\n  <label>Phone Number</label>\n  <input\n    name="phone"\n    type="tel"\n    value={phone}\n    onChange={(e) => setPhone(e.target.value)}\n    placeholder="+1 (555) 000-0000"\n    pattern="[+]?[0-9]{10,15}"\n  />\n</div>`,
  },
  {
    type: 'url', desc: 'URL input with built-in validation — the value must start with http:// or https://.',
    attrs: [
      { name: 'placeholder', type: 'string', desc: 'Hint shown when the field is empty.' },
      { name: 'required', type: 'boolean', desc: 'Makes the field mandatory.' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the input.' },
    ],
    example: `"website": {\n  "label": "Website",\n  "type": "url",\n  "placeholder": "https://example.com"\n}`,
    output: `<div>\n  <label>Website</label>\n  <input\n    name="website"\n    type="url"\n    value={website}\n    onChange={(e) => setWebsite(e.target.value)}\n    placeholder="https://example.com"\n  />\n</div>`,
  },
  {
    type: 'range', desc: 'Slider input for selecting a number within a range. Always pair with min and max.',
    attrs: [
      { name: 'min', type: 'string', desc: 'Minimum value of the slider.' },
      { name: 'max', type: 'string', desc: 'Maximum value of the slider.' },
      { name: 'step', type: 'string', desc: 'Increment between slider stops.' },
      { name: 'required', type: 'boolean', desc: 'Makes the field mandatory.' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the slider.' },
    ],
    example: `"rating": {\n  "label": "Rating",\n  "type": "range",\n  "min": "1",\n  "max": "10",\n  "step": "1"\n}`,
    output: `<div>\n  <label>Rating</label>\n  <input\n    name="rating"\n    type="range"\n    value={rating}\n    onChange={(e) => setRating(e.target.value)}\n    min="1"\n    max="10"\n    step="1"\n  />\n</div>`,
  },
  {
    type: 'color', desc: 'Native color picker — lets the user pick any color from a palette.',
    attrs: [
      { name: 'required', type: 'boolean', desc: 'Makes the field mandatory.' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the picker.' },
    ],
    example: `"theme_color": {\n  "label": "Theme Color",\n  "type": "color"\n}`,
    output: `<div>\n  <label>Theme Color</label>\n  <input\n    name="theme_color"\n    type="color"\n    value={theme_color}\n    onChange={(e) => setTheme_color(e.target.value)}\n  />\n</div>`,
  },
];

const COMMON_ATTRS = [
  { name: 'label', type: 'string', desc: 'Display label shown above the field.' },
  { name: 'type', type: 'string', desc: 'Field type — see the types reference.' },
  { name: 'required', type: 'boolean', desc: 'Marks the field as required. Use true/false.' },
  { name: 'placeholder', type: 'string', desc: 'Hint text shown inside the input when empty.' },
  { name: 'disabled', type: 'boolean', desc: 'Disables the field.' },
  { name: 'readonly', type: 'boolean', desc: 'Makes the field read-only.' },
  { name: 'min / max', type: 'string', desc: 'Min/max value for number, range, or date fields.' },
  { name: 'minlength / maxlength', type: 'string', desc: 'Character length constraints for text fields.' },
  { name: 'step', type: 'string', desc: 'Increment step for number/range fields.' },
  { name: 'pattern', type: 'string', desc: 'Regex pattern for validation (text, tel, url).' },
  { name: 'options', type: 'array', desc: 'Array of { value, label } — only for select type.' },
];

// ── Utilities ─────────────────────────────────────────────────────────────────
function isValidJson(str) {
  try { JSON.parse(str); return true; } catch { return false; }
}

// ── Home page ─────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: <Zap size={20} />, title: 'Instant generation', desc: 'Paste your schema and get working React JSX in seconds. No configuration needed.' },
  { icon: <Code2 size={20} />, title: '12 field types', desc: 'text, number, email, password, select, checkbox, date, textarea, tel, url, range, color.' },
  { icon: <Layers size={20} />, title: 'Any HTML attribute', desc: 'Every key in your schema (except label/type) is passed directly as an HTML attribute.' },
  { icon: <Check size={20} />, title: 'Copy-paste ready', desc: 'Output includes useState hooks, onChange handlers, and a handleSubmit function.' },
];

const STEPS = [
  { n: '01', title: 'Write a JSON schema', desc: 'Describe your form fields — their labels, types, and constraints — as a simple JSON object.' },
  { n: '02', title: 'Click Generate', desc: 'The pyformgen backend converts your schema into a complete React component with state management.' },
  { n: '03', title: 'Copy and use', desc: 'Paste the generated JSX into your project. Style it with your own CSS or design system.' },
];

const EXAMPLE_INPUT = `{
  "email": {
    "label": "Email",
    "type": "email",
    "required": true
  },
  "role": {
    "label": "Role",
    "type": "select",
    "options": [
      { "value": "admin", "label": "Admin" },
      { "value": "user",  "label": "User"  }
    ]
  }
}`;

const EXAMPLE_OUTPUT = `import { useState } from 'react';

export default function GeneratedForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, role });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input name="email" type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required />
      </div>
      <div>
        <label>Role</label>
        <select name="role" value={role}
          onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}`;

function HomePage({ onNavigate }) {
  return (
    <main className="main home-main">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-glow" />
        <h1 className="home-h1 anim fade-up d0">
          Turn JSON schemas into<br />
          <span className="gradient-text">React forms instantly</span>
        </h1>
        <p className="home-lead anim fade-up d1">
          Describe your form in JSON. FormGen generates a complete React component with state, handlers, and submit logic — ready to drop into any project.
        </p>
        <div className="home-cta-row anim fade-up d2">
          <button className="btn-primary" onClick={() => onNavigate('generator')}>
            Try the Generator <ArrowRight size={15} />
          </button>
          <button className="btn-ghost" onClick={() => onNavigate('docs')}>
            <BookOpen size={15} /> View Reference
          </button>
        </div>
      </section>

      {/* Preview */}
      <section className="home-preview">
        <div className="preview-panel anim slide-l d3" style={{ animation: 'slideLeft 0.65s cubic-bezier(0.22,1,0.36,1) 300ms both, float 4s ease-in-out 1s infinite' }}>
          <div className="preview-panel-header">
            <span className="panel-dot json" /> JSON Schema
          </div>
          <pre className="preview-code light-code">{EXAMPLE_INPUT}</pre>
        </div>
        <div className="preview-arrow anim fade-in d4">
          <ArrowRight size={20} />
        </div>
        <div className="preview-panel anim slide-r d3" style={{ animation: 'slideRight 0.65s cubic-bezier(0.22,1,0.36,1) 300ms both, float 4s ease-in-out 1.8s infinite' }}>
          <div className="preview-panel-header">
            <span className="panel-dot jsx" /> Generated JSX
          </div>
          <pre className="preview-code dark-code">{EXAMPLE_OUTPUT}</pre>
        </div>
      </section>

      {/* Features */}
      <section className="home-section">
        <h2 className="home-section-title anim fade-up d4">Everything you need</h2>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className={`feature-card anim fade-up d${4 + i}`} key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="home-section">
        <h2 className="home-section-title anim fade-up d5">How it works</h2>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div className={`step-card anim fade-up d${6 + i}`} key={s.n}>
              <div className="step-number">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="home-cta-strip anim fade-up d7">
        <h2>Ready to build your form?</h2>
        <p>No sign-up required. Paste a schema, generate, copy.</p>
        <button className="btn-primary" onClick={() => onNavigate('generator')}>
          Open Generator <ArrowRight size={15} />
        </button>
      </section>
    </main>
  );
}

// ── Docs page ─────────────────────────────────────────────────────────────────
function DocsPage({ onTryInGenerator }) {
  const [activeType, setActiveType] = useState(FIELD_TYPES[0].type);
  const active = FIELD_TYPES.find(f => f.type === activeType);

  return (
    <div className="docs-layout">
      <aside className="docs-sidebar">
        <div className="docs-sidebar-section">
          <p className="docs-sidebar-label">Field Types</p>
          {FIELD_TYPES.map(f => (
            <button key={f.type} className={`docs-nav-item${activeType === f.type ? ' active' : ''}`} onClick={() => setActiveType(f.type)}>
              <code>{f.type}</code>
            </button>
          ))}
        </div>
        <div className="docs-sidebar-section">
          <p className="docs-sidebar-label">Reference</p>
          <button className={`docs-nav-item${activeType === '__attrs' ? ' active' : ''}`} onClick={() => setActiveType('__attrs')}>
            All Attributes
          </button>
        </div>
      </aside>

      <div className="docs-content">
        {activeType === '__attrs' ? (
          <>
            <h2 className="docs-title">All Supported Attributes</h2>
            <p className="docs-desc">Every key besides <code>type</code> and <code>options</code> is passed directly as an HTML attribute to the generated <code>&lt;input&gt;</code> or <code>&lt;select&gt;</code>.</p>
            <table className="attr-table">
              <thead><tr><th>Key</th><th>Value type</th><th>Description</th></tr></thead>
              <tbody>
                {COMMON_ATTRS.map(a => (
                  <tr key={a.name}><td><code>{a.name}</code></td><td><span className="attr-type">{a.type}</span></td><td>{a.desc}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="docs-field-header">
              <div>
                <code className="docs-type-badge">{active.type}</code>
                <p className="docs-desc" style={{ marginTop: '0.75rem', marginBottom: 0 }}>{active.desc}</p>
              </div>
              <button className="btn-primary" style={{ fontSize: 12, padding: '7px 14px', whiteSpace: 'nowrap' }} onClick={() => onTryInGenerator(active.example)}>
                Try in Generator <ArrowRight size={13} />
              </button>
            </div>

            {/* Schema + Output side by side */}
            <h3 className="docs-section-title">Schema → Output</h3>
            <div className="docs-split">
              <div className="docs-split-panel">
                <div className="docs-split-label"><span className="panel-dot json" />JSON Schema</div>
                <div className="docs-code-block"><pre><code>{active.example}</code></pre></div>
              </div>
              <div className="docs-split-panel">
                <div className="docs-split-label"><span className="panel-dot jsx" />Generated JSX</div>
                <div className="docs-code-block"><pre><code>{active.output}</code></pre></div>
              </div>
            </div>

            {/* Attributes table */}
            <h3 className="docs-section-title">Supported attributes</h3>
            <table className="attr-table">
              <thead><tr><th>Key</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                {active.attrs.map(a => (
                  <tr key={a.name}>
                    <td><code>{a.name}</code></td>
                    <td><span className="attr-type">{a.type}</span></td>
                    <td>{a.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

// ── CodeMirror light theme matching the site ───────────────────────────────────
const lightTheme = EditorView.theme({
  '&': { background: 'var(--surface)', color: 'var(--text)', height: '100%', fontSize: '12.5px' },
  '.cm-content': { padding: '12px 0', fontFamily: "'SF Mono','Fira Code','Consolas',monospace", lineHeight: '1.65' },
  '.cm-gutters': { background: 'var(--surface-2)', borderRight: '1px solid var(--border)', color: 'var(--text-faint)', minWidth: '42px' },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 10px 0 6px', minWidth: '34px' },
  '.cm-activeLine': { background: 'rgba(0,0,0,0.03)' },
  '.cm-activeLineGutter': { background: 'var(--surface-3)' },
  '.cm-cursor': { borderLeftColor: 'var(--accent)' },
  '.cm-selectionBackground, ::selection': { background: 'var(--accent-subtle) !important' },
  '.cm-matchingBracket': { background: 'var(--accent-subtle)', color: 'var(--accent) !important', fontWeight: '700' },
  '.cm-foldPlaceholder': { background: 'var(--accent-subtle)', border: 'none', color: 'var(--accent)' },
  '.cm-scroller': { overflow: 'auto' },
}, { dark: false });

// ── Generator page ────────────────────────────────────────────────────────────
function GeneratorPage({ prefill, onPrefillUsed }) {
  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);
  const [generatedJSX, setGeneratedJSX] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [jsonValid, setJsonValid] = useState(true);
  const [copied, setCopied] = useState(false);
  const [darkMode] = useState(() => document.documentElement.classList.contains('dark'));

  const handleChange = useCallback((val) => {
    setJsonInput(val);
    setJsonValid(isValidJson(val));
    if (error) setError('');
  }, [error]);

  const generate = async () => {
    if (!jsonValid) { setError('Invalid JSON'); return; }
    setIsLoading(true); setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURI}/generatedOutput`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(JSON.parse(jsonInput)),
      });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text() || res.statusText}`);
      const data = await res.json();
      setGeneratedJSX(data.jsx || '');
    } catch (err) {
      setError(err.message.includes('fetch') ? 'Cannot reach the server. Check your connection.' : err.message);
    } finally { setIsLoading(false); }
  };

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(generatedJSX); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  useEffect(() => {
    if (prefill) { setJsonInput(prefill); setJsonValid(isValidJson(prefill)); onPrefillUsed(); }
  }, [prefill]);

  const lineCount = jsonInput.split('\n').length;
  const outputLineCount = generatedJSX ? generatedJSX.split('\n').length : 0;

  return (
    <main className="main gen-main">
      <div className="gen-header">
        <div>
          <h1 className="gen-title">Generator</h1>
          <p className="gen-subtitle">Paste a JSON schema — get production-ready React JSX.</p>
        </div>
        <button className="btn-primary" onClick={generate} disabled={isLoading || !jsonValid} style={{ alignSelf: 'center' }}>
          {isLoading ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Generating…</> : <><Logo size={15} /> Generate</>}
        </button>
      </div>

      <div className="editor-grid">
        {/* Input */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><span className="panel-dot json" />JSON Schema</div>
            {!jsonValid
              ? <span className="invalid-badge"><AlertCircle size={12} /> Invalid JSON</span>
              : <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{lineCount} lines</span>
            }
          </div>
          <div className={`cm-wrapper${!jsonValid ? ' invalid' : ''}`}>
            <CodeMirror
              value={jsonInput}
              onChange={handleChange}
              extensions={[json()]}
              theme={darkMode ? oneDark : lightTheme}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                autocompletion: true,
                bracketMatching: true,
                closeBrackets: true,
                indentOnInput: true,
                highlightActiveLine: true,
                highlightActiveLineGutter: true,
                tabSize: 2,
              }}
              style={{ height: '100%' }}
            />
          </div>
          <div className="panel-statusbar">
            <span>Tab to indent · Brackets auto-close</span>
            <span>{jsonValid ? '✓ Valid JSON' : '✗ Invalid JSON'}</span>
          </div>
        </div>

        {/* Output */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><span className="panel-dot jsx" />Generated JSX</div>
            {generatedJSX && (
              <button className="copy-btn" onClick={copyCode}>
                <Copy size={13} />{copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          {error && <div className="error-bar"><AlertCircle size={14} style={{ flexShrink: 0 }} />{error}</div>}
          {isLoading && (
            <div className="loading-state">
              <div className="spinner" style={{ width: 22, height: 22 }} />
              Generating your React component…
            </div>
          )}
          {!isLoading && !error && generatedJSX && <div className="code-output"><pre><code>{generatedJSX}</code></pre></div>}
          {!isLoading && !error && !generatedJSX && (
            <div className="empty-state">
              <Logo size={32} />
              <span style={{ marginTop: 8 }}>Output appears here</span>
              <span style={{ fontSize: 12, opacity: 0.5 }}>Fill in the schema and click Generate</span>
            </div>
          )}
          {generatedJSX && (
            <div className="panel-statusbar">
              <span>{outputLineCount} lines generated</span>
              <span style={{ color: 'var(--accent)' }}>✓ Ready to use</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// ── Root app ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [prefillJson, setPrefillJson] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const tryInGenerator = (exampleSnippet) => {
    const wrapped = `{\n  ${exampleSnippet.split('\n').join('\n  ')}\n}`;
    setPrefillJson(wrapped);
    setPage('generator');
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="nav">
        <button className="nav-brand" onClick={() => setPage('home')}>
          <Logo size={26} />
          <span>FormGen</span>
        </button>
          <div className="nav-actions">
            <button className={`nav-btn${page === 'home' ? ' nav-btn-active' : ''}`} onClick={() => setPage('home')}>Home</button>
            <button className={`nav-btn${page === 'generator' ? ' nav-btn-active' : ''}`} onClick={() => setPage('generator')}>Generator</button>
            <button className={`nav-btn${page === 'docs' ? ' nav-btn-active' : ''}`} onClick={() => setPage('docs')}>
              <BookOpen size={13} /><span>Reference</span>
            </button>
            <div className="nav-divider" />
            <a href="https://github.com/pradnyeshbhalekar/formgen" className="nav-btn" target="_blank" rel="noopener noreferrer">
              <Github size={14} /><span>GitHub</span>
            </a>
            <a href="https://pypi.org/project/pyformgen/" className="nav-btn" target="_blank" rel="noopener noreferrer">
              <Package size={14} /><span>PyPI</span>
            </a>
            <div className="nav-divider" />
            <button className="nav-btn icon-only" onClick={() => setDarkMode(d => !d)} title="Toggle theme">
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </nav>

        {/* Pages */}
        {page === 'home'      && <HomePage onNavigate={setPage} />}
        {page === 'generator' && <GeneratorPage prefill={prefillJson} onPrefillUsed={() => setPrefillJson(null)} />}
        {page === 'docs'      && (
          <main className="main">
            <div className="hero" style={{ paddingBottom: '1rem' }}>
              <h1><span className="gradient-text">Schema</span> Reference</h1>
              <p className="hero-sub">All supported field types and their configuration options.</p>
            </div>
            <DocsPage onTryInGenerator={tryInGenerator} />
          </main>
        )}

        {/* Footer */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <button className="footer-logo-btn" onClick={() => setPage('home')}>
                <Logo size={20} />
                <span className="footer-brand-name">FormGen</span>
              </button>
              <p className="footer-tagline">JSON schema → production-ready React forms.<br />No setup. No sign-up. Just paste and generate.</p>
            </div>

            <div className="footer-cols">
              <div className="footer-col">
                <p className="footer-col-label">Product</p>
                <button className="footer-link-btn" onClick={() => setPage('generator')}>Generator</button>
                <button className="footer-link-btn" onClick={() => setPage('docs')}>Reference</button>
                <button className="footer-link-btn" onClick={() => setPage('home')}>Home</button>
              </div>
              <div className="footer-col">
                <p className="footer-col-label">Resources</p>
                <a className="footer-link-btn" href="https://github.com/pradnyeshbhalekar/formgen" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a className="footer-link-btn" href="https://pypi.org/project/pyformgen/" target="_blank" rel="noopener noreferrer">PyPI Package</a>
                <a className="footer-link-btn" href="mailto:pradnyeshbhalekar78@gmail.com">Contact</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>Built with pyformgen · MIT License</span>
            <div className="footer-bottom-links">
              <a href="https://github.com/pradnyeshbhalekar/formgen" target="_blank" rel="noopener noreferrer"><Github size={15} /></a>
              <a href="https://pypi.org/project/pyformgen/" target="_blank" rel="noopener noreferrer"><Package size={15} /></a>
              <a href="mailto:pradnyeshbhalekar78@gmail.com"><Mail size={15} /></a>
            </div>
          </div>
        </footer>
    </div>
  );
}
