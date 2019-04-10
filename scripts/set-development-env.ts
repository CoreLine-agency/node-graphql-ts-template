import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { trim } from 'lodash';
import readline from 'readline-promise';

const rlp = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

// tslint:disable-next-line
const randomPort = () => Math.floor((Math.random() * 58000) + 1100);

(async () => {
  try {
    readFileSync('.env', 'utf8');
  } catch (e) {
    let templateEnv = readFileSync('template.env', 'utf8');
    let dockerCompose = readFileSync('docker-compose.yml', 'utf8');
    if (templateEnv.includes('technobabble-template')) {
      const name = trim(await rlp.questionAsync('Docker database/machine/service name?'));
      if (!name) {
        throw new Error('Name must not be empty');
      }
      templateEnv = templateEnv.replace(/technobabble-template/g, name);

      const port = randomPort().toString(10);
      dockerCompose = dockerCompose.replace(/5402/g, port);
      templateEnv = templateEnv.replace(/5402/g, port);

      console.log('Setting up database for port', port);
      writeFileSync('template.env', templateEnv, { encoding: 'utf8' });
      writeFileSync('docker-compose.yml', dockerCompose, { encoding: 'utf8' });
    }
    execSync('cp template.env .env');
    console.log('Default .env file created');
  }
})();
