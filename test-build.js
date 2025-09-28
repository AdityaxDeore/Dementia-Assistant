import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = promisify(exec);

async function testBuild() {
  try {
    console.log('Starting build test...');
    
    // Run the client build command
    console.log('Running: npm run build:client');
    const { stdout, stderr } = await execPromise('npm run build:client');
    
    console.log('Build output:');
    console.log(stdout);
    
    if (stderr) {
      console.log('Build stderr:');
      console.log(stderr);
    }
    
    // Check if dist/public directory exists
    const distPath = path.join(process.cwd(), 'dist', 'public');
    const distExists = fs.existsSync(distPath);
    
    console.log(`\nDist directory exists: ${distExists}`);
    
    if (distExists) {
      // List files in dist/public
      const files = fs.readdirSync(distPath);
      console.log('Files in dist/public:');
      files.forEach(file => console.log(`  - ${file}`));
      
      // Check for key files
      const indexHtmlExists = fs.existsSync(path.join(distPath, 'index.html'));
      const assetsExist = files.some(file => file.startsWith('assets'));
      
      console.log(`\nKey files check:`);
      console.log(`  - index.html exists: ${indexHtmlExists}`);
      console.log(`  - Asset files exist: ${assetsExist}`);
      
      if (indexHtmlExists) {
        console.log('\n✅ Build test PASSED! The client builds successfully.');
        console.log('You can now deploy to GitHub Pages.');
      } else {
        console.log('\n❌ Build test FAILED! index.html not found in dist/public.');
      }
    } else {
      console.log('\n❌ Build test FAILED! dist/public directory not found.');
    }
  } catch (error) {
    console.error('Build test failed with error:');
    console.error(error.message);
  }
}

testBuild();