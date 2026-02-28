/**
 * API 相关类型定义
 */

/**
 * 会议详情响应类型
 */
declare interface MeetingDetailResponse {
  /** 头像路径 */
  avatar: string
  /** 确认成员ID，对方确认会议后有值 */
  confirm_member_id: number | null
  /** 确认时间，对方确认会议后有值 */
  confirm_time: string | null
  /** 确认更新时间 */
  confirm_update_time: string | null
  /** 创建时间 */
  create_time: string
  /** 发起者成员ID */
  from_member_id: number
  /** 会议ID */
  id: number
  /** 是否通知：0-未通知，1-已通知 */
  is_notice: number
  /** 项目ID */
  item_id: number
  /** 项目类型：2-会议 */
  item_type: number
  /** 昵称 */
  nickname: string
  /** 真实姓名 */
  realname: string
  /** 是否拒绝：0-未拒绝，1-已拒绝 */
  refuse: number
  /** 会议状态：0-待确认，1-已确认，2-已拒绝，3-已取消 */
  status: number
  /** 时间选项1（时间戳） */
  time_one: number
  /** 时间选项2（时间戳） */
  time_two: number
  /** 时间选项3（时间戳） */
  time_three: number
  /** 会议时长（分钟） */
  times: number
  /** 接收者成员ID */
  to_member_id: number
  /** 更新时间 */
  update_time: string
}

/**
 * 获取阿里云会议 Token 响应类型
 */
declare interface AliMeetingTokenResponse {
  /** 会议 Token */
  token: string
  /** 频道ID */
  channel_id: string
  /** 用户ID */
  user_id: string
}

declare type MeetingState = 'attend' | 'preparation' | 'ongoing' | 'ended'

/**
 * 服务器时间响应类型
 */
declare interface ServerTimeResponse {
  /** ISO 格式的时间字符串 */
  iso: string;
  /** 时间戳（毫秒） */
  timestamp: number;
  /** 日期对象 */
  date: Date;
}
