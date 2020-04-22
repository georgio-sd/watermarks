export function delay(n: number) {
  return new Promise<void>(r => setTimeout(r, n))
}