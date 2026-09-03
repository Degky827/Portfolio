import { memo } from 'react'
import { MapPin } from 'lucide-react'

function ProfilePhotoScreen({ fullName, roleTitle, locationText, photoUrl }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-[#1e1e1e]">
      <img
        src={photoUrl}
        alt={fullName}
        className="h-full w-full object-cover object-top"
        draggable={false}
      />

      <div
        className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-12"
        style={{
          background: 'linear-gradient(to top, rgba(10,10,20,0.92) 0%, rgba(10,10,20,0.6) 55%, transparent 100%)',
        }}
      >
        <p className="text-white text-base sm:text-lg font-bold tracking-tight leading-tight">
          {fullName}
        </p>
        <p className="text-purple-300 text-xs sm:text-sm font-medium">{roleTitle}</p>
        {locationText && (
          <p className="mt-1 flex items-center gap-1 text-white/70 text-[11px]">
            <MapPin size={11} />
            {locationText}
          </p>
        )}
      </div>
    </div>
  )
}

export default memo(ProfilePhotoScreen)
