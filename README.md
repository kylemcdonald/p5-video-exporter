# p5-video-exporter

A command-line tool for capturing high-quality screenshots of p5.js sketches using Puppeteer.

## Features

- Capture full-page screenshots of any web URL
- Customize viewport dimensions
- Adjust device scale factor for higher resolution output
- Specify output directory and filename
- Support for both PNG and JPEG formats
- Configurable viewport dimensions

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/p5-video-exporter.git
cd p5-video-exporter
```

2. Install dependencies:
```bash
npm install
```

## Usage

Basic usage:
```bash
node screenshot.js -s "path/to/sketch.js" -o "output_directory"
```

### Command Line Options

- `-s, --sketch <path>`: Path to the sketch file (required)
- `-f, --format <format>`: Video format (mp4 or webm, default: webm)
- `-r, --fps <number>`: Frames per second (default: 30)
- `-t, --total-frames <number>`: Total number of frames to render (default: 60)
- `-o, --output-dir <path>`: Output directory for the video file (default: current directory)
- `-d, --device-scale-factor <number>`: Device scale factor for higher resolution output (default: 1)

### Examples

1. Basic usage with a sketch file:
```bash
node screenshot.js -s "my-sketch.js"
```

2. Specify output format and directory:
```bash
node screenshot.js -s "my-sketch.js" -f mp4 -o "videos"
```

3. Customize frame rate and total frames:
```bash
node screenshot.js -s "my-sketch.js" -r 60 -t 120
```

4. Increase resolution with device scale factor:
```bash
node screenshot.js -s "my-sketch.js" -d 2
```

## Output

The script will generate a video file in the specified output directory. The video will be saved in either MP4 or WebM format, depending on the format specified.