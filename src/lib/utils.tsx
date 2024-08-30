export function usdAmount(usdc: number | string) {
  if (usdc === undefined || usdc === null) {
    return "0.00 USDC";
  }
  if (typeof usdc === "string") {
    usdc = usdc.split(" ")[0];
  }
  // Converts USDC to USD by dividing by 1,000,000
  const usdAmount = Number(usdc) / 1000000;
  if (usdAmount > 1) {
    return usdAmount.toFixed(2) + " USDC";
  }
  return usdAmount.toFixed(7) + " USDC";
}
