const fs = require('fs');
const parser = require('@babel/parser');

const code = fs.readFileSync('/Volumes/Edulyst/Product/React/codeedu/src/views/create/learner/courses/details.tsx', 'utf-8');

try {
  parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });
  console.log('No syntax errors found by Babel!');
} catch (e) {
  console.error(`Syntax Error at line ${e.loc?.line}, col ${e.loc?.column}: ${e.message}`);
}
