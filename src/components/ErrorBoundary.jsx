import React from 'react';

/** 图表兜底边界:任何渲染异常只降级图表卡片,不影响其余数据面板 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(err) {
    return { err };
  }
  componentDidCatch(err) {
    console.error('[KillLine]', err);
  }
  render() {
    if (this.state.err) {
      return (
        <div className="card chart-error">
          <b>⚠ {this.props.fallback}</b>
          <pre>{String(this.state.err?.message || this.state.err)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
