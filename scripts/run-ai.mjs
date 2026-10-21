import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const aiDir = path.resolve(rootDir, 'ai-service');

const venvWin = path.join(aiDir, '.venv', 'Scripts', 'python.exe');
const venvPosix = path.join(aiDir, '.venv', 'bin', 'python');

let pythonBin = 'python3';
if (existsSync(venvWin)) {
  pythonBin = venvWin;
} else if (existsSync(venvPosix)) {
  pythonBin = venvPosix;
} else if (process.platform === 'win32') {
  pythonBin = 'python';
}

const port = process.env.RAG_SERVICE_PORT || '8000';
const args = ['-m', 'uvicorn', 'app.main:app', '--reload', '--host', '0.0.0.0', '--port', port];

const child = spawn(pythonBin, args, {
  cwd: aiDir,
  stdio: 'inherit',
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
