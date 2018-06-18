/// <reference types="node" />

declare module 'jaeger-client' {
  import * as opentracing from "opentracing";

  export interface TracingConfig {
    serviceName?: string;
    disable?: boolean;
    sampler?: SamplerConfig;
    reporter?: ReporterConfig;
  }

  export interface TracingOptions {
    reporter?: Reporter;
    metrics?: MetricsFactory;
    logger?: Logger;
    tags?: any;
  }

  export interface ReporterConfig {
    logSpans?: boolean;
    agentHost?: string;
    agentPort?: number;
    flushIntervalMs?: number;
  }

  export interface SamplerConfig {
    type: string;
    param: number;
    host?: string;
    port?: number;
    refreshIntervalMs?: number;
  }

  export interface Logger {
    info(msg: string): void;
    error(msg: string): void;
  }

  export interface Reporter {
    report(span: opentracing.Span): void;
    close(callback?: () => void): void;
    setProcess(serviceName: string, tags: any): void;
  }

  export interface MetricsFactory {
    createCounter(name: string, tags: any): Counter;
    createTimer(name: string, tags: any): Timer;
    createGauge(name: string, tags: any): Gauge;
  }

  // Counter tracks the number of times an event has occurred
  export interface Counter {
    // Adds the given value to the counter.
    increment(delta: number): void;
  }

  // Timer tracks how long an operation took and also computes percentiles.
  export interface Timer {
    // Records the time passed in.
    record(value: number): void;
  }

  // Gauge returns instantaneous measurements of something as an int64 value
  export interface Gauge {
    // Update the gauge to the value passed in.
    update(value: number): void;
  }

  export function initTracer(
    tracingConfig: TracingConfig,
    tracingOptions: TracingOptions,
  ): opentracing.Tracer;
}

