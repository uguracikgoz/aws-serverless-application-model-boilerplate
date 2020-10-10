'use strict';  
const EmailService  = require('./email');
const AlertMessageFactory = require('./alertSender')
module.exports = {
    EmailService:EmailService,
    AlertMessageFactory:AlertMessageFactory
}