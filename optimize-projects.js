const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectsDir = path.join(__dirname, 'assets', 'images', 'Projects');
const outputDir = path.join(__dirname, 'assets', 'images', 'projects_optimized');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const folderMapping = {
    'Construction Veterinary Office at kuruvita': 'kuruvita_vet_office',
    'Construction of Boundaru wall at Diyagama': 'diyagama_boundary_wall',
    'Construction school Building of parakaduwa Primery school': 'parakaduwa_school',
    'Renovation MOIC Quarters of Eratna Hospital': 'eratna_hospital_quarters'
};

async function processProjects() {
    console.log('Starting image optimization...');
    const subfolders = fs.readdirSync(projectsDir);
    
    let totalProcessed = 0;
    
    for (const folderName of subfolders) {
        const fullFolderPath = path.join(projectsDir, folderName);
        if (!fs.statSync(fullFolderPath).isDirectory()) continue;
        
        const projSlug = folderMapping[folderName] || folderName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const projOutputDir = path.join(outputDir, projSlug);
        
        if (!fs.existsSync(projOutputDir)) {
            fs.mkdirSync(projOutputDir, { recursive: true });
        }
        
        const files = fs.readdirSync(fullFolderPath).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
        console.log(`\nProcessing folder: "${folderName}" -> slug: "${projSlug}" (${files.length} images)`);
        
        let index = 1;
        for (const file of files) {
            const inputFilePath = path.join(fullFolderPath, file);
            const outputFileName = `img_${index.toString().padStart(2, '0')}.webp`;
            const outputFilePath = path.join(projOutputDir, outputFileName);
            
            try {
                const metadata = await sharp(inputFilePath).metadata();
                const resizeOptions = {};
                
                if (metadata.width > 1200 || metadata.height > 1200) {
                    if (metadata.width >= metadata.height) {
                        resizeOptions.width = 1200;
                    } else {
                        resizeOptions.height = 1200;
                    }
                }
                
                await sharp(inputFilePath)
                    .resize(resizeOptions)
                    .webp({ quality: 82 })
                    .toFile(outputFilePath);
                
                const origSize = (fs.statSync(inputFilePath).size / 1024 / 1024).toFixed(2);
                const newSize = (fs.statSync(outputFilePath).size / 1024).toFixed(1);
                console.log(`  [${index}/${files.length}] ${file} (${origSize} MB) -> ${outputFileName} (${newSize} KB)`);
                index++;
                totalProcessed++;
            } catch (err) {
                console.error(`  Error processing ${file}:`, err.message);
            }
        }
    }
    
    console.log(`\nOptimization Complete! Total ${totalProcessed} images saved in ${outputDir}`);
}

processProjects();
