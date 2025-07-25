import { Op } from 'sequelize';
import { hashEncode } from '../config/crypto.js';
import config from '../config/index.js';
import { FinanceModel as pmodel, UserModel as model, VerificationModel as vmodel } from '../db/Models.js'
import nodemailer from 'nodemailer';

export default class UserService {
    async sendEmail(email) {
        const options = {
            host: config.smtp_host,
            service: config.smtp_service,
            port: config.smtp_port,
            secure: true,
            auth: {
                user: config.smtp_email,
                pass: config.smtp_password,
            },
        };
        const transporter = nodemailer.createTransport(options);
        await transporter.sendMail(email);
        return { message: "Email sent successfully!" };
    }
    async sendEmailActivation(user) {
        const seq = Math.floor(1000 + Math.random() * 9000);
        const code = hashEncode(seq.toString());
        await vmodel.upsert({ id: user.email, code: code });
        const mail = {
            from: '"AVILO PORTAL" ' + config.smtp_email,
            to: `${user.email}`,
            subject: `Avilo Portal - Account activation`,
            html: this.emailStructure(
                `Hello ${user.name}`,
                "Here is the code to activate your account:" + seq,
                `If you did not request this, please ignore this email.`,
                `If you have any questions, please contact us at: ${config.smtp_email}`,
                `Avilo, conoce mas en: <a class="link" href="https://avilo.us">https://avilo.us</a>`,
                "Best regards, Avilo Team",
            ),
        };
        return await this.sendEmail(mail);
    }
    async getAll() {
        return await model.findAll({
            where: { verified: true },
            attributes: ['id', 'name', 'role', 'hcp_link', 'picture', 'email', 'phone', 'birthday', 'createdAt'],
            order: [['createdAt', 'DESC']],
            include: [{
                model: pmodel,
                as: 'finances',
                attributes: ['id', 'job_id', 'customer_id', 'job_number', 'address', 'amount', 'paid', 'due', 'job_date', 'createdAt']
            }]
        })
    }
    async get(where) {
        return await model.findOne({
            where: {
                [Op.and]: [
                    where,
                    { verified: true }
                ]
            }
        })
    }
    async verify({code, email}) {
        if (!code || !email) {
            throw new Error('Code is required');
        }
        const hashedCode = hashEncode(code);
        const verification = await vmodel.findOne({ where: { code: hashedCode, id: email } });
        if (!verification) {
            throw new Error('User not found');
        }
        const user = await model.update({verified: true},{ where: { email: email} });
        console.log('User verified:', user);
        await vmodel.destroy({ where: { id: email } });
        return user;
    }
    async create(user) {
        const pass = hashEncode(user.password)
        const response = await model.create({ ...user, password: pass });

        this.sendEmailActivation(response);

        return response;
    }
    async update(id, user) {
        return await model.update(user, { where: { id: id } })
    }
    async delete(id) {
        return await model.destroy({ where: { id: id } })
    }

    emailStructure(
        greeting,
        info,
        farewell,
        ...paragraph
    ) {
        const email = `
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Jaldi&display=swap');
        body{
            background-color: rgb(206, 206, 206);
            font-family: 'Jaldi', sans-serif;
            margin: 0;
            width: 100vw;
            height: 100vh;
        }
        .patern{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
        }
        .container{
            background-color: aliceblue;
            border-radius: 12px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }
        .header{
            background-image: url(https://www.wexinc.com/wp-content/uploads/2021/02/DivisionPage_Evolving@2x.png);
            background-position: center;
            background-size: cover;
            padding: 20px;
            padding-left: 30px;
            border-radius: 12px 12px 0 0;
        }
        .titles{
            background-color: rgba(0, 0, 0, 0.6);
            width: fit-content;
            color: #B46136;
            padding: 5px 15px 5px 15px;
            line-height: 1em;
            border-radius: 12px;
        }
        .title2{
            color: aliceblue;
            text-align: right;
        }
        .body-container{
            padding: 10px;
            padding-left: 50px;
            padding-right: 50px;
        }
        .reset-container{
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px;
        }
        .reset{
            justify-self: center;
            background-color: #FFFFFF;
            text-decoration: none;
            color: #A42A28;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }
        .link{
            text-decoration: none;
            transition-duration: .5s;
            color: #A42A28;
        }
        .link:hover{
            color: #fc7634;
        }
        .more{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: end;
        }
        h3{
            align-items: center;
        }
        .info{
            text-align: center;
        }
    </style>
</head>
<body>
        <div class="container">
            <div class="header">
                <div class="titles">
                    <h1 class="title1">AVILO.us</h1>
                    <h1 class="title2">PORTAL</h1>
                </div>
            </div>
            <div class="body-container">
                <p>${greeting}</p>
                <p>${info}</p>
                ${paragraph.map((p) => `<p>${p}</p>`).join("")}
                <div class="more">
                    <h3>${farewell}</h3>
                </div>
            </div>
        </div>
        <p class="info">Este email fue enviado para la acuenta registrada como ${config.smtp_email}.
            Tu recibiste este mensaje porque alguien puso esta direccion de email en nuestro sitio web.</p>
</body>
</html>
`;
        return email;
    }
}