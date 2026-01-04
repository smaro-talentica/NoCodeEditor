import { useState, useEffect } from 'react';
import {
  exportToHTML,
  exportToJSON,
  importFromJSON,
  copyToClipboard,
  downloadFile,
  openPreview,
  generateFilename,
} from '../../helpers/exportHelpers';
import './ExportModal.css';

const TABS = {
  HTML: 'html',
  JSON: 'json',
  IMPORT: 'import',
};

const ExportModal = ({ components, canvasWidth = 100, canvasRef, onClose, onImport }) => {
  const [activeTab, setActiveTab] = useState(TABS.HTML);
  const [htmlCode, setHtmlCode] = useState('');
  const [jsonCode, setJsonCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [importError, setImportError] = useState('');

  // Generate export code when components change or tab changes
  useEffect(() => {
    if (components.length > 0) {
      if (activeTab === TABS.HTML) {
        const canvasPixelWidth = canvasRef?.current?.clientWidth || 1200;
        const html = exportToHTML(components, canvasWidth, canvasPixelWidth);
        setHtmlCode(html || '');
      } else if (activeTab === TABS.JSON) {
        const json = exportToJSON(components, canvasWidth);
        setJsonCode(json || '');
      }
    }
  }, [components, canvasWidth, canvasRef, activeTab]);

  /**
   * Handle copy to clipboard
   */
  const handleCopy = async () => {
    const content = activeTab === TABS.HTML ? htmlCode : jsonCode;
    const success = await copyToClipboard(content);
    
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  /**
   * Handle download file
   */
  const handleDownload = () => {
    if (activeTab === TABS.HTML) {
      const filename = generateFilename('nocode-editor', 'html');
      downloadFile(htmlCode, filename, 'text/html');
    } else if (activeTab === TABS.JSON) {
      const filename = generateFilename('nocode-project', 'json');
      downloadFile(jsonCode, filename, 'application/json');
    }
  };

  /**
   * Handle preview in new window
   */
  const handlePreview = () => {
    if (activeTab === TABS.HTML && htmlCode) {
      const success = openPreview(htmlCode);
      if (!success) {
        alert('Failed to open preview. Please check your browser settings.');
      }
    }
  };

  /**
   * Handle file import
   */
  const handleFileImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        const { components: importedComponents, canvasWidth: importedCanvasWidth } = importFromJSON(content);
        onImport(importedComponents, importedCanvasWidth);
        setImportError('');
        onClose();
      } catch (error) {
        setImportError(error.message);
      }
    };
    reader.readAsText(file);
  };

  /**
   * Handle overlay click
   */
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * Render tab content
   */
  const renderTabContent = () => {
    if (components.length === 0 && activeTab !== TABS.IMPORT) {
      return (
        <div className="export-modal__empty">
          <div className="export-modal__empty-icon">📋</div>
          <p className="export-modal__empty-text">
            No components to export.<br />
            Add components to the canvas to get started.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case TABS.HTML:
        return (
          <div className="export-modal__section">
            <h4 className="export-modal__section-title">HTML Code</h4>
            <div className="export-modal__code">
              <textarea
                className="export-modal__textarea"
                value={htmlCode}
                readOnly
                placeholder="HTML code will appear here..."
              />
            </div>
            <div className="export-modal__actions">
              <button
                className={`export-modal__button ${
                  copySuccess ? 'export-modal__button--success' : 'export-modal__button--primary'
                }`}
                onClick={handleCopy}
              >
                {copySuccess ? '✓ Copied!' : '📋 Copy to Clipboard'}
              </button>
              <button
                className="export-modal__button export-modal__button--secondary"
                onClick={handleDownload}
              >
                💾 Download HTML
              </button>
              <button
                className="export-modal__button export-modal__button--secondary"
                onClick={handlePreview}
              >
                👁️ Preview
              </button>
            </div>
            <div className="export-modal__info">
              <p className="export-modal__info-text">
                This HTML file includes all your components with inline CSS styling. 
                You can open it in any browser or host it on a web server.
              </p>
            </div>
          </div>
        );

      case TABS.JSON:
        return (
          <div className="export-modal__section">
            <h4 className="export-modal__section-title">JSON Configuration</h4>
            <div className="export-modal__code">
              <textarea
                className="export-modal__textarea"
                value={jsonCode}
                readOnly
                placeholder="JSON configuration will appear here..."
              />
            </div>
            <div className="export-modal__actions">
              <button
                className={`export-modal__button ${
                  copySuccess ? 'export-modal__button--success' : 'export-modal__button--primary'
                }`}
                onClick={handleCopy}
              >
                {copySuccess ? '✓ Copied!' : '📋 Copy to Clipboard'}
              </button>
              <button
                className="export-modal__button export-modal__button--secondary"
                onClick={handleDownload}
              >
                💾 Download JSON
              </button>
            </div>
            <div className="export-modal__info">
              <p className="export-modal__info-text">
                Save this JSON file to preserve your project. You can import it later 
                to restore all components and their properties.
              </p>
            </div>
          </div>
        );

      case TABS.IMPORT:
        return (
          <div className="export-modal__section">
            <h4 className="export-modal__section-title">Import Project</h4>
            {importError && (
              <div className="export-modal__info" style={{ backgroundColor: '#f8d7da', borderColor: '#dc3545' }}>
                <p className="export-modal__info-text" style={{ color: '#721c24' }}>
                  ❌ {importError}
                </p>
              </div>
            )}
            <div className="export-modal__file-input-wrapper">
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="export-modal__file-input"
                id="file-import"
              />
              <label htmlFor="file-import" className="export-modal__file-button">
                <span className="export-modal__file-icon">📁</span>
                <span className="export-modal__file-text">
                  Click to select a JSON file or drag and drop
                </span>
              </label>
            </div>
            <div className="export-modal__info">
              <p className="export-modal__info-text">
                Import a previously exported JSON file to load a project. 
                This will replace all current components on the canvas.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="export-modal__overlay" onClick={handleOverlayClick}>
      <div className="export-modal">
        <div className="export-modal__header">
          <h2 className="export-modal__title">Export / Import</h2>
          <button
            className="export-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="export-modal__tabs">
          <button
            className={`export-modal__tab ${
              activeTab === TABS.HTML ? 'export-modal__tab--active' : ''
            }`}
            onClick={() => setActiveTab(TABS.HTML)}
          >
            HTML Export
          </button>
          <button
            className={`export-modal__tab ${
              activeTab === TABS.JSON ? 'export-modal__tab--active' : ''
            }`}
            onClick={() => setActiveTab(TABS.JSON)}
          >
            JSON Export
          </button>
          <button
            className={`export-modal__tab ${
              activeTab === TABS.IMPORT ? 'export-modal__tab--active' : ''
            }`}
            onClick={() => setActiveTab(TABS.IMPORT)}
          >
            Import Project
          </button>
        </div>

        <div className="export-modal__content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
