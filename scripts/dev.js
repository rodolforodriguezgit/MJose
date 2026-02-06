const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.join(__dirname, '..');

let backReady = false;
let frontReady = false;
let messageShown = false;

const showReadyMessage = () => {
  if (backReady && frontReady && !messageShown) {
    messageShown = true;
    setTimeout(() => {
      console.log('\n' + '='.repeat(60));
      console.log('✅ AMBOS SERVIDORES ESTÁN LEVANTADOS');
      console.log('='.repeat(60));
      console.log('🚀 Backend:  http://localhost:3000');
      console.log('🎨 Frontend: http://localhost:5173');
      console.log('='.repeat(60) + '\n');
    }, 2000);
  }
};

// Iniciar Backend
const backProcess = spawn('npm', ['run', 'dev:back'], {
  cwd: rootDir,
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe']
});

backProcess.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(`[BACK] ${output}`);
  
  // Detectar cuando el backend está listo
  if ((output.includes('SERVIDOR INICIADO') || 
       output.includes('localhost:3000') || 
       output.includes('Puerto:')) && !backReady) {
    backReady = true;
    showReadyMessage();
  }
});

backProcess.stderr.on('data', (data) => {
  process.stderr.write(`[BACK] ${data}`);
});

// Iniciar Frontend
const frontProcess = spawn('npm', ['run', 'dev:front'], {
  cwd: rootDir,
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe']
});

frontProcess.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(`[FRONT] ${output}`);
  
  // Detectar cuando el frontend está listo
  if ((output.includes('Local:') || 
       output.includes('localhost:5173') || 
       output.includes('ready in') ||
       output.includes('5173')) && !frontReady) {
    frontReady = true;
    showReadyMessage();
  }
});

frontProcess.stderr.on('data', (data) => {
  process.stderr.write(`[FRONT] ${data}`);
});

// Manejar cierre
process.on('SIGINT', () => {
  console.log('\n\n🛑 Cerrando servidores...');
  backProcess.kill();
  frontProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  backProcess.kill();
  frontProcess.kill();
  process.exit(0);
});
