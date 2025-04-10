const express = require('express');
const path = require('path');
const fs = require('fs');
const { program } = require('commander');

program
  .option('-d, --directory <dir>', 'Directory containing rendered videos', 'videos')
  .option('-p, --port <number>', 'Port to serve the webpage on', '3000')
  .parse(process.argv);

const options = program.opts();
const app = express();
const videoDir = path.resolve(options.directory);

// Serve static files from the video directory
app.use('/videos', express.static(videoDir));

// Serve the main page
app.get('/', (req, res) => {
  const videoExtensions = ['.mp4', '.webm'];
  const videos = fs.readdirSync(videoDir)
    .filter(file => videoExtensions.some(ext => file.toLowerCase().endsWith(ext)))
    .map(file => ({
      name: file,
      path: `/videos/${file}`
    }));

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Rendered Sketches</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 100%;
          margin: 0 auto;
          padding: 0;
          background: #f5f5f5;
        }
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0;
          width: 100%;
        }
        .video-card {
          background: white;
          padding: 0;
          box-shadow: none;
        }
        video {
          width: 100%;
          height: auto;
          border-radius: 0;
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div class="video-grid">
        ${videos.map(video => `
          <div class="video-card">
            <video loop muted playsinline>
              <source src="${video.path}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
        `).join('')}
      </div>
      <script>
        window.addEventListener('load', function() {
          const videos = document.querySelectorAll('video');
          videos.forEach(video => {
            video.play().catch(error => {
              console.error('Error playing video:', error);
            });
          });
        });
      </script>
    </body>
    </html>
  `;

  res.send(html);
});

const port = parseInt(options.port);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Viewing videos from: ${videoDir}`);
}); 