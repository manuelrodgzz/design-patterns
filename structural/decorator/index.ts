// Making this file a module to avoid global scope defined variables
export {}

//=============== Types, Classes and Interfaces ===============

interface DataSource {
  writeData(data: string): void
  readData(): string
}

class TextFile {
  private data: string

  constructor(data: string = '') {
    this.data = data
  }

  read(): string {
    return this.data
  }

  write(data: string) {
    this.data = data
  }
}

class FileDataSource implements DataSource {
  readonly source: TextFile

  constructor(source: TextFile) {
    this.source = source
  }

  readData(): string {
    return this.source.read()
  }

  writeData(data: string) {
    this.source.write(data)
  }
}

class DataSourceDecorator implements DataSource {
  protected wrapee: DataSource

  constructor(source: DataSource) {
    this.wrapee = source
  }

  writeData(data: string): void {
    this.wrapee.writeData(data)
  }

  readData(): string {
    return this.wrapee.readData()
  }
}

class EncryptionDecorator extends DataSourceDecorator {

  private readonly DICT = {
    a: 'z',
    b: 'y',
    c: 'x',
    d: 'w',
    e: 'v',
    f: 'u',
    g: 't',
    h: 's',
    i: 'r',
    j: 'q',
    k: 'p',
    l: 'o',
    m: 'n',
    n: 'm',
    o: 'l',
    p: 'k',
    q: 'j',
    r: 'i',
    s: 'h',
    t: 'g',
    u: 'f',
    v: 'e',
    w: 'd',
    x: 'c',
    y: 'b',
    z: 'a',
    '0': '9',
    '1': '8',
    '2': '7',
    '3': '6',
    '4': '5',
    '5': '4',
    '6': '3',
    '7': '2',
    '8': '1',
    '9': '0',
  }

  private readonly REVERSED_DICT = Object.fromEntries(
    Object.entries(this.DICT).map(([k, v]) => [v, k])
  )

  private replaceChars(data: string, dict: Record<string, string>): string {
    return data.split('').map(char => {
      const isUpperCase = Boolean(char.match(/[A-Z]/g))
      const key = isUpperCase ? char.toLocaleLowerCase() : char
      let newChar: string

      if (key in dict) {
        newChar = dict[key as keyof typeof dict]
      } else {
        newChar = key
      }

      return isUpperCase ? newChar.toUpperCase() : newChar
    }).join('')
  }

  private encrypt(data: string): string {
    return this.replaceChars(data, this.DICT)
  }

  private decrypt(data: string): string {
    return this.replaceChars(data, this.REVERSED_DICT)
  }

  writeData(data: string): void {
    this.wrapee.writeData(
      this.encrypt(data)
    )
  }

  readData(): string {
    return this.decrypt(
      this.wrapee.readData()
    )
  }
}

/**
 * Spoiler alert, this does not compress... it actually makes the file size bigger :'D
 */
class CompressionDecorator extends DataSourceDecorator {
  private readonly DECOMPRESSION_REGEX = new RegExp(/{.+?\)/g)
  
  writeData(data: string): void {
    let compressed = ''
    const map: Map<string, number[]> = new Map()

    data.split('').forEach((char, i) => {
      const arr = map.get(char)

      if (!arr) {
        map.set(char, [i])
        return
      }

      arr.push(i)
    })

    map.forEach((arr, char) => {
      compressed += `{${char}}(${arr.join(',')})`
    })

    this.wrapee.writeData(compressed)
  }

  readData(): string {
    const compressed = this.wrapee.readData()
    const decompressedArr: string[] = []
    
    const matches = compressed.match(this.DECOMPRESSION_REGEX)
    
    if (!matches) return compressed
    

    matches.forEach(chunk => {
      const char = chunk.slice(1, 2)
      const indices = chunk.slice(4, chunk.length - 1).split(',')
      indices.forEach(i => {
        decompressedArr[Number(i)] = char
      })
    })

    return decompressedArr.join('')
  }
}

//============================================================

//=============== Functions ===============

function clientCode() {
  const textFile = new TextFile()
  let source: DataSource = new FileDataSource(textFile)
  const MESSAGE = `Hi, my name is Manuel and I'm 26 years old`

  source.writeData(MESSAGE)

  if (MESSAGE === source.readData()) {
    console.log('File written correctly')
  }

  // enabling encryption to data source
  source = new EncryptionDecorator(source)
  source.writeData(MESSAGE)

  const encryptedMessage = textFile.read()

  if (MESSAGE !== encryptedMessage) {
    console.log(`File written and encrypted correctly: ${encryptedMessage}`)
  }

  const decryptedMessage = source.readData()
  
  if (MESSAGE === decryptedMessage) {
    console.log('File decrypted correctly')
  }

  // enabling compression to data source
  source = new CompressionDecorator(source)
  source.writeData(MESSAGE)
  const compressedMessage = textFile.read()
  
  if (MESSAGE !== compressedMessage) {
    console.log(`File written, encrypted and compressed: ${compressedMessage}`)
  }
  
  const decompressedMessage = source.readData()

  if (MESSAGE === decompressedMessage) {
    console.log ('File decrypted and decompressed correctly: ', decompressedMessage)
  }
}

//============================================================

clientCode()