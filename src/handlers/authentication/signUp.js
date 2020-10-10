const baseUrl = process.env.BASEURL;

const {User}        = require('../../models/user');
const {Response}    = require( process.env.AWS ? '/opt/nodejs/helpers' :'../../../layer/nodejs/helpers/');
const {EmailService}    = require( process.env.AWS ? '/opt/nodejs/services' :'../../../layer/nodejs/services/');
/**
 * The signUp function
*/
exports.main = async (event, context) => {

    var response;
    // All log statements are written to CloudWatch
    console.info('received:', event);

    if (event.httpMethod !== 'PUT') {
        response =  new Response(500,"ERR","this only accept PUT method, you tried:"+event.httpMethod,context).get();
    }
    else if(!event.hasOwnProperty('body'))
    {
        console.info("UNSUCCESSFULL", "Missing body");
        response =  new Response(400,"ERR","Missing body").get();
    }
    else
    {
        try
        {
            const body = JSON.parse(event.body);

            // Get id and name from the body of the request
            if(!body.hasOwnProperty("email") || !body.hasOwnProperty("password") || !body.hasOwnProperty("companyId"))
            {
                console.info("UNSUCCESSFULL", "Missing parameters : email or password or companyId");
                response =  new Response(400,"ERR","Missing parameters : email or password or companyId or companyId").get();
            }
            else
            {
                var user = new User();
                user.setEmail(body.email);
                user.setPassword(body.password);
                user.setCompanyId(body.companyId);
                try
                {
                    let existance = await user.get();
                    if(existance.hasOwnProperty('Item'))
                    {
                        console.info("UNSUCCESSFULL", "User already exists, can not put");
                        response =  new Response(303,"ERR","User is already existed.").get();
                    }
                    else
                    {
                        try
                        {
                            user.generateToken();
                            var emailService = new EmailService(
                                [user.getEmail()],//[user.email],
                                [],
                                "Please click following link to activate your account on MindBehind Whatsapp Payment System  : " + baseUrl + "activate/" + user.getToken(),
                                "Account activation",
                                "no-reply@sorunapp.com",
                                "no-reply@sorunapp.com");
                            let hasMailSent = await emailService.send()
                            if(hasMailSent)
                            {
                                try{
                                    let res = await user.put();
                                    delete user.password; // remove password field before it got hashed on jwt in case of anything
                                    console.info("Account signUp successfully", res);
                                    response =  new Response(200,"OK","Success").get();
                                }
                                catch(err)
                                {
                                    response =  new Response(500,"ERR","Error occured while inserting",context).get();
                                }
                            }
                            else
                            {
                                response =  new Response(500,"ERR","Validation mail could not be sent",context).get();
                            }
                            
                        }
                        catch(err)
                        {
                            console.error(err);
                            response =  new Response(500,"ERR","Error occured while sending activation email",context).get();
                        }
                    }
                }
                catch(err)
                {
                    console.error(err);
                    response =  new Response(500,"ERR","Error occured while fetching user to check its existance",context).get();
                }
            }
        }
        catch (err)
        {
            console.error(err);
            response =  new Response(500,"ERR","Error occured while parsing body",context).get();
        }
    }

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}