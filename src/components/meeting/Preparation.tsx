/**
 * 会议预备阶段
 * @returns
 */
export const MeetingPreparation = ({ meeting }: { meeting: MeetingDetailResponse }) => {
  console.log('会议详情数据：', meeting)
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <h1 className="text-white text-3xl font-bold">会议准备中...</h1>
    </div>
  )
}
