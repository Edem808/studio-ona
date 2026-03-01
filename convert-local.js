import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dirsToScan = ['public', 'src'];
const exts = ['.jpg', '.jpeg', '.png'];
const codeExts = ['.jsx', '.js', '.css'];

async function processDirectory(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (let file of list) {
        if (file === 'node_modules' || file === '.git' || file === 'dist') continue;
        const fullPath = path.resolve(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(await processDirectory(fullPath));
        } else {
            const ext = path.extname(fullPath).toLowerCase();
            if (exts.includes(ext)) {
                results.push(fullPath);
            }
        }
    }
    return results;
}

async function getCodeFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (let file of list) {
        if (file === 'node_modules' || file === '.git' || file === 'dist') continue;
        const fullPath = path.resolve(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(await getCodeFiles(fullPath));
        } else {
            const ext = path.extname(fullPath).toLowerCase();
            if (codeExts.includes(ext)) {
                results.push(fullPath);
            }
        }
    }
    return results;
}

async function run() {
    console.log("🕵️ Recherche des images locales (JPG/PNG)...");
    let images = [];
    for (let dir of dirsToScan) {
        if (fs.existsSync(dir)) {
            images = images.concat(await processDirectory(dir));
        }
    }

    if (images.length === 0) {
        console.log("Aucune image trouvée.");
        return;
    }

    console.log(`Trouvé ${images.length} images.`);

    // Mapping original file name with extension -> new .webp name
    const renameMap = new Map();

    for (let img of images) {
        const dir = path.dirname(img);
        const name = path.basename(img, path.extname(img));
        const outPath = path.join(dir, `${name}.webp`);
        const originalName = path.basename(img);
        const newName = `${name}.webp`;

        console.log(`🔁 Conversion: ${originalName} -> ${newName}`);
        try {
            await sharp(img).webp({ quality: 80 }).toFile(outPath);
            renameMap.set(originalName, newName);
            // Optionally remove old image
            fs.unlinkSync(img);
        } catch (e) {
            console.error(`❌ Erreur sur ${img}:`, e.message);
        }
    }

    console.log("📝 Mise à jour des références dans le code...");
    let codeFiles = [];
    for (let dir of dirsToScan) {
        if (fs.existsSync(dir)) {
            codeFiles = codeFiles.concat(await getCodeFiles(dir));
        }
    }
    // Also include index.html
    if (fs.existsSync('index.html')) codeFiles.push(path.resolve('index.html'));

    let updatedFiles = 0;
    for (let file of codeFiles) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        for (let [oldName, newName] of renameMap.entries()) {
            // Un peu de prudence: remplacer '.jpg'/'.png' par '.webp'
            // Regex for the old name
            const rx = new RegExp(oldName.replace(/\./g, '\\.'), 'g');
            if (rx.test(content)) {
                content = content.replace(rx, newName);
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            updatedFiles++;
        }
    }

    console.log(`✅ ${updatedFiles} fichiers de code mis à jour.`);
    console.log("🎉 Migration des images locales terminée !");
}

run();
