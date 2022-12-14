export function formatModalAddress(address: string): string {
  const leadingChars = 11;
  const trailingChars = 9;

  return address.length < leadingChars + trailingChars
    ? address
    : `${address.substring(0, leadingChars)}\u2026${address.substring(
        address.length - trailingChars
      )}`;
}
export function formatTransactionAddress(address: string): string {
  const leadingChars = 6;
  const trailingChars = 6;

  return address.length < leadingChars + trailingChars
    ? address
    : `${address.substring(0, leadingChars)}\u2026${address.substring(
        address.length - trailingChars
      )}`;
}
