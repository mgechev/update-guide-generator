import { exit } from "process";
import { program } from "commander";
import c from "picocolors";
import { execSync } from "child_process";
import { formatBreakingChanges } from "./format.mjs";

const error = (message) => {
  console.error("❌ ", c.red(message));
  exit(0);
};

const info = (message) => {
  console.error("🗒️ ", c.blue(message));
};

const validVersion = (range) => {
  return /(\d+\.\d+\.\d+)(-(next|rc)\.\d)?/.test(range);
};

const getBreakingChanges = (commits) => {
  const regex = /BREAKING CHANGE:\s*([\S\s]*?)PR Close #/gm;
  const allMatches = [...commits.matchAll(regex)];
  const result = [];
  for (let match of allMatches) {
    result.push(match[1]);
  }
  return result;
};

const getCommits = (fromVersion, toVersion, path) => {
  const command = `git log --pretty=format:%B ${fromVersion}..${toVersion}`;
  const commits = execSync(`cd ${path} && ${command}`).toString();
  return commits;
};

program
  .name("Angular update guide generator")
  .description(
    "A command-line tool to generate the first draft of the Angular update guide automatically using Gemini Pro",
  )
  .option(
    "-p, --path <string>",
    "Path to the Angular monorepo",
    "~/Projects/angular",
  )
  .option(
    "-f, --from <string>",
    "Range of versions in the format X.Y.Z",
  )
  .option(
    "-t, --to <string>",
    "Range of versions in the format X.Y.Z",
  );

program.parse();

const options = program.opts();

const fromVersion = options.from;
const toVersion = options.to;
if (!validVersion(fromVersion) || !validVersion(toVersion)) {
  error(
    "Wrong format of the versions range. Specify it in the format X.Y.Z",
  );
}

info(`Getting commits between versions ${fromVersion} and ${toVersion}`);
const commits = getCommits(fromVersion, toVersion, options.path);

info('Extracting "BREAKING CHANGE" messages');
const changes = Array.from(new Set(getBreakingChanges(commits)));

info(`Found ${changes.length} breaking change${changes.length === 1 ? '' : 's'}`);

let result = [];
const batchSize = 2;
for (let i = 0; i < changes.length; i += batchSize) {
  const currentBatch = changes.slice(i, i + batchSize);

  info(`Querying Gemini Pro to generate the update guide. Breaking changes: [${i}, ${i + batchSize}] `);

  try {
    const formattedChanges = await formatBreakingChanges(currentBatch, toVersion);
    result = result.concat(formattedChanges);
  } catch (e) {
    error(e);
    i -= 2;
  }
}

console.log(JSON.stringify(result, null, 2));
