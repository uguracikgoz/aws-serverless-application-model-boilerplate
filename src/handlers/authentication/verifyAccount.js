const {User}        = require('../../models/user');
const {Response}    = require( process.env.AWS ? '/opt/nodejs/helpers' :'../../../layer/nodejs/helpers/');
/**
 * Activation service with jwt for new users
*/
exports.main = async (event, context) => {

    var response;
    // All log statements are written to CloudWatch
    console.info('received:', event);

    if(event.httpMethod !== 'GET') {
        response =  new Response(500,"ERR","this only accepts GET method, you tried:"+event.httpMethod,context).get(); 
    }
    else if(!event.hasOwnProperty('pathParameters'))
    {
        console.info("UNSUCCESSFULL", "Access denied. No token provided. Missing queryStringParameters");
        response =  new Response(401,"ERR","Access denied. No token provided").get();
    }
    else if(event.pathParameters.hasOwnProperty("token") == false)
    {
        console.info("UNSUCCESSFULL", "Access denied. No token provided on url");
        response =  new Response(401,"ERR","Access denied. No token provided on url.").get();
    }
    else
    {
        try {
            var token = event.pathParameters.token;
            
            var user = new User();
            user.setToken(token);
            
            user.decodeToken();


            if( user.checkTokenExpired() )
            {
                console.info("ERR", "Provided token has got expired");
                response =  new Response(401,"UNSUCCESSFULL","Provided token has got expired").get();
            }
            else
            {
                console.info("SUCCESSFULL", user.getDecodedToken() );
                user.setId(user.getDecodedToken().params.id);
                user.setEmail(user.getDecodedToken().params.email);
                user.setCompanyId(user.getDecodedToken().params.companyId);
                user.setVerificationStatus(user.getDecodedToken().params.verificationStatus);
                delete user.decodedToken;
                try
                {
                    let result = await user.verify();
                    delete user.password;
                    delete user.verificationStatus;
                    console.info("result",result);
                    response =  new Response(200,"OK","Account has got activated",{ user:user }).get();
                }
                catch(err)
                {
                    console.error(err);
                    response =  new Response(500,"ERR","An error occured",context).get();
                }
            }
        }
        catch (err)
        {
            //if invalid token
            console.error(err);
            response =  new Response(400,"ERR","Access denied. Invalid token provided").get();
        }
    }

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
