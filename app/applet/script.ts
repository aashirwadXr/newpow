import { execSync } from 'child_process';
try {
  const output = execSync('git log -p -n 3 src/pages/About.tsx').toString();
  console.log(output);
} catch (e) {
  console.error(e);
}
