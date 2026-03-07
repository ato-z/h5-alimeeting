import { useEffect, useState, useRef } from 'react'
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
  const [localCameraTrack, localMicTrack, localTrackAction] = useLocalTrack({ controller: localClientRTC })
  const hasJoinedRef = useRef(false)
  const isFirstMountRef = useRef(true)

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

  // 等待轨道加入之后播放
  useEffect(() => {
    // 防止 React 严格模式重复执行
    if (hasJoinedRef.current) return void 0
    hasJoinedRef.current = true

    localClientRTC
      .join()
      .then(() => {
        setUserDrawUp(USER_DRAW_UP_STATE.COME)
      })
      .catch((err) => {
        if (err === null) return void 0
        setUserDrawUp(USER_DRAW_UP_STATE.FAIL)
        setError(err)
      })

    return () => {
      // React 严格模式在开发环境下会立即调用 cleanup
      // 跳过第一次的 cleanup，避免破坏 SDK 状态
      if (isFirstMountRef.current) {
        isFirstMountRef.current = false
        console.log('跳过 React 严格模式的第一次 cleanup')
        return
      }
      localClientRTC.leave()
    }
  }, [localClientRTC])

  if (localCameraTrack) {
    localCameraTrack.play('#self')
  }

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
