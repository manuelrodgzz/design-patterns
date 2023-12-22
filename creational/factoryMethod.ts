//=============== Types, Classes and Interfaces ===============

type Item = '📦' | '🚗'

interface Transport {
  deliver: (item: Item) => string
}

abstract class Logistics {
  abstract createTransport(): Transport
}

class RoadLogistics extends Logistics {
  createTransport(): Transport {
    const truck = new Truck()
    return truck
  }
}

class SeaLogistics extends Logistics {
  createTransport(): Transport {
    const ship = new Ship()
    return ship
  }
}

class Truck implements Transport {
  deliver(item: Item) {
    return `Transporting ${item} by 🚛`
  }
}

class Ship implements Transport {
  deliver(item: Item) {
    return `Transporting ${item} by 🚢`
  }
}
//============================================================

//=============== Functions ===============

function clientCode(creator: Logistics, item: Item) {
  const transport = creator.createTransport()
  const response = transport.deliver(item)
  console.log(response)
}

function deliverPackages(items: Item[]) {
  for (const item of items) {
    let factory: Logistics

    if (item === '📦') {
      factory = new RoadLogistics()
    } else {
      factory = new SeaLogistics()
    }

    clientCode(factory, item)
  }
}

//============================================================

deliverPackages([
  '🚗',
  '📦',
  '🚗',
  '📦',
])