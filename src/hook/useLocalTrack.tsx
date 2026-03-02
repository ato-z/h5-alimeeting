import { useState } from 'react'
import DingRTC from 'dingrtc'
import type { CameraVideoTrack, DingRTCClient, MicrophoneAudioTrack } from 'dingrtc'

interface LocalTrackProp {
  client: DingRTCClient
  joinPromise: ReturnType<DingRTCClient['join']>
}

/**
 * 本地客户端音视频轨道
 */
export const useLocalTrack = ({ client, joinPromise }: LocalTrackProp) => {
  const [cameraTrack, setCameraTrack] = useState<CameraVideoTrack>()
  const [micTrack, setMicTrack] = useState<MicrophoneAudioTrack>()

  const touchCameraTrack = async () => {
    await joinPromise

    const track = await DingRTC.createCameraVideoTrack({
      frameRate: 15,
      dimension: 'VD_1280x720',
    })
    setCameraTrack(track)
    client.publish([track])
  }

  const touchMicTrack = async () => {
    await joinPromise
    const track = await DingRTC.createMicrophoneAudioTrack()
    setMicTrack(track)
    client.publish([track])
  }

  const closeCameraTrack = () => {
    if (cameraTrack) {
      client.unpublish([cameraTrack])
    }
    setCameraTrack(undefined)
  }

  const closeMicTrack = () => {
    if (micTrack) {
      client.unpublish([micTrack])
    }

    setMicTrack(undefined)
  }

  return [cameraTrack, micTrack, { touchCameraTrack, touchMicTrack, closeCameraTrack, closeMicTrack }] as const
}
