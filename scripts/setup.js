// scripts/setup.js
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

const ENV_PATH = path.join(__dirname, '..', '.env');

// ASCII Art Header
const HEADER = `
${chalk.blue('██╗  ██╗██╗██╗     ██████╗  █████╗ ')}
${chalk.blue('██║  ██║██║██║     ██╔══██╗██╔══██╗')}
${chalk.blue('███████║██║██║     ██║  ██║███████║')}
${chalk.blue('██╔══██║██║██║     ██║  ██║██╔══██║')}
${chalk.blue('██║  ██║██║███████╗██████╔╝██║  ██║')}
${chalk.blue('╚═╝  ╚═╝╚═╝╚══════╝╚═════╝ ╚═╝  ╚═╝')}
   ${chalk.gray('>> AI DevOps Deployment Agent <<')}
`;

async function main() {
  console.clear();
  console.log(HEADER);
  console.log(chalk.green('?'), 'Welcome to the HILDA Setup Wizard.');
  console.log(chalk.gray('   This script will configure your local environment.\n'));

  // 1. SELECT AI PROVIDER
  const aiChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: 'Select your AI Intelligence Provider:',
      choices: [
        { name: 'Google Gemini (Free & Fast)', value: 'gemini' },
        { name: 'OpenAI GPT-4o (High Accuracy)', value: 'openai' },
        { name: 'Anthropic Claude 3.5 Sonnet (Coding Expert)', value: 'anthropic' },
      ],
    },
  ]);

  // 2. GET API KEYS (Dynamic based on choice)
  const envVars = {
    AI_PROVIDER: aiChoice.provider,
  };

  // Model Name Defaults
  if (aiChoice.provider === 'gemini') envVars.AI_MODEL_NAME = 'gemini-2.5-flash';
  if (aiChoice.provider === 'openai') envVars.AI_MODEL_NAME = 'gpt-4o';
  if (aiChoice.provider === 'anthropic') envVars.AI_MODEL_NAME = 'claude-3-5-sonnet-20240620';

  console.log();
  const apiKey = await inquirer.prompt([
    {
      type: 'password',
      name: 'key',
      message: `Paste your ${chalk.cyan(aiChoice.provider.toUpperCase())} API Key:`,
      validate: (input) => input.length > 0 ? true : 'API Key is required.',
    }
  ]);
  
  // Save generically as AI_API_KEY
  envVars.AI_API_KEY = apiKey.key;

  // 3. GITHUB SETUP
  console.log(chalk.blue('\n--- GitHub Integration ---'));
  const github = await inquirer.prompt([
    {
      type: 'password',
      name: 'token',
      message: 'Paste your GitHub Personal Access Token (Repo Scope):',
      validate: (input) => input.length > 0 ? true : 'Token required.',
    }
  ]);
  envVars.GITHUB_ACCESS_TOKEN = github.token;

  // 4. SUPABASE SETUP
  console.log(chalk.blue('\n--- Supabase Database ---'));
  console.log(chalk.gray('   (Find these in Project Settings -> API)'));
  const supabase = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: 'Supabase URL:',
      validate: (input) => input.includes('https://') ? true : 'Must be a valid URL.',
    },
    {
      type: 'password',
      name: 'key',
      message: 'Supabase Anon Key:',
    }
  ]);
  envVars.NEXT_PUBLIC_SUPABASE_URL = supabase.url;
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY = supabase.key;

  // 5. WRITE FILE
  const spinner = ora('Configuring HILDA...').start();
  
  const envContent = Object.entries(envVars)
    .map(([key, val]) => `${key}="${val}"`)
    .join('\n');

  try {
    fs.writeFileSync(ENV_PATH, envContent);
    spinner.succeed(chalk.green('Configuration saved to .env'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to write .env file.'));
    console.error(error);
  }

  // 6. FINAL INSTRUCTIONS
  console.log('\n' + chalk.bold('🚀 Setup Complete!'));
  console.log(chalk.gray('-------------------------------------'));
  console.log(`1. Run ${chalk.cyan('npm run dev')} to start Mission Control.`);
  console.log(`2. Start Ngrok: ${chalk.cyan('ngrok http 3000')}`);
  console.log(`3. Add Webhook to GitHub: ${chalk.cyan('[Your-Ngrok-URL]/api/webhooks/github')}`);
  console.log(chalk.gray('-------------------------------------'));
}

main();