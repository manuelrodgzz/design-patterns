// Making this file a module to avoid global scope defined variables
export {}

//=============== Types, Classes and Interfaces ===============

class Device {
  private readonly MAX_CHANNEL
  private readonly MIN_CHANNEL
  private readonly MAX_VOLUME = 100
  private readonly MIN_VOLUME = 0
  private on: boolean = false
  private volume: number = 20
  private channel: number = 1

  constructor(maxChannel: number, minChannel: number) {
    this.MAX_CHANNEL = maxChannel
    this.MIN_CHANNEL = minChannel
  }

  private range(val: number, max: number, min: number): number {
    if (val > max) return max

    if (val < min) return min

    return val
  }

  private channelRange(channel: number): number {
    return this.range(channel, this.MAX_CHANNEL, this.MIN_CHANNEL)
  }

  private volumeRange(volume: number): number {
    return this.range(volume, this.MAX_VOLUME, this.MIN_VOLUME)
  }

  isOn(): boolean {
    return this.on
  }

  power(): boolean {
    this.on = !this.on
    return this.isOn()
  }

  getVolume(): number {
    return this.volume
  }

  volumeUp(): void {
    this.volume = this.volumeRange(this.volume + 1)
  }

  volumeDown(): void {
    this.volume = this.volumeRange(this.volume - 1)
  }

  setVolume(volume: number): void {
    this.volume = this.volumeRange(volume)
  }

  setChannel(channel: number): void {
    this.channel = this.channelRange(channel)
  }

  getChannel(): number {
    return this.channel
  }

  channelUp(): void {
    this.channel = this.channelRange(this.channel + 1)
  }

  channelDown(): void {
    this.channel = this.channelRange(this.channel - 1)
  }
}

class RemoteControl {
  protected device: Device

  constructor(device: Device) {
    this.device = device
  }

  power(): boolean {
    return this.device.power()
  }

  volumeUp(): void {
    this.device.volumeUp()
  }

  volumeDown(): void {
    this.volumeDown()
  }

  channelUp(): void {
    this.device.channelUp()
  }

  channelDown(): void {
    this.device.channelDown()
  }

  setChannel(channel: number): void {
    this.device.setChannel(channel)
  }
}

class AdvancedRemoteControl extends RemoteControl {
  mute() {
    this.device.setVolume(0)
  }
}

class TV extends Device {
  constructor() {
    super(100, 1)
  }
}

class Radio extends Device {
  constructor() {
    super(110, 80)
  }
}

//============================================================

//=============== Functions ===============

function clientCode() {
  const tv = new TV()
  const radio = new Radio()

  const radioRemote = new RemoteControl(radio)
  const tvRemote = new AdvancedRemoteControl(tv)

  if (!tv.isOn()) {
    console.log('TV is off... Turning on.')
    tvRemote.power()
  }

  if (tv.isOn()) {
    console.log('TV is now ON!')
  } else {
    console.log('TV is off :(')
  }

  const prevChannel = tv.getChannel()

  console.log('Changing to next channel...')
  tvRemote.channelUp()

  console.log(`Previous channel was ${prevChannel}. New channel is ${tv.getChannel()}`)

  const prevVolume = tv.getVolume()

  console.log('Muting TV...')
  tvRemote.mute()

  console.log(`Previous volume was ${prevVolume}. New volume is ${tv.getVolume()}`)
}

//============================================================

clientCode()