// Making this file a module to avoid global scope defined variables
export {}

//=============== Types, Classes and Interfaces ===============

class TreeType {
  readonly name: string
  readonly color: string
  readonly texture: string

  constructor(name: string, color: string, texture: string) {
    this.name = name
    this.color = color
    this.texture = texture
  }

  draw(x: number, y: number) {
    console.log(`Drawing ${JSON.stringify(this)} at [${x}, ${y}]`)
  }
}

class Tree {
  x: number
  y: number
  treeType: TreeType

  constructor(x: number, y: number, treeType: TreeType) {
    this.x = x
    this.y = y
    this.treeType = treeType
  }

  draw() {
    return this.treeType.draw(this.x, this.y)
  }
}

class TreeFactory {
  // This cahce helps to save memory by storing each unique tree type
  private static cache: TreeType[] = []

  static getTreeType(name: string, color: string, texture: string): TreeType {
    const cachedTreeType = TreeFactory.cache.find(treeType => {
      if (treeType.color !== color) return false

      if (treeType.name !== name) return false

      if (treeType.texture !== texture) return false

      return true
    })

    if (cachedTreeType) {
      return cachedTreeType
    }

    const newTreeType = new TreeType(name, color, texture)
    TreeFactory.cache.push(newTreeType)

    return newTreeType
  }
}

class Forest {
  trees: Tree[] = []

  constructor() {}

  plantTree(x: number, y: number, name: string, color: string, texture: string) {
    const treeType = TreeFactory.getTreeType(name, color, texture)
    const newTree = new Tree(x, y, treeType)
    this.trees.push(newTree)
  }

  draw() {
    for (const tree of this.trees) {
      tree.draw()
    }
  }
}

//============================================================

//=============== Functions ===============

function clientCode() {
  // Forest and Tree clases are the flyweight's (TreeType's) clients.
  const forest = new Forest()

  forest.plantTree(0,0, 'Maple', 'Brown', 'texture1')
  forest.plantTree(0,1, 'Maple', 'Brown', 'texture1')
  forest.plantTree(0,1, 'Oak tree', 'Brown', 'texture2')

  forest.draw()
}

//============================================================

clientCode()