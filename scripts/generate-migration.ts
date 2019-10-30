import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { sync as globSync } from 'glob';
import { createInterface } from 'readline';

import { connectionOptions } from '../ormconfig/ormconfig';

const stdio = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const isMigrationEmpty = process.argv[2] === 'empty';

stdio.question('Migration name: ', migrationName => {
  const { migrations, cli } = connectionOptions;
  const { migrationsDir } = cli;

  const response: Buffer = execSync(
    `npx typeorm migration:${isMigrationEmpty ? 'create' : 'generate'} --dir "${migrationsDir}" -n "${migrationName}"`,
  );
  console.log(response.toString('utf8'));

  for (const file of globSync(migrations[0])) {
    const content = readFileSync(file, 'utf8');
    if (content.indexOf('/* eslint:disable */') > -1) {
      continue;
    }
    writeFileSync(file, `/* eslint-disable */\n${content}`, { encoding: 'utf8' });
  }

  stdio.close();
});
