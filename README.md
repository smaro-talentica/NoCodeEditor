# NoCodeEditor

A drag-and-drop visual editor for building web pages without code. Create, customize, and export HTML/CSS pages with an intuitive interface.

## 🌟 Overview

NoCodeEditor is a React-based visual page builder that allows users to:
- **Design visually**: Drag and drop components onto a canvas
- **Customize freely**: Adjust properties, colors, sizes, and styles through a properties panel
- **Responsive canvas**: Set canvas width (10-100%) to design for different screen sizes
- **Export easily**: Generate clean HTML/CSS code or JSON for your designs
- **Import projects**: Load previously saved JSON projects to continue editing

### Available Components
- **Text**: Single-line text with horizontal resizing, customizable font, color, and alignment
- **Text Area**: Multi-line text with full resizing, adjustable line height and alignment
- **Flexbox**: Empty styled container with background, padding, and border radius
- **Image**: Resizable images with custom URLs and border radius
- **Button**: Interactive buttons with custom text, URLs, colors, and styling

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v18 or higher
- **npm**: v10 or higher

To check your versions:
```bash
node --version
npm --version
```

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd NoCodeEditor
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   This will install all required packages including React, Vite, and testing libraries.

### Running the Application

#### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at:
- **Local**: `http://localhost:5173`
- **Network**: Check terminal output for network address

Press `q` or `Ctrl+C` to stop the development server.

#### Production Build

Build the application for production:

```bash
npm run build
```

The optimized files will be generated in the `dist/` directory.

#### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

This serves the built application from the `dist/` directory.

### Testing

#### Run Specific Test

Run a specific test file with colored output:

```bash
npx jest src/ShoppingCart.test.jsx --color
```

#### Run All Tests

Execute all test suites:

```bash
npm test
```

#### Test Coverage

Generate and view test coverage report:

```bash
npx jest --coverage --color
```

Coverage reports will be available in the `coverage/` directory.
- Open `coverage/lcov-report/index.html` in a browser to view the detailed coverage report.

### Linting

Check code quality and style:

```bash
npm run lint
```

## 📖 Usage Guide

### Basic Workflow

1. **Set Canvas Width**: Use the width input at the top to set your canvas width (10-100%)
2. **Add Components**: Click on component buttons in the palette (Text, Text Area, Flexbox, Image, Button)
3. **Position Components**: Drag components to desired positions on the canvas
4. **Resize Components**: 
   - Text: Drag left/right handles for horizontal resizing
   - Text Area, Flexbox, Image: Drag corner handles for full resizing
5. **Edit Properties**: Select a component to edit its properties in the right panel
6. **Duplicate**: Use Ctrl/Cmd + D or the Duplicate button
7. **Delete**: Select and press Delete key or click the delete button
8. **Export**: Click Export to generate HTML/CSS or JSON

### Keyboard Shortcuts

- **Delete**: Delete selected component
- **Ctrl/Cmd + D**: Duplicate selected component
- **Ctrl/Cmd + C**: Copy selected component
- **Ctrl/Cmd + V**: Paste copied component
- **Ctrl/Cmd + A**: Select all components
- **Ctrl/Cmd + Z**: Undo last action
- **Escape**: Deselect component

## 🏗️ Project Structure

```
NoCodeEditor/
├── src/
│   ├── components/
│   │   ├── Canvas/              # Main canvas area
│   │   ├── CanvasComponent/     # Individual draggable components
│   │   ├── ComponentPalette/    # Component selection toolbar
│   │   ├── ExportModal/         # Export/Import functionality
│   │   ├── PropertiesPanel/     # Component property editors
│   │   └── PropertyInputs/      # Reusable input components
│   ├── constants/
│   │   └── canvas.js            # Component types and defaults
│   ├── helpers/
│   │   └── exportHelpers.js     # HTML/CSS/JSON export logic
│   ├── App.jsx                  # Main application component
│   └── main.jsx                 # Application entry point
├── public/                      # Static assets
├── coverage/                    # Test coverage reports
├── package.json                 # Project dependencies and scripts
└── vite.config.js              # Vite configuration

```

## 🛠️ Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Jest**: Testing framework
- **ESLint**: Code quality and style checking
- **CSS3**: Styling with flexbox and modern features

## 📝 License

This project is private and not licensed for public use.

## 🤝 Contributing

This is a private project. For any questions or issues, please contact the project maintainer.
