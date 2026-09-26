import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Eye } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onFallback2D?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '24px',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '12px',
            color: '#f8fafc',
            textAlign: 'center',
            margin: '12px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={24} className="text-rose-400" />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#fca5a5' }}>
            {this.props.fallbackTitle || 'Subsystem Sensor Offline'}
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', maxWidth: '420px', margin: 0 }}>
            {this.state.error?.message?.includes('WebGL')
              ? 'Hardware 3D WebGL acceleration is currently unavailable on this device or display driver. The tactical bridge is operating in 2D sensor mode.'
              : 'A telemetry subsystem encountered an unexpected state. Mission state and telemetry data remain fully intact.'}
          </p>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            {this.props.onFallback2D && (
              <button
                onClick={this.props.onFallback2D}
                style={{
                  padding: '6px 14px',
                  backgroundColor: '#38bdf8',
                  color: '#070a0e',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Eye size={14} />
                <span>Switch to 2D Tactical View</span>
              </button>
            )}
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '6px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <RefreshCw size={14} />
              <span>Retry Sensor</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
