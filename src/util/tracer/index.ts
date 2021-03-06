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


// function http_get(fn, url, span) {
//   const method = 'GET';
//   const headers = {};

//   span.setTag(Tags.HTTP_URL, url);
//   span.setTag(Tags.HTTP_METHOD, method);
//   span.setTag(Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_CLIENT);
//   // Send span context via request headers (parent id etc.)
//   tracer.inject(span, FORMAT_HTTP_HEADERS, headers);

//   return request({ url, method, headers })
//     .then(data => {
//       span.finish();
//       return data;
//     }, e => {
//       span.finish();
//       throw e;
//     });

// }
