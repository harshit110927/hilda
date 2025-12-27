#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const command = process.argv[2];
const projectRoot = path.join(__dirname, '..');
const localEnvPath = path.join(process.cwd(), '.env');

// Helper to run shell commands cleanly
function runCommand(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { 
      cwd, 
      stdio: 'inherit', 
      shell: true,
      env: { ...process.env, ...dotenv.config({ path: localEnvPath }).parsed } 
    });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
  });
}

// 1. Load Environment if exists
if (fs.existsSync(localEnvPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(localEnvPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

async function main() {
  if (command === 'setup') {
    try {
      // Step A: Run the Wizard
      console.log('🔮 Launching Setup Wizard...');
      await runCommand('node', ['scripts/setup.js'], projectRoot);
      
      // Step B: NOW we build (With the keys the user just entered)
      console.log('\n🏗️  Building HILDA with your configuration...');
      await runCommand('npm', ['run', 'build'], projectRoot);
      
      console.log('\n✅ Setup & Build Complete! Run "hilda start" to launch.');
    } catch (err) {
      console.error('\n❌ Setup failed:', err.message);
      process.exit(1);
    }
  } 
  else if (command === 'start') {
    // Check if built
    if (!fs.existsSync(path.join(projectRoot, '.next'))) {
      console.error('❌ HILDA is not built yet.');
      console.error('👉 Please run "hilda setup" first.');
      process.exit(1);
    }

    console.log('🛡️  Starting HILDA Mission Control...');
    await runCommand('npm', ['run', 'start'], projectRoot);
  } 
  else {
    console.log(`
    Usage:
      hilda setup   - Configure keys & Build the agent
      hilda start   - Start the Mission Control dashboard
    `);
  }
}

main();