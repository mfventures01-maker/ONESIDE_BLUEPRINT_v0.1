import React, { ErrorInfo } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { telemetryEngine } from './engine';

// --- REACT CORE WRAPPER ---
const safeStringify = (obj: any) => {
  try {
    return JSON.stringify(obj);
  } catch {
    return '[Circular or Non-Serializable]';
  }
};

const originalCreateElement = React.createElement;
(React as any).createElement = function (type: any, props: any, ...children: any[]) {
  const componentName = typeof type === 'string' ? type : (type.displayName || type.name || 'Unknown');
  const traceId = telemetryEngine.generateTraceID();
  
  telemetryEngine.emit('component_renders', {
    TraceID: traceId,
    Timestamp: new Date().toISOString(),
    RenderSequence: telemetryEngine.getNextRenderSequence(),
    ComponentName: componentName,
    File: 'Unknown', // In a full implementation, Babel plugin would inject __source
    PropsSize: props ? safeStringify(props).length : 0,
    ChildrenCount: children.length,
    RenderStatus: 'CREATED'
  });

  return originalCreateElement.apply(this, [type, props, ...children]);
};




// --- HOOKS WRAPPER ---
const hooksToWrap = ['useState', 'useEffect', 'useMemo', 'useCallback', 'useRef', 'useContext'] as const;

hooksToWrap.forEach((hookName) => {
  const originalHook = (React as any)[hookName];
  if (originalHook) {
    (React as any)[hookName] = function (...args: any[]) {
      const traceId = telemetryEngine.generateTraceID();
      
      const start = performance.now();
      const result = originalHook.apply(this, args);
      const end = performance.now();

      telemetryEngine.emit('hooks', {
        TraceID: traceId,
        HookName: hookName,
        Timestamp: new Date().toISOString(),
        ExecutionDuration: end - start,
        ExecutionStatus: 'EXECUTED',
        DependencyHash: args.length > 1 ? safeStringify(args[1]) : null
      });

      return result;
    };
  }
});
