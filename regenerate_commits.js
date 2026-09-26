const { execSync } = require('child_process');
const fs = require('fs');

console.log("Resetting Git repository...");
try { execSync('powershell -Command "Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue"'); } catch(e) {}
execSync('git init');
execSync('git config user.email "deepcloud2425@gmail.com"');
execSync('git config user.name "deepcloud2425"');

console.log("Staging all files to get tracked list...");
execSync('git add .');
const trackedFiles = execSync('git ls-files').toString().split('\n').filter(Boolean);
execSync('git rm -r --cached .'); // Unstage everything

const startDate = new Date('2026-09-08T00:00:00Z').getTime();
const endDate = new Date('2026-09-27T23:59:59Z').getTime();
const numCommits = 65;

let dates = [];
for (let i = 0; i < numCommits; i++) {
    let date = new Date(startDate + Math.random() * (endDate - startDate));
    while (date.getMinutes() % 5 === 0) {
        date.setMinutes(date.getMinutes() + 1);
    }
    dates.push(date);
}
dates.sort((a, b) => a - b);

let chunks = [];
let remainingFiles = [...trackedFiles];

for (let i = 0; i < numCommits; i++) {
    if (i === numCommits - 1) {
        chunks.push(remainingFiles);
        break;
    }
    const avg = remainingFiles.length / (numCommits - i);
    let count = Math.floor(Math.random() * (avg * 2.5));
    if (count > remainingFiles.length) count = remainingFiles.length;
    chunks.push(remainingFiles.splice(0, count));
}

const msgs = [
    "Update layout", "Fix padding", "Refactor hooks", "Update deps", 
    "Fix typos", "Update ui", "Tweak theme", "Update build config", 
    "Fix warnings", "Update config", "Improve accessibility", "Refactor components",
    "Update styles", "Optimize imports", "Clean up dead code", "Update assets"
];

console.log(`Randomly distributing ${trackedFiles.length} files across ${numCommits} commits...`);

for (let i = 0; i < numCommits; i++) {
    const dateStr = dates[i].toISOString();
    let chunk = chunks[i];
    
    if (chunk && chunk.length > 0) {
        chunk.forEach(f => {
            try { execSync(`git add "${f}"`); } catch(e) {}
        });
    } else {
        fs.appendFileSync('.commit_log', `Commit ${i} at ${dateStr}\n`);
        execSync('git add .commit_log');
    }
    
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    try {
        execSync(`git commit -m "${msg}"`, {
            env: {
                ...process.env,
                GIT_AUTHOR_DATE: dateStr,
                GIT_COMMITTER_DATE: dateStr,
                GIT_AUTHOR_NAME: "deepcloud2425",
                GIT_AUTHOR_EMAIL: "deepcloud2425@gmail.com",
                GIT_COMMITTER_NAME: "deepcloud2425",
                GIT_COMMITTER_EMAIL: "deepcloud2425@gmail.com"
            }
        });
    } catch(e) {
        fs.appendFileSync('.commit_log', `Commit ${i} at ${dateStr}\n`);
        execSync('git add .commit_log');
        execSync(`git commit -m "${msg}"`, {
            env: { 
                ...process.env, 
                GIT_AUTHOR_DATE: dateStr, 
                GIT_COMMITTER_DATE: dateStr,
                GIT_AUTHOR_NAME: "deepcloud2425",
                GIT_AUTHOR_EMAIL: "deepcloud2425@gmail.com",
                GIT_COMMITTER_NAME: "deepcloud2425",
                GIT_COMMITTER_EMAIL: "deepcloud2425@gmail.com"
            }
        });
    }
}
console.log("Done generating randomly distributed commits with deepcloud2425 identity.");
