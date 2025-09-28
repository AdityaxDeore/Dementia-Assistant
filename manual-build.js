import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = promisify(exec);

async function manualBuild() {
  try {
    console.log('Starting manual build process...');
    
    // Ensure we're in the correct directory
    console.log('Current directory:', process.cwd());
    
    // Run Vite build command
    console.log('Running: npx vite build');
    const { stdout, stderr } = await execPromise('npx vite build', { timeout: 120000 });
    
    console.log('Build stdout:');
    console.log(stdout);
    
    if (stderr) {
      console.log('Build stderr:');
      console.log(stderr);
    }
    
    // Check if dist/public directory exists
    const distPath = path.join(process.cwd(), 'dist', 'public');
    console.log('Checking dist path:', distPath);
    
    const distExists = fs.existsSync(distPath);
    console.log('Dist directory exists:', distExists);
    
    if (distExists) {
      // List files in dist/public
      const files = fs.readdirSync(distPath);
      console.log('Files in dist/public:');
      files.forEach(file => console.log(`  - ${file}`));
      
      // Check for key files
      const indexHtmlExists = fs.existsSync(path.join(distPath, 'index.html'));
      console.log('index.html exists:', indexHtmlExists);
      
      if (indexHtmlExists) {
        console.log('\n✅ Build completed successfully!');
        return true;
      } else {
        console.log('\n❌ Build completed but index.html not found');
        return false;
      }
    } else {
      console.log('\n❌ Build may have failed - dist/public directory not found');
      return false;
    }
  } catch (error) {
    console.error('Build failed with error:');
    console.error(error.message);
    if (error.stdout) console.log('stdout:', error.stdout);
    if (error.stderr) console.log('stderr:', error.stderr);
    return false;
  }
}

// Run the build
manualBuild().then(success => {
  console.log('\nBuild process finished with success:', success);
});