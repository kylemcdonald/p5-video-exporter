# p5.js Video Exporter

A tool to export p5.js sketches as videos using Puppeteer and ffmpeg.

## Prerequisites

- Node.js (v14 or higher)
- ffmpeg installed and available in your PATH
- Puppeteer (will be installed as a dependency)

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

## Usage

### Single Sketch Rendering

To render a single p5.js sketch as a video:

```bash
node render.js -s path/to/sketch.js [options]
```

#### Options:

- `-s, --sketch <path>`: Path to the sketch file (required)
- `-f, --format <format>`: Video format (mp4 or webm, default: webm)
- `-r, --fps <number>`: Frames per second (default: 30)
- `-t, --total-frames <number>`: Total number of frames to render (default: 60)
- `-o, --output-dir <path>`: Output directory for the video file (default: current directory)
- `-d, --device-scale-factor <number>`: Device scale factor for higher resolution output (default: 2)

### Batch Rendering

To render multiple p5.js sketches in a directory:

```bash
node batch-render.js -s path/to/sketches/directory [options]
```

#### Options:

- `-s, --sketches-dir <path>`: Directory containing sketch files (required)
- `-f, --format <format>`: Video format (mp4 or webm, default: webm)
- `-r, --fps <number>`: Frames per second (default: 30)
- `-t, --total-frames <number>`: Total number of frames to render (default: 60)
- `-o, --output-dir <path>`: Output directory for the video files (default: current directory)
- `-d, --device-scale-factor <number>`: Device scale factor for higher resolution output (default: 2)
- `-c, --max-concurrent <number>`: Maximum number of concurrent renders (default: 8)

### Viewing Rendered Sketches

To view all rendered videos in a web browser:

```bash
node view-sketches.js [options]
```

#### Options:

- `-d, --directory <dir>`: Directory containing rendered videos (default: 'videos')
- `-p, --port <number>`: Port to serve the webpage on (default: 3000)

This will start a local web server that displays all rendered videos in a grid layout. Videos will autoplay (muted) when the page loads.

## Examples

### Render a single sketch

```bash
node render.js -s my-sketch.js -f webm -r 30 -t 60 -o ./videos
```

### Batch render multiple sketches

```bash
node batch-render.js -s ./sketches -f webm -r 30 -t 60 -o ./videos -c 4
```

## How it works

1. The script launches a headless browser using Puppeteer
2. It loads the p5.js sketch in the browser
3. It captures frames at the specified frame rate
4. It uses ffmpeg to compile the frames into a video

## License

MIT