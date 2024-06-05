export const sendEmail = async (addressee, subject, body) => {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'thiago.piaia@tunad.io',
            pass: 'Ththedfa13'
        }
    });

    const mensagem = {
        from: 'thiago.piaia@tunad.io',
        to: addressee,
        subject: subject,
        text: body
    };

    try {
        await transporter.sendMail(mensagem);
        console.log('Email enviado com sucesso para:', addressee);
    } catch (error) {
        console.error('Falha ao enviar email:', error);
    }
}
