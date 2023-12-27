// Making this file a module to avoid global scope defined variables
export {}

//=============== Types, Classes and Interfaces ===============

type EnemyConctructorArgs = { health: number, attack: number, defense: number } | Enemy

abstract class Enemy {
  readonly health: number
  readonly attack: number 
  readonly defense: number

  constructor(config: EnemyConctructorArgs) {
    this.health = config.health
    this.attack = config.attack
    this.defense = config.defense
  }

  abstract clone(): Enemy
}

class Goblin extends Enemy {
  constructor(config: EnemyConctructorArgs) {
    super(config)
  }

  clone(): Goblin {
    return new Goblin(this)
  }
}

class Troll extends Enemy {
  constructor(config: EnemyConctructorArgs) {
    super(config)
  }

  clone(): Troll {
    return new Troll(this)
  }
}

//============================================================

//=============== Functions ===============

function clientCode() {
  const goblin1 = new Goblin({
    attack: 10,
    health: 200,
    defense: 5
  })

  const goblin2 = goblin1.clone()

  if (goblin1 !== goblin2) {
    console.log('Goblin cloned successfully!')
  } else {
    console.log('Goblin was not cloning failed :(')
  }
  
  console.log({goblin1, goblin2})

  const troll1 = new Troll({
    attack: 100,
    health: 2000,
    defense: 90
  })

  const troll2 = troll1.clone()
  
  if (troll1 !== troll2) {
    console.log('Troll cloned successfully!')
  } else {
    console.log('Troll was not cloning failed :(')
  }

  console.log({troll1, troll2})
}

//============================================================

clientCode()