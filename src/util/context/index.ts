import { Tracer, Tags, FORMAT_HTTP_HEADERS } from 'opentracing'
import { IncomingHttpHeaders } from 'http'
import uuidv1 from 'uuid/v1'

export type Context = {
  [index: string]: any
}

export function spanFromContext(ctx: Context, name: string): Context {
  if (!ctx.tracer) {
    return ctx
  }
  let span = ctx.span
    ? ctx.tracer.startSpan(name, { childOf: ctx.span })
    : ctx.tracer.startSpan(name)
  return { ...ctx, span }
}


export function contextFromHttpHeaders(name: string, tracer: Tracer, headers: IncomingHttpHeaders): Context {
  let parentSpanContext: any = tracer.extract(FORMAT_HTTP_HEADERS, headers)
  let isValidSpan = parentSpanContext && parentSpanContext._spanId !== undefined

  let tags = {
    [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER
  }

  let span = tracer.startSpan(name, isValidSpan
    ? { childOf: parentSpanContext, tags }
    : { tags })

  let rootCtx: Context = {
    tracer,
    span
  }

  return rootCtx
}

export function contextWithRequestId(ctx: Context): Context {
  return ctx.requestId ? ctx : { ...ctx, requestId: uuidv1() }
}