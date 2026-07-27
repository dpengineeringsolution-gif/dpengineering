const fs = require('fs');
const path = require('path');

// ඔයාගේ වෙබ් අඩවියේ නම මෙතනට දෙන්න (අගට / දාන්න එපා)
const domain = 'https://oyagewebsite.com'; 

// HTML files තියෙන ෆෝල්ඩරය (මෙය root එක නම් __dirname ලෙස තබන්න)
const rootDir = __dirname; 

// සියලුම HTML files සොයා ගැනීමේ කේතය
function getHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            // node_modules, .git, සහ temp_html_backup ෆෝල්ඩර මඟ හරින්න
            if (file !== 'node_modules' && file !== '.git' && file !== 'temp_html_backup') {
                getHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const htmlFiles = getHtmlFiles(rootDir);

// XML සිතියම ලිවීම ආරම්භ කිරීම
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

htmlFiles.forEach(file => {
    // Mac/Windows path ගැටළු මඟහරවා ගැනීම
    let relativePath = path.relative(rootDir, file).replace(/\\/g, '/');
    
    // URL එකෙන් .html කෑල්ල සහ index.html ඉවත් කිරීම (Clean URLs සඳහා)
    let route = relativePath;
    if (route === 'index.html') {
        route = '';
    } else if (route.endsWith('/index.html')) {
        route = route.replace('/index.html', '');
    } else {
        route = route.replace('.html', '');
    }
    
    xml += `  <url>\n    <loc>${domain}/${route}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n  </url>\n`;
});

xml += '</urlset>';

// sitemap.xml ගොනුව නිර්මාණය කිරීම
fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), xml);
console.log('✅ Sitemap.xml ස්වයංක්‍රීයව සාදන ලදී!');
