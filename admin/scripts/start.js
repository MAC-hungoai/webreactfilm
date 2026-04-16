const { spawn } = require('child_process');

const port = process.env.PORT || '3002';
const nextBin = require.resolve('next/dist/bin/next');

const child = spawn(process.execPath, [nextBin, 'start', '-p', port], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
