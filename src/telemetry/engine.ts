export class ConstitutionalTelemetryEngine {
  private static instance: ConstitutionalTelemetryEngine;
  private renderSequence = 0;

  private constructor() {}

  public static getInstance(): ConstitutionalTelemetryEngine {
    if (!ConstitutionalTelemetryEngine.instance) {
      ConstitutionalTelemetryEngine.instance = new ConstitutionalTelemetryEngine();
    }
    return ConstitutionalTelemetryEngine.instance;
  }

  public generateTraceID(): string {
    return 'trace_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  public getNextRenderSequence(): number {
    return ++this.renderSequence;
  }

  public emit(type: 'component_renders' | 'hooks' | 'routes' | 'supabase', payload: any) {
    // Send to Vite telemetry server
    fetch('/__telemetry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type,
        data: {
          ...payload,
          Timestamp: new Date().toISOString()
        }
      })
    }).catch(err => {
      console.error('[CRVE] Telemetry emission failed:', err);
    });
  }
}

export const telemetryEngine = ConstitutionalTelemetryEngine.getInstance();
