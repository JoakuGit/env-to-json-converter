import { useMemo, useState } from 'react';
import { ENV_SAMPLE, JSON_SAMPLE, jsonToEnv, parseEnv } from './converters.js';

export default function App() {
  const [mode, setMode] = useState('env-to-json');
  const [input, setInput] = useState(ENV_SAMPLE);
  const [copied, setCopied] = useState(false);

  const conversion = useMemo(() => {
    if (mode === 'env-to-json') {
      const { result, warnings } = parseEnv(input);
      return { output: JSON.stringify(result, null, 2), warnings, error: '' };
    }

    return { ...jsonToEnv(input), warnings: [] };
  }, [input, mode]);

  const { output, warnings, error } = conversion;
  const isEnvToJson = mode === 'env-to-json';

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setInput(nextMode === 'env-to-json' ? ENV_SAMPLE : JSON_SAMPLE);
    setCopied(false);
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <h1>ENV ↔ JSON</h1>
          <p>Convert environment variables and JSON in either direction.</p>
        </div>

        <div className="intro">
          <p>
            A lightweight, browser-based converter. No backend and no install—your data stays
            in your browser.
          </p>
          <div className="mode-switch" role="group" aria-label="Conversion direction">
            <button
              className={isEnvToJson ? 'active' : ''}
              onClick={() => changeMode('env-to-json')}
            >
              ENV → JSON
            </button>
            <button
              className={!isEnvToJson ? 'active' : ''}
              onClick={() => changeMode('json-to-env')}
            >
              JSON → ENV
            </button>
          </div>
        </div>

        <div className="grid">
          <div className="pane">
            <div className="toolbar">
              <strong>Input</strong>
              <div className="actions">
                <button onClick={() => setInput(isEnvToJson ? ENV_SAMPLE : JSON_SAMPLE)}>
                  Load example
                </button>
                <button onClick={() => setInput('')}>Clear</button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck="false"
              aria-label={isEnvToJson ? '.env input' : 'JSON input'}
            />
          </div>

          <div className="pane">
            <div className="toolbar">
              <strong>{isEnvToJson ? 'JSON Output' : 'ENV Output'}</strong>
              <div className="actions">
                <button onClick={copyOutput} disabled={Boolean(error)}>
                  Copy {isEnvToJson ? 'JSON' : 'ENV'}
                </button>
              </div>
            </div>
            <pre>{output}</pre>
            <div className="meta">
              <span>{error || (warnings.length ? `${warnings.length} warning(s)` : 'Ready')}</span>
              <span>{copied ? 'Copied' : ' '}</span>
            </div>
            {warnings.length > 0 && (
              <p className="error" style={{ marginTop: 10 }}>
                {warnings.join(' | ')}
              </p>
            )}
            {error && (
              <p className="error" style={{ marginTop: 10 }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
