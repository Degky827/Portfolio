const { hashToken } = require('../tokenUtils')

describe('Token Utilities', () => {
  it('hashes tokens into a consistent 64-character SHA-256 hex string', () => {
    const rawToken = 'my-sample-refresh-token-xyz'
    const hash1 = hashToken(rawToken)
    const hash2 = hashToken(rawToken)

    expect(hash1).toBeDefined()
    expect(hash1.length).toBe(64)
    expect(hash1).toBe(hash2)
  })

  it('produces different hashes for different tokens', () => {
    const hashA = hashToken('token-a')
    const hashB = hashToken('token-b')

    expect(hashA).not.toBe(hashB)
  })

  it('handles null, undefined or empty strings safely', () => {
    expect(hashToken('')).toBe('')
    expect(hashToken(null)).toBe('')
    expect(hashToken(undefined)).toBe('')
  })
})
