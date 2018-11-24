import 'reflect-metadata'
import {
  getExclude,
  getInclude,
  EqualFunction,
  getEquatable,
  getEquatableForClass
} from './decorators'
export { Equatable, Exclude, Include } from './decorators'

interface MergeOptions {
  group?: string
}

const isForGroup = (group: string | undefined, metadata: { group?: string }) =>
  group === metadata.group || metadata.group === undefined

export const getAllPropertiesToMerge = (object: Object, options: MergeOptions = {}) => {
  const allProperties = Object.getOwnPropertyNames(object)
    .map(s => ({ name: s, descriptor: Object.getOwnPropertyDescriptor(object, s)! }))
    .filter(p => p.descriptor.enumerable)

  let finalProperties = [...allProperties]

  const excludes = getExclude(object)
  for (const excl of excludes) {
    if (!isForGroup(options.group, excl.options)) continue
    if (!excl.propertyName) {
      finalProperties = []
    } else {
      finalProperties = finalProperties.filter(x => x.name !== excl.propertyName)
    }
  }

  const includes = getInclude(object)
  for (const incl of includes) {
    if (!isForGroup(options.group, incl.options)) continue
    if (!incl.propertyName) {
      finalProperties = allProperties
    } else if ((object as any)[incl.propertyName]) {
      finalProperties = [...finalProperties, allProperties.find(x => x.name === incl.propertyName)!]
    }
  }

  return finalProperties
}

export const areEqual = <T>(compare: T, to: T, overrideEquatable?: EqualFunction<T>) => {
  const objEquatables = getEquatableForClass(compare)
  return objEquatables ? objEquatables.options.equal(compare, to) : compare === to
}

export const getObjectInfo = (object: any, key: string) => {
  const type = Reflect.getMetadata('design:type', object, key)
  return type
}

const isGeneric = (object: any) => {
  const type = typeof object
  return type !== 'object'
}

export const merger = <T extends any, Y extends any>(
  merge: T,
  into: Y,
  options?: MergeOptions
): T & Y => {
  if (isGeneric(merge) || isGeneric(into)) {
    return into as T & Y
  }
  const allProperties = getAllPropertiesToMerge(merge, options)
  for (const property of allProperties) {
    const typeNew = typeof merge
    if (typeNew === 'undefined' || typeNew === 'function') {
      continue
    }
    const oldValue = into[property.name]
    const newValue = merge[property.name]
    if (oldValue === undefined) {
      into[property.name] = newValue
      continue
    }
    if (Array.isArray(newValue)) {
      if (!Array.isArray(oldValue)) {
        into[property.name] = newValue
        continue
      }
      const toAdd = []
      for (const newEl of newValue) {
        const existingEl = oldValue.find(oldEl => areEqual(oldEl, newEl))
        if (existingEl) {
          merger(newEl, existingEl, options)
        } else {
          toAdd.push(newEl)
        }
      }
      if (toAdd.length > 0) {
        into[property.name] = [...oldValue, ...toAdd]
      }
    } else {
      into[property.name] = newValue
    }
  }
  return into as T & Y
}
