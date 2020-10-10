'use strict';
const {AlertMessageFactory} = require('../services');
const {messageChannels} = require('../enums');

class Response
{
    statusCode;
    status;
    message;
    data;

    constructor(statusCode,status,message,data)
    {
        this.statusCode = statusCode?statusCode:"404";
        this.status     = status?status:"ERR";
        this.message    = message?message:"";
        this.data       = data?data:{};
    }

    async get()
    {
        if(this.statusCode == 500)
        {
            var alertMessageFactory = new AlertMessageFactory();
            alertMessageFactory.setChannel(messageChannels.microsoftTeams);
            var msTeamMessage = alertMessageFactory.createMessage();
            msTeamMessage.setMessage( this.getMessage() );
            msTeamMessage.setLogGroupName( this.getData().logGroupName );
            msTeamMessage.setLogGroupName( this.getData().logGroupName );
            msTeamMessage.setLogStreamName( this.getData().logStreamName );
            msTeamMessage.setFunctionName( this.getData().functionName );
            msTeamMessage.setLogUrl( msTeamMessage.getLogGroupName(), msTeamMessage.getLogStreamName() );
            await msTeamMessage.sendMessage();
            this.data = {}; // never show detailed error to customer
        } 
        return {
            statusCode: this.statusCode,
            body: JSON.stringify({
                status:this.status,
                message:this.message,
                data:this.data
            })
        };
    }

    setStatusCode(statusCode)
    {
        this.statusCode = statusCode;
    } 

    setStatus(status)
    {
        this.status = status;
    }

    setMessage(message)
    {
        this.message = message;
    }

    getMessage()
    {
        return this.message;
    }

    setData(data)
    {
        this.data = data;
    }

    getData()
    {
        return this.data;
    }

    setContext(context)
    {
        this.context = context;
    }

    getContext()
    {
        return this.context;
    }
}
module.exports = Response;