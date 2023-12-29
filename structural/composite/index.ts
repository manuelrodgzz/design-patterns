// Making this file a module to avoid global scope defined variables
export {}

//=============== Types, Classes and Interfaces ===============

interface Purchasable {
  getPrice(): number
}

class Item implements Purchasable {
  private price: number
  protected name: string
  protected type: string

  constructor(name: string, price: number, type: string) {
    this.name = name
    this.price = price
    this.type = type
  }

  getPrice(): number {
    return this.price
  }
}

class Computer extends Item {
  
  constructor(name: string, price: number) {
    super(name, price, 'Computer')
  }
}

class Phone extends Item {
  constructor(name: string, price: number) {
    super(name, price, 'Phone')
  }
}

class Box implements Purchasable {
  private items: Item[] = []

  constructor() {}

  add(item: Item) {
    this.items.push(item)
  }

  remove(item: Item) {
    this.items = this.items.filter(el => el !== item)
  }

  getPrice(): number {
    return this.items.reduce((acc, item) => acc + item.getPrice(), 0)
  }
}

//============================================================

//=============== Functions ===============

function clientCode() {
  // Items on sell
  const macbook = new Computer('Macbook', 25_000)
  const lenovo = new Computer('Lenovo', 15_000)
  const iPhone = new Phone('iPhone', 21_000)
  const samsungGalaxy = new Phone('Samsung Galaxy', 19_000)

  const cart: Purchasable[] = []

  // Purchasing individual items
  cart.push(lenovo, samsungGalaxy)
  console.log(
    'Individual items total:',
    cart.reduce((acc, v) => acc + v.getPrice(), 0)
  )

  // clearCart
  cart.splice(0, 2)

  // Create a box full of macbooks
  const macbooksBox = new Box()
  macbooksBox.add(macbook)
  macbooksBox.add(macbook)
  macbooksBox.add(macbook)
  macbooksBox.add(macbook)
  macbooksBox.add(macbook)
  
  // Purchasing box of macbooks and one single iPhone
  cart.push(macbooksBox, iPhone)
  console.log(
    'Box items total:',
    cart.reduce((acc, v) => acc + v.getPrice(), 0)
  )
}

//============================================================

clientCode()