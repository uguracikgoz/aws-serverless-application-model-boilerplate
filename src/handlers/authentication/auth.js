const {User}        = require('../../models/user.js');
const {Response}    = require( process.env.AWS ? '/opt/nodejs/helpers' :'../../../layer/nodejs/helpers/');
/**
 * Auth service with jwt
*/

exports.main = async (event, context) => {

    var response;
    // All log statements are written to CloudWatch
    console.info('received:', event);

    if(event.httpMethod !== 'GET') {
        response =  new Response(500,"ERR","login only accept GET method, you tried:"+event.httpMethod,context).get(); 
    }
    else if(!event.hasOwnProperty('headers'))
    {
        console.info("UNSUCCESSFULL", "Access denied. No headers provided.");
        response =  new Response(401,"ERR","Access denied. No headers provided").get();
    }
    else if(!event.headers.hasOwnProperty('x-access-token') && !event.headers.hasOwnProperty('Authorization'))
    {
        console.info("UNSUCCESSFULL", "Access denied. No x-access-token or Authorization token provided");
        response =  new Response(401,"ERR","Access denied. No x-access-token or Authorization token provided.").get();
    }
    else
    {
        try {
            var token = event.headers.hasOwnProperty('x-access-token')?event.headers.x-access-token : event.headers.Authorization;
            token = token.replace('Bearer ', '');

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
                response =  new Response(200,"OK","Token is valid",{ user:user.getDecodedToken() }).get();
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
