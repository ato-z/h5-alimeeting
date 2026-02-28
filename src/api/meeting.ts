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
  })
}

/**
 * 获取阿里云会议 Token
 * @param userId 用户ID
 * @returns 阿里云会议 Token 数据
 */
export function getAliMeetingToken(userId: number | string) {
  return request<AliMeetingTokenResponse>({
    url: '/audio/getAudioToken',
    method: 'GET',
    params: { userId },
  })
}
