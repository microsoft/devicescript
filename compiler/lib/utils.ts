function clamp(low:number, v: number, hi: number) {
    if (v < low) return low
    if (v > hi) return hi
    return v
}
