# cloudformation-spike

This repo includes an example of a products API that exposes a single `GET products/` endpoint.

Using:
- AWS Cloudformation Template using a AWS Serverless(SAM) transform
- AWS API Gateway specified with the Swagger/Open API Specification
- AWS DynamoDB (a single table)
- 

The project presumes you have the following ENV vars set locally for the AWS account on which you intend to run this.

```
AWS_ACCOUNT_ID (Your AWS account ID - i.e 111121323423)
AWS_REGION (The Region into which you want to deploy this project i.e. eu-west-1)
GITHUB_TOKEN (To enable access to the repo.)
SLACK_PATH (The path to the Slack Webhook you have setup to receive your alerts).

```

The scripts found in `bin` require that you have the `aws cli` tool installed. This can be installed with Homebrew.
```
brew install awscli
```


Some helper scripts are included. You may need to provide executable permissions to them:

```
$ chmod +x bin/deploy_pipeline
```

Within this script you scpecify the parameter overrides for:

```
GitHubToken
Repository
Branch
Project
Configuration (current setup allows only staging or production options)
```


Returns all resources for the given stack:
```
$ bin/describe your-stack-name 
```


A helper script for populating some basic records in the created DynamoDB table:
```
ruby bin/add_products_to_dynamo.rb your-stack-name
```


Get the root path to your newly created api
```
bin/get_root_url your-stack-name
```




