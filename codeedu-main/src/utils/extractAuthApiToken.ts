/**
 * Reads session / signup token from common backend response shapes
 * (`{ data: { token } }`, `{ token }`, nested `result`, etc.).
 */
export function extractTokenFromAuthPayload(payload: unknown): string | null {
    if (payload == null || typeof payload !== 'object') return null
    const p = payload as Record<string, unknown>

    const tryString = (v: unknown): string | null =>
        typeof v === 'string' && v.length > 0 ? v : null

    const fromData = p.data
    if (fromData && typeof fromData === 'object') {
        const inner = fromData as Record<string, unknown>
        const t = tryString(inner.token)
        if (t) return t
    }

    const result = p.result
    if (result && typeof result === 'object') {
        const t = tryString((result as Record<string, unknown>).token)
        if (t) return t
    }

    return tryString(p.token)
}
