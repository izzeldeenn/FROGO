import { ProductAPI } from '@/contexts/ProductAPIContext';

export interface SandboxConfig {
  allowNetwork?: boolean;
  allowLocalStorage?: boolean;
  maxExecutionTime?: number;
  allowedAPIs?: string[];
}

export interface ExecutionResult {
  success: boolean;
  error?: string;
  cleanup?: () => void;
}

/**
 * Execute product code in a sandboxed environment
 */
export async function executeProductCode(
  code: string,
  codeType: 'javascript' | 'css' | 'html',
  productId: string,
  productAPI: ProductAPI,
  config: SandboxConfig = {}
): Promise<ExecutionResult> {
  try {
    switch (codeType) {
      case 'javascript':
        return executeJavaScript(code, productId, productAPI, config);
      case 'css':
        return executeCSS(code, productId, config);
      case 'html':
        return executeHTML(code, productId, config);
      default:
        return { success: false, error: `Unsupported code type: ${codeType}` };
    }
  } catch (error) {
    console.error('Product execution error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Execute JavaScript code in sandbox
 */
function executeJavaScript(
  code: string,
  productId: string,
  productAPI: ProductAPI,
  config: SandboxConfig
): ExecutionResult {
  const cleanupFunctions: (() => void)[] = [];

  try {
    // Create sandbox environment
    const sandbox = {
      // Safe console
      console: {
        log: (...args: any[]) => console.log(`[Product ${productId}]:`, ...args),
        warn: (...args: any[]) => console.warn(`[Product ${productId}]:`, ...args),
        error: (...args: any[]) => console.error(`[Product ${productId}]:`, ...args),
      },
      
      // Product API
      ProductAPI: productAPI,
      
      // Safe timers
      setTimeout: (callback: Function, delay: number) => {
        const id = setTimeout(() => {
          try {
            callback();
          } catch (error) {
            console.error(`Timer error in product ${productId}:`, error);
          }
        }, delay);
        
        cleanupFunctions.push(() => clearTimeout(id));
        return id;
      },
      
      setInterval: (callback: Function, delay: number) => {
        const id = setInterval(() => {
          try {
            callback();
          } catch (error) {
            console.error(`Interval error in product ${productId}:`, error);
          }
        }, delay);
        
        cleanupFunctions.push(() => clearInterval(id));
        return id;
      },
      
      // Safe event listeners
      addEventListener: (target: EventTarget, event: string, handler: EventListener) => {
        target.addEventListener(event, handler);
        cleanupFunctions.push(() => target.removeEventListener(event, handler));
      },
      
      // Safe storage (if allowed)
      storage: config.allowLocalStorage ? {
        get: (key: string) => productAPI.getProductStorage(key),
        set: (key: string, value: any) => productAPI.setProductStorage(key, value),
      } : undefined,
      
      // Product metadata
      productId,
      productVersion: productAPI.version,
    };

    // Wrap code in IIFE to prevent scope pollution
    const wrappedCode = `
      (function(sandbox) {
        'use strict';
        try {
          ${code}
        } catch (error) {
          sandbox.console.error('Product execution error:', error);
          throw error;
        }
      })(sandbox);
    `;

    // Create function from code
    const sandboxedFunction = new Function('sandbox', wrappedCode);
    
    // Execute with timeout
    const maxTime = config.maxExecutionTime || 5000; // 5 seconds default
    const timeoutId = setTimeout(() => {
      throw new Error('Product execution timeout');
    }, maxTime);
    
    sandboxedFunction(sandbox);
    clearTimeout(timeoutId);

    // Register cleanup with ProductAPI
    productAPI.onUnload(() => {
      cleanupFunctions.forEach(fn => fn());
    });

    return {
      success: true,
      cleanup: () => {
        cleanupFunctions.forEach(fn => fn());
      }
    };
  } catch (error) {
    // Cleanup on error
    cleanupFunctions.forEach(fn => fn());
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Execute CSS code
 */
function executeCSS(code: string, productId: string, config: SandboxConfig): ExecutionResult {
  try {
    const styleId = `product-style-${productId}`;
    
    // Remove existing style if any
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = code;
    document.head.appendChild(styleElement);
    
    return {
      success: true,
      cleanup: () => {
        const element = document.getElementById(styleId);
        if (element) element.remove();
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Execute HTML code
 */
function executeHTML(code: string, productId: string, config: SandboxConfig): ExecutionResult {
  try {
    const containerId = `product-html-${productId}`;
    
    // Remove existing container if any
    const existingContainer = document.getElementById(containerId);
    if (existingContainer) {
      existingContainer.remove();
    }
    
    // Create container
    const container = document.createElement('div');
    container.id = containerId;
    container.style.display = 'none'; // Hidden by default
    container.innerHTML = code;
    document.body.appendChild(container);
    
    return {
      success: true,
      cleanup: () => {
        const element = document.getElementById(containerId);
        if (element) element.remove();
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Validate code for security
 */
export function validateCode(code: string, codeType: string): { valid: boolean; error?: string } {
  // Check for dangerous patterns
  const dangerousPatterns = [
    /eval\s*\(/,
    /Function\s*\(/,
    /document\.write/,
    /window\.location/,
    /\.innerHTML\s*=/,
    /import\s+/,
    /require\s*\(/,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      return {
        valid: false,
        error: `Code contains potentially dangerous pattern: ${pattern}`
      };
    }
  }

  // Additional validation for JavaScript
  if (codeType === 'javascript') {
    // Check for infinite loops (basic check)
    const loopPatterns = [
      /while\s*\(\s*true\s*\)/,
      /for\s*\(\s*;\s*;\s*\)/,
    ];

    for (const pattern of loopPatterns) {
      if (pattern.test(code)) {
        return {
          valid: false,
          error: 'Code contains potentially infinite loop'
        };
      }
    }
  }

  return { valid: true };
}
