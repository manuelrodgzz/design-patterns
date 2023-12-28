// Making this file a module to avoid global scope defined variables
export {}

//=============== Types, Classes and Interfaces ===============

class Database {
  private static db: Database

  private constructor() {

  }

  static getInstance(): Database {
    if (!this.db) {
      this.db = new Database()
    }

    return this.db
  }
}

//============================================================

//=============== Functions ===============
function clientCode() {
  const db1 = Database.getInstance()
  const db2 = Database.getInstance()

  if (db1 === db2) {
    console.log('Singleton!')
  } else {
    console.log('Not Singleton :(')
  }
}
//============================================================

clientCode()