// Making this file a module to avoid global scope defined variables
export {}

//=============== Types, Classes and Interfaces ===============
abstract class Button {
  protected text: string = ''
  constructor(text?: string) {
    if (text) {
      this.text = text
    }
  }
  abstract paint(): string
}

interface Checkbox {
  paint(): string
}

interface GUIFactory {
  createButton(text?: string): Button
  createCheckbox(): Checkbox
}

class WindowsButton extends Button {

  paint() {
    return `[${this.text}]`
  }
}

class WindowsCheckbox implements Checkbox {
  paint() {
    return `☑`
  }
}

class MacCheckbox implements Checkbox {
  paint(): string {
    return `✅`
  }
}

class MacButton extends Button {
  paint() {
    return `(${this.text})`
  }
}

class WindowsFactory implements GUIFactory {
  createButton(text?: string): Button {
    return new WindowsButton(text)
  }

  createCheckbox(): Checkbox {
    return new WindowsCheckbox()
  }
}

class MacFactory implements GUIFactory {
  createButton(text?: string): Button {
    return new MacButton(text)
  }

  createCheckbox(): Checkbox {
    return new MacCheckbox()
  }
}

//============================================================

//=============== Functions ===============

function clientCode(
  GUI: GUIFactory,
  uiElements: Array<
    { type:'checkbox' }
    | { type: 'button', text?: string }
  >
): Array<Button | Checkbox> {
  const screen: Array<Button | Checkbox> = []
  
  for (const element of uiElements) {
    let elementInstance: Button | Checkbox

    if (element.type === 'button') {
      elementInstance = GUI.createButton(element.text)
    } else {
      elementInstance = GUI.createCheckbox()
    }

    screen.push(elementInstance)
  }

  return screen
}

function createGraphicUserInterface(os: 'windows' | 'mac') {
  const factory: GUIFactory = os === 'windows' ? new WindowsFactory() : new MacFactory()

  const screen = clientCode(
    factory,
    [
      { type: 'button', text: 'Submit' },
      { type: 'checkbox'}
    ]
  )

  console.log(`==== ${os} interface ====`)
  screen.forEach(el => console.log(el.paint()))
  console.log(`=========================`)
}

//============================================================

createGraphicUserInterface('windows')
createGraphicUserInterface('mac')