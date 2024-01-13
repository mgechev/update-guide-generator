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

const validVersions = (range) => {
  return /(\d+\.\d+\.\d+)-(\d+\.\d+\.\d+)/.test(range);
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

const getCommits = (versions, path) => {
  const command = `git log --pretty=format:%B ${versions[0]}..${versions[1]}`;
  const commits = execSync(`cd ${options.path} && ${command}`).toString();
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
    "-v, --versions <string>",
    "Range of versions in the format X.Y.Z-A.B.C",
  );

program.parse();

const options = program.opts();

const versionsOption = options.versions;
if (!validVersions(versionsOption)) {
  error(
    "Wrong format of the versions range. Specify it in the format X.Y.Z-A.B.C",
  );
}

const versions = versionsOption.split("-");

info(`Getting commits between versions ${versions[0]} and ${versions[1]}`);
const commits = getCommits(versions, options.path);

info('Extracting "BREAKING CHANGE" messages');
const changes = getBreakingChanges(commits);

info("Querying Gemini Pro to generate the update guide");
const formattedChanges = await formatBreakingChanges(changes, versions[1]);

console.log(formattedChanges);
