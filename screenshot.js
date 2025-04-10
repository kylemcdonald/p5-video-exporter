const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { program } = require('commander');

program
  .requiredOption('-s, --sketch <path>', 'path to the sketch file')
  .option('-f, --format <format>', 'video format (mp4 or webm)', 'webm')
  .option('-r, --fps <number>', 'frames per second', '30')
  .option('-t, --total-frames <number>', 'total number of frames to render', '60')
  .option('-o, --output-dir <path>', 'output directory for the video file', __dirname)
  .option('-d, --device-scale-factor <number>', 'device scale factor for higher resolution output', '1')
  .parse(process.argv);

const options = program.opts();

// Generate output video name based on input sketch name
const outputVideo = path.join(
  options.outputDir,
  `${path.basename(options.sketch, path.extname(options.sketch))}.${options.format}`
);

(async () => {
  const startTime = new Date("2025-01-01T11:59:59Z").getTime(); // UTC time
  
  console.log("Starting rendering process...");
  console.log(`Rendering ${options.totalFrames} frames at ${options.fps} fps`);
  const renderStartTime = Date.now();
  
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const outputDir = path.join(__dirname, "frames");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  await page.setViewport({
    width: 400,
    height: 400,
    deviceScaleFactor: parseFloat(options.deviceScaleFactor),
  });

  // Read the sketch file content
  const sketchContent = fs.readFileSync(options.sketch, 'utf8');
  
  // Create HTML content with the sketch embedded
  const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <script src="https://cdn.jsdelivr.net/npm/p5@1.11.1/lib/p5.min.js"></script>
    <script>${sketchContent}</script>
  </head>
  <body></body>
</html>`;

  // Set the content directly on the page
  await page.setContent(htmlContent);

  // Wait for p5 to be ready
  await page.waitForFunction(() => typeof window.setup === "function" && typeof window.draw === "function");

  // Stop looping and reset frameCount
  await page.evaluate(() => {
    noLoop();
    frameCount = 0;
  });

  const canvas = await page.$("canvas");

  for (let i = 0; i < options.totalFrames; i++) {
    const currentTime = startTime + i * (1000 / options.fps);

    await page.evaluate((frameCount, currentTime) => {
      // Simulated current Date
      const now = new Date(currentTime);

      // Override p5 time functions
      window.year = () => now.getUTCFullYear();
      window.month = () => now.getUTCMonth() + 1; // getUTCMonth() is zero-based
      window.day = () => now.getUTCDate();
      window.hour = () => now.getUTCHours();
      window.minute = () => now.getUTCMinutes();
      window.second = () => now.getUTCSeconds();
      window.millis = () => currentTime;

      // Set frameCount manually
      window.frameCount = frameCount;

      redraw();
    }, i, currentTime);

    const framePath = path.join(outputDir, `frame_${String(i).padStart(4, "0")}.png`);
    await canvas.screenshot({ path: framePath });
  }

  await browser.close();
  
  const renderEndTime = Date.now();
  const renderDuration = (renderEndTime - renderStartTime) / 1000;
  console.log(`Rendering completed in ${renderDuration.toFixed(2)} seconds`);

  // Convert frames to video using ffmpeg
  console.log("Starting video compression and encoding...");
  const compressionStartTime = Date.now();
  
  const baseCommand = `ffmpeg -y -framerate ${options.fps} -i ${path.join(outputDir, "frame_%04d.png")}`;
  const ffmpegCommand = options.format === 'webm'
    ? `${baseCommand} -c:v libvpx-vp9 -crf 30 -b:v 0 -pix_fmt yuv420p ${outputVideo}`
    : `${baseCommand} -c:v libx264 -crf 23 -pix_fmt yuv420p ${outputVideo}`;

  exec(ffmpegCommand, (error, stdout, stderr) => {
    const compressionEndTime = Date.now();
    const compressionDuration = (compressionEndTime - compressionStartTime) / 1000;
    
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    console.log(`Video compression completed in ${compressionDuration.toFixed(2)} seconds`);
    console.log(`Total processing time: ${((renderDuration + compressionDuration)).toFixed(2)} seconds`);
    
    // Delete all frame images
    fs.readdir(outputDir, (err, files) => {
      if (err) {
        console.error(`Error reading directory: ${err}`);
        return;
      }
      
      for (const file of files) {
        if (file.endsWith('.png')) {
          fs.unlink(path.join(outputDir, file), err => {
            if (err) console.error(`Error deleting ${file}: ${err}`);
          });
        }
      }
      console.log("Frame images deleted successfully!");
      
      // Remove the frames directory
      fs.rmdir(outputDir, err => {
        if (err) console.error(`Error removing frames directory: ${err}`);
        else console.log("Frames directory removed successfully!");
      });
    });
  });
})();