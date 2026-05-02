export function generateQRUrl(orderCode: string, amount: number): string {
  const bankId = process.env.NEXT_PUBLIC_SEPAY_BANK_ID || 'MB'
  const accountNo = process.env.NEXT_PUBLIC_SEPAY_ACCOUNT_NUMBER || ''
  const template = 'compact2'
  const description = orderCode

  return `https://qr.sepay.vn/img?bank=${bankId}&acc=${accountNo}&template=${template}&amount=${amount}&des=${description}`
}
