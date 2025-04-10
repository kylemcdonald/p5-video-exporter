const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { program } = require('commander');

program
  .requiredOption('-s, --sketches-dir <path>', 'directory containing sketch files')
  .option('-f, --format <format>', 'video format (mp4 or webm)', 'webm')
  .option('-r, --fps <number>', 'frames per second', '30')
  .option('-t, --total-frames <number>', 'total number of frames to render', '60')
  .option('-o, --output-dir <path>', 'output directory for the video files', __dirname)
  .option('-d, --device-scale-factor <number>', 'device scale factor for higher resolution output', '2')
  .option('-c, --max-concurrent <number>', 'maximum number of concurrent renders', '8')
  .parse(process.argv);

const options = program.opts();
const SKETCHES_DIR = options.sketchesDir;
const MAX_CONCURRENT = parseInt(options.maxConcurrent);

async function renderSketch(sketchPath) {
  try {
    console.log(`Starting render for ${path.basename(sketchPath)}`);
    const command = `node render.js -s "${sketchPath}" -f ${options.format} -r ${options.fps} -t ${options.totalFrames} -o "${options.outputDir}" -d ${options.deviceScaleFactor}`;
    await execAsync(command);
    console.log(`✅ Completed render for ${path.basename(sketchPath)}`);
    return { success: true, path: sketchPath };
  } catch (error) {
    console.error(`❌ Error rendering ${path.basename(sketchPath)}:`, error.message);
    return { success: false, path: sketchPath, error };
  }
}

async function processSketches() {
  const files = fs.readdirSync(SKETCHES_DIR)
    .filter(file => file.endsWith('.js'))
    .map(file => path.join(SKETCHES_DIR, file));

  console.log(`Found ${files.length} sketches to process`);
  
  const failedSketches = [];
  let completedCount = 0;
  let activeRenders = 0;
  let fileIndex = 0;
  
  // Function to start a new render if there are files left to process
  const startNextRender = () => {
    if (fileIndex < files.length && activeRenders < MAX_CONCURRENT) {
      const sketchPath = files[fileIndex++];
      activeRenders++;
      
      renderSketch(sketchPath)
        .then(result => {
          activeRenders--;
          completedCount++;
          
          if (!result.success) {
            failedSketches.push(result);
          }
          
          // Log progress
          console.log(`Progress: ${completedCount}/${files.length} sketches processed (${files.length - completedCount - activeRenders} waiting, ${activeRenders} active)`);
          
          // Start the next render immediately
          startNextRender();
        })
        .catch(error => {
          activeRenders--;
          completedCount++;
          failedSketches.push({ 
            success: false, 
            path: sketchPath, 
            error 
          });
          
          // Log progress
          console.log(`Progress: ${completedCount}/${files.length} sketches processed (${files.length - completedCount - activeRenders} waiting, ${activeRenders} active)`);
          
          // Start the next render immediately
          startNextRender();
        });
    }
  };

  // Start the initial batch of renders
  for (let i = 0; i < Math.min(MAX_CONCURRENT, files.length); i++) {
    startNextRender();
  }

  // Wait for all renders to complete
  while (completedCount < files.length) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\nAll sketches processed!');
  
  if (failedSketches.length > 0) {
    console.log(`\n⚠️ ${failedSketches.length} sketches failed to render:`);
    failedSketches.forEach(result => {
      console.log(`- ${path.basename(result.path)}`);
    });
  } else {
    console.log('✅ All sketches rendered successfully!');
  }
}

processSketches().catch(console.error); 