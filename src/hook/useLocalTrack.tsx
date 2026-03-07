import { useState } from 'react'
import type { CameraVideoTrack, MicrophoneAudioTrack } from 'dingrtc'
import type { LocalClientRTC } from '@/utils/LocalClientRTC'

interface LocalTrackProp {
  controller: LocalClientRTC
}

/**
 * 本地客户端音视频轨道
 */
export const useLocalTrack = ({ controller }: LocalTrackProp) => {
  const [cameraTrack, setCameraTrack] = useState<CameraVideoTrack | undefined>(controller.localVideoTrack)
  const [micTrack, setMicTrack] = useState<MicrophoneAudioTrack | undefined>(controller.localAudioTrack)

  const touchCameraTrack = async () => {
    await controller.joinPromise
    await controller.publishLocalVideo()
    setCameraTrack(controller.localVideoTrack)
  }

  const touchMicTrack = async () => {
    await controller.joinPromise
    await controller.publishLocalAudio()
    setMicTrack(controller.localAudioTrack)
  }

  const closeCameraTrack = async () => {
    await controller.joinPromise
    await controller.unPublishLocalVideo()
    setCameraTrack(controller.localVideoTrack)
  }

  const closeMicTrack = async () => {
    await controller.joinPromise
    await controller.unPublishLocalAudio()
    setMicTrack(controller.localAudioTrack)
  }

  return [cameraTrack, micTrack, { touchCameraTrack, touchMicTrack, closeCameraTrack, closeMicTrack }] as const
}
