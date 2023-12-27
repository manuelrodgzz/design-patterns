// Making this file a module to avoid global scope defined variables
export {}

//=============== Types, Classes and Interfaces ===============

interface Builder {
  setWalls(): void
  setRoof(): void
  setFloor(): void
  setGarden(): void
  setGarage(): void
  setSwimmingPool(): void
}

class House {
  walls?: string
  roof?: string
  floor?: string
  garden?: boolean
  garage?: boolean
  swimmingPool?: boolean

  constructor() {

  }
}

class WoodHouseBuilder implements Builder {
  private house: House = new House()
  private readonly MATERIAL = 'Wood'

  constructor() {

  }

  reset() {
    this.house = new House()
  }

  setWalls() {
    this.house.walls = this.MATERIAL
  }

  setFloor(): void {
    this.house.floor = this.MATERIAL
  }

  setGarage(): void {
    this.house.garage = true
  }

  setGarden(): void {
    this.house.garden = true
  }

  setRoof(): void {
    this.house.roof = this.MATERIAL
  }
  
  setSwimmingPool(): void {
    this.house.swimmingPool = true
  }

  getProduct(): House {
    return this.house
  }
}

class StoneHouseBuilder implements Builder {
  private house: House = new House()
  private readonly MATERIAL = 'Stone'

  constructor() {
     
  }

  reset() {
    this.house = new House()
  }

  setWalls() {
    this.house.walls = this.MATERIAL
  }

  setFloor(): void {
    this.house.floor = this.MATERIAL
  }

  setGarage(): void {
    this.house.garage = true
  }

  setGarden(): void {
    this.house.garden = true
  }

  setRoof(): void {
    this.house.roof = this.MATERIAL
  }
  
  setSwimmingPool(): void {
    this.house.swimmingPool = true
  }

  getProduct(): House {
    const house = this.house
    this.reset()
    return house
  }
}

class HouseDirector {
  buildSimpleHouse(builder: Builder) {
    builder.setFloor()
    builder.setWalls()
    builder.setRoof()
  }

  buildLuxuryHouse(builder: Builder) {
    this.buildSimpleHouse(builder)
    builder.setGarage()
    builder.setGarden()
    builder.setSwimmingPool()
  }
}

//============================================================

//=============== Functions ===============

function clientCode() {
  const director = new HouseDirector()
  const woodBuilder = new WoodHouseBuilder()
  const stoneBuilder = new StoneHouseBuilder()

  director.buildSimpleHouse(woodBuilder)
  const simpleWoodHouse = woodBuilder.getProduct()

  director.buildSimpleHouse(stoneBuilder)
  const simpleStoneHouse = stoneBuilder.getProduct()

  director.buildLuxuryHouse(stoneBuilder)
  const luxuryStoneHouse = stoneBuilder.getProduct()

  console.log({
    simpleWoodHouse,
    simpleStoneHouse,
    luxuryStoneHouse
  })
}

//============================================================

clientCode()