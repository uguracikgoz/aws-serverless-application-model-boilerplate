const {messageChannels} = require('../../enums');

const MicrosoftTeams = require('./msTeamMessage');

class AlertMessageFactory
{
    constructor(channel)
    {
        this.channel = channel;
    }

    createMessage()
    {
        switch(this.channel)
        {
            case messageChannels.microsoftTeams:
                return new MicrosoftTeams();
        }
    }

    setChannel(channel)
    {
        this.channel = channel;
    }

    getChannel()
    {
        return this.channel;
    }


}

module.exports = AlertMessageFactory;