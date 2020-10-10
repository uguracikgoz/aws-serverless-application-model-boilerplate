const region = process.env.AWS_REGION;
class IAlertMessage
{
    message
    constructor(message,logGroupName,logStreamName,functionName)
    {
        this.message = message;
        this.logGroupName = logGroupName;
        this.logStreamName = logStreamName;
        this.functionName = functionName;
    }
 
    getLogGroupName()
    {
        return this.logGroupName;
    }
    setLogGroupName(logGroupName)
    {
        this.logGroupName = logGroupName;
    }
    getLogStreamName()
    {
        return this.logStreamName;
    }
    setLogStreamName(logStreamName)
    {
        this.logStreamName = logStreamName;
    }
    getMessage()
    {
        return this.message;
    }
    setMessage(message)
    {
        this.message = message;
    }
    getFunctionName()
    {
        return this.functionName;
    }
    setFunctionName(functionName)
    {
        this.functionName = functionName;
    }
    getLogUrl()
    {
      return this.logUrl;
    }
    setLogUrl(logGroupName,logStreamName)
    {
        this.logUrl = "https://"+
        encodeURIComponent(region)+
        ".console.aws.amazon.com/cloudwatch/home?region="+
        encodeURIComponent(region)+
        "#logsV2:log-groups/log-group/"+
        encodeURIComponent( logGroupName )+
        "/log-events/"+
        encodeURIComponent( logStreamName );
    }
}
 
module.exports = IAlertMessage;