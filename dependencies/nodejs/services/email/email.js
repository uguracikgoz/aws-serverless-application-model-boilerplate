const aws = require('aws-sdk');
const ses = new aws.SES({
    region: 'eu-west-1'
});

class EmailService
{
    mailTo
    mailCc
    body
    subject
    returnPath
    source

    constructor(mailTo,mailCc,body,subject,returnPath,resource)
    {
        this.mailTo     = mailTo?mailTo:"";
        this.mailCc     = mailCc?mailCc:"";
        this.body       = body?body:"";
        this.subject    = subject?subject:"";
        this.returnPath = returnPath?returnPath:"";
        this.resource   = resource?resource:"";
    }

    async send()
    {
        return new Promise((resolve, reject) => {
            console.info("mail",this);
            const params = {
                Destination: {
                    ToAddresses: this.mailTo,
                    CcAddresses: this.mailCc
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: 'UTF-8',
                            Data: this.body
                        },
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: this.subject
                    }
                },
                ReturnPath:this.returnPath,
                Source: this.resource
            };

            return ses.sendEmail(params, (err, data) => {
                if (err) {
                    console.error(err, err.stack);
                    resolve(false);
                }
                else
                {
                    console.info("Mail Sender Succeed", data);
                    resolve(true);
                }
            });
        });
    }
}
module.exports = EmailService;