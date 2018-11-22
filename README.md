[![Build Status](https://travis-ci.org/neckaros/decorated-merger.svg?branch=master)](https://travis-ci.org/neckaros/decorated-merger)
[![Coverage Status](https://coveralls.io/repos/github/neckaros/decorated-merger/badge.svg?branch=master)](https://coveralls.io/github/neckaros/decorated-merger?branch=master)

# Decorated Merged

A very simple package to merge to object respecting decoration if any.

### Features

 - Exclude/Include all class properties with decoractors
 - Define group of decorators to have different option at runtime
 - Define Equatable function with decorator to properly merge arrays

## Usage

### Merger
Merger function will **merge** all _newObject_ properties **into** the source _object_ merging arrays and sub-objects, respecting all the decorators below.
 ```typescript
    merger(newObject, object); // will merge properties of newObject in object
```
### Decorators
 - **@Exclude** at **class level** it will exclude all the class properties by default. The one yo want to merge will need to be set with the **@Include** decorator. Ex:
 ```typescript
@Exclude()
export class Person {
    id: string;
    firstname: string;
    lastname: string;
    @Include()
    status: string;
    constructor(id: string, lastname: string, firstname: string, status: string) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.status = status;
    }
}
 ```
Only status from the new object will be merged into the source object

 - **@Exclude** at **property level** it will exclude only this property. Ex:
 ```typescript
export class Person {
    @Exclude()
    id: string;
    firstname: string;
    lastname: string;
    status: string;
    constructor(id: string, lastname: string, firstname: string, status: string) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.status = status;
    }
}
 ```
All properties except ID of the new object will be merged into the source object

 - **Groups** You can specify a group at the decorater level and in the merger to specify different behaviours. Ex:
 ```typescript
@Exclude()
export class Person {
    id: string;
    @Include({group: 'admin'}))
    firstname: string;
    @Include({group: 'admin'}))
    lastname: string;
    @Include()
    status: string;
    constructor(id: string, lastname: string, firstname: string, status: string) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.status = status;
    }
}
 ```
If you call without group option:
```typescript
merger(newObject, object);
 ```
 only status will be merged in object
If you call with group admin option:
```typescript
merger(newObject, object, {group: 'admin'});
 ```
 lastname, firstame and status will be merged in new object


 - **Equatable** Allow you to specify if new object should be merged with an existing object in the array or if the object should be appended to the array. Ex:
 ```typescript
 @Equatable<Car>({equal: (a, b) => a.id === b.id})
export class Car {
    id: string
    model: string;
}
export class Person {
    @Exclude()
    id: string;
    firstname: string;
    lastname: string;
    cars: Car[];
    constructor(id: string, lastname: string, firstname: string, cars?: Car[]) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.status = status;
    }
}
 ```

## TODO
 - override equatable a array property level.


## Exemple use cases
```typescript
@Exclude()
@Equatable<Car>({equal: (a, b) => a.id === b.id})
export class Car {
    id: string
    @Include({group: 'garage'})
    model: string;
    creator: string;
    @Include()
    notfilled: string;
    @Include()
    price: number;
    options: string[];
    @Include()
    canUse: Person[];
    buyer: Person;
}

@Equatable<Person>({equal: (a, b) => a.id === b.id})
export class Person {
    @Exclude()
    id: string;
    fixing: Car[];   
    @Exclude()
    middlename: string;
    constructor(id: string, public lastname: string, public firstname: string, middlename: string) {
        this.id = id;
        this.middlename = middlename;
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


it("Two simple class should merge", () => {
    const car = getTestCar();
    const carNew = getTestCar();
    carNew.notfilled = 'test';
    carNew.creator = 'toto';
    carNew.model = 'Model X';
    expect(car.notfilled).toBeUndefined();
    expect(car.creator).toEqual('Elon');
    expect(car.model).toEqual('Model 3');
    merger(carNew, car);
    expect(car.notfilled).toBeDefined();
    expect(car.creator).toEqual('Elon');
    expect(car.model).toEqual('Model 3');
  })

  it("Two simple class with group should merge", () => {
    const car = getTestCar();
    const carNew = getTestCar();
    carNew.notfilled = 'test';
    carNew.creator = 'toto';
    carNew.model = 'Model X';
    expect(car.notfilled).toBeUndefined();
    expect(car.creator).toEqual('Elon');
    expect(car.model).toEqual('Model 3');
    merger(carNew, car, {group: 'garage'});
    expect(car.notfilled).toBeDefined();
    expect(car.creator).toEqual('Elon');
    expect(car.model).toEqual('Model X');
  })

  it("Two simple class with new array should merge", () => {
    const car = getTestCar();
    const carNew = getTestCar();
    const personA = getPersonA();
    carNew.canUse = [personA];
    expect(car.canUse).toBeUndefined();
    merger(carNew, car);
    expect(car.canUse).toBeDefined();
    expect(car.canUse[0]).toEqual(personA);
  })

  it("Two simple class with exsiting array should merge", () => {
    const car = getTestCar();
    const carNew = getTestCar();
    const personA = getPersonA();
    const personB = getPersonB();
    car.canUse = [personA];
    carNew.canUse = [personB]
    merger(carNew, car);
    expect(car.canUse.length).toEqual(2);
    expect(car.canUse[0]).toEqual(personA);
    expect(car.canUse[1]).toEqual(personB);
  })

  it("Two simple class with exsiting array with equals should merge", () => {
    const car = getTestCar();
    const carNew = getTestCar();
    const personA = getPersonA();
    const personB = getPersonA();
    personB.lastname = 'Ab';
    personB.middlename = 'cecile';
    car.canUse = [personA];
    carNew.canUse = [personB]
    expect(personA.middlename).toEqual('middlea');
    merger(carNew, car);
    expect(car.canUse.length).toEqual(1);
    expect(car.canUse[0].lastname).toEqual('Ab');
    expect(car.canUse[0].middlename).toEqual('middlea');
  })
````

