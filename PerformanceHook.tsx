import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

interface WebVitals {
  CLS?: number;  // Cumulative Layout Shift
  FID?: number;  // First Input Delay
  FCP?: number;  // First Contentful Paint
  LCP?: number;  // Largest Contentful Paint
  TTFB?: number; // Time to First Byte
}

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const measureRenderTime = useCallback((startTime: number) => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    const metrics: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now()
    };

    // Log slow renders (> 16ms for 60fps)
    if (renderTime > 16) {
      console.warn(`Slow render detected in ${componentName}:`, `${renderTime.toFixed(2)}ms`);
    }

    // In production, you might send this to an analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time:`, `${renderTime.toFixed(2)}ms`);
    }

    return metrics;
  }, [componentName]);

  return { measureRenderTime };
};

// Hook for monitoring Web Vitals
export const useWebVitals = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Measure Core Web Vitals
    const measureWebVitals = () => {
      const vitals: WebVitals = {};

      // Get navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        vitals.TTFB = navigation.responseStart - navigation.requestStart;
      }

      // Observe paint entries
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        vitals.FCP = fcpEntry.startTime;
      }

      // Use PerformanceObserver for modern browsers
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            vitals.LCP = lastEntry.startTime;
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP observation not supported');
        }

        // First Input Delay
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              vitals.FID = entry.processingStart - entry.startTime;
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID observation not supported');
        }

        // Cumulative Layout Shift
        try {
          const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0;
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            vitals.CLS = clsValue;
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS observation not supported');
        }
      }

      // Log metrics after page load
      setTimeout(() => {
        console.log('Web Vitals:', vitals);
        // In production, send to analytics
      }, 2000);
    };

    if (document.readyState === 'complete') {
      measureWebVitals();
    } else {
      window.addEventListener('load', measureWebVitals);
    }

    return () => {
      window.removeEventListener('load', measureWebVitals);
    };
  }, []);
};

// Hook for memory usage monitoring
export const useMemoryMonitor = () => {
  const checkMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryInfo = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usedPercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };

      // Warn if memory usage is high
      if (memoryInfo.usedPercentage > 80) {
        console.warn('High memory usage detected:', memoryInfo);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Memory Usage:', {
          used: `${(memoryInfo.usedJSHeapSize / 1048576).toFixed(2)} MB`,
          total: `${(memoryInfo.totalJSHeapSize / 1048576).toFixed(2)} MB`,
          limit: `${(memoryInfo.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
          percentage: `${memoryInfo.usedPercentage.toFixed(1)}%`
        });
      }

      return memoryInfo;
    }
    return null;
  }, []);

  useEffect(() => {
    const interval = setInterval(checkMemoryUsage, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [checkMemoryUsage]);

  return { checkMemoryUsage };
};

// Hook for detecting performance issues
export const usePerformanceDetector = () => {
  useEffect(() => {
    const detectLongTasks = () => {
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (entry.duration > 50) { // Long tasks > 50ms
                console.warn('Long task detected:', {
                  duration: `${entry.duration.toFixed(2)}ms`,
                  startTime: entry.startTime,
                  name: entry.name
                });
              }
            });
          });
          observer.observe({ entryTypes: ['longtask'] });
          
          return () => observer.disconnect();
        } catch (e) {
          console.warn('Long task observation not supported');
        }
      }
    };

    const cleanup = detectLongTasks();
    return cleanup;
  }, []);
};

// Utility function to measure function execution time
export const measureExecutionTime = <T extends (...args: any[]) => any>(
  fn: T,
  functionName: string = fn.name || 'anonymous'
): T => {
  return ((...args: Parameters<T>) => {
    const startTime = performance.now();
    const result = fn(...args);
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    if (executionTime > 10) { // Log functions taking > 10ms
      console.warn(`Slow function execution: ${functionName} took ${executionTime.toFixed(2)}ms`);
    }

    return result;
  }) as T;
};

// React component wrapper for performance monitoring
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    const name = componentName || Component.displayName || Component.name || 'Unknown';
    const { measureRenderTime } = usePerformanceMonitor(name);

    useEffect(() => {
      const startTime = performance.now();
      return () => {
        measureRenderTime(startTime);
      };
    });

    return <Component {...props} ref={ref} />;
  });

  WrappedComponent.displayName = `withPerformanceMonitoring(${componentName || Component.displayName || Component.name})`;
  
  return WrappedComponent;
};