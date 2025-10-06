#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json for version and metadata
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

// Create header comment with dynamic version
const createHeader = (filename) => {
  const date = new Date().toISOString().split('T')[0];
  return `/*!
 * ${packageJson.name} - ${filename}
 * Version: ${packageJson.version}
 * Description: ${packageJson.description}
 * Author: ${packageJson.author}
 * License: ${packageJson.license}
 * Build Date: ${date}
 * Repository: Web components for building questionnaire/slides interfaces
 */\n`;
};

async function buildDist() {
  const srcDir = path.join(__dirname, '..', 'src');
  const distDir = path.join(__dirname, '..', 'dist');
  
  // Clean and create dist directory
  await fs.remove(distDir);
  await fs.ensureDir(distDir);
  
  // Get all JavaScript files from src
  const srcFiles = await fs.readdir(srcDir);
  const jsFiles = srcFiles.filter(file => file.endsWith('.js'));
  
  console.log(`Building ${jsFiles.length} files to dist/...`);
  
  for (const file of jsFiles) {
    const srcPath = path.join(srcDir, file);
    const distPath = path.join(distDir, file);
    const minDistPath = path.join(distDir, file.replace('.js', '.min.js'));
    
    // Read source file
    const sourceContent = await fs.readFile(srcPath, 'utf8');
    
    // Create header for this file
    const header = createHeader(file);
    
    // Write non-minified version with header
    const fullContent = header + sourceContent;
    await fs.writeFile(distPath, fullContent);
    
    try {
      // Minify the source code
      const minified = await minify(sourceContent, {
        compress: {
          drop_console: false, // Keep console logs for debugging
          drop_debugger: true,
          pure_funcs: ['console.debug'],
        },
        mangle: {
          keep_classnames: true, // Preserve class names for web components
          keep_fnames: true,     // Preserve function names for debugging
        },
        format: {
          comments: false,
          semicolons: true,
        },
      });
      
      if (minified.error) {
        throw minified.error;
      }
      
      // Write minified version with header
      const minifiedContent = header + minified.code;
      await fs.writeFile(minDistPath, minifiedContent);
      
      console.log(`✓ Built ${file} and ${file.replace('.js', '.min.js')}`);
    } catch (error) {
      console.error(`✗ Error minifying ${file}:`, error.message);
      // Still write a non-minified version as .min.js if minification fails
      await fs.writeFile(minDistPath, fullContent);
      console.log(`✓ Built ${file} and ${file.replace('.js', '.min.js')} (fallback - not minified)`);
    }
  }
  
  // Create an index file that exports all components
  const indexContent = jsFiles
    .map(file => `export * from './${file}';`)
    .join('\n');
    
  const indexHeader = createHeader('index.js');
  await fs.writeFile(path.join(distDir, 'index.js'), indexHeader + indexContent + '\n');
  
  // Create minified index
  try {
    const minifiedIndex = await minify(indexContent, {
      compress: { drop_console: false },
      mangle: { keep_classnames: true, keep_fnames: true },
      format: { comments: false, semicolons: true },
    });
    
    await fs.writeFile(
      path.join(distDir, 'index.min.js'), 
      indexHeader + (minifiedIndex.code || indexContent) + '\n'
    );
    
    console.log('✓ Built index.js and index.min.js');
  } catch (error) {
    console.error('✗ Error minifying index.js:', error.message);
    await fs.writeFile(path.join(distDir, 'index.min.js'), indexHeader + indexContent + '\n');
    console.log('✓ Built index.js and index.min.js (fallback - not minified)');
  }
  
  // Create package.json for dist
  const distPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    main: 'index.js',
    module: 'index.js',
    type: 'module',
    author: packageJson.author,
    license: packageJson.license,
    files: ['*.js'],
    keywords: ['web-components', 'questionnaire', 'slides', 'lit', 'custom-elements'],
    dependencies: packageJson.dependencies,
    peerDependencies: packageJson.dependencies,
  };
  
  await fs.writeFile(
    path.join(distDir, 'package.json'),
    JSON.stringify(distPackageJson, null, 2)
  );
  
  console.log('✓ Built package.json for dist');
  console.log(`\n🎉 Build completed! Generated ${jsFiles.length * 2 + 2} files in dist/`);
  
  // Show file sizes
  const distFiles = await fs.readdir(distDir);
  const jsDistFiles = distFiles.filter(f => f.endsWith('.js')).sort();
  
  console.log('\n📦 Generated files:');
  for (const file of jsDistFiles) {
    const filePath = path.join(distDir, file);
    const stats = await fs.stat(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`   ${file} (${sizeKB} KB)`);
  }
}

// Run the build
buildDist().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});