import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { name, email, message } = body || {}

    // Server-side validation
    const errors = {}
    if (!name || name.trim().length < 2) errors.name = 'Name is required'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email is required'
    if (!message || message.trim().length < 10) errors.message = 'Message must be at least 10 characters'

    if (Object.keys(errors).length > 0) {
        throw createError({ statusCode: 422, data: errors })
    }

    const config = useRuntimeConfig()

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.gmailUser,
            pass: config.gmailPass,
        },
    })

    await transporter.sendMail({
        from: `"Portfolio Contact" <${config.gmailUser}>`,
        to: config.gmailUser,
        replyTo: email,
        subject: `New message from ${name}`,
        html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#0a0a0a;color:#fff;border-radius:12px">
        <h2 style="color:#FFC72C;margin-bottom:8px">New Contact Message</h2>
        <hr style="border-color:rgba(255,255,255,0.1);margin-bottom:24px"/>
        <p style="margin:0 0 8px"><span style="color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:.15em;text-transform:uppercase">From</span></p>
        <p style="margin:0 0 20px;font-size:16px;font-weight:600">${name} &lt;${email}&gt;</p>
        <p style="margin:0 0 8px"><span style="color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:.15em;text-transform:uppercase">Message</span></p>
        <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.85)">${message.replace(/\n/g, '<br/>')}</p>
      </div>
    `,
    })

    return { ok: true }
})
