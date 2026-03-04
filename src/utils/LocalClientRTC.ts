import DingRTC from 'dingrtc'
import type { DingRTCClient } from 'dingrtc'
import { APPID } from '@/constant'
import { getAliMeetingToken } from '@/api/meeting'

const instanceMap = new Map<string, LocalClientRTC>()

export class LocalClientRTC {
  static getInstance(uid: string, roomId: string) {
    if (instanceMap.has(uid)) return instanceMap.get(uid)!

    console.log('重启多次?')
    const instance = new LocalClientRTC(uid, roomId)
    instanceMap.set(uid, instance)
    return instance
  }
  static instance: LocalClientRTC

  protected start() {
    const { client } = this

    client.on('user-published', (user, mediaType, auxiliary) => {
      console.log('远程用户加入', client.remoteUsers)
      if (mediaType === 'video') {
        console.log('远程uid', user.userId)
        client.subscribe(user.userId, mediaType, auxiliary).then((track) => {
          const playFn = Reflect.get(track, 'play').bind(track)
          if (this.onRemoteUserJoin) {
            this.onRemoteUserJoin({ id: user.userId }, playFn)
          }
        })
      } else if (!this.mcuSubscribed) {
        this.mcuSubscribed = true
        client.subscribe('mcu', 'audio').then((track) => {
          const playFn = Reflect.get(track, 'play')
          if (typeof playFn === 'function') {
            // playFn.apply(track, [])
          }
        })
      }
    })

    client.on('user-unpublished', (user) => {
      if (this.onRemoveUserLeave) {
        this.onRemoveUserLeave({ id: user.userId })
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

  leave() {
    console.log('用户退出房间')
    /* if (this.client) {
      try {
        this.client.leave()
      } catch {
        console.log('退出房间失败')
      }
    }

    instanceMap.delete(this.uid)*/
  }

  private constructor(
    public readonly uid: string,
    public readonly roomId: string
  ) {
    const client = DingRTC.createClient()
    this.client = client

    this.start()
    this.joinPromise = this.withByOnline().then(async (res) => {
      await this.touchJoinRemove()
      return res
    })
  }

  private async withByOnline() {
    const { uid, roomId } = this
    const { token, channel_id, user_id } = await getAliMeetingToken(uid, roomId)

    console.log(token, channel_id, user_id)
    return this.client.join({
      appId: APPID,
      token: token,
      uid: user_id,
      channel: channel_id.toString(),
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

  public onRemoveUserLeave?: (user: DingRTCClient['remoteUsers'][number] | { id: string }) => void
}
