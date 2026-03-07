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

  // =================
  // start 远程轨道事件处理
  // =================
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

  /**
   * 设置客户端事件监听器
   */
  protected async setupClientEventListeners() {
    await this.checkState()

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

    client.on('user-left', (user) => {
      if (this.onRemoveUserLeave) {
        this.onRemoveUserLeave({ id: user.userId })
      }
    })
  }
  // =================
  // 远程订阅 end
  // =================

  /**
   * 获取订阅参数
   */
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
    await this.checkState()
    const subParams = await this.touchSubParams()
    if (this.leaveState) return console.warn('客户端已断开链接')
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

  private async checkState() {
    if (this.leaveState) throw new Error('当前客户端已销毁')
    console.log(this.joinPromise)
    await this.joinPromise
  }

  /**
   * 离开房间
   */
  async leave() {
    // 幂等性：如果已经离开，直接返回
    if (this.leaveState) {
      console.log('客户端已经离开，无需重复操作')
      return
    }

    this.leaveState = true

    try {
      // 1. 等待 join 完成（避免时序问题）
      if (this.joinPromise) {
        await this.joinPromise
      }

      // 2. 离开频道
      try {
        this.client.leave()
      } catch (error) {
        console.warn('leave 频道时发生错误:', error)
      }

      // 3. 清理本地视频轨道
      if (this.localVideoTrack) {
        try {
          this.localVideoTrack.close()
        } catch {
          console.log('关闭视频轨道时发生异常，但已忽略')
        }
        this.localVideoTrack = undefined
      }

      // 4. 清理本地音频轨道
      if (this.localAudioTrack) {
        try {
          this.localAudioTrack.close()
        } catch {
          console.log('关闭音频轨道时发生异常，但已忽略')
        }
        this.localAudioTrack = undefined
      }

      // 5. 从单例中移除
      instanceMap.delete(this.uid)

      console.log('客户端已成功离开房间')
    } catch (error) {
      console.warn('leave 时发生错误:', error)
    }
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

  /** 添加本地视频监听 */
  async publishLocalVideo() {
    const track = await this.createCameraVideoTrack()
    await this.client.publish([track])
  }

  /** 取消本地视监听 */
  async unPublishLocalVideo() {
    if (!this.localVideoTrack) return

    // 先取消发布，再关闭轨道
    await this.client.unpublish(this.localVideoTrack)

    // 关闭轨道并释放采集设备
    try {
      this.localVideoTrack.close()
    } catch {
      console.log('关闭视频轨道时发生异常，但已忽略')
    }

    this.localVideoTrack = undefined
  }

  /** 添加本地音频监听 */
  async publishLocalAudio() {
    const track = await this.createMicrophoneAudioTrack()
    await this.client.publish([track])
  }

  /** 取消本地音频监听 */
  async unPublishLocalAudio() {
    if (!this.localAudioTrack) return

    // 先取消发布，再关闭轨道
    await this.client.unpublish(this.localAudioTrack)

    // 关闭轨道并释放采集设备
    try {
      this.localAudioTrack.close()
    } catch {
      console.log('关闭音频轨道时发生异常，但已忽略')
    }

    this.localAudioTrack = undefined
  }

  /** 加入客户端 */
  async join() {
    // 如果已经离开，重置状态并创建新的 client
    if (this.leaveState) {
      console.log('检测到客户端已离开，重置状态并创建新的 client')
      this.leaveState = false
      this.joinPromise = undefined
      // 重新创建 client，确保 SDK 状态干净
      this.client = DingRTC.createClient()
    }

    // 如果已经在加入中，等待完成
    if (this.joining) {
      console.log('正在加入房间，请稍候...')
      await this.joinPromise
      return
    }

    try {
      // 设置加入锁
      this.joining = true

      // 开始加入频道
      this.joinPromise = this.touchJoinByZerg()

      // 等待加入完成后再设置监听和订阅
      await this.joinPromise

      // 检测是否在中途离开了
      if (this.leaveState) {
        console.warn('加入完成后但客户端已离开')
        return
      }

      this.setupClientEventListeners().catch((err) => console.warn('setupClientEventListeners 失败:', err))
      this.batchSubscribeRemoteMedia().catch((err) => console.warn('batchSubscribeRemoteMedia 失败:', err))
    } finally {
      // 释放锁
      this.joining = false
    }
  }

  /**
   * 构造函数
   * @param uid 用户ID
   * @param roomId 房间ID
   */
  private constructor(
    public readonly uid: string,
    public readonly roomId: string
  ) {
    this.client = DingRTC.createClient()
  }

  // 是否已经离开房间
  protected leaveState = false
  // 是否正在加入房间（锁机制）
  protected joining = false
  // ���里云本地客户端
  public client
  // 是否加入房间完毕
  public joinPromise?: ReturnType<typeof getAliMeetingToken>
  // 远程用户加入
  public onRemoteUserJoin?: (user: RemoteUser, play: (id: string) => void) => void
  // 远程用户退出
  public onRemoveUserLeave?: (user: RemoteUser) => void

  // 本地视频流
  public localVideoTrack?: CameraVideoTrack
  // 本地音频流
  public localAudioTrack?: MicrophoneAudioTrack
}
