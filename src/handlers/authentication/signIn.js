const {User}        = require('../../models/user');
const {Response}    = require( process.env.AWS ? '/opt/nodejs/helpers' :'../../../layer/nodejs/helpers/');
/**
 * The signUp function
 */
exports.main = async (event, context) => {

    var response;
    // All log statements are written to CloudWatch
    console.info('received:', event);

    if (event.httpMethod !== 'POST') {
        response =  new Response(500,"ERR","this only accept POST method, you tried:"+event.httpMethod,context).get();
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
            if(!body.hasOwnProperty("email") || !body.hasOwnProperty("password"))
            {
                console.info("UNSUCCESSFULL", "Missing parameters : email or password");
                response =  new Response(400,"ERR","Missing parameters : email or password").get();
            }
            else
            {
                var user = new User();
                user.setEmail(body.email); 
                try
                { 
                    var fetchedUser = await user.getWithEmail();
                    console.log("fetchedUser",fetchedUser);
                    if(fetchedUser.Count == 1)
                    {
                        fetchedUser.Item = fetchedUser.Items[0];
                        var result = await user.checkPassword(body.password,fetchedUser.Item.password);
                        console.info("checkPassword",result);
                        if(result)
                        {
                            delete user.password; // remove password field before it got hashed on jwt in case of anything
                            user.setId(fetchedUser.Item.id);
                            user.setCompanyId(fetchedUser.Item.companyId);
                            user.setVerificationStatus(fetchedUser.Item.verificationStatus);
    
                            switch(user.verificationStatus)
                            {
                                case user.getVerificationTypes().verified:
                                    user.generateToken();
                                    console.info("SUCCESSFULL", "User signedIn");
                                    response =  new Response(200,"OK","SUCCESSFULL",{token:user.getToken()}).get();
                                break;
                                case user.getVerificationTypes().waiting:
                                    console.info("UNSUCCESSFULL", "Account should be verified first");
                                    response =  new Response(401,"ERR","Please check your mail inbox to verify the account").get();
                                break;
                                case user.getVerificationTypes().passive:
                                    console.info("UNSUCCESSFULL", "Account has got deleted, its passive now");
                                    response =  new Response(401,"ERR","The account is deleted").get();
                                break;
                                default:
                                    console.error("User status switch case droped into default! Please check userstatuses enum");
                                    response =  new Response(500,"ERR","TUnknown error occured",context).get();
                                break;
                            }
                        }
                        else
                        {
                            console.info("UNSUCCESSFULL", "Email or password is wrong");
                            response =  new Response(401,"ERR","Email or password is wrong").get();
                        }
    
                    }
                    else
                    {
                        console.info("UNSUCCESSFULL", "No such an account with given information");
                        response =  new Response(400,"ERR","No such a user found with given information").get();
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