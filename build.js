const fs = require('fs');
const path = require('path');

const slidesDir    = path.join(__dirname, 'slides');
const partialsDir  = path.join(__dirname, 'partials');
const orderFile    = path.join(__dirname, 'order.txt');
const outputPath   = path.join(__dirname, 'dist', 'index.html');

const head  = fs.readFileSync(path.join(partialsDir, 'head.html'), 'utf8');
const shell = fs.readFileSync(path.join(partialsDir, 'shell.html'), 'utf8');

const order = fs.readFileSync(orderFile, 'utf8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line && !line.startsWith('#')); // ข้ามบรรทัดว่างและ comment

const slidesHtml = order
  .map(name => fs.readFileSync(path.join(slidesDir, `${name}.html`), 'utf8'))
  .join('\n\n');

const bodyHtml = shell.replace('<!--SLIDES-->', slidesHtml);

const finalHtml = `<!DOCTYPE html>
<html lang="th">
<head>
${head}
</head>
<body>
${bodyHtml}
</body>
</html>
`;

if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'));
}

fs.writeFileSync(outputPath, finalHtml, 'utf8');
console.log(`Built ${order.length} slides -> ${outputPath}`);