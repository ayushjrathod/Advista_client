import { Component } from "react";

export default class LazyRenderBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Lazy render failed:", error);
  }

  render() {
    const { fallback, children } = this.props;

    if (this.state.hasError) {
      return fallback;
    }

    return children;
  }
}
