import 'reflect-metadata'
import { merger } from '../src/decorated-merger'
import { getTestCar, getPersonA, getPersonB } from './models'

/**
 * Dummy test
 */
describe('Merging', () => {
  it('Two simple class should merge', () => {
    const car = getTestCar()
    const carNew = getTestCar()
    carNew.notfilled = 'test'
    carNew.creator = 'toto'
    carNew.model = 'Model X'
    expect(car.notfilled).toBeUndefined()
    expect(car.creator).toEqual('Elon')
    expect(car.model).toEqual('Model 3')
    merger(carNew, car)
    expect(car.notfilled).toBeDefined()
    expect(car.creator).toEqual('Elon')
    expect(car.model).toEqual('Model 3')
  })

  it('Two simple class with group should merge', () => {
    const car = getTestCar()
    const carNew = getTestCar()
    carNew.notfilled = 'test'
    carNew.creator = 'toto'
    carNew.model = 'Model X'
    expect(car.notfilled).toBeUndefined()
    expect(car.creator).toEqual('Elon')
    expect(car.model).toEqual('Model 3')
    merger(carNew, car, { group: 'garage' })
    expect(car.notfilled).toBeDefined()
    expect(car.creator).toEqual('Elon')
    expect(car.model).toEqual('Model X')
  })

  it('Two simple class with new array should merge', () => {
    const car = getTestCar()
    const carNew = getTestCar()
    const personA = getPersonA()
    carNew.canUse = [personA]
    expect(car.canUse).toBeUndefined()
    merger(carNew, car)
    expect(car.canUse).toBeDefined()
    expect(car.canUse[0]).toEqual(personA)
  })

  it('String arrays should merge', () => {
    const movieA = { title: 'test', genre: ['Comedy', 'Drama'] }
    const movieB = { title: 'test', genre: ['Fiction', 'Drama'] }
    merger(movieB, movieA)

    expect(movieA.genre.length).toEqual(3)
    expect(movieA.genre).toContain('Comedy')
    expect(movieA.genre).toContain('Fiction')
    expect(movieA.genre).toContain('Drama')
  })

  it('Number arrays should merge', () => {
    const movieA = { title: 'test', genre: [1, 2] }
    const movieB = { title: 'test', genre: [2, 3] }
    merger(movieB, movieA)

    expect(movieA.genre.length).toEqual(3)
    expect(movieA.genre).toContain(1)
    expect(movieA.genre).toContain(2)
    expect(movieA.genre).toContain(3)
  })

  it('function arrays should merge', () => {
    const movieA = { title: 'test', genre: [() => 'Drama'] }
    const movieB = { title: 'test', genre: [() => 'Action'] }
    merger(movieB, movieA)

    console.log(movieA)

    expect(movieA.genre.length).toEqual(2)
    expect(movieA.genre[0]()).toEqual('Drama')
    expect(movieA.genre[1]()).toEqual('Action')
  })

  it('Object with funct should merge', () => {
    let movieA = { title: 'test', test: () => true }
    const movieB = { title: 'test', to: () => true }
    const newMovie = merger(movieB, movieA)

    expect(newMovie.test).toBeDefined()
    expect(newMovie.to).toBeDefined()
  })

  it('Undefinded in new object should not override', () => {
    let movieA = { title: 'test', genre: ['Drama'] }
    const movieB = { title: undefined, genre: undefined }
    const newMovie = merger(movieB, movieA)

    expect(newMovie.title).toEqual('test')
    expect(newMovie.genre[0]).toEqual('Drama')
  })

  it('Two simple class with exsiting array should merge', () => {
    const car = getTestCar()
    const carNew = getTestCar()
    const personA = getPersonA()
    const personB = getPersonB()
    car.canUse = [personA]
    carNew.canUse = [personB]
    merger(carNew, car)
    expect(car.canUse.length).toEqual(2)
    expect(car.canUse[0]).toEqual(personA)
    expect(car.canUse[1]).toEqual(personB)
  })

  it('Two simple class with exsiting array with equals should merge', () => {
    const car = getTestCar()
    const carNew = getTestCar()
    const personA = getPersonA()
    const personB = getPersonA()
    personB.lastname = 'Ab'
    personB.middlename = 'cecile'
    car.canUse = [personA]
    carNew.canUse = [personB]
    expect(personA.middlename).toEqual('middlea')
    merger(carNew, car)
    expect(car.canUse.length).toEqual(1)
    expect(car.canUse[0].lastname).toEqual('Ab')
    expect(car.canUse[0].middlename).toEqual('middlea')
  })
})
