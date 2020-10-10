# aws-serverless-application-model-boilerplate
AWS-SAM serverless application model boilerplate with lambda functions

a super fast getting started *module as a project* for a new project.

Project has one dynomodb table defined in template.yaml, auth functions(signIn,auth,signUp,verifyAccount,resetPassword) and some libraries to be used unified per each projects.

authentication layer works for each new project you want to build up. The only thing is to do is define new template.yaml file. For instance, you might get started with your new projects including this super basic auth application by editing this lines on template.yaml :

# Getting started
1.Description : project description to understand further on<br>
2.userstable->Properties->TableName : change table name for new project <br>
3.PrivKey->Default : optionally you might change private key for jwt tokens<br>
4.JwtAlgorithm->Default : optionally you might change your jwt encryption algorithm<br>
5.ExpireMins->Default : optionally you might change your expiration time for your security tokens<br>
6.BaseUrl->Default : You might set your base url if you use domain name linked with your lambda project. That might be filled with you lambda application url as well. This is used while sending an activation email to your users after they sign up.<br>
7.MsTeamsWebhookForAlerts-> Default : You should place your "Incoming Webhook"s Webhook url on microsoft teams. You can basically add "connector" on to your microsoft teams "team". You can also write your own other channel classes to send your 500 error alerts to a spesific channel. It is on alertSender folder.<br>
8.JiraProjectUrl-> Default : You can set your own jira link to create "open bug report on jira" button on MSTEAMS alert message.

# Building and deployment
Install and build sam aws cli first and configure your credentials<br>
RUN aws sam build<br>
RUN aws sam --guided ( guided allows you to your own lambda configurations, you don't have to run with --guided all the the time. Run once to let it create samconfig.toml. It is included on project but you should pick your own configurations for setting up region etc.. Setting up correct region is important. Otherwise you might not get project on correct region )

# NOTES :
1.Please note that you should set your own email configurations on AWS-SES : https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-set-up.html<br>
2.All dependencies are stored on *layer*. Until now, AWS-SAM CLI has no option for incremental deployment. So to decrease building execution time, what we do is to run npm install on dependencies/nodejs, zip the folder ( we have it already, you might consider that to figure out how to do ) and remove dependencies from package.json and node-modules from dependencies/nodejs

