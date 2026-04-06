import express from 'express'
import cors from 'cors'
import twilio from 'twilio'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER
const TO_NUMBER = process.env.MY_PHONE_NUMBER // Your number: 0908720092
const EMAIL_TO = process.env.EMAIL_TO // Your email

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' })
  }

  try {
    // Send SMS to your phone
    const smsMessage = `New Portfolio Message!\n\nFrom: ${name}\nEmail: ${email}\n\nMessage: ${message}`
    
    await client.messages.create({
      body: smsMessage,
      from: FROM_NUMBER,
      to: TO_NUMBER
    })

    // Send email notification (using Twilio's SendGrid or simple mailto)
    console.log(`New message from ${name} (${email}): ${message}`)

    res.json({ success: true, message: 'Message sent successfully!' })
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ success: false, message: 'Failed to send message' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))