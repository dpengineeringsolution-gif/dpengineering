const fs = require('fs');
const path = require('path');

const PAGES = ['about', 'services', 'projects', 'contact'];
const ROOT_DIR = __dirname;
const BACKUP_DIR = path.join(ROOT_DIR, 'temp_html_backup');

// Ensure backup folder exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// 1. Process subpages
PAGES.forEach(page => {
  const originalFileName = `${page}.html`;
  const originalFilePath = path.join(ROOT_DIR, originalFileName);

  if (!fs.existsSync(originalFilePath)) {
    console.log(`Warning: File ${originalFileName} not found, skipping.`);
    return;
  }

  console.log(`Processing subpage: ${originalFileName}`);

  // Read original HTML
  let html = fs.readFileSync(originalFilePath, 'utf8');

  // Replace assets to be relative (prefix with ../)
  // Catch href="assets/, src="assets/, and any general "assets/ or 'assets/
  html = html.replace(/(href|src)=["']assets\//g, (match, p1) => `${p1}="../assets/`);
  // Also catch background-image URLs if any, e.g., url('assets/
  html = html.replace(/url\(["']?assets\//g, "url('../assets/");

  // Replace page links to point to pretty directory URLs
  html = html.replace(/href="index\.html"/g, 'href="../"');
  html = html.replace(/href="about\.html"/g, 'href="../about/"');
  html = html.replace(/href="services\.html"/g, 'href="../services/"');
  html = html.replace(/href="projects\.html"/g, 'href="../projects/"');
  html = html.replace(/href="contact\.html"/g, 'href="../contact/"');

  // Create page directory
  const pageDir = path.join(ROOT_DIR, page);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  // Write new index.html in directory
  const newFilePath = path.join(pageDir, 'index.html');
  fs.writeFileSync(newFilePath, html, 'utf8');
  console.log(`Created ${page}/index.html`);

  // Move original file to backup directory
  const backupFilePath = path.join(BACKUP_DIR, originalFileName);
  fs.renameSync(originalFilePath, backupFilePath);
  console.log(`Backed up original ${originalFileName} to temp_html_backup/`);
});

// 2. Process root index.html
const indexFilePath = path.join(ROOT_DIR, 'index.html');
if (fs.existsSync(indexFilePath)) {
  console.log('Processing root index.html');
  let indexHtml = fs.readFileSync(indexFilePath, 'utf8');

  // Update page links in root index.html
  indexHtml = indexHtml.replace(/href="index\.html"/g, 'href="./"');
  indexHtml = indexHtml.replace(/href="about\.html"/g, 'href="about/"');
  indexHtml = indexHtml.replace(/href="services\.html"/g, 'href="services/"');
  indexHtml = indexHtml.replace(/href="projects\.html"/g, 'href="projects/"');
  indexHtml = indexHtml.replace(/href="contact\.html"/g, 'href="contact/"');

  fs.writeFileSync(indexFilePath, indexHtml, 'utf8');
  console.log('Updated root index.html references');
}

console.log('Project directory restructuring completed successfully!');
