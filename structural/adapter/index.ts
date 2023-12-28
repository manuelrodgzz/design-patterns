// Making this file a module to avoid global scope defined variables
export {}

//=============== Types, Classes and Interfaces ===============

class RoundHole {
  private radius: number

  constructor(radius: number) {
    this.radius = radius
  }

  getRadius(): number {
    return this.radius
  }

  fits(peg: RoundPeg): boolean {
    return peg.getRadius() <= this.radius
  }
}

class RoundPeg {
  private radius: number

  constructor(radius: number) {
    this.radius = radius
  }

  getRadius(): number {
    return this.radius
  }
}

class SquarePeg {
  private width: number

  constructor(width: number) {
    this.width = width
  }

  getWidth(): number {
    return this.width
  }
}

class SquarePegAdapter extends RoundPeg {
  constructor(peg: SquarePeg) {
    const radius = (peg.getWidth() * Math.sqrt(2)) / 2
    super(radius) 
  }
}

//============================================================

//=============== Functions ===============

function clientCode() {
  const roundHole = new RoundHole(5)
  const roundPeg = new RoundPeg(5)

  console.log(roundHole.fits(roundPeg)) // true

  const squarePeg1 = new SquarePeg(2)
  const squareAdapter1 = new SquarePegAdapter(squarePeg1)

  const squarePeg2 = new SquarePeg(10)
  const squareAdapter2 = new SquarePegAdapter(squarePeg2)

  // roundHole.fits(squarePeg) <= This throws an error
  console.log(roundHole.fits(squareAdapter1)) // true
  console.log(roundHole.fits(squareAdapter2)) // false
}

//============================================================

clientCode()