const http = require('http');
const { spawn } = require('child_process');

const HOST = '127.0.0.1';
const PORT = 8080;
const TARGET_URL = `http://${HOST}:${PORT}`;

let chromeOpened = false;
let shuttingDown = false;

const serveProcess = spawn('npm', ['run', 'serve'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: process.platform === 'win32'
});

const cleanup = (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;
  if (serveProcess && !serveProcess.killed) {
    serveProcess.kill(signal);
  }
};

['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((signal) => {
  process.on(signal, () => {
    cleanup(signal);
    process.exit(0);
  });
});

serveProcess.on('exit', (code) => {
  if (!shuttingDown) {
    process.exit(code ?? 0);
  }
});

function openChrome(url) {
  if (chromeOpened) return;
  chromeOpened = true;

  if (process.platform === 'darwin') {
    spawn('open', ['-a', 'Google Chrome', url], { stdio: 'ignore', detached: true });
    return;
  }

  if (process.platform === 'win32') {
    spawn('cmd', ['/c', 'start', 'chrome', url], { stdio: 'ignore', detached: true });
    return;
  }

  spawn('google-chrome', [url], { stdio: 'ignore', detached: true });
}

function waitForServer() {
  if (shuttingDown || chromeOpened) return;

  const request = http.get(TARGET_URL, (response) => {
    response.resume();
    if (response.statusCode && response.statusCode < 500) {
      openChrome(TARGET_URL);
      return;
    }
    setTimeout(waitForServer, 1000);
  });

  request.on('error', () => {
    setTimeout(waitForServer, 1000);
  });

  request.setTimeout(1000, () => {
    request.destroy();
    setTimeout(waitForServer, 1000);
  });
}

waitForServer();
