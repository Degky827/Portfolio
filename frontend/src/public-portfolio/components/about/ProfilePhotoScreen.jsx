import { memo } from 'react'

function ProfilePhotoScreen({ fullName, photoUrl }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#1e1e1e] border-l border-[#3c3c3c]">
      <img
        src={photoUrl}
        alt={fullName}
        className="h-full w-full object-cover object-top"
        draggable={false}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(30,30,30,0.35) 0%, transparent 25%)',
        }}
      />
    </div>
  )
}

export default memo(ProfilePhotoScreen)
