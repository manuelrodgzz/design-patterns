// Making this file a module to avoid global scope defined variables
export {}

//=============== Types, Classes and Interfaces ===============

class BankingNetwork {
  private static banks: Bank[] = []

  static findAccount(accountNumber: string): BankAccount | null {
    for (const bank of BankingNetwork.banks) {
      const account = bank.findAccount(accountNumber)
      if (account) {
        return account
      }
    }

    return null
  }

  static addBank(bank: Bank) {
    BankingNetwork.banks.push(bank)
  }
}

class Bank {
  readonly name: string
  private accounts: BankAccount[] = []

  constructor(name: string) {
    this.name = name
    BankingNetwork.addBank(this)
  }

  findAccount(accountNumber: string): BankAccount | null {
    return this.accounts.find(account => account.accountNumber === accountNumber) || null
  }

  createAccount(person: Person): BankAccount {
    const account = new BankAccount(person.name, this)
    this.accounts.push(account)
    return account
  }
}

class BankAccount {
  private balance: number = 0
  readonly accountNumber: string
  private owner: string
  private bank: Bank

  constructor(owner: string, bank: Bank) {
    this.owner = owner
    this.bank = bank
    this.accountNumber = Math.round(Math.random() * 1000000).toString()
  }

  getBalance(): number {
    return this.balance
  }

  addToBalance(ammount: number) {
    this.balance += ammount
  }

  subtractToBalance(ammount: number) {
    this.balance -= ammount
  }
}

class Operator {
  bank: Bank

  constructor(bank: Bank) {
    this.bank = bank
  }

  private findAccount(accountNumber: string): BankAccount | null {
    const account = this.bank.findAccount(accountNumber)

    return account
  }

  private accountNotFoundError(account: string): never {
    throw new Error(`Account "${account}" doest not exist.`)
  }

  deposit(ammount: number, accountNumber: string) {
    const account = this.findAccount(accountNumber)

    if (!account) {
      this.accountNotFoundError(accountNumber)
    }

    account.addToBalance(ammount)
  }

  withdraw(ammount: number, accountNumber: string) {
    const account = this.findAccount(accountNumber)

    if (!account) {
      this.accountNotFoundError(accountNumber)
    }

    if (account.getBalance() < ammount) {
      throw new Error(`Not sufficient funds.`)
    }

    account.subtractToBalance(ammount)
  }

  transfer(ammount: number, senderAccountNum: string, receiverAccountNum: string) {
    const sender = this.findAccount(senderAccountNum) || BankingNetwork.findAccount(senderAccountNum)
    const receiver = this.findAccount(receiverAccountNum) || BankingNetwork.findAccount(receiverAccountNum)

    if (!sender) {
      this.accountNotFoundError(senderAccountNum)
    }

    if (!receiver) {
      this.accountNotFoundError(receiverAccountNum)
    }

    if (sender.getBalance() < ammount) {
      throw new Error(`Not sufficient funds.`)
    }

    sender.subtractToBalance(ammount)
    receiver.addToBalance(ammount)
  }

  openBankAccount(person: Person) {
    const account = this.bank.createAccount(person)
    person.bankAccountNumber = account.accountNumber
  }
}

class Person {
  readonly name: string
  bankAccountNumber?: string

  constructor(name: string) {
    this.name = name
  }
}

//============================================================

//=============== Functions ===============

function clientCode() {
  const citi = new Bank('citi')
  const bbva = new Bank('bbva')

  // The operator class is the facade to interact with banks and banking accounts
  const citiOperator = new Operator(citi)
  const bbvaOperator = new Operator(bbva)

  const person1 = new Person('Manuel')
  const person2 = new Person('George')
  const person3 = new Person('Mary')

  citiOperator.openBankAccount(person1)
  citiOperator.openBankAccount(person2)
  bbvaOperator.openBankAccount(person3)

  if (!person1.bankAccountNumber || !person2.bankAccountNumber || !person3.bankAccountNumber) {
    console.log('Bank accounts were not created.')
    return
  }
  
  
  if (person1.bankAccountNumber) {
    citiOperator.deposit(1000, person1.bankAccountNumber)
  }

  if (person2.bankAccountNumber) {
    citiOperator.deposit(500, person2.bankAccountNumber)
  }

  if (person3.bankAccountNumber) {
    bbvaOperator.deposit(2000, person3.bankAccountNumber)
  }

  citiOperator.transfer(200, person1.bankAccountNumber, person2.bankAccountNumber)
  citiOperator.transfer(200, person1.bankAccountNumber, person3.bankAccountNumber)

  console.log(citi, bbva)
}

//============================================================

clientCode()