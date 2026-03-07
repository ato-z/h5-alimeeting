import { useEffect, useState, useRef, useCallback } from 'react'
import type { CameraVideoTrack, MicrophoneAudioTrack } from 'dingrtc'
import { LocalClientRTC } from '@/utils/LocalClientRTC'
import { USER_DRAW_UP_STATE } from '@/constant'

type JoinState = (typeof USER_DRAW_UP_STATE)[keyof typeof USER_DRAW_UP_STATE]

interface UseMeetingOptions {
  userId: string
  meetingId: string
  onRemoteUserJoin?: (userId: string, play: (selector: string) => void) => void
  onRemoteUserLeave?: (userId: string) => void
}

/**
 * 会议管理 Hook
 * 统一管理加入/离开房间、音视频轨道
 */
export const useMeeting = ({ userId, meetingId, onRemoteUserJoin, onRemoteUserLeave }: UseMeetingOptions) => {
  const controller = LocalClientRTC.getInstance(userId, meetingId)

  const [joinState, setJoinState] = useState<JoinState>(USER_DRAW_UP_STATE.ENTER)
  const [error, setError] = useState<Error | string | null>(null)
  const [cameraTrack, setCameraTrack] = useState<CameraVideoTrack | undefined>(controller.localVideoTrack)
  const [micTrack, setMicTrack] = useState<MicrophoneAudioTrack | undefined>(controller.localAudioTrack)
  const hasJoinedRef = useRef(false)
  const isFirstMountRef = useRef(true)

  // 设置远程用户回调
  controller.onRemoteUserJoin = ({ id }, play) => {
    onRemoteUserJoin?.(id, play)
  }

  // 设置远程用户离开
  controller.onRemoveUserLeave = ({ id }) => {
    onRemoteUserLeave?.(id)
  }

  // 播放本地视频
  if (cameraTrack) {
    cameraTrack.play('#self')
  }

  const touchCameraTrack = useCallback(async () => {
    await controller.joinPromise
    await controller.publishLocalVideo()
    setCameraTrack(controller.localVideoTrack)
  }, [controller, setCameraTrack])

  const touchMicTrack = useCallback(async () => {
    await controller.joinPromise
    await controller.publishLocalAudio()
    setMicTrack(controller.localAudioTrack)
  }, [controller, setMicTrack])

  const closeCameraTrack = useCallback(async () => {
    await controller.joinPromise
    await controller.unPublishLocalVideo()
    setCameraTrack(controller.localVideoTrack)
  }, [controller, setCameraTrack])

  const closeMicTrack = useCallback(async () => {
    await controller.joinPromise
    await controller.unPublishLocalAudio()
    setMicTrack(controller.localAudioTrack)
  }, [controller, setMicTrack])

  // 自动加入房间
  useEffect(() => {
    // 防止 React 严格模式重复执行
    if (hasJoinedRef.current) return void 0
    hasJoinedRef.current = true

    controller
      .join()
      .then(async () => {
        setJoinState(USER_DRAW_UP_STATE.COME)

        await touchCameraTrack()
        await touchMicTrack()
      })
      .catch((err) => {
        if (err === null) return void 0
        setJoinState(USER_DRAW_UP_STATE.FAIL)
        setError(err)
      })

    return () => {
      // React 严格模式在开发环境下会立即调用 cleanup
      if (isFirstMountRef.current) {
        isFirstMountRef.current = false
        console.log('跳过 React 严格模式的第一次 cleanup')
        return
      }
      controller.leave()
    }
  }, [controller, touchCameraTrack, touchMicTrack])

  return {
    controller,
    joinState,
    error,
    cameraTrack,
    micTrack,
    touchCameraTrack,
    touchMicTrack,
    closeCameraTrack,
    closeMicTrack,
  }
}
