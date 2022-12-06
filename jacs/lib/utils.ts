Math.clamp = function clamp(low, v, hi) {
    if (v < low) return low
    if (v > hi) return hi
    return v
}
