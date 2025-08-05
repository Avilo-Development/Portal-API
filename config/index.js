import dotenv from 'dotenv'

dotenv.config()

const config = {
    db_main: process.env.DB_MAIN,
    db_host: process.env.DB_HOST,
    db_port: process.env.DB_PORT,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    db_dialect: process.env.DB_DIALECT,

    token_secret: process.env.TOKEN_SECRET,
    port: process.env.PORT,

    hcp_token: process.env.HCP_TOKEN,

    smtp_host: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtp_service: process.env.SMTP_SERVICE || 'gmail',
    smtp_port: process.env.SMTP_PORT || 587,
    smtp_email: process.env.SMTP_EMAIL || '',
    smtp_password: process.env.SMTP_PASSWORD || '',
}

export default config