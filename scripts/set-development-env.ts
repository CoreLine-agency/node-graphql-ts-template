import { execSync } from 'child_process';
import { readFileSync } from 'fs';

try {
  readFileSync('.env', 'utf8');
} catch (e) {
  execSync('cp template.env .env');
  console.log('Default .env file created');
}
