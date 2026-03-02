const IconCamera = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
)

const IconCameraOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="2" y1="2" x2="22" y2="22"/>
    <path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16"/>
    <path d="M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5"/>
    <path d="M14.121 15.121A3 3 0 1 1 9.88 10.88"/>
  </svg>
)

const IconMic = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
  </svg>
)

const IconMicOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="2" y1="2" x2="22" y2="22"/>
    <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/>
    <path d="M5 10v2a7 7 0 0 0 12 5"/>
    <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/>
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
  </svg>
)

type ToolbarButtonProps = {
  active: boolean
  activeIcon: React.ReactNode
  inactiveIcon: React.ReactNode
  activeLabel: string
  inactiveLabel: string
  onActivate: () => void
  onDeactivate: () => void
}

const ToolbarButton = ({ active, activeIcon, inactiveIcon, activeLabel, inactiveLabel, onActivate, onDeactivate }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={active ? onDeactivate : onActivate}
    className={[
      'flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium transition-colors',
      active ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/80 text-white hover:bg-red-500',
    ].join(' ')}>
    {active ? activeIcon : inactiveIcon}
    {active ? activeLabel : inactiveLabel}
  </button>
)

type MeetingToolbarProps = {
  hasCameraTrack: boolean
  hasMicTrack: boolean
  onCameraOpen: () => void
  onCameraClose: () => void
  onMicOpen: () => void
  onMicClose: () => void
}

export const MeetingToolbar = ({
  hasCameraTrack,
  hasMicTrack,
  onCameraOpen,
  onCameraClose,
  onMicOpen,
  onMicClose,
}: MeetingToolbarProps) => {
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-6 bg-black/50 backdrop-blur-sm px-6 py-4 safe-area-pb">
      <ToolbarButton
        active={hasCameraTrack}
        activeIcon={<IconCamera />}
        inactiveIcon={<IconCameraOff />}
        activeLabel="关闭视频"
        inactiveLabel="开启视频"
        onActivate={onCameraOpen}
        onDeactivate={onCameraClose}
      />
      <ToolbarButton
        active={hasMicTrack}
        activeIcon={<IconMic />}
        inactiveIcon={<IconMicOff />}
        activeLabel="关闭音频"
        inactiveLabel="开启音频"
        onActivate={onMicOpen}
        onDeactivate={onMicClose}
      />
    </div>
  )
}
