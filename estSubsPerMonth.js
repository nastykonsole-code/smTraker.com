
export function estimateMonthlySubsUniversal(monthlyViews) {
    const universalSCR = 0.0048; 
    return Math.round(monthlyViews * universalSCR);
}