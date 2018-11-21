export interface ExcludeOptions {
  group?: string
}

export class ExcludeMetadata {
  static KEY = 'decmerg:exclude'
  constructor(
    public target: Function,
    public options: ExcludeOptions,
    public propertyName?: string
  ) {}
}

export function Exclude(options?: ExcludeOptions) {
  return function(object: Object | Function, propertyName?: string) {
    const metadata = new ExcludeMetadata(
      object instanceof Function ? object : object.constructor,
      options || {},
      propertyName
    )
    const existingExclude = getExclude(metadata.target) || []
    const newExclude = [...existingExclude, metadata]
    Reflect.defineMetadata(ExcludeMetadata.KEY, newExclude, metadata.target)
  }
}

export function getExclude(object: Object | Function): ExcludeMetadata[] {
  const target = object instanceof Function ? object : object.constructor
  const type = Reflect.getMetadata(ExcludeMetadata.KEY, target)
  return type || []
}

export interface IncludeOptions {
  group?: string
}

export class IncludeMetadata {
  static KEY = 'decmerg:include'
  constructor(
    public target: Function,
    public options: ExcludeOptions,
    public propertyName?: string
  ) {}
}

export function Include(options?: IncludeOptions) {
  return function(object: Object | Function, propertyName?: string) {
    const metadata = new IncludeMetadata(
      object instanceof Function ? object : object.constructor,
      options || {},
      propertyName
    )
    const existingInclude = getInclude(metadata.target) || []
    const newInclude = [...existingInclude, metadata]
    Reflect.defineMetadata(IncludeMetadata.KEY, newInclude, metadata.target)
  }
}

export function getInclude(object: Object | Function): ExcludeMetadata[] {
  const target = object instanceof Function ? object : object.constructor
  const type = Reflect.getMetadata(IncludeMetadata.KEY, target)
  return type || []
}

export type EqualFunction<T> = (obj1: T, obj2: T) => boolean
export interface EquatableOptions<T> {
  equal: EqualFunction<T>
}
export class EquatableMetadata<T> {
  static KEY = 'decmerg:equatable'
  constructor(
    public target: Function,
    public options: EquatableOptions<T>,
    public propertyName?: string
  ) {}
}

export function Equatable<T>(options: EquatableOptions<T>) {
  return function(object: Object | Function, propertyName?: string) {
    const metadata = new EquatableMetadata<T>(
      object instanceof Function ? object : object.constructor,
      options,
      propertyName
    )
    const existingEquatable = getEquatable<T>(metadata.target) || []
    const newEquatable = [...existingEquatable, metadata]
    Reflect.defineMetadata(EquatableMetadata.KEY, newEquatable, metadata.target)
  }
}

export function getEquatable<T>(object: Object | Function): EquatableMetadata<T>[] {
  const target = object instanceof Function ? object : object.constructor
  const type = Reflect.getMetadata(EquatableMetadata.KEY, target)
  return type || []
}

export function getEquatableForClass<T>(
  object: Object | Function
): EquatableMetadata<T> | undefined {
  return getEquatable<T>(object).find(x => x.propertyName === undefined)
}

export function getEquatableForProperty<T>(
  object: Object | Function,
  propertyName: string
): EquatableMetadata<T> | undefined {
  return getEquatable<T>(object).find(x => x.propertyName === propertyName)
}
