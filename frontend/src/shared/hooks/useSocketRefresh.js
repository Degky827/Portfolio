import { useEffect } from 'react'
import { usePublicSocket } from '../context/PublicSocketContext'

/**
 * Listen for a socket event and call `callback` when it fires.
 * Automatically cleans up the listener on unmount.
 *
 * @param {string} event - Socket event name (e.g. 'content:updated')
 * @param {function} callback - Function to call when event fires
 * @param {object} [filter] - Optional { type: string } to only trigger for specific content type
 */
export function useSocketRefresh(event, callback, filter) {
  const { on, off } = usePublicSocket()

  useEffect(() => {
    const handler = (data) => {
      if (filter?.type && data?.type !== filter.type) return
      callback(data)
    }
    on(event, handler)
    return () => off(event, handler)
  }, [event, callback, filter, on, off])
}
