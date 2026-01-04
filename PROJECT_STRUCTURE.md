# NoCodeEditor - Project Structure

This document provides a comprehensive overview of the NoCodeEditor project structure, explaining the purpose and functionality of each folder and key module.

## 📁 Root Directory

```
NoCodeEditor/
├── src/                    # Source code
├── public/                 # Static assets
├── coverage/               # Test coverage reports
├── node_modules/           # Dependencies (generated)
├── dist/                   # Production build output (generated)
├── package.json            # Project configuration and dependencies
├── vite.config.js          # Vite build configuration
├── jest.config.js          # Jest testing configuration
├── jest.setup.js           # Jest setup file
├── babel.config.js         # Babel transpiler configuration
├── eslint.config.js        # ESLint linting rules
├── index.html              # HTML entry point
├── README.md               # Project documentation
└── PROJECT_STRUCTURE.md    # This file
```

### Configuration Files

- **package.json**: Defines project metadata, dependencies (React, Vite, Jest), and npm scripts (`dev`, `build`, `test`, `lint`)
- **vite.config.js**: Configures Vite development server, build process, and React plugin
- **jest.config.js**: Configures Jest test runner, coverage settings, and test environment
- **jest.setup.js**: Initializes testing environment (e.g., @testing-library/jest-dom matchers)
- **babel.config.js**: Configures Babel to transpile JSX and modern JavaScript
- **eslint.config.js**: Defines code quality rules and style guidelines
- **index.html**: Main HTML file that loads the React application

---

## 📂 src/ - Source Directory

The main source code directory containing all application components, helpers, and constants.

```
src/
├── components/             # React components
├── constants/              # Application constants
├── helpers/                # Utility functions
├── assets/                 # Images, icons, fonts
├── App.jsx                 # Root application component
├── App.css                 # Global application styles
├── main.jsx                # Application entry point
└── index.css               # Global CSS styles
```

### Core Files

#### `main.jsx`
- **Purpose**: Application entry point
- **Functionality**: 
  - Imports React and ReactDOM
  - Renders the root `<App />` component
  - Mounts application to `#root` div in index.html
  - Includes global styles

#### `App.jsx`
- **Purpose**: Root application component and state management
- **Functionality**:
  - Manages canvas width state (10-100%)
  - Maintains components array (all canvas components)
  - Handles selected component state
  - Coordinates component operations (add, update, delete, duplicate)
  - Manages undo/redo functionality
  - Handles keyboard shortcuts (Delete, Ctrl+D, Ctrl+C/V, Ctrl+Z, Escape, Ctrl+A)
  - Provides canvas ref for boundary calculations
  - Renders Canvas, ComponentPalette, PropertiesPanel, and ExportModal

#### `App.css`
- **Purpose**: Global application layout styles
- **Functionality**:
  - Defines app container layout (header, main, sidebar)
  - Responsive breakpoints for mobile/tablet/desktop
  - Color scheme and theme variables
  - Base typography and spacing

#### `index.css`
- **Purpose**: Global CSS reset and base styles
- **Functionality**:
  - CSS reset for consistent cross-browser rendering
  - Box-sizing rules
  - Body and root element styles
  - Font family definitions

---

## 📂 src/components/ - React Components

All UI components organized by feature/functionality.

```
components/
├── Canvas/
│   ├── Canvas.jsx
│   └── Canvas.css
├── CanvasComponent/
│   ├── CanvasComponent.jsx
│   └── CanvasComponent.css
├── ComponentPalette/
│   ├── ComponentPalette.jsx
│   └── ComponentPalette.css
├── ExportModal/
│   ├── ExportModal.jsx
│   └── ExportModal.css
├── PropertiesPanel/
│   ├── PropertiesPanel.jsx
│   ├── PropertiesPanel.css
│   ├── TextProperties.jsx
│   ├── TextAreaProperties.jsx
│   ├── FlexboxProperties.jsx
│   ├── ImageProperties.jsx
│   └── ButtonProperties.jsx
└── PropertyInputs/
    ├── TextInput.jsx
    ├── NumberInput.jsx
    ├── ColorPicker.jsx
    ├── ButtonGroup.jsx
    └── PropertyInputs.css
```

---

### Canvas/

Main canvas area where components are placed and manipulated.

#### `Canvas.jsx`
- **Purpose**: Canvas container with configurable width
- **Functionality**:
  - Uses `forwardRef` to expose canvas ref to parent
  - Handles drop events when components are added from palette
  - Converts drop coordinates to canvas-relative positions
  - Manages canvas width (10-100%) with centering
  - Implements boundary constraints (left, right, top only)
  - Renders all CanvasComponent instances
  - Handles component selection on click
  - Applies overflow-y: auto for vertical scrolling

#### `Canvas.css`
- **Purpose**: Canvas visual styling
- **Functionality**:
  - Canvas container with background and border
  - Overflow handling (overflow-x: hidden, overflow-y: auto)
  - Width centering with margin: 0 auto
  - Min-height for empty canvas
  - Drop zone styling

---

### CanvasComponent/

Individual draggable and resizable component wrapper.

#### `CanvasComponent.jsx`
- **Purpose**: Wrapper for each component on canvas with drag/resize functionality
- **Functionality**:
  - **Positioning**: Absolute positioning with left/top coordinates
  - **Dragging**: 
    - Mouse/touch event handling
    - Canvas-relative coordinate calculations
    - Boundary constraints using canvasRef.current.clientWidth
    - Prevents dragging outside left/right/top boundaries
  - **Resizing**:
    - Text: Horizontal-only resize (e/w handles)
    - Textarea/Flexbox/Image: 4-corner resize (nw/ne/sw/se handles)
    - Button: Non-resizable
    - Boundary constraints during resize
  - **Rendering**: Switch statement for different component types
    - Text: Div with flex centering, nowrap, ellipsis
    - Textarea: Div with overflow auto, pre-wrap
    - Flexbox: Empty styled div with border
    - Image: Img tag with custom src
    - Button: Button element with onClick handler
  - **Selection**: Visual highlight border when selected
  - **Z-index**: Component layering based on array order

#### `CanvasComponent.css`
- **Purpose**: Component wrapper and resize handle styles
- **Functionality**:
  - Component container styles (absolute positioning, cursor)
  - Selection highlight styles (blue border)
  - Resize handle positioning and appearance
  - Different cursor styles for resize directions (nwse, nesw, ew)
  - Hover states for better UX

---

### ComponentPalette/

Toolbar with component buttons for adding to canvas.

#### `ComponentPalette.jsx`
- **Purpose**: Component selection toolbar
- **Functionality**:
  - Displays 5 component type buttons:
    - 📝 Text
    - 📄 Text Area
    - 📦 Flexbox
    - 🖼️ Image
    - 🔘 Button
  - Each button triggers `onAddComponent(type)` callback
  - Creates new component with default properties from constants
  - Responsive layout (horizontal on desktop, grid on mobile)

#### `ComponentPalette.css`
- **Purpose**: Toolbar styling
- **Functionality**:
  - Flexbox layout for buttons
  - Button hover/active states
  - Icon and label styling
  - Responsive breakpoints for mobile
  - Accessibility focus styles

---

### PropertiesPanel/

Right sidebar for editing selected component properties.

#### `PropertiesPanel.jsx`
- **Purpose**: Main properties panel container and router
- **Functionality**:
  - Displays component info (type)
  - Delete button (🗑️) for removing component
  - Duplicate button (📋) for copying component
  - Routes to appropriate property editor based on component type:
    - TEXT → TextProperties
    - TEXTAREA → TextAreaProperties
    - FLEXBOX → FlexboxProperties
    - IMAGE → ImageProperties
    - BUTTON → ButtonProperties
  - Empty state when no component selected
  - Mobile overlay for closing panel
  - Mobile close button (×)

#### `PropertiesPanel.css`
- **Purpose**: Panel layout and styling
- **Functionality**:
  - Fixed right sidebar layout
  - Scrollable content area
  - Section dividers and titles
  - Button group layouts
  - Mobile slide-in panel animation
  - Overlay backdrop for mobile

---

#### Property Editor Components

Each component type has its own property editor:

**TextProperties.jsx**
- Content (multiline TextInput)
- Font Size (8-120px NumberInput)
- Text Color (ColorPicker)
- Width (50-1200px NumberInput)
- Height (30-800px NumberInput)
- Font Weight (ButtonGroup: normal/bold)
- Text Align (ButtonGroup: left/center/right)

**TextAreaProperties.jsx**
- Content (multiline TextInput)
- Font Size (8-120px NumberInput)
- Text Color (ColorPicker)
- Width (50-1200px NumberInput)
- Height (50-800px NumberInput)
- Line Height (1-3 NumberInput)
- Text Align (ButtonGroup: left/center/right)

**FlexboxProperties.jsx**
- Background Color (ColorPicker)
- Width (50-1200px NumberInput)
- Height (50-800px NumberInput)
- Padding (0-100px NumberInput)
- Border Radius (0-100px NumberInput)

**ImageProperties.jsx**
- Image URL (TextInput)
- Alt Text (TextInput)
- Width (50-800px NumberInput)
- Height (50-800px NumberInput)
- Border Radius (0-200px NumberInput)

**ButtonProperties.jsx**
- Button Text (TextInput)
- URL (TextInput)
- Font Size (8-48px NumberInput)
- Padding (0-50px NumberInput)
- Background Color (ColorPicker)
- Text Color (ColorPicker)
- Border Radius (0-50px NumberInput)

---

### PropertyInputs/

Reusable input components for property editors.

#### `TextInput.jsx`
- **Purpose**: Text input field with label
- **Props**: label, value, onChange, placeholder, multiline
- **Functionality**: 
  - Single-line input or textarea based on multiline prop
  - Controlled component pattern
  - Label and placeholder support

#### `NumberInput.jsx`
- **Purpose**: Number input with optional slider
- **Props**: label, value, onChange, min, max, step, showSlider
- **Functionality**:
  - Range slider for visual adjustment
  - Number input for precise values
  - Min/max validation
  - Step increment support

#### `ColorPicker.jsx`
- **Purpose**: Color selection input
- **Props**: label, value, onChange
- **Functionality**:
  - Native HTML color picker
  - Hex color value display
  - Synchronized input and picker

#### `ButtonGroup.jsx`
- **Purpose**: Multiple choice button group
- **Props**: label, value, onChange, options
- **Functionality**:
  - Radio-style button selection
  - Visual active state
  - Custom option labels (text/emoji)

#### `PropertyInputs.css`
- **Purpose**: Shared styling for all property inputs
- **Functionality**:
  - Consistent spacing and layout
  - Label typography
  - Input field styling
  - Focus states
  - Slider styling

---

### ExportModal/

Modal for exporting and importing projects.

#### `ExportModal.jsx`
- **Purpose**: Export/Import functionality with tabs
- **Functionality**:
  - **3 Tabs**: HTML Export, JSON Export, Import Project
  - **HTML Export Tab**:
    - Generates complete HTML file with inline CSS
    - Calculates canvas pixel width from canvas ref
    - Converts component widths to percentages
    - Converts component positions to percentages
    - Copy to clipboard button
    - Download as .html file
    - Live preview in iframe
  - **JSON Export Tab**:
    - Serializes components array and canvas width
    - Pretty-printed JSON with 2-space indent
    - Copy to clipboard button
    - Download as .json file
  - **Import Project Tab**:
    - File input for .json files
    - Parses and validates JSON structure
    - Restores components and canvas width
    - Error handling for invalid JSON
  - **Preview Tab**:
    - Iframe rendering of exported HTML
    - Real-time preview of final output

#### `ExportModal.css`
- **Purpose**: Modal styling
- **Functionality**:
  - Fullscreen modal overlay
  - Centered modal dialog
  - Tab navigation styling
  - Code display area with syntax highlighting
  - Button layouts
  - Responsive sizing for mobile
  - Iframe preview styling

---

## 📂 src/constants/

Application-wide constants and configuration.

#### `canvas.js`
- **Purpose**: Component type definitions and default properties
- **Exports**:
  - `COMPONENT_TYPES`: Object with component type constants
    - TEXT: 'text'
    - TEXTAREA: 'textarea'
    - FLEXBOX: 'flexbox'
    - IMAGE: 'image'
    - BUTTON: 'button'
  - `DEFAULT_COMPONENT_PROPS`: Default properties for each type
    - TEXT: content, fontSize(16), color(#000), fontWeight(normal), textAlign(left), width(100), height(30)
    - TEXTAREA: content, fontSize(14), color(#000), lineHeight(1.5), textAlign(left), width(300), height(100)
    - FLEXBOX: backgroundColor(#f0f0f0), width(200), height(100), padding(16), borderRadius(4)
    - IMAGE: src(placeholder), alt, width(200), height(200), borderRadius(0)
    - BUTTON: text, url, fontSize(16), padding(12), backgroundColor(#007bff), color(#fff), borderRadius(4)

---

## 📂 src/helpers/

Utility functions and helper modules.

#### `exportHelpers.js`
- **Purpose**: HTML/CSS/JSON export and import logic
- **Functions**:
  - `generateComponentCSS(component, index, canvasPixelWidth)`:
    - Creates CSS class for component
    - Generates position styles (left/top as percentages)
    - Generates component-specific styles
    - Calculates width percentages for responsive export
    - Returns className and CSS string
  - `generateComponentHTML(component, className)`:
    - Creates HTML element for component
    - Adds appropriate attributes and content
    - Returns HTML string
  - `exportToHTML(components, canvasWidth, canvasPixelWidth)`:
    - Generates complete HTML document
    - Includes DOCTYPE, meta tags, inline CSS
    - Iterates through all components
    - Returns complete HTML string
  - `exportToJSON(components, canvasWidth)`:
    - Serializes components array
    - Includes canvas width
    - Returns formatted JSON string
  - `importFromJSON(jsonString)`:
    - Parses JSON string
    - Validates structure
    - Returns components and canvas width
    - Throws error for invalid JSON

---

## 📂 src/assets/

Static assets like images, icons, and fonts (if any).

```
assets/
└── (Currently empty, reserved for future assets)
```

---

## 📂 public/

Static files served directly without processing.

```
public/
└── (SVG icons, favicon, other static files)
```

- Files in this directory are served at root path
- Not processed by Vite build system
- Referenced by absolute paths in HTML

---

## 📂 coverage/

Test coverage reports generated by Jest.

```
coverage/
├── lcov.info              # LCOV format coverage data
└── lcov-report/           # HTML coverage report
    ├── index.html         # Main coverage page
    ├── base.css           # Report styling
    ├── prettify.js        # Code syntax highlighting
    └── [component].html   # Individual file reports
```

- Generated by running `npx jest --coverage`
- View detailed coverage in browser by opening lcov-report/index.html
- Shows line, branch, function, and statement coverage

---

## 🔄 Data Flow

### Component Addition Flow
1. User clicks component button in ComponentPalette
2. ComponentPalette calls `onAddComponent(type)`
3. App.jsx creates new component with default props from constants
4. Component added to components array state
5. Canvas renders new CanvasComponent

### Component Update Flow
1. User modifies property in PropertiesPanel
2. Property editor calls `onUpdate(id, updates)`
3. App.jsx updates component in array by ID
4. React re-renders affected CanvasComponent
5. Changes reflected on canvas

### Export Flow
1. User clicks Export button
2. ExportModal receives components and canvasWidth
3. exportHelpers generates HTML/CSS or JSON
4. User can copy, download, or preview
5. Import reverses the process

### Drag Flow
1. User mousedown on CanvasComponent
2. Component captures initial position and mouse coordinates
3. Document mousemove handlers calculate delta
4. Canvas boundary constraints applied
5. Component updates position via onUpdate
6. Mouseup removes event listeners

### Resize Flow
1. User mousedown on resize handle
2. Component captures initial size and mouse coordinates
3. Document mousemove handlers calculate new dimensions
4. Boundary constraints prevent overflow
5. Component updates size via onUpdate
6. Mouseup removes event listeners

---

## 🔧 Key Design Patterns

### Component Architecture
- **Presentational/Container Pattern**: Separates UI (components) from logic (App.jsx)
- **Composition**: Small, reusable components (PropertyInputs) composed into larger ones
- **Single Responsibility**: Each component has one clear purpose

### State Management
- **Lift State Up**: All component data in App.jsx for centralized control
- **Controlled Components**: All inputs controlled by React state
- **Immutable Updates**: State updates via spread operators, never direct mutation

### Event Handling
- **Event Delegation**: Document-level listeners for drag/resize
- **Synthetic Events**: React's synthetic event system for cross-browser compatibility
- **Cleanup**: useEffect cleanup functions remove event listeners

### Styling Strategy
- **CSS Modules Pattern**: Each component has dedicated CSS file
- **BEM Naming**: Block-Element-Modifier for clear class names
- **Responsive Design**: Mobile-first approach with breakpoints

---

## 🚀 Build Process

1. **Development** (`npm run dev`):
   - Vite starts dev server with HMR
   - React Fast Refresh for instant updates
   - Source maps for debugging
   - Port 5173 by default

2. **Production Build** (`npm run build`):
   - Vite bundles and minifies code
   - Tree-shaking removes unused code
   - Assets optimized and hashed
   - Output to dist/ directory

3. **Preview** (`npm run preview`):
   - Serves production build locally
   - Tests optimized bundle
   - Simulates production environment

---

## 📊 Testing Strategy

- **Unit Tests**: Individual component testing with Jest
- **Integration Tests**: Component interaction testing
- **Coverage Goals**: Aim for >80% coverage
- **Test Files**: Co-located with components (.test.jsx)
- **Mocking**: React Testing Library for DOM testing

---

## 🔮 Future Considerations

### Potential Additions
- `src/hooks/`: Custom React hooks for shared logic
- `src/context/`: React Context for deep prop drilling
- `src/utils/`: General utility functions
- `src/services/`: API integration services
- `src/types/`: TypeScript type definitions

### Scalability
- Consider state management library (Redux, Zustand) if state grows complex
- Implement lazy loading for better performance
- Add routing if multi-page functionality needed
- Consider component library (Storybook) for documentation

---

## 📝 Notes

- All pixel values are eventually converted to percentages for responsive export
- Canvas uses clientWidth (not getBoundingClientRect) for accurate boundary calculations
- Component positioning is canvas-relative, not viewport-relative
- Z-index is managed by array order (last component is on top)
- Flexbox component is a pure container without text functionality
- Text component is horizontal-resize only, all others are 4-corner resizable
