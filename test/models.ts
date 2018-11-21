import { format } from '../src/decorated-merger'
import { Exclude, Include, Equatable } from '../src/decorators'

@Exclude()
@Equatable<Car>({ equal: (a, b) => a.id === b.id })
export class Car {
  id: string
  @Include({ group: 'garage' })
  model: string
  creator: string
  @Include()
  notfilled: string
  @Include()
  price: number
  options: string[]
  @Include()
  canUse: Person[]
  buyer: Person
}

export class ElectricCar extends Car {
  @Include()
  percent: number
}

@Include()
export class TransformerCar extends Car {
  surename: string
}

@Equatable<Person>({ equal: (a, b) => a.id === b.id })
export class Person {
  @Exclude()
  id: string
  fixing: Car[]
  @Exclude()
  middlename: string
  constructor(id: string, public lastname: string, public firstname: string, middlename: string) {
    this.id = id
    this.middlename = middlename
  }
}

export const getTestCar = () => {
  const car = new Car()
  car.id = 'test'
  car.model = 'Model 3'
  car.creator = 'Elon'
  car.price = 30000
  return car
}

export const getElecticCar = () => {
  const car = new ElectricCar()
  car.id = 'electric'
  car.model = 'Model 3'
  car.creator = 'Elon'
  car.price = 30000
  car.percent = 50
  return car
}
export const getTransformerCar = () => {
  const car = new TransformerCar()
  car.id = 'transformer'
  car.creator = 'Elon'
  car.model = 'Model 3'
  car.price = 30000
  car.surename = 'billy'
  return car
}

export const getPersonA = () => new Person('a', 'A', 'toto', 'middlea')
export const getPersonB = () => new Person('b', 'B', 'toto', 'middleb')
