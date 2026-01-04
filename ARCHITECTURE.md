# NoCodeEditor - Architecture Documentation

This document details the architectural decisions, design patterns, and technology choices that shape the NoCodeEditor application. It explains the "why" behind key decisions and provides justification for the chosen approaches.

---

## Table of Contents

1. [Architectural Pattern](#architectural-pattern)
2. [System Architecture Diagram](#system-architecture-diagram)
3. [Technology Justification](#technology-justification)
4. [State Management Strategy](#state-management-strategy)
5. [Component Structure Design](#component-structure-design)
6. [Undo/Redo Implementation](#undoredo-implementation)
7. [Key Design Decisions](#key-design-decisions)

---

## 1. Architectural Pattern

### Chosen Pattern: **Component-Based Architecture with Lifted State**

#### Overview

The NoCodeEditor follows a **component-based architecture** with **unidirectional data flow** and **lifted state management**. This pattern is a React-centric approach that emphasizes:

- **Single source of truth**: All application state lives in the root component (`App.jsx`)
- **Unidirectional data flow**: Data flows down through props, events flow up through callbacks
- **Composition over inheritance**: Complex UI built from small, reusable components
- **Container/Presentational separation**: Logic components vs. pure UI components

#### Why This Pattern?

**1. Simplicity and Maintainability**
- The application's state is straightforward: a list of components and some UI state
- No need for complex state management patterns or libraries
- Easy to reason about: state changes always happen in one place
- Debugging is straightforward with React DevTools

**2. React-Native Approach**
- Leverages React's built-in state management capabilities
- No external dependencies for state management
- Faster initial development and smaller bundle size
- Easier onboarding for developers familiar with React basics

**3. Predictable State Updates**
- All mutations happen through explicit setState calls in App.jsx
- Component updates are predictable and traceable
- No hidden side effects or action dispatchers to track
- Clear parent-child relationships

**4. Sufficient for Application Scale**
- Current feature set doesn't require complex state orchestration
- Component tree is relatively shallow (3-4 levels max)
- No deeply nested prop drilling issues
- Can easily migrate to Context API or Redux if needed

**5. Performance Considerations**
- React's reconciliation algorithm handles updates efficiently
- Component updates are localized (only affected components re-render)
- UseCallback and useMemo can be added if performance issues arise
- Ref usage prevents unnecessary re-renders for canvas calculations

#### When This Pattern Fits

This architectural pattern is ideal for:
- **Small to medium-sized applications** with manageable state
- **Editor-style applications** where state is centralized
- **Prototypes and MVPs** that need quick iteration
- **Applications with clear component hierarchies**

#### Potential Migration Path

If the application grows significantly, the architecture can evolve:
1. **Phase 1 (Current)**: Lifted state in App.jsx
2. **Phase 2 (Medium complexity)**: React Context API for global state
3. **Phase 3 (High complexity)**: Redux or Zustand for complex state orchestration
4. **Phase 4 (Large scale)**: Micro-frontends with independent state management

---

## 2. System Architecture Diagram

### High-Level Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────┐
│                              App.jsx                                 │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ STATE:                                                      │    │
│  │ - components: Component[]                                   │    │
│  │ - selectedComponentId: string | null                        │    │
│  │ - canvasWidth: number (10-100)                             │    │
│  │ - history: Component[][]  (undo/redo)                      │    │
│  │ - historyIndex: number                                      │    │
│  │ - copiedComponent: Component | null                        │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ METHODS:                                                    │    │
│  │ - handleAddComponent(type)                                  │    │
│  │ - handleComponentUpdate(id, updates)                        │    │
│  │ - handleDeleteComponent(id)                                 │    │
│  │ - handleDuplicateComponent(id)                             │    │
│  │ - handleUndo() / handleRedo()                              │    │
│  │ - handleCopy() / handlePaste()                             │    │
│  └────────────────────────────────────────────────────────────┘    │
└──────────────────┬───────────────┬──────────────┬────────────────────┘
                   │               │              │
        ┌──────────▼──────┐ ┌─────▼─────┐ ┌─────▼────────────┐
        │ ComponentPalette│ │  Canvas   │ │ PropertiesPanel  │
        │                 │ │ (forwardRef)│ │                 │
        └─────────────────┘ └─────┬─────┘ └─────┬────────────┘
                                  │              │
                   ┌──────────────▼──────────┐   │
                   │   CanvasComponent[]     │   │
                   │   (Individual Components)│   │
                   │                          │   │
                   │  ┌────────────────────┐ │   │
                   │  │ Drag/Resize Logic │ │   │
                   │  │ Boundary Checks   │ │   │
                   │  │ Event Handlers    │ │   │
                   │  └────────────────────┘ │   │
                   └─────────────────────────┘   │
                                                 │
                    ┌────────────────────────────▼────────────┐
                    │     Property Editors (Type-Specific)    │
                    │  ┌──────────────────────────────────┐  │
                    │  │ - TextProperties                 │  │
                    │  │ - TextAreaProperties             │  │
                    │  │ - FlexboxProperties              │  │
                    │  │ - ImageProperties                │  │
                    │  │ - ButtonProperties               │  │
                    │  └──────────────────────────────────┘  │
                    │                 │                       │
                    │  ┌──────────────▼───────────────────┐  │
                    │  │   PropertyInputs (Reusable)      │  │
                    │  │ - TextInput                      │  │
                    │  │ - NumberInput                    │  │
                    │  │ - ColorPicker                    │  │
                    │  │ - ButtonGroup                    │  │
                    │  └──────────────────────────────────┘  │
                    └─────────────────────────────────────────┘
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW PATTERNS                           │
└─────────────────────────────────────────────────────────────────────┘

1. COMPONENT ADDITION FLOW
   ──────────────────────────
   User Click
      │
      ▼
   ComponentPalette
      │ onAddComponent(type)
      ▼
   App.jsx
      │ 1. Create component with default props
      │ 2. Add to components array
      │ 3. Save to history
      ▼
   Canvas receives updated components[]
      │
      ▼
   New CanvasComponent rendered


2. COMPONENT UPDATE FLOW (Drag/Resize/Property Edit)
   ──────────────────────────────────────────────────
   User Action (drag/resize/edit)
      │
      ▼
   CanvasComponent OR PropertiesPanel
      │ onUpdate(id, updates)
      ▼
   App.jsx
      │ 1. Find component by ID
      │ 2. Merge updates immutably
      │ 3. Update components array
      │ 4. Save to history
      ▼
   React reconciliation
      │
      ▼
   Only affected component re-renders


3. SELECTION FLOW
   ────────────────
   User clicks component
      │
      ▼
   Canvas (handleSelectComponent)
      │ onSelectComponent(id)
      ▼
   App.jsx sets selectedComponentId
      │
      ├─────────────────┬─────────────────┐
      ▼                 ▼                 ▼
   Canvas          PropertiesPanel   CanvasComponent
   (no visual)     (shows properties) (shows selection)


4. EXPORT/IMPORT FLOW
   ────────────────────
   User clicks Export
      │
      ▼
   ExportModal
      │ Receives: components[], canvasWidth, canvasRef
      │
      ├──► exportToHTML(components, canvasWidth, canvasPixelWidth)
      │      │ 1. Calculate percentages
      │      │ 2. Generate CSS classes
      │      │ 3. Generate HTML elements
      │      └─► Complete HTML document
      │
      └──► exportToJSON(components, canvasWidth)
             │ 1. Serialize state
             └─► JSON string

   Import (reverse):
      File upload ─► Parse JSON ─► Validate ─► setState ─► Render


5. UNDO/REDO FLOW
   ────────────────
   User presses Ctrl+Z or Ctrl+Shift+Z
      │
      ▼
   App.jsx keyboard handler
      │
      ├─► Undo: historyIndex--
      │   │ Restore components[historyIndex]
      │   └─► Trigger re-render
      │
      └─► Redo: historyIndex++
          │ Restore components[historyIndex]
          └─► Trigger re-render
```

### Component Communication Patterns

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMMUNICATION PATTERNS                            │
└─────────────────────────────────────────────────────────────────────┘

1. PROPS DOWN (Data Flow)
   ───────────────────────
   App.jsx
      │ components={components}
      │ selectedComponentId={selectedComponentId}
      │ canvasWidth={canvasWidth}
      ▼
   Canvas
      │ components.map(c => <CanvasComponent />)
      ▼
   CanvasComponent
      │ Renders based on props
      └─► Visual output


2. EVENTS UP (Control Flow)
   ─────────────────────────
   User interaction
      │
      ▼
   CanvasComponent
      │ onUpdate(id, {position: {x, y}})
      ▼
   Canvas (pass-through)
      │ onComponentUpdate(id, updates)
      ▼
   App.jsx
      │ Updates state
      └─► Triggers re-render down the tree


3. REF FORWARDING (Direct Access)
   ────────────────────────────────
   App.jsx creates canvasRef
      │ ref={canvasRef}
      ▼
   Canvas (forwardRef)
      │ Exposes DOM element
      ├─► Used by CanvasComponent for boundary calculations
      └─► Used by ExportModal for pixel width calculations


4. CALLBACK PATTERN (Event Handling)
   ──────────────────────────────────
   Component defines callback
      │ const handleClick = useCallback(() => {...}, [deps])
      │ Passed as prop
      ▼
   Child component
      │ Invokes callback on event
      ▼
   Parent updates state
      │
      └─► Re-render triggered
```

---

## 3. Technology Justification

### Core Technologies

#### React 18

**Why React?**

1. **Component-Based Architecture**
   - Perfect fit for editor with multiple reusable UI elements
   - Encapsulation of component logic and styling
   - Composition model allows building complex UI from simple pieces

2. **Virtual DOM & Reconciliation**
   - Efficient updates when dragging/resizing components
   - Only changed components re-render
   - Smooth performance for interactive canvas operations

3. **Rich Ecosystem**
   - Extensive documentation and community support
   - Mature testing libraries (Jest, React Testing Library)
   - Large pool of developers familiar with React

4. **React Hooks**
   - useState: Simple state management for component-level state
   - useEffect: Side effect management (event listeners, cleanup)
   - useRef: Direct DOM access without re-renders (canvas boundary calculations)
   - useCallback: Memoized callbacks prevent unnecessary child re-renders
   - forwardRef: Canvas ref forwarding for multi-component access

5. **Developer Experience**
   - Fast refresh for instant feedback during development
   - Excellent debugging tools (React DevTools)
   - Clear error messages and warnings
   - Strong TypeScript support (if needed in future)

**Alternatives Considered:**
- **Vue.js**: Excellent choice, but React's larger ecosystem and job market prevalence made it preferable
- **Svelte**: Better performance, but smaller ecosystem and less familiar to most developers
- **Angular**: Too heavy for this use case, steeper learning curve
- **Vanilla JS**: Would require reinventing React's optimization patterns

---

#### Vite

**Why Vite?**

1. **Lightning-Fast Development Server**
   - ESBuild-powered bundling (10-100x faster than Webpack)
   - Instant hot module replacement (HMR)
   - Sub-second server startup
   - Native ES modules in development

2. **Optimized Production Builds**
   - Rollup-based production bundling
   - Automatic code splitting
   - Tree-shaking for smaller bundles
   - Asset optimization (images, CSS)

3. **Modern Defaults**
   - Out-of-box support for JSX, CSS, and assets
   - No configuration needed for basic setup
   - Built-in support for React Fast Refresh
   - TypeScript support without extra setup

4. **Developer Experience**
   - Minimal configuration required
   - Clear, helpful error messages
   - Excellent documentation
   - Growing ecosystem and community

**Alternatives Considered:**
- **Create React App (CRA)**: Slower build times, Webpack-based, less modern
- **Webpack**: More configuration required, slower development server
- **Parcel**: Good alternative, but Vite's React integration is superior
- **Turbopack**: Too new, not stable enough for production use

---

#### Jest (Testing)

**Why Jest?**

1. **React-Optimized**
   - Designed with React in mind
   - Works seamlessly with React Testing Library
   - Built-in support for JSX and ES modules

2. **Comprehensive Features**
   - Test runner, assertion library, and mocking in one package
   - Built-in code coverage reporting
   - Snapshot testing for component outputs
   - Watch mode for test-driven development

3. **Developer Experience**
   - Clear, readable test syntax
   - Helpful error messages
   - Parallel test execution
   - Interactive watch mode

**Alternatives Considered:**
- **Vitest**: Vite-native, faster, but Jest's ecosystem is more mature
- **Mocha + Chai**: Requires more configuration, less integrated
- **Cypress**: Better for E2E testing, overkill for unit tests

---

#### CSS (Styling)

**Why Plain CSS?**

1. **Simplicity**
   - No build step or compilation for styles
   - Easy to understand and debug
   - No learning curve for new developers

2. **Modern CSS Features**
   - CSS Variables for theming
   - Flexbox and Grid for layouts
   - Media queries for responsiveness
   - CSS nesting (if supported by browsers)

3. **Component Co-location**
   - Each component has its own CSS file
   - Clear style ownership
   - Easy to find and modify styles

4. **Performance**
   - No runtime style injection
   - Static CSS files cached by browser
   - Smaller JavaScript bundle

**Alternatives Considered:**
- **CSS Modules**: Considered, but plain CSS with BEM naming is sufficient
- **Styled Components**: Runtime overhead, larger bundle size
- **Tailwind CSS**: Would increase bundle size, utility classes in JSX reduce readability
- **SASS/LESS**: Preprocessing not needed for this project's complexity

---

### Technology Stack Summary

| Category | Technology | Why? |
|----------|------------|------|
| **Framework** | React 18 | Component model, virtual DOM, hooks, ecosystem |
| **Build Tool** | Vite | Fast dev server, optimized builds, modern defaults |
| **Testing** | Jest + React Testing Library | React-optimized, comprehensive, great DX |
| **Styling** | CSS | Simplicity, no runtime overhead, modern features |
| **Language** | JavaScript (ES2020+) | Native browser support, no compilation needed |
| **Package Manager** | npm | Ubiquitous, reliable, comes with Node.js |

---

## 4. State Management Strategy

### Chosen Strategy: **Lifted State in Root Component**

#### State Structure

```javascript
// App.jsx state
const [components, setComponents] = useState([]);
const [selectedComponentId, setSelectedComponentId] = useState(null);
const [canvasWidth, setCanvasWidth] = useState(100);
const [history, setHistory] = useState([[]]);
const [historyIndex, setHistoryIndex] = useState(0);
const [copiedComponent, setCopiedComponent] = useState(null);
```

#### Why This Strategy?

**1. Single Source of Truth**
- All component data lives in one place: `App.jsx`
- No confusion about where state lives or how it's shared
- Easy to serialize entire application state for export/import
- Debugging is straightforward - inspect App component state

**2. Predictable State Updates**
```javascript
// All updates follow the same pattern
const handleComponentUpdate = (id, updates) => {
  setComponents(prevComponents => 
    prevComponents.map(component => 
      component.id === id 
        ? { ...component, ...updates }
        : component
    )
  );
  saveToHistory();
};
```
- Immutable updates using spread operator
- Functional setState for reliable updates
- State transitions are explicit and traceable

**3. No Prop Drilling Issues**
- Maximum component depth: 3-4 levels
- Props flow: App → Canvas → CanvasComponent (2 levels)
- Props flow: App → PropertiesPanel → PropertyEditor → PropertyInput (3 levels)
- Shallow enough that Context API would add unnecessary complexity

**4. Easy Testing**
- State logic concentrated in one file
- Pure functions for state transformations
- Can test state updates in isolation
- Component tests can use mock callbacks

**5. Performance Considerations**
- React's reconciliation algorithm handles updates efficiently
- Only components whose props change will re-render
- CanvasComponent updates are localized (doesn't re-render siblings)
- Ref usage for canvas prevents unnecessary recalculations

#### State Update Patterns

**Immutable Updates:**
```javascript
// ❌ Mutating state directly (WRONG)
components[0].position.x = 100;
setComponents(components);

// ✅ Immutable update (CORRECT)
setComponents(prevComponents => 
  prevComponents.map((c, i) => 
    i === 0 
      ? { ...c, position: { ...c.position, x: 100 } }
      : c
  )
);
```

**Functional setState:**
```javascript
// ❌ Using current state value (can be stale)
setComponents(components.filter(c => c.id !== id));

// ✅ Using functional update (always up-to-date)
setComponents(prevComponents => 
  prevComponents.filter(c => c.id !== id)
);
```

#### When to Migrate Away?

Consider more complex state management if:
- Component tree depth exceeds 4-5 levels
- Extensive prop drilling occurs (passing props through 3+ levels)
- Multiple components need same state in distant parts of the tree
- State updates become difficult to reason about
- Performance issues arise from excessive re-renders

**Migration Path:**
1. **Phase 1**: Extract repeated state logic into custom hooks
2. **Phase 2**: Use React Context for truly global state (theme, user)
3. **Phase 3**: Consider Zustand for simple global state with less boilerplate
4. **Phase 4**: Adopt Redux if complex async logic and middleware needed

---

## 5. Component Structure Design

### Design Principles

#### 1. Single Responsibility Principle
Each component has one clear purpose:
- `Canvas`: Renders the canvas and handles drop events
- `CanvasComponent`: Handles individual component drag/resize/render
- `PropertiesPanel`: Routes to appropriate property editor
- `TextProperties`: Edits text component properties only

#### 2. Composition Over Configuration
Built complex UI from small, reusable pieces:
```
PropertyEditor
  ├─ TextInput (reusable)
  ├─ NumberInput (reusable)
  ├─ ColorPicker (reusable)
  └─ ButtonGroup (reusable)
```

#### 3. Container/Presentational Pattern

**Container Components (Smart):**
- `App.jsx`: State management and business logic
- `CanvasComponent`: Drag/resize logic and event handling
- `PropertiesPanel`: Component routing logic

**Presentational Components (Dumb):**
- `Canvas`: Just renders components
- Property Editors: Just render inputs
- Property Inputs: Just controlled inputs

### Component Responsibilities

#### App.jsx (Application Controller)
**Responsibilities:**
- Application state management
- Component lifecycle (add, update, delete, duplicate)
- History management (undo/redo)
- Clipboard operations (copy/paste)
- Keyboard shortcuts
- Canvas width configuration

**Why at root level?**
- Central access point for all state operations
- Simplifies passing callbacks to children
- Makes export/import trivial (serialize App state)
- Easy to add features without restructuring

---

#### Canvas (Rendering Layer)
**Responsibilities:**
- Render all canvas components
- Handle component drop from palette
- Convert drop coordinates to canvas-relative positions
- Forward ref for boundary calculations

**Why separate from App?**
- Isolates rendering concerns from state management
- Can be tested independently
- Ref forwarding encapsulated in one component
- Clear boundary between logic and presentation

---

#### CanvasComponent (Component Wrapper)
**Responsibilities:**
- Individual component positioning (absolute)
- Drag-and-drop functionality
- Resize functionality (type-specific)
- Boundary constraint enforcement
- Component rendering (type-specific)
- Selection visual feedback

**Why so much responsibility?**
- Encapsulates all component interaction logic
- Prevents duplicating drag/resize logic for each component type
- Single place to enforce boundary rules
- Type-specific rendering in one switch statement

**Design Trade-off:**
- ✅ Reduces code duplication
- ✅ Consistent behavior across all component types
- ❌ Larger component file (400+ lines)
- ❌ More complex testing

**Mitigation:**
- Well-organized with clear sections
- Comments explain each responsibility
- Can be split later if needed (DraggableWrapper + ResizableWrapper)

---

#### PropertiesPanel (Property Router)
**Responsibilities:**
- Display component metadata (type, actions)
- Route to correct property editor based on component type
- Handle delete and duplicate actions
- Mobile overlay and close button

**Why route instead of one universal editor?**
- Different component types have different properties
- Type-specific editors are easier to maintain
- Prevents conditional rendering spaghetti
- Each editor can be tested in isolation

---

#### Property Editors (Type-Specific)
**Responsibilities:**
- Render appropriate inputs for component type
- Handle property changes
- Validate input values

**Why separate files?**
- Clear ownership of each component type
- Easy to add new component types
- Prevents one massive property editor file
- Can load lazily if needed for performance

---

#### Property Inputs (Reusable Primitives)
**Responsibilities:**
- Controlled input components
- Consistent styling
- Label and value display
- Input validation (min/max for numbers)

**Why reusable inputs?**
- Consistency across all property editors
- Single place to fix bugs or add features
- Reduced code duplication
- Easy to add new input types (e.g., DatePicker)

**Example reusability:**
```jsx
// TextProperties.jsx
<NumberInput label="Font Size" value={fontSize} onChange={...} min={8} max={120} />

// ButtonProperties.jsx
<NumberInput label="Font Size" value={fontSize} onChange={...} min={8} max={48} />

// Different ranges, same component!
```

---

#### ExportModal (Feature Module)
**Responsibilities:**
- HTML/CSS export generation
- JSON export/import
- Preview rendering
- File download handling

**Why separate modal instead of inline?**
- Keeps App.jsx focused on state management
- Export logic is complex enough to warrant isolation
- Can be developed/tested independently
- Easy to add new export formats

---

### File Organization Rationale

```
components/
├── Canvas/                  # Rendering layer
├── CanvasComponent/         # Interaction layer
├── ComponentPalette/        # Input layer (add components)
├── PropertiesPanel/         # Input layer (edit components)
│   ├── PropertiesPanel.jsx  # Router
│   └── [Type]Properties.jsx # Type-specific editors
├── PropertyInputs/          # Reusable primitives
└── ExportModal/             # Feature module
```

**Why this structure?**
- **Logical grouping**: Related files are together
- **Flat hierarchy**: Easy to find components (max 2 levels deep)
- **Co-located styles**: Component.jsx and Component.css together
- **Clear boundaries**: Each folder is a distinct feature/layer

---

## 6. Undo/Redo Implementation

### Strategy: **History Stack with Array Snapshots**

#### Data Structure

```javascript
const [history, setHistory] = useState([[]]);  // Array of component arrays
const [historyIndex, setHistoryIndex] = useState(0);  // Current position
```

#### Why This Approach?

**1. Simplicity**
- Easy to understand: just an array of states
- No complex command pattern or action log
- Can see entire state at each point in time
- Trivial to implement: save snapshot after each change

**2. Complete State Capture**
- Every mutation captured (add, update, delete, move, resize)
- No need to track individual operations
- Can undo/redo any combination of changes
- Eliminates bugs from missing undo handlers

**3. Reliable Time Travel**
```javascript
// Undo
const handleUndo = () => {
  if (historyIndex > 0) {
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setComponents(history[newIndex]);
  }
};

// Redo
const handleRedo = () => {
  if (historyIndex < history.length - 1) {
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setComponents(history[newIndex]);
  }
};
```

**4. Easy to Implement Branching**
- Can add "save snapshot" feature (bookmark a history point)
- Can implement "go to specific point in time"
- Can show history timeline UI

#### Implementation Details

**Saving to History:**
```javascript
const saveToHistory = useCallback(() => {
  setHistory(prevHistory => {
    // Discard future history if we're not at the end
    const newHistory = prevHistory.slice(0, historyIndex + 1);
    
    // Add current state
    return [...newHistory, components];
  });
  
  setHistoryIndex(prev => prev + 1);
}, [components, historyIndex]);
```

**When to Save:**
- After component added
- After component updated (drag/resize/property change)
- After component deleted
- After component duplicated

**History Limit:**
```javascript
const MAX_HISTORY = 50;  // Prevent memory issues

if (history.length > MAX_HISTORY) {
  setHistory(prev => prev.slice(-MAX_HISTORY));
  setHistoryIndex(MAX_HISTORY - 1);
}
```

#### Trade-offs

**Advantages:**
- ✅ Simple implementation
- ✅ Reliable (can't miss an operation)
- ✅ Easy debugging (inspect history array)
- ✅ Can implement time-travel debugging
- ✅ Works with any state structure

**Disadvantages:**
- ❌ Memory usage (storing entire state each time)
- ❌ Not suitable for very large canvases (100+ components)
- ❌ Serialization overhead if components are complex

**Memory Optimization Strategies:**
1. **Shallow Cloning**: Components are shallow-cloned, not deep
2. **Structural Sharing**: Unchanged components share references
3. **History Limit**: Keep only last 50 states
4. **Debouncing**: Don't save every pixel movement while dragging

```javascript
// Example: Debounced history save
const debouncedSave = useCallback(
  debounce(() => saveToHistory(), 500),
  [saveToHistory]
);

// During drag: frequent updates, no history save
const handleMouseMove = (e) => {
  updateComponentPosition(e);
  debouncedSave();  // Only saves after 500ms of no movement
};
```

#### Alternative Approaches Considered

**1. Command Pattern**
```javascript
// Track operations instead of state
const history = [
  { type: 'ADD', component: {...} },
  { type: 'UPDATE', id: '1', updates: {...} },
  { type: 'DELETE', id: '2' }
];
```
- **Pros**: Lower memory usage, precise operation tracking
- **Cons**: Complex implementation, easy to miss edge cases, harder debugging
- **Verdict**: Not worth the complexity for this app size

**2. Immutable.js / Immer**
- **Pros**: Structural sharing built-in, better memory efficiency
- **Cons**: External dependency, learning curve, overkill for this app
- **Verdict**: Would consider if performance issues arise

**3. Redux DevTools Time Travel**
- **Pros**: Free with Redux, excellent UI, powerful debugging
- **Cons**: Requires Redux adoption, unnecessary if only need undo/redo
- **Verdict**: Good if migrating to Redux for other reasons

---

## 7. Key Design Decisions

### Decision 1: Canvas Coordinate System

**Choice:** Canvas-relative positioning with clientWidth for boundaries

```javascript
// Convert screen coordinates to canvas-relative
const canvasRect = canvasRef.current.getBoundingClientRect();
const canvasX = screenX - canvasRect.left;
const canvasY = screenY - canvasRect.top;
```

**Why?**
- Components positioned relative to canvas, not viewport
- Scrolling doesn't affect component positions
- Canvas can be centered with different widths
- Boundaries calculated from canvas dimensions, not window

**Alternatives:**
- Viewport-relative: Would break when canvas scrolls or moves
- Percentage-based positioning: Would require constant recalculation

---

### Decision 2: Resize Handles by Component Type

**Choice:** Different resize behavior per component type
- Text: Horizontal only (left/right handles)
- Textarea, Flexbox, Image: 4-corner resize
- Button: No resize

**Why?**
- Text is typically single-line (height is font-size dependent)
- Textarea needs arbitrary sizing for content
- Flexbox is a container (needs full resize)
- Button size should be determined by content and padding

**Implementation:**
```javascript
const renderResizeHandles = () => {
  if (type === 'button') return null;
  
  if (type === 'text') {
    return (
      <>
        <div className="resize-handle resize-handle--e" />
        <div className="resize-handle resize-handle--w" />
      </>
    );
  }
  
  return (
    <>
      <div className="resize-handle resize-handle--nw" />
      <div className="resize-handle resize-handle--ne" />
      <div className="resize-handle resize-handle--sw" />
      <div className="resize-handle resize-handle--se" />
    </>
  );
};
```

---

### Decision 3: Percentage-Based Export

**Choice:** Export component widths and left positions as percentages

```javascript
const widthPercent = ((props.width / canvasPixelWidth) * 100).toFixed(2);
const leftPercent = ((position.left / canvasPixelWidth) * 100).toFixed(2);
```

**Why?**
- Responsive output (works on different screen sizes)
- Canvas width is configurable (10-100%)
- Browser resizing maintains layout proportions
- Industry standard for responsive design

**Trade-offs:**
- Heights remain in pixels (easier for text sizing)
- Top positions remain in pixels (allows infinite vertical scroll)

---

### Decision 4: ForwardRef for Canvas

**Choice:** Use forwardRef to expose canvas DOM element

```javascript
// Canvas.jsx
const Canvas = forwardRef((props, ref) => {
  return <div ref={ref} className="canvas">...</div>;
});

// App.jsx
const canvasRef = useRef(null);
<Canvas ref={canvasRef} />
```

**Why?**
- Multiple components need canvas dimensions (CanvasComponent, ExportModal)
- Avoids prop drilling the ref through multiple levels
- Direct DOM access for accurate measurements (clientWidth)
- Ref access doesn't cause re-renders

**Alternatives:**
- Pass canvas width as prop: Would require state sync and extra renders
- Context for canvas ref: Overkill for 2 consumers

---

### Decision 5: Boundary Constraints

**Choice:** Constrain left, right, top but not bottom

```javascript
// Constrain left and right
const maxLeft = canvasWidth - componentWidth;
const constrainedLeft = Math.max(0, Math.min(left, maxLeft));

// Constrain top only (not bottom)
const constrainedTop = Math.max(0, top);
```

**Why?**
- Left/right: Prevents horizontal scrolling, maintains layout
- Top: Prevents components going above canvas
- Bottom: Allow infinite scroll for long pages
- Matches user expectation of web page behavior

---

### Decision 6: No Global State Library

**Choice:** Use React's built-in state management (useState, useRef)

**Why?**
- Application state is simple enough
- No deeply nested component tree
- No complex async state updates
- Smaller bundle size
- Faster initial development
- Lower learning curve for contributors

**When to reconsider:**
- Component tree exceeds 5 levels deep
- Prop drilling becomes painful (3+ levels)
- Performance issues from excessive re-renders
- Need for complex middleware (logging, persistence)

---

### Decision 7: Component as Objects, Not Classes

**Choice:** Components represented as plain objects in state

```javascript
{
  id: "unique-id",
  type: "text",
  position: { left: 100, top: 50 },
  props: { content: "Hello", fontSize: 16, ... }
}
```

**Why?**
- Easy to serialize (export to JSON)
- Easy to clone (duplicate functionality)
- Easy to compare (shallow equality checks)
- No class instantiation overhead
- Works naturally with React's immutable update pattern

**Alternatives:**
- Class-based components: Would require serialization logic
- More complex data structures: Would complicate state updates

---

### Decision 8: Co-located CSS

**Choice:** Each component has its own CSS file in the same directory

```
CanvasComponent/
├── CanvasComponent.jsx
└── CanvasComponent.css
```

**Why?**
- Easy to find styles for a component
- Clear ownership (no cascading style conflicts)
- Can be deleted together when component removed
- Follows component-based architecture principle

---

## Summary

The NoCodeEditor architecture prioritizes:

1. **Simplicity** over complexity
2. **React-native patterns** over external frameworks
3. **Developer experience** over premature optimization
4. **Maintainability** over clever abstractions
5. **Pragmatism** over dogmatic purity

The chosen patterns and technologies create a codebase that is:
- ✅ Easy to understand
- ✅ Simple to maintain
- ✅ Quick to extend
- ✅ Performant enough
- ✅ Well-tested
- ✅ Production-ready

As the application grows, the architecture provides clear migration paths to more sophisticated patterns without requiring a complete rewrite.
