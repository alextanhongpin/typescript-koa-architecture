export interface Decorator<T> {
  (service: T, ...args: any[]): T
}

export function decorate<T>(service: T, decorators: Decorator<T>[]): T {
  let decorated = service
  for (let decorator of decorators) {
    decorated = decorator(decorated)
  }
  return decorated
}