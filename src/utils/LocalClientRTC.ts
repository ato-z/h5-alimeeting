import DingRTC from 'dingrtc'
import type { DingRTCClient } from 'dingrtc'
import { APPID } from '@/constant'
import { getAliMeetingToken } from '@/api/meeting'

const instanceMap = new Map<string, LocalClientRTC>()

export class LocalClientRTC {
  static getInstance(uid: string) {
    if (instanceMap.has(uid)) return instanceMap.get(uid)!

    const instance = new LocalClientRTC(uid)
    instanceMap.set(uid, instance)
    return instance
  }
  static instance: LocalClientRTC

  protected start() {
    const { client } = this

    client.on('user-published', (user, mediaType, auxiliary) => {
      if (mediaType === 'video') {
        client.subscribe(user.userId, mediaType, auxiliary).then((track) => {
          const playFn = Reflect.get(track, 'play').bind(track)
          if (this.onRemoteUserJoin) {
            this.onRemoteUserJoin(user, playFn)
          }
        })
      } else if (!this.mcuSubscribed) {
        this.mcuSubscribed = true
        client.subscribe('mcu', 'audio').then((track) => {
          const playFn = Reflect.get(track, 'play')
          if (typeof playFn === 'function') {
            playFn.apply(track, [])
          }
        })
      }
    })
  }

  protected async touchJoinRemove() {
    const { remoteUsers } = this.client
    const subParams: Array<{ uid: string; mediaType: 'audio' | 'video'; auxiliary: boolean }> = [
      { uid: 'mcu', mediaType: 'audio', auxiliary: false },
    ]
    remoteUsers.forEach((user) => {
      if (user.hasAuxiliary) {
        subParams.push({ uid: user.userId, mediaType: 'video', auxiliary: true })
      }
      if (user.hasVideo) {
        subParams.push({ uid: user.userId, mediaType: 'video', auxiliary: false })
      }
    })

    const batchSubscribeResult = await this.client.batchSubscribe(subParams)
    for (const { error, track, uid, auxiliary } of batchSubscribeResult) {
      if (error) {
        console.log(`[订阅${uid} ${auxiliary ? 'screenShare' : 'camera'} 失败]` + error.message, 'danger')
        continue
      }
      if (!track) return void 0
      if (track.trackMediaType === 'audio' && this.mcuSubscribed) {
        this.mcuSubscribed = true
        const playFn = Reflect.get(track, 'play')
        if (typeof playFn === 'function') {
          playFn.apply(track, [])
        }
      } else {
        const playFn = Reflect.get(track, 'play').bind(track)
        if (this.onRemoteUserJoin) {
          this.onRemoteUserJoin({ id: uid }, playFn)
        }
      }
    }
  }

  private constructor(public readonly uid: string) {
    const client = DingRTC.createClient()
    this.client = client

    this.start()
    this.joinPromise = this.withByOnline().then(() => this.touchJoinRemove())
  }

  private async withByOnline() {
    const { uid } = this
    const { token, channel_id } = await getAliMeetingToken(uid)

    return this.client.join({
      appId: APPID,
      token: token,
      uid: uid,
      channel: channel_id,
      userName: `user: ${uid}`,
    })
  }

  public readonly client
  public readonly joinPromise
  public mcuSubscribed = false
  public onRemoteUserJoin?: (
    user: DingRTCClient['remoteUsers'][number] | { id: string },
    play: (id: string) => void
  ) => void
}
