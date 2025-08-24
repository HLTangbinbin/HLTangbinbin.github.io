// src/utils/PerformanceMonitor.js

import { logger } from "./Logger";

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      navigation: [],
      dataLoading: [],
      chartRendering: [],
      memory: [],
      errors: []
    };
    
    this.observers = new Map();
    this.isMonitoring = false;
    
    this.init();
  }

  init() {
    // 监控页面加载性能
    this.observePageLoad();
    
    // 监控路由切换性能
    this.observeNavigation();
    
    // 监控内存使用
    this.observeMemory();
    
    // 监控错误
    this.observeErrors();
    
    // 监控长任务
    this.observeLongTasks();
  }

  start() {
    this.isMonitoring = true;
    logger.debug('性能监控已启动');
  }

  stop() {
    this.isMonitoring = false;
    logger.debug('性能监控已停止');
  }

  // 监控页面加载性能
  observePageLoad() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          const metrics = {
            timestamp: Date.now(),
            type: 'pageLoad',
            dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcpConnection: navigation.connectEnd - navigation.connectStart,
            requestResponse: navigation.responseEnd - navigation.requestStart,
            domProcessing: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            totalTime: navigation.loadEventEnd - navigation.navigationStart
          };
          
          this.recordMetric('navigation', metrics);
          this.analyzePerformance(metrics);
        }
      });
    }
  }

  // 监控路由切换性能
  observeNavigation() {
    if (window.router) {
      const originalPush = window.router.push;
      window.router.push = function(...args) {
        const startTime = performance.now();
        const result = originalPush.apply(this, args);
        
        result.then(() => {
          const endTime = performance.now();
          const metrics = {
            timestamp: Date.now(),
            type: 'navigation',
            from: window.router.currentRoute.value?.path,
            to: args[0],
            duration: endTime - startTime
          };
          
          this.recordMetric('navigation', metrics);
        });
        
        return result;
      }.bind(this);
    }
  }

  // 监控内存使用
  observeMemory() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        const metrics = {
          timestamp: Date.now(),
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        };
        
        this.recordMetric('memory', metrics);
        
        // 内存使用过高时发出警告
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
          logger.warn('内存使用率过高:', (memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100).toFixed(2) + '%');
        }
      }, 10000); // 每10秒检查一次
    }
  }

  // 监控错误
  observeErrors() {
    window.addEventListener('error', (event) => {
      const metrics = {
        timestamp: Date.now(),
        type: 'error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      };
      
      this.recordMetric('errors', metrics);
    });

    window.addEventListener('unhandledrejection', (event) => {
      const metrics = {
        timestamp: Date.now(),
        type: 'unhandledRejection',
        reason: event.reason
      };
      
      this.recordMetric('errors', metrics);
    });
  }

  // 监控长任务
  observeLongTasks() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) { // 超过50ms的任务
              const metrics = {
                timestamp: Date.now(),
                type: 'longTask',
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name
              };
              
              this.recordMetric('chartRendering', metrics);
              logger.warn('检测到长任务:', entry.duration.toFixed(2) + 'ms');
            }
          }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        logger.warn('长任务监控不可用:', e);
      }
    }
  }

  // 记录性能指标
  recordMetric(category, metric) {
    if (!this.isMonitoring) return;
    
    this.metrics[category].push(metric);
    
    // 限制记录数量，避免内存泄漏
    if (this.metrics[category].length > 100) {
      this.metrics[category] = this.metrics[category].slice(-50);
    }
    
    // 通知观察者
    this.notifyObservers(category, metric);
  }

  // 分析性能
  analyzePerformance(metrics) {
    if (metrics.type === 'pageLoad') {
      if (metrics.totalTime > 3000) {
        logger.warn('页面加载时间过长:', metrics.totalTime.toFixed(2) + 'ms');
      }
      
      if (metrics.dnsLookup > 100) {
        logger.warn('DNS查询时间过长:', metrics.dnsLookup.toFixed(2) + 'ms');
      }
      
      if (metrics.requestResponse > 2000) {
        logger.warn('请求响应时间过长:', metrics.requestResponse.toFixed(2) + 'ms');
      }
    }
    
    if (metrics.type === 'navigation' && metrics.duration > 1000) {
      logger.warn('路由切换时间过长:', metrics.duration.toFixed(2) + 'ms');
    }
  }

  // 添加观察者
  addObserver(category, callback) {
    if (!this.observers.has(category)) {
      this.observers.set(category, []);
    }
    this.observers.get(category).push(callback);
  }

  // 移除观察者
  removeObserver(category, callback) {
    if (this.observers.has(category)) {
      const callbacks = this.observers.get(category);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // 通知观察者
  notifyObservers(category, metric) {
    if (this.observers.has(category)) {
      this.observers.get(category).forEach(callback => {
        try {
          callback(metric);
        } catch (e) {
          logger.error('观察者回调执行失败:', e);
        }
      });
    }
  }

  // 获取性能报告
  getReport() {
    const report = {
      summary: {},
      details: this.metrics
    };
    
    // 计算汇总统计
    Object.keys(this.metrics).forEach(category => {
      const data = this.metrics[category];
      if (data.length > 0) {
        const durations = data.filter(m => m.duration || m.totalTime).map(m => m.duration || m.totalTime);
        if (durations.length > 0) {
          report.summary[category] = {
            count: data.length,
            avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
            maxDuration: Math.max(...durations),
            minDuration: Math.min(...durations)
          };
        }
      }
    });
    
    return report;
  }

  // 导出性能数据
  exportData() {
    return JSON.stringify(this.getReport(), null, 2);
  }

  // 清理数据
  clearData() {
    Object.keys(this.metrics).forEach(key => {
      this.metrics[key] = [];
    });
    logger.debug('性能数据已清理');
  }
}

// 创建全局实例
const performanceMonitor = new PerformanceMonitor();

// 自动启动监控
performanceMonitor.start();

export default performanceMonitor;
export { PerformanceMonitor }; 