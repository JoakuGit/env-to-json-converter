export const ENV_SAMPLE = `# Example .env
API_URL=https://api.example.com
PORT=3000
DEBUG=true
NAME="My App"`;

export const JSON_SAMPLE = `{
  "API_URL": "https://api.example.com",
  "PORT": 3000,
  "DEBUG": true,
  "NAME": "My App"
}`;

export function parseEnv(text) {
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
    const rawValue = cleaned.slice(equalIndex + 1).trim();
    let value = rawValue;

    if (!key) {
      warnings.push(`Line ${index + 1}: empty key`);
      return;
    }

    if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
      try {
        value = JSON.parse(rawValue);
      } catch {
        warnings.push(`Line ${index + 1}: invalid quoted value`);
        value = rawValue.slice(1, -1);
      }
    } else if (rawValue.startsWith("'") && rawValue.endsWith("'")) {
      value = rawValue.slice(1, -1);
    } else {
      value = value.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t');

      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (value !== '' && !Number.isNaN(Number(value)) && /^-?\d+(\.\d+)?$/.test(value)) {
        value = Number(value);
      }
    }

    result[key] = value;
  });

  return { result, warnings };
}

export function jsonToEnv(text) {
  try {
    const parsed = JSON.parse(text);

    if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') {
      return { output: '', error: 'JSON input must be an object.' };
    }

    const output = Object.entries(parsed)
      .map(([key, value]) => {
        if (value === null) return `${key}=`;
        if (typeof value === 'string') return `${key}=${JSON.stringify(value)}`;
        if (typeof value === 'object') return `${key}=${JSON.stringify(JSON.stringify(value))}`;
        return `${key}=${String(value)}`;
      })
      .join('\n');

    return { output, error: '' };
  } catch (error) {
    return { output: '', error: `Invalid JSON: ${error.message}` };
  }
}
