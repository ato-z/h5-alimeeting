import { useEffect, useState } from 'react'
import { MeetingRoomUser } from './RoomUser'
import { LocalClientRTC } from '@/utils/LocalClientRTC'
import { MeetingError } from './MeetingError'
import { USER_DRAW_UP_STATE } from '@/constant'
import { MeetingGrid } from './Grid'
import { useLocalTrack } from '@/hook/useLocalTrack'
import { MeetingToolbar } from './Toolbar'
import { waitBeFindNode } from '@/utils'

type MeetingRoomProps = {
  /** 会议ID */
  meetingId: string
  /** 用户ID */
  userId: string
}

export const MeetingRoom = ({ userId, meetingId }: MeetingRoomProps) => {
  const localClientRTC = LocalClientRTC.getInstance(userId, meetingId)
  const [userDrawUp, setUserDrawUp] = useState<(typeof USER_DRAW_UP_STATE)[keyof typeof USER_DRAW_UP_STATE]>(
    USER_DRAW_UP_STATE.ENTER
  )
  const [roomUsers, setRoomUser] = useState(['self'])
  const [error, setError] = useState<Error | string | null>(null)
  const [localCameraTrack, localMicTrack, localTrackAction] = useLocalTrack({
    client: localClientRTC.client,
    joinPromise: localClientRTC.joinPromise,
  })

  localClientRTC.onRemoteUserJoin = ({ id }, play) => {
    const newUsers = new Set(roomUsers)

    // 如果存在则不加入
    if (newUsers.has(id) || id === 'mcu') return void 0

    newUsers.add(id)
    setRoomUser([...newUsers])

    const selector = `#${id}`
    waitBeFindNode(selector, () => {
      console.log('插入到节点中', selector, play)
      play(selector)
    })
  }

  localClientRTC.onRemoveUserLeave = ({ id }) => {
    const newUsers = new Set(roomUsers)
    newUsers.delete(id)
    setRoomUser([...newUsers])
  }

  useEffect(() => {
    localClientRTC.joinPromise
      .then(() => {
        setUserDrawUp(USER_DRAW_UP_STATE.COME)
      })
      .catch((err) => {
        setUserDrawUp(USER_DRAW_UP_STATE.FAIL)
        setError(err)
      })
  }, [localClientRTC, localTrackAction])

  // 等待轨道加入之后播放
  useEffect(() => {
    if (localCameraTrack) localCameraTrack.play('#self')
    return () => {
      localClientRTC.leave()
    }
  }, [localCameraTrack, localClientRTC])

  if (userDrawUp === USER_DRAW_UP_STATE.ENTER) return <MeetingRoomUser />
  if (error) return <MeetingError error={error} />

  return (
    <MeetingGrid
      users={roomUsers}
      children={
        <MeetingToolbar
          hasCameraTrack={!!localCameraTrack}
          hasMicTrack={!!localMicTrack}
          onCameraOpen={localTrackAction.touchCameraTrack}
          onCameraClose={localTrackAction.closeCameraTrack}
          onMicOpen={localTrackAction.touchMicTrack}
          onMicClose={localTrackAction.closeMicTrack}
        />
      }
    />
  )
}
