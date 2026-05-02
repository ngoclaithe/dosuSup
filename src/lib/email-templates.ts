interface OrderEmailData {
  orderCode: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  province: string
  district: string
  ward: string
  items: Array<{
    name: string
    price: number
    salePrice?: number
    quantity: number
  }>
  totalAmount: number
  paymentMethod: 'COD' | 'BANK_TRANSFER'
}

const BRAND = 'DosuSupplements'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

function baseTemplate(title: string, content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background: #f0fbf5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    <div style="background: linear-gradient(135deg, #1A5C38, #27AE60); padding: 28px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 22px; font-weight: 700;">${title}</h1>
    </div>
    <div style="padding: 28px;">
      ${content}
    </div>
    <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6B7280; font-size: 13px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0;">© ${new Date().getFullYear()} ${BRAND}</p>
      <p style="margin: 8px 0 0;">Website: <a href="${SITE_URL}" style="color: #27AE60;">${SITE_URL}</a></p>
    </div>
  </div>
</body>
</html>`
}

export function orderConfirmTemplate(order: OrderEmailData): string {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; text-align: center;">×${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; text-align: right;">${formatPrice((item.salePrice || item.price) * item.quantity)}</td>
    </tr>
  `).join('')

  const paymentText = order.paymentMethod === 'COD'
    ? '💵 Thanh toán khi nhận hàng (COD)'
    : '📱 Chuyển khoản QR (SePay)'

  const bankTransferNote = order.paymentMethod === 'BANK_TRANSFER'
    ? `<div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 14px; border-radius: 6px; margin-top: 16px;">
        <p style="margin: 0; font-weight: 600; color: #92400E;">⚠️ Lưu ý thanh toán</p>
        <p style="margin: 8px 0 0; color: #78350F;">Vui lòng chuyển khoản <strong>${formatPrice(order.totalAmount)}</strong> với nội dung: <strong>${order.orderCode}</strong></p>
        <p style="margin: 4px 0 0; color: #78350F;">Đơn hàng sẽ được xử lý sau khi nhận được thanh toán.</p>
      </div>`
    : ''

  return baseTemplate(
    `Xác nhận đơn hàng #${order.orderCode}`,
    `<p style="font-size: 15px; color: #333;">Xin chào <strong>${order.customerName}</strong>,</p>
    <p style="color: #555;">Đơn hàng của bạn đã được tiếp nhận thành công.</p>
    
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <thead>
        <tr style="background: #F0FBF5;">
          <th style="padding: 10px; text-align: left; font-size: 13px; color: #1A5C38;">Sản phẩm</th>
          <th style="padding: 10px; text-align: center; font-size: 13px; color: #1A5C38;">SL</th>
          <th style="padding: 10px; text-align: right; font-size: 13px; color: #1A5C38;">Thành tiền</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding: 12px 10px; font-weight: 700; font-size: 15px;">Tổng cộng</td>
          <td style="padding: 12px 10px; text-align: right; font-weight: 700; font-size: 15px; color: #1A5C38;">${formatPrice(order.totalAmount)}</td>
        </tr>
      </tfoot>
    </table>

    <div style="background: #f9fafb; padding: 14px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 0 0 8px; font-weight: 600; color: #333;">📦 Thông tin giao hàng</p>
      <p style="margin: 2px 0; color: #555; font-size: 14px;">${order.customerName} — ${order.customerPhone}</p>
      <p style="margin: 2px 0; color: #555; font-size: 14px;">${order.address}, ${order.ward}, ${order.district}, ${order.province}</p>
    </div>

    <p style="color: #555; font-size: 14px;">Phương thức thanh toán: <strong>${paymentText}</strong></p>

    ${bankTransferNote}

    <div style="text-align: center; margin-top: 24px;">
      <a href="${SITE_URL}/dat-hang/xac-nhan/${order.orderCode}"
         style="display: inline-block; background: linear-gradient(135deg, #27AE60, #1A5C38); color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
        Xem trạng thái đơn hàng →
      </a>
    </div>`
  )
}

export function orderPaidTemplate(orderCode: string, customerName: string): string {
  return baseTemplate(
    `Thanh toán thành công — #${orderCode}`,
    `<p style="font-size: 15px; color: #333;">Xin chào <strong>${customerName}</strong>,</p>
    <div style="text-align: center; padding: 20px;">
      <div style="width: 64px; height: 64px; background: #D1FAE5; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 32px;">✅</span>
      </div>
      <p style="color: #555; font-size: 15px;">Chúng tôi đã xác nhận thanh toán cho đơn hàng <strong>#${orderCode}</strong>.</p>
      <p style="color: #555;">Đơn hàng của bạn đang được chuẩn bị và sẽ sớm được giao.</p>
    </div>
    <div style="text-align: center; margin-top: 16px;">
      <a href="${SITE_URL}/dat-hang/xac-nhan/${orderCode}"
         style="display: inline-block; background: linear-gradient(135deg, #27AE60, #1A5C38); color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Xem trạng thái đơn hàng →
      </a>
    </div>`
  )
}

export function orderShippingTemplate(orderCode: string, customerName: string): string {
  return baseTemplate(
    `Đơn hàng đang được giao 🚚`,
    `<p style="font-size: 15px; color: #333;">Xin chào <strong>${customerName}</strong>,</p>
    <p style="color: #555;">Đơn hàng <strong>#${orderCode}</strong> đã được giao cho đơn vị vận chuyển và đang trên đường đến địa chỉ của bạn.</p>
    <p style="color: #555;">Vui lòng để ý điện thoại để nhận hàng.</p>
    <div style="text-align: center; margin-top: 24px;">
      <a href="${SITE_URL}/dat-hang/xac-nhan/${orderCode}"
         style="display: inline-block; background: linear-gradient(135deg, #27AE60, #1A5C38); color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Xem trạng thái đơn hàng →
      </a>
    </div>`
  )
}

export function orderDoneTemplate(orderCode: string, customerName: string): string {
  return baseTemplate(
    `Giao hàng thành công 🎉`,
    `<p style="font-size: 15px; color: #333;">Xin chào <strong>${customerName}</strong>,</p>
    <p style="color: #555;">Đơn hàng <strong>#${orderCode}</strong> đã được giao thành công.</p>
    <p style="color: #555;">Cảm ơn bạn đã tin tưởng và mua sắm tại <strong>${BRAND}</strong>!</p>
    <p style="color: #555;">Nếu có bất kỳ vấn đề gì, vui lòng liên hệ chúng tôi trong vòng 7 ngày.</p>
    <div style="text-align: center; margin-top: 24px;">
      <a href="${SITE_URL}"
         style="display: inline-block; background: linear-gradient(135deg, #27AE60, #1A5C38); color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Tiếp tục mua sắm →
      </a>
    </div>`
  )
}
