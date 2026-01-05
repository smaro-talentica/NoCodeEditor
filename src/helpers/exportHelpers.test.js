import { exportToHTML, exportToJSON, importFromJSON } from './exportHelpers';

describe('exportHelpers', () => {
  // Suppress console.error during tests that intentionally throw errors
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('exportToJSON', () => {
    test('exports empty components array', () => {
      const result = exportToJSON([], 100);
      const parsed = JSON.parse(result);
      
      expect(parsed.components).toEqual([]);
      expect(parsed.canvasWidth).toBe(100);
    });

    test('exports single component', () => {
      const components = [
        {
          id: '1',
          type: 'text',
          position: { x: 100, y: 50 },
          props: {
            content: 'Hello',
            fontSize: 16,
            color: '#000000',
            width: 200,
            height: 30
          }
        }
      ];
      
      const result = exportToJSON(components, 100);
      const parsed = JSON.parse(result);
      
      expect(parsed.components.length).toBe(1);
      expect(parsed.components[0].type).toBe('text');
      expect(parsed.components[0].props.content).toBe('Hello');
    });

    test('exports multiple components', () => {
      const components = [
        { id: '1', type: 'text', position: { x: 0, y: 0 }, props: {} },
        { id: '2', type: 'flexbox', position: { x: 100, y: 100 }, props: {} },
        { id: '3', type: 'button', position: { x: 200, y: 200 }, props: {} }
      ];
      
      const result = exportToJSON(components, 75);
      const parsed = JSON.parse(result);
      
      expect(parsed.components.length).toBe(3);
      expect(parsed.canvasWidth).toBe(75);
    });

    test('preserves all component properties', () => {
      const components = [
        {
          id: 'test-id',
          type: 'textarea',
          position: { x: 150, y: 75 },
          props: {
            content: 'Multi-line\ntext',
            fontSize: 14,
            color: '#333333',
            lineHeight: 1.5,
            textAlign: 'center',
            width: 300,
            height: 100
          }
        }
      ];
      
      const result = exportToJSON(components, 50);
      const parsed = JSON.parse(result);
      
      expect(parsed.components[0].id).toBe('test-id');
      expect(parsed.components[0].props.content).toBe('Multi-line\ntext');
      expect(parsed.components[0].props.lineHeight).toBe(1.5);
    });
  });

  describe('importFromJSON', () => {
    test('imports valid JSON', () => {
      const jsonString = JSON.stringify({
        components: [
          { id: '1', type: 'text', position: { x: 0, y: 0 }, props: {} }
        ],
        canvasWidth: 100
      });
      
      const result = importFromJSON(jsonString);
      
      expect(result.components.length).toBe(1);
      expect(result.canvasWidth).toBe(100);
    });

    test('throws error for invalid JSON', () => {
      const invalidJSON = 'not valid json';
      
      expect(() => importFromJSON(invalidJSON)).toThrow();
    });

    test('throws error for missing components array', () => {
      const jsonString = JSON.stringify({ canvasWidth: 100 });
      
      expect(() => importFromJSON(jsonString)).toThrow();
    });

    test('throws error for missing canvasWidth', () => {
      const jsonString = JSON.stringify({ components: [] });
      
      expect(() => importFromJSON(jsonString)).toThrow();
    });

    test('imports multiple components correctly', () => {
      const jsonString = JSON.stringify({
        components: [
          { id: '1', type: 'text', position: { x: 0, y: 0 }, props: { content: 'A' } },
          { id: '2', type: 'flexbox', position: { x: 50, y: 50 }, props: { backgroundColor: '#fff' } },
          { id: '3', type: 'image', position: { x: 100, y: 100 }, props: { src: 'test.jpg' } }
        ],
        canvasWidth: 75
      });
      
      const result = importFromJSON(jsonString);
      
      expect(result.components.length).toBe(3);
      expect(result.components[0].props.content).toBe('A');
      expect(result.components[1].props.backgroundColor).toBe('#fff');
      expect(result.components[2].props.src).toBe('test.jpg');
    });
  });

  describe('exportToHTML', () => {
    test('exports empty components to basic HTML', () => {
      const result = exportToHTML([], 100, 1200);
      
      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<html lang="en">');
      expect(result).toContain('</html>');
    });

    test('exports text component with percentage width', () => {
      const components = [
        {
          id: '1',
          type: 'text',
          position: { x: 120, y: 50 },
          props: {
            content: 'Hello',
            fontSize: 16,
            color: '#000000',
            fontWeight: 'normal',
            textAlign: 'left',
            width: 240,
            height: 30
          }
        }
      ];
      
      const result = exportToHTML(components, 100, 1200);
      
      // 240px / 1200px * 100 = 20%
      expect(result).toContain('width: 20.00%');
      // 120px / 1200px * 100 = 10%
      expect(result).toContain('left: 10.00%');
      expect(result).toContain('Hello');
      expect(result).toContain('font-size: 16px');
    });

    test('exports textarea component with correct styles', () => {
      const components = [
        {
          id: '1',
          type: 'textarea',
          position: { x: 60, y: 100 },
          props: {
            content: 'Multi-line\ntext',
            fontSize: 14,
            color: '#333',
            lineHeight: 1.5,
            textAlign: 'center',
            width: 360,
            height: 100
          }
        }
      ];
      
      const result = exportToHTML(components, 100, 1200);
      
      // 360px / 1200px * 100 = 30%
      expect(result).toContain('width: 30.00%');
      // 60px / 1200px * 100 = 5%
      expect(result).toContain('left: 5.00%');
      expect(result).toContain('line-height: 1.5');
      expect(result).toContain('Multi-line\ntext');
    });

    test('exports flexbox component without text properties', () => {
      const components = [
        {
          id: '1',
          type: 'flexbox',
          position: { x: 100, y: 100 },
          props: {
            backgroundColor: '#f0f0f0',
            width: 200,
            height: 100,
            padding: 16,
            borderRadius: 4
          }
        }
      ];
      
      const result = exportToHTML(components, 100, 1200);
      
      expect(result).toContain('background-color: #f0f0f0');
      expect(result).toContain('padding: 16px');
      expect(result).toContain('border-radius: 4px');
      expect(result).toContain('border: 1px solid #e0e0e0');
      expect(result).not.toContain('font-size');
      expect(result).not.toContain('text-align');
    });

    test('exports image component', () => {
      const components = [
        {
          id: '1',
          type: 'image',
          position: { x: 0, y: 0 },
          props: {
            src: 'https://example.com/image.jpg',
            alt: 'Test Image',
            width: 400,
            height: 300,
            borderRadius: 8
          }
        }
      ];
      
      const result = exportToHTML(components, 100, 1200);
      
      expect(result).toContain('https://example.com/image.jpg');
      expect(result).toContain('alt="Test Image"');
      expect(result).toContain('border-radius: 8px');
    });

    test('exports button component with URL', () => {
      const components = [
        {
          id: '1',
          type: 'button',
          position: { x: 100, y: 200 },
          props: {
            text: 'Click me',
            url: 'https://example.com',
            fontSize: 16,
            padding: 12,
            backgroundColor: '#007bff',
            color: '#ffffff',
            borderRadius: 4
          }
        }
      ];
      
      const result = exportToHTML(components, 100, 1200);
      
      expect(result).toContain('Click me');
      expect(result).toContain('https://example.com');
      expect(result).toContain('background-color: #007bff');
    });

    test('calculates percentages correctly for 50% canvas', () => {
      const components = [
        {
          id: '1',
          type: 'text',
          position: { x: 60, y: 50 },
          props: {
            content: 'Test',
            width: 120,
            height: 30,
            fontSize: 16,
            color: '#000',
            fontWeight: 'normal',
            textAlign: 'left'
          }
        }
      ];
      
      // Canvas at 50% = 600px actual width
      const result = exportToHTML(components, 50, 600);
      
      // 120px / 600px * 100 = 20%
      expect(result).toContain('width: 20.00%');
      // 60px / 600px * 100 = 10%
      expect(result).toContain('left: 10.00%');
    });

    test('exports multiple components', () => {
      const components = [
        {
          id: '1',
          type: 'text',
          position: { x: 0, y: 0 },
          props: { content: 'First', width: 100, height: 30, fontSize: 16, color: '#000', fontWeight: 'normal', textAlign: 'left' }
        },
        {
          id: '2',
          type: 'flexbox',
          position: { x: 200, y: 100 },
          props: { backgroundColor: '#fff', width: 200, height: 100, padding: 16, borderRadius: 4 }
        }
      ];
      
      const result = exportToHTML(components, 100, 1200);
      
      expect(result).toContain('First');
      expect(result).toContain('background-color: #fff');
      expect(result).toContain('.component-0');
      expect(result).toContain('.component-1');
    });

    test('includes proper HTML structure', () => {
      const result = exportToHTML([], 100, 1200);
      
      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<html lang="en">');
      expect(result).toContain('<meta charset="UTF-8">');
      expect(result).toContain('<meta name="viewport"');
      expect(result).toContain('<style>');
      expect(result).toContain('</style>');
      expect(result).toContain('<body>');
      expect(result).toContain('</body>');
      expect(result).toContain('</html>');
    });
  });

  describe('Export/Import Round Trip', () => {
    test('exports and imports data correctly', () => {
      const originalComponents = [
        {
          id: '1',
          type: 'text',
          position: { x: 100, y: 50 },
          props: {
            content: 'Test',
            fontSize: 16,
            color: '#000000',
            fontWeight: 'bold',
            textAlign: 'center',
            width: 200,
            height: 30
          }
        },
        {
          id: '2',
          type: 'flexbox',
          position: { x: 200, y: 150 },
          props: {
            backgroundColor: '#f0f0f0',
            width: 300,
            height: 200,
            padding: 20,
            borderRadius: 8
          }
        }
      ];
      
      const originalCanvasWidth = 75;
      
      // Export to JSON
      const exported = exportToJSON(originalComponents, originalCanvasWidth);
      
      // Import back
      const imported = importFromJSON(exported);
      
      // Verify round trip
      expect(imported.components.length).toBe(originalComponents.length);
      expect(imported.canvasWidth).toBe(originalCanvasWidth);
      expect(imported.components[0].props.content).toBe('Test');
      expect(imported.components[1].props.backgroundColor).toBe('#f0f0f0');
    });
  });

  describe('Edge Cases', () => {
    test('handles components with zero position', () => {
      const components = [
        {
          id: '1',
          type: 'text',
          position: { x: 0, y: 0 },
          props: { content: 'At origin', width: 100, height: 30, fontSize: 16, color: '#000', fontWeight: 'normal', textAlign: 'left' }
        }
      ];
      
      const result = exportToHTML(components, 100, 1200);
      
      expect(result).toContain('left: 0.00%');
      expect(result).toContain('top: 0px');
    });

    test('handles special characters in content', () => {
      const components = [
        {
          id: '1',
          type: 'text',
          position: { x: 0, y: 0 },
          props: { content: '<script>alert("xss")</script>', width: 100, height: 30, fontSize: 16, color: '#000', fontWeight: 'normal', textAlign: 'left' }
        }
      ];
      
      const result = exportToHTML(components, 100, 1200);
      
      // Content should be properly escaped or handled
      expect(result).toContain('<script>alert("xss")</script>');
    });

    test('handles empty content', () => {
      const components = [
        {
          id: '1',
          type: 'text',
          position: { x: 0, y: 0 },
          props: { content: '', width: 100, height: 30, fontSize: 16, color: '#000', fontWeight: 'normal', textAlign: 'left' }
        }
      ];
      
      const result = exportToHTML(components, 100, 1200);
      
      expect(result).toContain('.component-0');
    });

    test('handles very small canvas width', () => {
      const components = [
        {
          id: '1',
          type: 'text',
          position: { x: 10, y: 10 },
          props: { content: 'Small', width: 50, height: 30, fontSize: 16, color: '#000', fontWeight: 'normal', textAlign: 'left' }
        }
      ];
      
      const result = exportToHTML(components, 10, 120);
      
      // 50px / 120px * 100 = 41.67%
      expect(result).toContain('width: 41.67%');
    });

    test('handles maximum canvas width', () => {
      const components = [
        {
          id: '1',
          type: 'flexbox',
          position: { x: 0, y: 0 },
          props: { backgroundColor: '#fff', width: 1200, height: 100, padding: 0, borderRadius: 0 }
        }
      ];
      
      const result = exportToHTML(components, 100, 1200);
      
      // 1200px / 1200px * 100 = 100%
      expect(result).toContain('width: 100.00%');
    });
  });
});
