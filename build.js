const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}

const srcPath = path.join(__dirname, 'src');

let indexHtml = fs.readFileSync(path.join(srcPath, 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(srcPath, 'styles.css'), 'utf8');
let scriptJs = fs.readFileSync(path.join(srcPath, 'script.js'), 'utf8');
const talksJson = fs.readFileSync(path.join(srcPath, 'talks.json'), 'utf8');

// Replace the fetch call in script.js with the actual data
scriptJs = scriptJs.replace(
  `fetch('talks.json')
    .then(response => response.json())
    .then(data => {
      talks = data;
      renderSchedule(talks);
    })`,
  `talks = ${talksJson};
   renderSchedule(talks);`
);

indexHtml = indexHtml.replace('<link rel="stylesheet" href="styles.css">', `<style>${stylesCss}</style>`);
indexHtml = indexHtml.replace('<script src="script.js"></script>', `<script>${scriptJs}</script>`);

fs.writeFileSync(path.join(distPath, 'index.html'), indexHtml);

console.log('Successfully built single page website to dist/index.html');
