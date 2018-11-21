# Decorated Merged

A very simple package to merge to object respecting decoration if any.

### Usage

TBD
Still in early stage

### Features

 - Exclude/Include all class properties with decoractors
 - Define group of decorators to have different option at runtime
 - Define Equatable function with decorator to properly merge arrays

### TODO
 - override equatable a array property level.


### Exemple use case
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

