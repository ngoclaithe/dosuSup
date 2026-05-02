import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

export async function sendMail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || `"DosuSupplements" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    })
    console.log('[Email] Sent:', info.messageId)
    return info
  } catch (error) {
    console.error('[Email] Failed to send:', error)
    throw error
  }
}
