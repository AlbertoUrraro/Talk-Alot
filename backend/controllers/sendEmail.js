
const Sendgrid = require('@sendgrid/mail')
Sendgrid.setApiKey("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")
const sendEmail = async (to, url,nick)=>{


const msg={
    from: process.env.SENDER_EMAIL_ADDRESS,
    to: to,
    subject: "Talk-Alot",
    html:  `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Talk-Alot Chat</h2>
            <p>Ciao ${nick} sei quasi pronto per iniziare a utilizzare Talk-Alot
                basta fare clic sul pulsante qui sotto per rempostare la tua password
            </p>
            
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Reset password</a>
        
            <p>Se il pulsante non funziona per qualsiasi motivo, puoi anche fare clic sul link seguente:</p>
        
            <div>${url}</div>
            </div>
        `
};

Sendgrid.send(msg)

}
    

module.exports = sendEmail