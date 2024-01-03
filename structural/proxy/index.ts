// Making this file a module to avoid global scope defined variables
export {}

//=============== Types, Classes and Interfaces ===============

interface ThirdPartyYouTubeLib {
  listVideos(): Promise<string[]>
  getVideoInfo(id: string): Promise<string>
  downloadVideo(id: string): Promise<any>
}

class ThirdPartyYouTubeClass implements ThirdPartyYouTubeLib {

  constructor() {}

  listVideos(): Promise<string[]> {
    return new Promise((res) => {
      setTimeout(() => res(['video1', 'video2', 'video3']), 800)
    })
  }

  getVideoInfo(id: string): Promise<string> {
    return new Promise((res) => {
      setTimeout(() => res(`Description for video ${id}`), 200)
    })
  }

  downloadVideo(id: string): Promise<any> {
    return new Promise((res) => {
      setTimeout(() => res({}), 1000)
    })
  }
}

class CachedYouTubeClass implements ThirdPartyYouTubeLib {
  service: ThirdPartyYouTubeLib
  videosListCache: string[] = []
  videoInfoCache: Record<string, string> = {}
  videoCache: Record<string, {}> = {}
  lastCache: number = 0

  constructor(service: ThirdPartyYouTubeLib) {
    this.service = service
  }

  private shouldUpdateCache(): boolean {
    const now = new Date().getTime()

    // udpate cache every 30 seconds
    if (now - this.lastCache > 30_000) {
      this.lastCache = now
      return true
    }

    return false
  }

  async listVideos(): Promise<string[]> {
    const cacheUpdateRequired = this.shouldUpdateCache()
    if (!this.videosListCache.length || cacheUpdateRequired) {
      const freshVideosList = await this.service.listVideos()

      this.videosListCache.push(
        ...freshVideosList  
      )
    }

    return this.videosListCache
  }

  async getVideoInfo(id: string): Promise<string> {
    const cacheUpdateRequired = this.shouldUpdateCache()
    if (!this.videoInfoCache[id] || cacheUpdateRequired) {
      const newVideoInfo = await this.service.getVideoInfo(id)
      this.videoInfoCache[id] = newVideoInfo
    }

    return this.videoInfoCache[id]
  }

  async downloadVideo(id: string): Promise<any> {
    const cacheUpdateRequired = this.shouldUpdateCache()
    if (!this.videoCache[id] || cacheUpdateRequired) {
      const video = await this.service.downloadVideo(id)
      this.videoCache[id] = video
    }

    return this.videoCache[id]
  }
}

class YouTuberManager {
  service: ThirdPartyYouTubeLib

  constructor(service: ThirdPartyYouTubeLib) {
    this.service = service
  }

  async renderVideo(id: string) {
    const timeLabel = `renderVideo ${id}`
    console.time(timeLabel)
    await this.service.getVideoInfo(id)
    await this.service.downloadVideo(id)
    console.timeEnd(timeLabel)
    // render video page
  }

  async renderListPanel() {
    const timeLabel = `renderListPanel`
    console.time(timeLabel)
    await this.service.listVideos()
    console.timeEnd(timeLabel)
  }
}

//============================================================

//=============== Functions ===============

async function clientCode() {
  const youtubeService = new ThirdPartyYouTubeClass()
  const youtubeProxy = new CachedYouTubeClass(youtubeService)
  const manager = new YouTuberManager(youtubeProxy)

  console.log('--- Rendering list panel for the first time ---')
  await manager.renderListPanel()
  console.log('--- Rendering video for the first time ---')
  await manager.renderVideo('asd')

  console.log('--- Rendering list panel for the second time ---')
  await manager.renderListPanel()
  console.log('--- Rendering video for the second time ---')
  await manager.renderVideo('asd')
}

//============================================================

clientCode()