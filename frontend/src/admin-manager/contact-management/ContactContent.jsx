import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw, Plus, Trash2, GripVertical } from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import { getContactContent, updateContactContent } from '../../shared/services/contactService'
import { listLogs } from '../../shared/services/activityLogService'

const PLATFORM_ICONS = {
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  telegram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.127.087.776.085 1.257-.008 1.33-.364 5.275-.565 7.454-.07.747-.156 1.074-.357 1.28-.2.207-.546.285-.754.282-.38-.006-.724-.115-1.016-.224-1.391-.518-3.316-1.645-4.617-2.574-.246-.175-.304-.393-.066-.597.63-.54 2.05-1.92 2.825-2.655.054-.051.109-.145.04-.244-.07-.1-.17-.066-.246-.045-.24.066-2.08 1.322-2.435 1.538-.204.124-.433.035-.57-.043-.399-.225-.97-.57-1.4-.864-.396-.27-.312-.423.043-.569.982-.405 2.216-.884 3.257-1.237 1.72-.583 2.54-.786 3.138-.79z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>',
  discord: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
  snapchat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12C24 5.372 18.627 0 12 0zm6.857 16.308c-.527.247-1.085.374-1.637.432-.174.018-.343.094-.447.238-.168.233-.267.52-.425.76-.198.303-.472.455-.845.341-.268-.082-.518-.217-.787-.295-.662-.192-1.305-.226-1.967-.08-.243.053-.48.13-.719.207-.109.036-.21.065-.316.065-.176 0-.31-.137-.31-.31v-3.83c0-.408-.063-.822-.286-1.164-.315-.484-.879-.772-1.441-.852-.507-.072-1.025.016-1.508.157-.424.124-.848.324-1.139.654-.49.556-.772 1.154-1.029 1.81-.105.27-.187.557-.353.784-.244.334-.577.489-.982.46-.433-.03-.827-.194-1.199-.374-.114-.055-.204-.07-.322-.019-.288.125-.573.26-.798.477-.105.101-.185.24-.153.39.119.561.473.93.942 1.169.999.51 2.054.872 3.148 1.044.382.06.768.098 1.155.098.504 0 .964-.07 1.385-.31.278-.158.495-.393.726-.604.203-.186.425-.35.663-.48.587-.318 1.22-.429 1.896-.388.484.03.954.166 1.394.416.26.148.5.34.736.535.07.058.157.1.251.086.218-.033.434-.076.648-.133.52-.14 1.014-.345 1.478-.613.18-.104.354-.22.505-.366.117-.113.142-.235.03-.35-.103-.106-.233-.177-.358-.252zm-.896-4.717c-.098.735-.383 1.365-.848 1.88-.14.155-.37.193-.57.133-.197-.06-.301-.241-.315-.44-.022-.306-.023-.614-.023-.92 0-.825.146-1.641.422-2.427.131-.373.297-.733.47-1.088.18-.37.37-.736.552-1.105.107-.218.204-.442.303-.664.111-.249.09-.493.022-.745-.048-.178-.126-.344-.2-.511-.176-.398-.385-.782-.533-1.193-.178-.497-.294-1.013-.423-1.523-.039-.154-.048-.318-.087-.472-.23-.904-.618-1.737-1.168-2.483-.716-.972-1.64-1.722-2.735-2.24-1.003-.473-2.07-.73-3.175-.768-.63-.022-1.255-.002-1.875.078-.197.025-.386.084-.581.13-1.394.324-2.606.99-3.63 1.969-.712.68-1.27 1.474-1.676 2.374-.315.7-.511 1.436-.652 2.19-.032.172-.058.348-.07.523-.048.673.001 1.336.072 2.003.034.307.077.614.137.918.051.258.015.486-.112.714-.11.196-.246.383-.354.588-.142.27-.23.563-.25.87-.043.655.143 1.24.5 1.76.22.32.49.598.791.835.076.06.161.108.24.163.266.187.547.35.832.506.012.007.026.005.046.007.012-.015.026-.03.035-.047.147-.243.26-.504.352-.77.04-.117.084-.233.11-.353.048-.22.214-.322.432-.329.158-.005.317.039.448.152.206.177.296.419.367.667.104.363.155.74.125 1.121-.019.24.056.4.278.51.215.107.44.19.666.279l.004.002z"/></svg>',
  pinterest: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.936 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.739a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>',
  reddit: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.698 3.484h.001c1.583.143 2.903.869 3.816 1.936.336-.152.707-.24 1.099-.24 1.378 0 2.5 1.121 2.5 2.5 0 .824-.402 1.555-1.013 2.002v.003l.007.004c.066.044.13.09.19.14.735.613 1.204 1.536 1.204 2.57 0 1.873-1.705 3.424-3.917 3.708a4.34 4.34 0 0 1-.636.05c-.677 0-1.333-.14-1.929-.397l.005.002a5.365 5.365 0 0 1-3.259.395c-.597.257-1.252.398-1.929.398-.214 0-.428-.017-.637-.05-2.212-.284-3.917-1.835-3.917-3.708 0-1.034.47-1.957 1.204-2.57.06-.05.124-.097.19-.14v-.003A2.49 2.49 0 0 1 6.68 14.73c0-.976.559-1.816 1.374-2.24.48-.252 1.04-.363 1.612-.337.046.002.092.002.138 0 .614.064 1.172.283 1.636.62.62.449 1.074 1.106 1.239 1.87.053.247.081.504.081.766 0 .675-.269 1.286-.705 1.74h.003c.316.33.76.54 1.252.54.507 0 .965-.22 1.28-.562.427-.447.688-1.054.688-1.722 0-.231-.027-.456-.076-.673-.164-.778-.63-1.446-1.265-1.898a3.03 3.03 0 0 0-.64-.373c.727-.166 1.463-.285 2.22-.348l.005-.002.888-4.564a.249.249 0 0 1 .288-.199l3.807.763c.045-.23.24-.398.478-.398zm-7.82 9.803a1.248 1.248 0 0 0 .002 2.498 1.248 1.248 0 0 0-.002-2.498zm5.25 0a1.248 1.248 0 0 0 .001 2.498 1.248 1.248 0 0 0-.001-2.498zm-5.142 3.625a5.603 5.603 0 0 0 5.616 0 .25.25 0 0 0 .14-.35.251.251 0 0 0-.348-.116 5.106 5.106 0 0 1-5.2 0 .251.251 0 0 0-.348.115.251.251 0 0 0 .14.35z"/></svg>',
  twitch: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>',
  medium: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 0v24h24V0H0zm19.938 5.686L18.651 6.92a.376.376 0 0 0-.143.362v9.067a.376.376 0 0 0 .143.361l1.257 1.234v.271h-6.322v-.271l1.303-1.265c.128-.128.128-.165.128-.36V8.99l-3.62 9.195h-.49L6.69 8.99v5.963a.85.85 0 0 0 .233.707l1.694 2.054v.271H2.815v-.271l1.694-2.054a.817.817 0 0 0 .215-.707V8.203a.613.613 0 0 0-.198-.507L3.025 5.686v-.27h4.498l3.467 7.607 3.049-7.607h4.5v.27z"/></svg>',
  devto: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.357 10.247c-.08-.311-.31-.562-.705-.748-.297-.135-.668-.203-1.116-.203H4.045v5.107h1.494c.454 0 .845-.073 1.157-.22.313-.15.55-.362.71-.64.16-.28.24-.605.24-.979v-1.67c0-.353-.08-.647-.24-.884l-.048-.763zM20.495 5.2l-4.79 2.496L18.84 11.7c.517.626.978 1.229 1.383 1.809.406.58.727 1.16.963 1.742.237.581.355 1.155.355 1.72 0 .28-.05.535-.144.913-.099.378-.272.695-.517.954-.248.259-.573.44-.972.555-.403.116-.862.198-1.379.249v.078c1.32.03 2.515-.17 3.585-.587v-8.96c-.663-.466-1.362-.928-2.1-1.388l.68-.793zM11.4 13.973c.196-.22.362-.489.488-.797.108-.277.16-.554.16-.832 0-.36-.068-.692-.207-.998-.139-.308-.348-.573-.628-.791a3.126 3.126 0 0 0-.768-.457 1.886 1.886 0 0 0-.718-.18 1.756 1.756 0 0 0-.741.113c-.234.08-.446.168-.636.263v4.11c.211.105.445.199.695.281.25.082.491.147.726.195l.246.04c.386.06.7-.031.942-.273zM23.1.981a3.012 3.012 0 0 1 .395.538l.026.034v1.342a2.22 2.22 0 0 1-.158.17l-2.478 2.32.144.09c2.048 1.266 3.07 2.48 3.07 4.226 0 1.287-.495 2.483-1.439 3.474-.304.32-.666.635-1.084.948-1.047.786-2.02 1.59-2.02 3.285 0 2.056 1.342 3.146 3.535 4.47v.606H0v-.7c2.288-1.017 3.22-2.365 3.22-4.89 0-1.866-.402-3.198-1.228-4.31-.605-.818-1.398-1.522-1.492-1.618l-.262-.252v-.495c1.848-.27 3.237-.538 4.615-1.069 1.481-.57 2.644-1.356 3.498-2.358.746-.876 1.187-1.847 1.33-2.916h1.16l2.01 2.017 1.647-1.628 1.805 1.795L18.276.022 23.1.98z"/></svg>',
  codepen: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.14L2.415 12.7l1.86-1.42L12 19.3l7.725-8.02 1.86 1.42L12 22.14zm0-6.58l-5.76-4.57L12 5.66l5.76 5.33L12 15.56zm-3.82-5.35L12 13.58l3.82-3.37L12 6.56 8.18 10.21z"/></svg>',
  stackoverflow: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.36 20.2v-4.22h1.44V21.7H3.62v-5.72h1.44v4.22h12.3zM6.8 16.56h10.68v-1.46H6.81v1.46zm.27-3.57l10.37 2.15.3-1.44L7.38 11.55l-.3 1.44zm1.38-3.45l9.61 4.16.57-1.34-9.6-4.16-.58 1.34zm3.6-4.25l-5.18 7.16 1.1.8 5.17-7.15-1.09-.8zm4.47 10.79H6.95v1.46h11.57v-1.46z"/></svg>',
  dribbble: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.29zm10.335 3.483c-.218.29-1.91 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/></svg>',
  behance: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.81 0c1.89 0 3.4.46 4.5 1.38 1.1.92 1.65 2.18 1.65 3.78 0 1.01-.26 1.89-.78 2.65-.52.76-1.24 1.35-2.18 1.77v.06c1.22.27 2.16.82 2.84 1.65.68.83 1.02 1.88 1.02 3.15 0 1.78-.6 3.16-1.8 4.17-1.2 1-2.86 1.5-5 1.5H0V0h7.81zm-.45 9.56c2.02 0 3.03-.82 3.03-2.45 0-.8-.24-1.42-.72-1.86-.48-.44-1.18-.66-2.1-.66H4.27v4.97h3.1zm.3 7.48c1.06 0 1.88-.27 2.46-.8.58-.54.87-1.33.87-2.37 0-1.08-.3-1.87-.9-2.37-.6-.5-1.44-.76-2.52-.76H4.28v6.3h3.38zM24 17.88h-6.7c.12 2.1 1.58 2.84 3.21 2.84 1.2 0 2.08-.3 2.64-.9.33-.35.57-.82.66-1.37h2.03c-.17 1.04-.55 1.88-1.12 2.53-.82.95-2.05 1.42-3.7 1.42-1.67 0-2.97-.54-3.92-1.62-.95-1.08-1.42-2.6-1.42-4.56 0-1.94.46-3.47 1.38-4.6.92-1.12 2.2-1.68 3.84-1.68 1.6 0 2.83.57 3.7 1.7.87 1.14 1.3 2.69 1.3 4.67v.57zm-6.68-1.52h4.54c-.09-1.15-.46-1.99-1.1-2.52-.64-.53-1.45-.8-2.4-.8-1.02 0-1.85.27-2.48.8-.56.48-.88 1.14-.97 1.98v.54zm-1.7-9.82h6.88v2.05H15.63V6.54z"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
  website: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>',
}

function getPlatformKey(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

const emptyChannel = { channelName: '', linkUrl: '', iconVector: '', displayWeight: 0 }

const actionBadge = {
  CREATE: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  UPDATE: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  DELETE: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 ${className}`}>
      {children}
    </div>
  )
}

function EmptyState({ message }) {
  return <p className="text-sm text-gray-400 italic">{message}</p>
}

export default function ContactContent() {
  const [form, setForm] = useState({
    email: '',
    phone: '',
    address: '',
    mapLink: '',
    contactFormEnabled: true,
    socialChannels: [],
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)
  const [auditLogs, setAuditLogs] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const { content } = await getContactContent()
        if (content) {
          setForm({
            email: content.email || '',
            phone: content.phone || '',
            address: content.address || '',
            mapLink: content.mapLink || '',
            contactFormEnabled: content.contactFormEnabled !== false,
            socialChannels: content.socialChannels || [],
          })
        }
      } catch {
        setToast({ message: 'Failed to load contact content', type: 'error' })
      } finally {
        setFetching(false)
      }
    })()
    ;(async () => {
      try {
        const data = await listLogs({ resource: 'Contact', limit: 3 })
        setAuditLogs(data.logs || [])
      } catch { /* silent */ }
    })()
  }, [])

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const addChannel = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      socialChannels: [...prev.socialChannels, { ...emptyChannel, displayWeight: prev.socialChannels.length }],
    }))
  }, [])

  const removeChannel = useCallback((idx) => {
    setForm((prev) => ({
      ...prev,
      socialChannels: prev.socialChannels.filter((_, i) => i !== idx),
    }))
  }, [])

  const updateChannel = useCallback((idx, field) => (e) => {
    const value = e.target.value
    setForm((prev) => {
      const channels = [...prev.socialChannels]
      const updated = { ...channels[idx], [field]: field === 'displayWeight' ? Number(value) : value }
      if (field === 'channelName' && value) {
        const key = getPlatformKey(value)
        if (PLATFORM_ICONS[key]) {
          updated.iconVector = PLATFORM_ICONS[key]
        }
      }
      channels[idx] = updated
      return { ...prev, socialChannels: channels }
    })
  }, [])

  const moveChannel = useCallback((idx, direction) => {
    setForm((prev) => {
      const channels = [...prev.socialChannels]
      const target = idx + direction
      if (target < 0 || target >= channels.length) return prev
      ;[channels[idx], channels[target]] = [channels[target], channels[idx]]
      channels.forEach((c, i) => { c.displayWeight = i })
      return { ...prev, socialChannels: channels }
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const body = {
      ...form,
      socialChannels: JSON.stringify(form.socialChannels),
    }
    try {
      await updateContactContent(body)
      setToast({ message: 'Contact settings updated successfully', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update contact settings', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Contact Settings & Channels" subtitle="Manage contact information, social channel links, and review recent activity." />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ═══════ COLUMN 1: Contact Info + Settings ═══════ */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Phone</label>
                    <input type="text" value={form.phone} onChange={set('phone')} placeholder="+251 900 000 000" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Address</label>
                  <input type="text" value={form.address} onChange={set('address')} placeholder="City, Country" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Map Link</label>
                  <input type="url" value={form.mapLink} onChange={set('mapLink')} placeholder="https://maps.google.com/?q=..." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" checked={form.contactFormEnabled} onChange={set('contactFormEnabled')} className="sr-only peer" />
                    <div className="w-10 h-6 bg-gray-300 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Form Enabled</span>
                </label>
                <p className="text-xs text-gray-400 -mt-2">When disabled, the public form fields are hidden and contact details expand full-width.</p>
              </Card>
            </motion.div>
          </div>

          {/* ═══════ COLUMN 2: Social Channels (Polymorphic Array) ═══════ */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Social Channels</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Icons are auto-assigned from the channel name.</p>
                  </div>
                  <button type="button" onClick={addChannel} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    <Plus size={16} /> Add Channel
                  </button>
                </div>
                {form.socialChannels.length === 0 && <EmptyState message="No social channels added yet." />}
                <div className="space-y-2">
                  {form.socialChannels.map((ch, idx) => {
                    const key = getPlatformKey(ch.channelName)
                    const hasIcon = Boolean(PLATFORM_ICONS[key])
                    return (
                    <div key={idx} className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-gray-400 shrink-0 cursor-grab" />
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${hasIcon ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}`}
                          dangerouslySetInnerHTML={hasIcon ? { __html: PLATFORM_ICONS[key].replace(/width="[^"]*"/, 'width="16"').replace(/height="[^"]*"/, 'height="16"') } : undefined}>
                          {!hasIcon && <span className="text-xs font-bold uppercase">{ch.channelName?.charAt(0) || '?'}</span>}
                        </div>
                        <input type="text" value={ch.channelName} onChange={updateChannel(idx, 'channelName')} placeholder="GitHub" className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button type="button" onClick={() => moveChannel(idx, -1)} disabled={idx === 0} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 text-xs">▲</button>
                          <button type="button" onClick={() => moveChannel(idx, 1)} disabled={idx === form.socialChannels.length - 1} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 text-xs">▼</button>
                        </div>
                        <button type="button" onClick={() => removeChannel(idx)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"><Trash2 size={13} /></button>
                      </div>
                      <input type="url" value={ch.linkUrl} onChange={updateChannel(idx, 'linkUrl')} placeholder="https://github.com/username" className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                      <div className="flex gap-2">
                        <div className="flex-1" />
                        <div className="w-20">
                          <label className="block text-[10px] font-medium text-gray-400 mb-0.5">Order</label>
                          <input type="number" value={ch.displayWeight} onChange={updateChannel(idx, 'displayWeight')} className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                        </div>
                      </div>
                    </div>
                    )
                  })}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* ═══════ COLUMN 3: Recent Audit Activity ═══════ */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Contact Activity</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-3">Last 3 audit log entries where resource contains "Contact".</p>
                {auditLogs.length === 0 ? (
                  <EmptyState message="No Contact-module activity recorded yet." />
                ) : (
                  <div className="space-y-2">
                    {auditLogs.map((log) => (
                      <div key={log._id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${actionBadge[log.action] || 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'}`}>
                              {log.action}
                            </span>
                            <span className="text-[10px] text-gray-400">{new Date(log.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                            {log.resource}{log.details?.field ? ` — ${log.details.field}` : ''}
                          </p>
                          {log.user?.name && (
                            <p className="text-[11px] text-gray-400 mt-0.5">by {log.user.name}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex justify-end gap-3"
        >
          <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
            {loading ? <><RefreshCw size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
          </button>
        </motion.div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
