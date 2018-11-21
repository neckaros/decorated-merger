import 'reflect-metadata'
import { getObjectInfo, getAllPropertiesToMerge, areEqual } from '../src/decorated-merger'
import { getTestCar, Car, getElecticCar, Person, getPersonA, getTransformerCar } from './models'
import { getExclude, getEquatable, getEquatableForClass } from '../src/decorators'

/**
 * Dummy test
 */
describe('Get class metadata', () => {
  it('A string property should be instance of String', () => {
    const car = getTestCar()
    const type = getObjectInfo(Car, 'model')
    expect(type instanceof String)

    const typeObj = getObjectInfo(car, 'model')
    expect(typeObj instanceof String)
  })

  it('A field not set should still return a type', () => {
    const car = getTestCar()
    const type = getObjectInfo(Car, 'notfilled')
    expect(type instanceof String)

    const typeObj = getObjectInfo(car, 'notfilled')
    expect(typeObj instanceof String)
  })
})

describe('metadata', () => {
  it('Exclude full class', () => {
    const type = getExclude(Car)
    expect(type.length).toEqual(1)
    expect(type[0].propertyName).toBeUndefined()

    const car = getTestCar()
    const typeObj = getExclude(car)
    expect(typeObj.length).toEqual(1)
    expect(typeObj[0].propertyName).toBeUndefined()
  })

  it('Exclude multiple properties of a class', () => {
    const type = getExclude(Person)
    expect(type.length).toEqual(2)
    expect(type.filter(x => x.propertyName === 'id').length).toEqual(1)
    expect(type.filter(x => x.propertyName === 'middlename').length).toEqual(1)

    const person = getPersonA()
    const typeObj = getExclude(person)
    expect(typeObj.length).toEqual(2)
    expect(typeObj.filter(x => x.propertyName === 'id').length).toEqual(1)
    expect(typeObj.filter(x => x.propertyName === 'middlename').length).toEqual(1)
  })

  it('Should get equatable function', () => {
    const type = getEquatable(Car)
    expect(type.length).toEqual(1)
    expect(type[0].options.equal).toBeDefined()

    const car = getTestCar()
    const typeObj = getEquatable(car)
    expect(typeObj.length).toEqual(1)
    expect(typeObj[0].options.equal).toBeDefined()

    const typeObjForClass = getEquatableForClass(car)
    expect(typeObjForClass).toBeDefined()
    expect(typeObjForClass!.options.equal).toBeDefined()
  })
})

describe('Properties to merge getter', () => {
  it('Simple class', () => {
    const car = getTestCar()
    let properties = getAllPropertiesToMerge(car)
    expect(properties.length).toEqual(1)
    expect(properties.filter(x => x.name === 'price').length).toEqual(1)
    car.canUse = []
    properties = getAllPropertiesToMerge(car)
    expect(properties.length).toEqual(2)
    expect(properties.filter(x => x.name === 'canUse').length).toEqual(1)

    properties = getAllPropertiesToMerge(car, { group: 'garage' })
    expect(properties.length).toEqual(3)
    expect(properties.filter(x => x.name === 'model').length).toEqual(1)
  })

  it('Inherited class', () => {
    const car = getElecticCar()
    let properties = getAllPropertiesToMerge(car)
    expect(properties.length).toEqual(2)
    expect(properties.filter(x => x.name === 'price').length).toEqual(1)
    expect(properties.filter(x => x.name === 'percent').length).toEqual(1)
    car.canUse = []
    properties = getAllPropertiesToMerge(car)
    expect(properties.length).toEqual(3)
    expect(properties.filter(x => x.name === 'canUse').length).toEqual(1)
  })

  it('Inherited reinclude class', () => {
    const car = getTransformerCar()
    let properties = getAllPropertiesToMerge(car)
    expect(properties.length).toEqual(5)
    expect(properties.filter(x => x.name === 'id').length).toEqual(1)
    expect(properties.filter(x => x.name === 'model').length).toEqual(1)
    expect(properties.filter(x => x.name === 'price').length).toEqual(1)
    expect(properties.filter(x => x.name === 'creator').length).toEqual(1)
    expect(properties.filter(x => x.name === 'surename').length).toEqual(1)
    car.canUse = []
    properties = getAllPropertiesToMerge(car)
    expect(properties.length).toEqual(6)
    expect(properties.filter(x => x.name === 'canUse').length).toEqual(1)
  })
})

describe('Comparison', () => {
  it('equatable equal obj should be equal', () => {
    const carA = getTestCar()
    const carB = getTestCar()
    let equal = areEqual(carA, carB)
    expect(equal).toEqual(true)
  })

  it("equatable non equal obj shouldn't be equal", () => {
    const carA = getTestCar()
    const carB = getTestCar()
    carA.id = 'nono'
    let equal = areEqual(carA, carB)
    expect(equal).toEqual(false)
  })
})
