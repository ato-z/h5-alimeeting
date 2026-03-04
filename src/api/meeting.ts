import { getCurrentLocalDate } from '@/utils'
import { request } from '@/utils/request'

/**
 * 获取会议详情
 * @param id 会议ID
 * @returns 会议详情数据
 */
export function getMeetingDetail(id: number | string) {
  return request<MeetingDetailResponse>({
    url: '/meetingDetail',
    method: 'GET',
    params: { id },
  }).then((data) => {
    if (data) {
      data.confirm_time = getCurrentLocalDate()
    }
    return data
  })
}

/**
 * 获取阿里云会议 Token
 * @param userId 用户ID
 * @param roomId 房间ID
 * @returns 阿里云会议 Token 数据
 */
export function getAliMeetingToken(userId: number | string, roomId: number | string) {
  return request<AliMeetingTokenResponse>({
    url: '/audio/getAudioToken',
    method: 'GET',
    params: { userId, roomId },
  })
}

/**
 * 获取服务器时间
 * @returns 时间对象
 */
export async function getServerTime(): Promise<ServerTimeResponse> {
  const response = await fetch(window.location.origin, { method: 'HEAD' })
  const dateStr = response.headers.get('date')

  if (!dateStr) {
    throw new Error('Server did not return Date header')
  }

  const date = new Date(dateStr)
  return {
    iso: date.toISOString(),
    timestamp: date.getTime(),
    date,
  }
}
