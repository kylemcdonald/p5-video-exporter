# p5-video-exporter

A command-line tool for capturing high-quality screenshots of web pages using Puppeteer. This tool is particularly useful for creating consistent, high-resolution screenshots of web content for documentation, testing, or archival purposes.

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
node screenshot.js -u "https://example.com" -o "screenshot.png"
```

### Command Line Options

- `-u, --url <url>`: URL of the webpage to capture (required)
- `-o, --output <path>`: Output file path (required)
- `-w, --width <number>`: Viewport width (default: 800)
- `-h, --height <number>`: Viewport height (default: 600)
- `-d, --device-scale-factor <number>`: Device scale factor for higher resolution (default: 1)
- `-f, --format <format>`: Output format (png or jpeg, default: png)

### Examples

1. Capture a basic screenshot:
```bash
node screenshot.js -u "https://example.com" -o "example.png"
```

2. Capture a high-resolution screenshot:
```bash
node screenshot.js -u "https://example.com" -o "example.png" -d 2
```

3. Capture a screenshot with custom dimensions:
```bash
node screenshot.js -u "https://example.com" -o "example.png" -w 1920 -h 1080
```

4. Capture a JPEG screenshot:
```bash
node screenshot.js -u "https://example.com" -o "example.jpg" -f jpeg
```

## Output

The script will generate a screenshot file at the specified output path. The image will be saved in either PNG or JPEG format, depending on the file extension or format specified.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 