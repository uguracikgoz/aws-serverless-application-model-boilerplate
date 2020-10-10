'use strict'; 
const tableName = process.env.TABLE;

const bcrypt    = require( 'bcrypt' );
const uuid      = require('uuid');
const aws = require('aws-sdk');
const docClient = new aws.DynamoDB.DocumentClient({
    "sslEnabled": false,
    "paramValidation": false,
    "convertResponseTypes": false
});

const {verificationTypes} = require('../../dependencies/nodejs/enums');
const UserToken      = require('./token.js');

class User
{
    id;
    email;
    password;
    companyId;
    verificationStatus;
    token;
    decodedToken;
    activationToken;
    createdAt;
    verifiedAt;
    updatedAt;

    constructor(id,email,password,companyId,verificationStatus)
    {
        this.id                 = id?id:uuid.v1();
        this.email              = email?email:"";
        this.password           = password?bcrypt.hashSync( password, 10 ):"";
        this.companyId          = companyId?companyId:"";
        this.verificationStatus = verificationStatus?verificationStatus: verificationTypes.waiting; // { 'W' : 'Waiting to be verified', 'V' : 'Verified', 'P' : 'Passive' }
    }

    async get()
    {
        var params = 
        {
            TableName : tableName,
            Key: 
            {
                "email":this.email,
                "companyId":this.companyId
            }
        };
        return await docClient.get(params).promise();
    }
    
    async put()
    {
        this.setCreatedAt();
        console.info("PUT",JSON.stringify(this));
        var params =
        {
            TableName : tableName,
            Item: this
        };
        return await docClient.put(params).promise();
    }

    async verify()
    {
        this.setUpdatedAt();
        this.setVerifiedAt();
        const params = {
            TableName: tableName,
            Key: {
                "email": this.email,
                "companyId":this.companyId
            },
            UpdateExpression: "set verificationStatus = :verificationStatus, verifiedAt = :verifiedAt",
            ExpressionAttributeValues: {
                ":verificationStatus":verificationTypes.verified,
                ":verifiedAt":this.getVerifiedAt()
            }
        };
        console.info("params",params);
        return await docClient.update(params).promise();
    }

    async getWithEmail()
    {
        var params = {
                TableName: tableName,
                KeyConditionExpression: "#email = :email",
                ExpressionAttributeNames:{
                    "#email": "email"
                },
                ExpressionAttributeValues: {
                    ":email":this.email
                }
            };
        return await docClient.query(params).promise();
    }

    async checkPassword(readable,hashed)
    { 
        return bcrypt.compareSync( readable, hashed );
    }

    generateToken()
    {
        var token = new UserToken(this).sign();
        this.setToken(token);
    }

    decodeToken()
    {
        var decodedToken = new UserToken(this).decode(this.token);
        this.setDecodedToken(decodedToken);
        return decodedToken;
    }

    checkTokenExpired()
    {
        var decodedToken = new UserToken(this).isExpired(this.decodedToken);
        return decodedToken; 
    }
    
    getId()
    {
        return this.id;
    }

    setId(id)
    {
        this.id = id;
    }

    getEmail()
    {
        return this.email;
    }

    setEmail(email)
    {
        this.email = email;
    }

    getPassword()
    {
        return this.password;
    }

    setPassword(password)
    {
        this.password = bcrypt.hashSync( password, 10 );
    }

    getCompanyId()
    {
        return this.companyId;
    }

    setCompanyId(companyId)
    {
        this.companyId = companyId;
    }

    getverificationStatus()
    {
        return this.verificationStatus;
    }

    getVerificationTypes()
    {
        return verificationTypes;
    }

    setVerificationStatus(verificationType)
    {
        this.verificationStatus = verificationType;
    }

    getToken()
    {
        return this.token;
    }

    setToken(token)
    {
        this.token = token;
    }

    getDecodedToken()
    {
        return this.decodedToken;
    }

    setDecodedToken(decodedToken)
    {
        this.decodedToken = decodedToken;
    }

    getCreatedAt()
    {
        return this.createdAt;
    }

    setCreatedAt()
    {
        this.createdAt = new Date().getTime();
    }

    getVerifiedAt()
    {
        return this.verifiedAt;
    }

    setVerifiedAt()
    {
        this.verifiedAt = new Date().getTime();
    }

    getUpdatedAt()
    {
        return this.updatedAt;
    }

    setUpdatedAt()
    {
        this.updatedAt = new Date().getTime();
    }
}
module.exports =  { User }