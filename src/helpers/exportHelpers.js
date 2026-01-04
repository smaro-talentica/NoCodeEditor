/**
 * Export helper functions for generating HTML/CSS/JS and JSON
 */

/**
 * Generate CSS styles for a component
 */
const generateComponentCSS = (component, index, canvasWidth) => {
  const { type, props, position } = component;
  const className = `component-${index}`;
  
  // Calculate percentages relative to canvas width (assumes canvas is full container width)
  const leftPercent = canvasWidth > 0 ? ((position.left / canvasWidth) * 100).toFixed(2) : 0;
  const widthPercent = canvasWidth > 0 ? ((props.width / canvasWidth) * 100).toFixed(2) : 0;
  
  let styles = `  .${className} {\n`;
  styles += `    position: absolute;\n`;
  styles += `    left: ${leftPercent}%;\n`;
  styles += `    top: ${position.top}px;\n`;
  
  switch (type) {
    case 'text':
      const textWidthPercent = canvasWidth > 0 ? ((props.width / canvasWidth) * 100).toFixed(2) : 0;
      styles += `    width: ${textWidthPercent}%;\n`;
      styles += `    height: ${props.height}px;\n`;
      styles += `    font-size: ${props.fontSize}px;\n`;
      styles += `    color: ${props.color};\n`;
      styles += `    font-weight: ${props.fontWeight};\n`;
      styles += `    text-align: ${props.textAlign};\n`;
      styles += `    display: flex;\n`;
      styles += `    align-items: center;\n`;
      styles += `    overflow: hidden;\n`;
      styles += `    white-space: nowrap;\n`;
      styles += `    text-overflow: ellipsis;\n`;
      break;
      
    case 'textarea':
      const textareaWidthPercent = canvasWidth > 0 ? ((props.width / canvasWidth) * 100).toFixed(2) : 0;
      styles += `    width: ${textareaWidthPercent}%;\n`;
      styles += `    height: ${props.height}px;\n`;
      styles += `    font-size: ${props.fontSize}px;\n`;
      styles += `    color: ${props.color};\n`;
      styles += `    line-height: ${props.lineHeight};\n`;
      styles += `    text-align: ${props.textAlign};\n`;
      styles += `    overflow: auto;\n`;
      styles += `    white-space: pre-wrap;\n`;
      styles += `    word-wrap: break-word;\n`;
      break;
      
    case 'flexbox':
      styles += `    width: ${widthPercent}%;\n`;
      styles += `    height: ${props.height}px;\n`;
      styles += `    background-color: ${props.backgroundColor};\n`;
      styles += `    padding: ${props.padding}px;\n`;
      styles += `    border-radius: ${props.borderRadius}px;\n`;
      styles += `    border: 1px solid #e0e0e0;\n`;
      break;
      
    case 'image':
      styles += `    width: ${widthPercent}%;\n`;
      styles += `    height: ${props.height}px;\n`;
      styles += `    border-radius: ${props.borderRadius}px;\n`;
      styles += `    object-fit: cover;\n`;
      break;
      
    case 'button':
      styles += `    padding: ${props.padding}px;\n`;
      styles += `    font-size: ${props.fontSize}px;\n`;
      styles += `    background-color: ${props.backgroundColor};\n`;
      styles += `    color: ${props.color};\n`;
      styles += `    border: none;\n`;
      styles += `    border-radius: ${props.borderRadius}px;\n`;
      styles += `    cursor: pointer;\n`;
      break;
  }
  
  styles += `  }\n`;
  return { className, styles };
};

/**
 * Generate HTML element for a component
 */
const generateComponentHTML = (component, className) => {
  const { type, props } = component;
  
  switch (type) {
    case 'text':
      return `    <div class="${className}">${props.content}</div>`;
      
    case 'textarea':
      return `    <div class="${className}">${props.content}</div>`;
      
    case 'flexbox':
      return `    <div class="${className}"></div>`;
      
    case 'image':
      return `    <img class="${className}" src="${props.src}" alt="${props.alt}" />`;
      
    case 'button':
      const onClick = props.url ? ` onclick="window.location.href='${props.url}'"` : '';
      return `    <button class="${className}"${onClick}>${props.text}</button>`;
      
    default:
      return '';
  }
};

/**
 * Export components to HTML/CSS
 */
export const exportToHTML = (components, canvasWidth = 100, canvasPixelWidth = 1200) => {
  let css = '';
  let html = '';
  
  if (components && components.length > 0) {
    components.forEach((component, index) => {
      const { className, styles } = generateComponentCSS(component, index, canvasPixelWidth);
      css += styles + '\n';
      html += generateComponentHTML(component, className) + '\n';
    });
  }

  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>No-Code Editor Export</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background-color: #f5f5f5;
      position: relative;
      min-height: 100vh;
    }
    
    .container {
      position: relative;
      width: ${canvasWidth}%;
      min-height: 100vh;
      background-color: #ffffff;
      margin: 0 auto;
      max-width: 100%;
    }
    
${css}
  </style>
</head>
<body>
  <div class="container">
${html}
  </div>
</body>
</html>`;

  return fullHTML;
};

/**
 * Export components to JSON
 */
export const exportToJSON = (components, canvasWidth = 100) => {
  const exportData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    canvasWidth,
    components: components.map((comp) => ({
      id: comp.id,
      type: comp.type,
      position: { ...comp.position },
      props: { ...comp.props },
    })),
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Import components from JSON
 */
export const importFromJSON = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    
    if (!data.components || !Array.isArray(data.components)) {
      throw new Error('Invalid JSON format: missing components array');
    }
    
    if (!data.canvasWidth) {
      throw new Error('Invalid JSON format: missing canvasWidth');
    }
    
    return {
      components: data.components,
      canvasWidth: data.canvasWidth,
    };
  } catch (error) {
    console.error('Error importing JSON:', error);
    throw new Error(`Failed to import: ${error.message}`);
  }
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

/**
 * Download text as file
 */
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error downloading file:', error);
    return false;
  }
};

/**
 * Open preview in new window
 */
export const openPreview = (htmlContent) => {
  try {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.open();
      previewWindow.document.write(htmlContent);
      previewWindow.document.close();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error opening preview:', error);
    return false;
  }
};

/**
 * Generate filename with timestamp
 */
export const generateFilename = (prefix = 'export', extension = 'html') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}-${timestamp}.${extension}`;
};
