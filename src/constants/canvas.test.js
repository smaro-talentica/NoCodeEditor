import { COMPONENT_TYPES, DEFAULT_COMPONENT_PROPS } from './canvas';

describe('Canvas Constants', () => {
  describe('COMPONENT_TYPES', () => {
    test('defines all component types', () => {
      expect(COMPONENT_TYPES.TEXT).toBe('text');
      expect(COMPONENT_TYPES.TEXTAREA).toBe('textarea');
      expect(COMPONENT_TYPES.FLEXBOX).toBe('flexbox');
      expect(COMPONENT_TYPES.IMAGE).toBe('image');
      expect(COMPONENT_TYPES.BUTTON).toBe('button');
    });

    test('has exactly 5 component types', () => {
      const types = Object.keys(COMPONENT_TYPES);
      expect(types.length).toBe(5);
    });

    test('all component types are strings', () => {
      Object.values(COMPONENT_TYPES).forEach(type => {
        expect(typeof type).toBe('string');
      });
    });

    test('component types are unique', () => {
      const values = Object.values(COMPONENT_TYPES);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe('DEFAULT_COMPONENT_PROPS', () => {
    describe('TEXT component defaults', () => {
      test('has all required text properties', () => {
        const textProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXT];
        
        expect(textProps).toHaveProperty('content');
        expect(textProps).toHaveProperty('fontSize');
        expect(textProps).toHaveProperty('color');
        expect(textProps).toHaveProperty('fontWeight');
        expect(textProps).toHaveProperty('textAlign');
        expect(textProps).toHaveProperty('width');
        expect(textProps).toHaveProperty('height');
      });

      test('has correct default values', () => {
        const textProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXT];
        
        expect(textProps.content).toBe('Text');
        expect(textProps.fontSize).toBe(16);
        expect(textProps.color).toBe('#000000');
        expect(textProps.fontWeight).toBe('normal');
        expect(textProps.textAlign).toBe('left');
        expect(textProps.width).toBe(100);
        expect(textProps.height).toBe(30);
      });

      test('fontSize is a positive number', () => {
        const textProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXT];
        expect(typeof textProps.fontSize).toBe('number');
        expect(textProps.fontSize).toBeGreaterThan(0);
      });

      test('dimensions are positive numbers', () => {
        const textProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXT];
        expect(textProps.width).toBeGreaterThan(0);
        expect(textProps.height).toBeGreaterThan(0);
      });
    });

    describe('TEXTAREA component defaults', () => {
      test('has all required textarea properties', () => {
        const textareaProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXTAREA];
        
        expect(textareaProps).toHaveProperty('content');
        expect(textareaProps).toHaveProperty('fontSize');
        expect(textareaProps).toHaveProperty('color');
        expect(textareaProps).toHaveProperty('lineHeight');
        expect(textareaProps).toHaveProperty('textAlign');
        expect(textareaProps).toHaveProperty('width');
        expect(textareaProps).toHaveProperty('height');
      });

      test('has correct default values', () => {
        const textareaProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXTAREA];
        
        expect(textareaProps.content).toBe('This is a longer text area content that can span multiple lines.');
        expect(textareaProps.fontSize).toBe(16);
        expect(textareaProps.color).toBe('#000000');
        expect(textareaProps.lineHeight).toBe(1.5);
        expect(textareaProps.textAlign).toBe('left');
        expect(textareaProps.width).toBe(300);
        expect(textareaProps.height).toBe(100);
      });

      test('lineHeight is valid', () => {
        const textareaProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXTAREA];
        expect(textareaProps.lineHeight).toBeGreaterThan(0);
        expect(textareaProps.lineHeight).toBeLessThanOrEqual(3);
      });
    });

    describe('FLEXBOX component defaults', () => {
      test('has only container properties (no text)', () => {
        const flexboxProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.FLEXBOX];
        
        expect(flexboxProps).toHaveProperty('backgroundColor');
        expect(flexboxProps).toHaveProperty('width');
        expect(flexboxProps).toHaveProperty('height');
        expect(flexboxProps).toHaveProperty('padding');
        expect(flexboxProps).toHaveProperty('borderRadius');
        
        // Should NOT have text properties
        expect(flexboxProps).not.toHaveProperty('content');
        expect(flexboxProps).not.toHaveProperty('fontSize');
        expect(flexboxProps).not.toHaveProperty('color');
        expect(flexboxProps).not.toHaveProperty('textAlign');
      });

      test('has correct default values', () => {
        const flexboxProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.FLEXBOX];
        
        expect(flexboxProps.backgroundColor).toBe('#ffffff');
        expect(flexboxProps.width).toBe(200);
        expect(flexboxProps.height).toBe(100);
        expect(flexboxProps.padding).toBe(16);
        expect(flexboxProps.borderRadius).toBe(4);
      });

      test('padding and borderRadius are non-negative', () => {
        const flexboxProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.FLEXBOX];
        expect(flexboxProps.padding).toBeGreaterThanOrEqual(0);
        expect(flexboxProps.borderRadius).toBeGreaterThanOrEqual(0);
      });
    });

    describe('IMAGE component defaults', () => {
      test('has all required image properties', () => {
        const imageProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.IMAGE];
        
        expect(imageProps).toHaveProperty('src');
        expect(imageProps).toHaveProperty('alt');
        expect(imageProps).toHaveProperty('width');
        expect(imageProps).toHaveProperty('height');
        expect(imageProps).toHaveProperty('borderRadius');
      });

      test('has correct default values', () => {
        const imageProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.IMAGE];
        
        expect(imageProps.src).toBe('');
        expect(imageProps.alt).toBe('Image');
        expect(imageProps.width).toBe(200);
        expect(imageProps.height).toBe(200);
        expect(imageProps.borderRadius).toBe(0);
      });

      test('src is a string', () => {
        const imageProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.IMAGE];
        expect(typeof imageProps.src).toBe('string');
      });
    });

    describe('BUTTON component defaults', () => {
      test('has all required button properties', () => {
        const buttonProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.BUTTON];
        
        expect(buttonProps).toHaveProperty('text');
        expect(buttonProps).toHaveProperty('url');
        expect(buttonProps).toHaveProperty('fontSize');
        expect(buttonProps).toHaveProperty('padding');
        expect(buttonProps).toHaveProperty('backgroundColor');
        expect(buttonProps).toHaveProperty('color');
        expect(buttonProps).toHaveProperty('borderRadius');
      });

      test('has correct default values', () => {
        const buttonProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.BUTTON];
        
        expect(buttonProps.text).toBe('Button');
        expect(buttonProps.url).toBe('#');
        expect(buttonProps.fontSize).toBe(16);
        expect(buttonProps.padding).toBe(10);
        expect(buttonProps.backgroundColor).toBe('#007bff');
        expect(buttonProps.color).toBe('#ffffff');
        expect(buttonProps.borderRadius).toBe(4);
      });

      test('colors are valid hex codes', () => {
        const buttonProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.BUTTON];
        expect(buttonProps.backgroundColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(buttonProps.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    describe('Cross-component consistency', () => {
      test('all components with width/height have positive values', () => {
        Object.entries(DEFAULT_COMPONENT_PROPS).forEach(([type, props]) => {
          if (props.width !== undefined) {
            expect(props.width).toBeGreaterThan(0);
          }
          if (props.height !== undefined) {
            expect(props.height).toBeGreaterThan(0);
          }
        });
      });

      test('all components with borderRadius have non-negative values', () => {
        Object.entries(DEFAULT_COMPONENT_PROPS).forEach(([type, props]) => {
          if (props.borderRadius !== undefined) {
            expect(props.borderRadius).toBeGreaterThanOrEqual(0);
          }
        });
      });

      test('all color properties are valid hex codes', () => {
        Object.entries(DEFAULT_COMPONENT_PROPS).forEach(([type, props]) => {
          if (props.color !== undefined) {
            expect(props.color).toMatch(/^#[0-9a-fA-F]{6}$/);
          }
          if (props.backgroundColor !== undefined) {
            expect(props.backgroundColor).toMatch(/^#[0-9a-fA-F]{6}$/);
          }
        });
      });

      test('all fontSize properties are positive numbers', () => {
        Object.entries(DEFAULT_COMPONENT_PROPS).forEach(([type, props]) => {
          if (props.fontSize !== undefined) {
            expect(typeof props.fontSize).toBe('number');
            expect(props.fontSize).toBeGreaterThan(0);
          }
        });
      });
    });

    describe('Component differentiation', () => {
      test('text and textarea have different default sizes', () => {
        const textProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXT];
        const textareaProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXTAREA];
        
        expect(textProps.width).not.toBe(textareaProps.width);
        expect(textProps.height).not.toBe(textareaProps.height);
      });

      test('text and textarea have same default fontSize', () => {
        const textProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXT];
        const textareaProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXTAREA];
        
        expect(textProps.fontSize).toBe(textareaProps.fontSize);
      });

      test('only textarea has lineHeight', () => {
        const textProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXT];
        const textareaProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXTAREA];
        
        expect(textProps).not.toHaveProperty('lineHeight');
        expect(textareaProps).toHaveProperty('lineHeight');
      });

      test('only text has fontWeight', () => {
        const textProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXT];
        const textareaProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXTAREA];
        
        expect(textProps).toHaveProperty('fontWeight');
        expect(textareaProps).not.toHaveProperty('fontWeight');
      });

      test('only flexbox lacks content property', () => {
        const textProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXT];
        const textareaProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.TEXTAREA];
        const flexboxProps = DEFAULT_COMPONENT_PROPS[COMPONENT_TYPES.FLEXBOX];
        
        expect(textProps).toHaveProperty('content');
        expect(textareaProps).toHaveProperty('content');
        expect(flexboxProps).not.toHaveProperty('content');
      });
    });

    describe('Data structure integrity', () => {
      test('all component types have default props defined', () => {
        Object.values(COMPONENT_TYPES).forEach(type => {
          expect(DEFAULT_COMPONENT_PROPS[type]).toBeDefined();
          expect(typeof DEFAULT_COMPONENT_PROPS[type]).toBe('object');
        });
      });

      test('no unexpected component types in defaults', () => {
        const defaultKeys = Object.keys(DEFAULT_COMPONENT_PROPS);
        const typeValues = Object.values(COMPONENT_TYPES);
        
        defaultKeys.forEach(key => {
          expect(typeValues).toContain(key);
        });
      });

      test('default props objects are not empty', () => {
        Object.values(DEFAULT_COMPONENT_PROPS).forEach(props => {
          expect(Object.keys(props).length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Constants export', () => {
    test('exports COMPONENT_TYPES', () => {
      expect(COMPONENT_TYPES).toBeDefined();
      expect(typeof COMPONENT_TYPES).toBe('object');
    });

    test('exports DEFAULT_COMPONENT_PROPS', () => {
      expect(DEFAULT_COMPONENT_PROPS).toBeDefined();
      expect(typeof DEFAULT_COMPONENT_PROPS).toBe('object');
    });
  });
});
