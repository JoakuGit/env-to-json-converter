import { useMemo, useState } from 'react';

const SAMPLE = `# Example .env
API_URL=https://api.example.com
PORT=3000
DEBUG=true
NAME="My App"`;

function parseEnv(text) {
  const result = {};
  const warnings = [];

  text.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) return;

    const cleaned = line.startsWith('export ') ? line.slice(7).trim() : line;
    const equalIndex = cleaned.indexOf('=');

    if (equalIndex === -1) {
      warnings.push(`Line ${index + 1}: missing '='`);
      return;
    }

    const key = cleaned.slice(0, equalIndex).trim();
    let value = cleaned.slice(equalIndex + 1).trim();

    if (!key) {
      warnings.push(`Line ${index + 1}: empty key`);
      return;
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    value = value
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t');

    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (value !== '' && !Number.isNaN(Number(value)) && /^-?\d+(\.\d+)?$/.test(value)) {
      value = Number(value);
    }

    result[key] = value;
  });

  return { result, warnings };
}

export default function App() {
  const [envText, setEnvText] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);

  const { result, warnings } = useMemo(() => parseEnv(envText), [envText]);
  const output = JSON.stringify(result, null, 2);

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <h1>ENV to JSON</h1>
          <p>Paste your `.env` file and get JSON output instantly.</p>
        </div>

        <div className="intro">
          <p>
            A lightweight browser-based dotenv converter for GitHub Pages.
            No backend, no install, just paste your environment variables and copy the JSON.
          </p>
        </div>

        <div className="grid">
          <div className="pane">
            <div className="toolbar">
              <strong>Input</strong>
              <div className="actions">
                <button onClick={() => setEnvText(SAMPLE)}>Load example</button>
                <button onClick={() => setEnvText('')}>Clear</button>
              </div>
            </div>
            <textarea
              value={envText}
              onChange={(e) => setEnvText(e.target.value)}
              spellCheck="false"
              aria-label=".env input"
            />
          </div>

          <div className="pane">
            <div className="toolbar">
              <strong>JSON Output</strong>
              <div className="actions">
                <button onClick={copyOutput}>Copy JSON</button>
              </div>
            </div>
            <pre>{output}</pre>
            <div className="meta">
              <span>{warnings.length ? `${warnings.length} warning(s)` : 'No warnings'}</span>
              <span>{copied ? 'Copied' : ' '}</span>
            </div>
            {warnings.length > 0 && (
              <p className="error" style={{ marginTop: 10 }}>
                {warnings.join(' | ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
