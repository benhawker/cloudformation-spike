# cloudformation-spike

This repo includes an example of a products API that exposes a single `GET products/` endpoint.

Using:
- AWS Cloudformation Template using a AWS Serverless(SAM) transform
- AWS API Gateway specified with the Swagger/Open API Specification
- AWS DynamoDB (a single table)
- 

The project presumes you have the following ENV vars set for the AWS account on which you intend to run this.

```
AWS_ACCOUNT_ID
AWS_REGION
```

The scripts found in `bin` require that you have the `aws cli` tool installed. This can be installed with Homebrew.
```
brew install awscli
```


Some helper scripts are included. You may need to provide executable permissions to them:

```
$ chmod +x bin/deploy
```


Interpolate your templates & deploy your stack.
```
$ bin/deploy your-stack-name
```


Delete the stack:
```
$ bin/delete your-stack-name
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




