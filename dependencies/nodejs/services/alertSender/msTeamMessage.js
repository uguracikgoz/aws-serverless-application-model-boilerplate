const webhook = process.env.MSTEAMSWEBHOOK;
const jiraUrl = process.env.JIRAURL;
const axios = require('axios');
const IAlertMessage = require('./IAlertMessage');

class MsTeamMessage extends IAlertMessage
{
    constructor()
    {
      super();
      this.webhook = webhook;
    }

    async sendMessage()
    { 
      var webhook = this.webhook;
      var functionName = this.functionName;
      var message = this.message;
      var logUrl  = this.logUrl;
      await axios.post(webhook, {
          "@context": "https://schema.org/extensions",
          "@type": "MessageCard",
          "themeColor": "red",
          "title": "An error occured on " + functionName,
          "text": "Here is the error it self on following : Click **See the log** to dig into problem.<br><b>ERROR</b><br><pre>"+message+"</pre>",
          "potentialAction": [
            {
              "@type": "OpenUri",
              "name": "See the log",
              "targets": [
                { "os": "default", "uri": logUrl }
              ]
            },
            {
              "@type": "OpenUri",
              "name": "Create Jira Ticket",
              "targets": [
                { "os": "default", "uri": jiraUrl }
              ]
            }
          ]
        }).then(function(response)
        {
          if(response.statusText == "OK")
          {
            console.info("Microsoft Team Message","Successfully sent");
          }
          else
          {
            console.error("Microsoft Team Message",response);
          }
        }).catch(err =>{
          console.error("Microsoft team alert message failed",err);
        })
    }
}
module.exports = MsTeamMessage;