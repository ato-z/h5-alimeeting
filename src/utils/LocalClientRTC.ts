import DingRTC from 'dingrtc'
import type { CameraVideoTrack, MicrophoneAudioTrack, RemoteTrack } from 'dingrtc'
import { APPID } from '@/constant'
import { getAliMeetingToken } from '@/api/meeting'

type RemoteUser = { id: string }
const instanceMap = new Map<string, LocalClientRTC>()

export class LocalClientRTC {
  /**
   * 返回客户端实例
   * @param uid
   * @param roomId
   */
  static getInstance(uid: string, roomId: string) {
    if (instanceMap.has(uid)) return instanceMap.get(uid)!
    const instance = new LocalClientRTC(uid, roomId)
    instanceMap.set(uid, instance)
    return instance
  }

  /**
   * 从后台获取阿里云token信息并加入客户端
   */
  protected async touchJoinByZerg() {
    const certificate = await getAliMeetingToken(this.uid, this.roomId)

    // 加入阿里会议
    await this.client.join({
      appId: APPID,
      token: certificate.token,
      uid: certificate.user_id,
      channel: certificate.channel_id,
      userName: this.uid,
    })

    return certificate
  }

  // start 远程轨道加入处理
  /**
   * 处理远程视频
   */
  private handleWithVideoTrack(userId: string, track: RemoteTrack) {
    const playFn = Reflect.get(track, 'play').bind(track)
    if (this.onRemoteUserJoin) {
      this.onRemoteUserJoin({ id: userId }, playFn)
    }
  }

  /**
   * 处理远程音频
   */
  protected handleWithAudioTrack(track: RemoteTrack) {
    if ('play' in track && typeof track.play === 'function') {
      track.play()
      this.handleWithAudioTrack = (track: RemoteTrack) => console.log('远程音频仅需监听1次', track)
    } else {
      console.error('播放远程音频失败')
    }
  }

  /**  */
  protected async setupClientEventListeners() {
    // 等待加入完毕
    await this.joinPromise
    const { client } = this

    // 处理远程音视频轨道
    client.on('user-published', (user, mediaType, auxiliary) => {
      if (mediaType === 'video') {
        return this.client
          .subscribe(user.userId, 'video', auxiliary)
          .then((track) => this.handleWithVideoTrack(user.userId, track))
      }
      if (mediaType === 'audio') {
        return this.client.subscribe('mcu', 'audio').then((track) => this.handleWithAudioTrack(track))
      }
    })

    // 处理远程用户退出
    client.on('user-unpublished', (user) => {
      if (this.onRemoveUserLeave) {
        this.onRemoveUserLeave({ id: user.userId })
      }
    })
  }
  // 远程轨道加入处理 end

  // start 远程订阅
  /** */
  protected async touchSubParams() {
    // 订阅参数
    const subParams: Array<{ uid: string; mediaType: 'audio' | 'video'; auxiliary: boolean }> = [
      { uid: 'mcu', mediaType: 'audio', auxiliary: false }, // 远程音频
    ]
    // 远程视频轨道
    this.client.remoteUsers.forEach((user) => {
      if (user.hasAuxiliary) {
        subParams.push({ uid: user.userId, mediaType: 'video', auxiliary: true })
      }
      if (user.hasVideo) {
        subParams.push({ uid: user.userId, mediaType: 'video', auxiliary: false })
      }
    })

    return subParams
  }

  /** 订阅远程视频视频流 */
  protected async batchSubscribeRemoteMedia() {
    // 等待加入完毕
    await this.joinPromise
    const subParams = await this.touchSubParams()
    const batchSubscribeResult = await this.client.batchSubscribe(subParams)

    for (const { error, track, uid, auxiliary } of batchSubscribeResult) {
      if (!track) continue
      if (error) {
        console.log(`[订阅${uid} ${auxiliary ? 'screenShare' : 'camera'} 失败]` + error.message, 'danger')
        continue
      }

      if (track.trackMediaType === 'audio') this.handleWithAudioTrack(track)
      else if (track.trackMediaType === 'video') this.handleWithVideoTrack(uid, track)
    }
  }
  // 远程订阅加入处理 end

  /** */
  leave() {
    console.log('用户退出房间')
  }

  /** 创建视频流 */
  async createCameraVideoTrack() {
    if (this.localVideoTrack) return this.localVideoTrack
    this.localVideoTrack = await DingRTC.createCameraVideoTrack({
      frameRate: 15,
      dimension: 'VD_1280x720',
    })

    return this.localVideoTrack
  }

  /** 创建音频流 */
  async createMicrophoneAudioTrack() {
    if (this.localAudioTrack) return this.localAudioTrack
    this.localAudioTrack = await DingRTC.createMicrophoneAudioTrack()
    return this.localAudioTrack
  }

  /** */
  private constructor(
    public readonly uid: string,
    public readonly roomId: string
  ) {
    this.client = DingRTC.createClient()
    this.joinPromise = this.touchJoinByZerg()
    this.setupClientEventListeners()
    this.batchSubscribeRemoteMedia()
  }

  // 阿里云本地客户端
  public readonly client
  // 是否加入房间完毕
  public readonly joinPromise: ReturnType<typeof getAliMeetingToken>
  // 远程用户加入
  public onRemoteUserJoin?: (user: RemoteUser, play: (id: string) => void) => void
  // 远程用户退出
  public onRemoveUserLeave?: (user: RemoteUser) => void

  // 本地视频流
  public localVideoTrack?: CameraVideoTrack
  // 本地音频流
  public localAudioTrack?: MicrophoneAudioTrack
}
