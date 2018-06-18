import * as opentracing from 'opentracing'
import { initTracer, TracingConfig, TracingOptions } from 'jaeger-client'

export function makeTracer(serviceName: string): opentracing.Tracer {
  let config: TracingConfig = {
    serviceName,
    disable: false,
    sampler: {
      type: 'const',
      param: 1
      // type: 'probabilistic',
      // param: 1.0
    },
    reporter: {
      logSpans: true,
      agentHost: 'localhost',
      agentPort: 6832, // accept jaeger.thrift over binary thrift protocol
    }
  }
  let options: TracingOptions = {
    tags: {
      'app.version': '1.0.0',
    },
  }
  let tracer = initTracer(config, options)
  return tracer
}
