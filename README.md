# cloudformation-spike

This repo includes an example of API that exposes the following endpoints:
- `GET products/` 
- `GET products/{id}` 
- `POST products/` 

Using:
- AWS Cloudformation Template using a AWS Serverless(SAM) transform
- AWS API Gateway specified with the Swagger/Open API Specification
- AWS DynamoDB (a single table)
- AWS CodeBuild & CodePipeline provisioned 

----

Run the tests with:
```
npm run jest
```

To run the tests locally I am testing against a local DynamoDB provisioned with [LocalStack](https://github.com/localstack/localstack). This allows for connect to a local version of DynamoDB for testing purposes at localhost:4569.

----

The project presumes you have the following ENV vars set locally for the AWS account on which you intend to run this.

```
AWS_ACCOUNT_ID (Your AWS account ID - i.e 111121323423)
AWS_REGION (The Region into which you want to deploy this project i.e. eu-west-1)
GITHUB_TOKEN (To enable AWS CodePipeline to access the repo.)
```

The scripts found in `bin` require that you have the `aws cli` tool installed & configured. This can be installed with Homebrew.
```
brew install awscli
```


Some helper scripts are included. You may need to provide executable permissions to them:

```
$ chmod +x bin/deploy_pipeline
```

Within this script you specify the parameter overrides for:

```
GitHubToken
Repository
Branch
Project
Configuration (current setup allows only staging or production options)
```


Returns all resources for the given stack:
```
$ bin/describe product-api
```


A helper script for populating some basic records in the created DynamoDB table:
```
bin/add_products_to_dynamo.rb product-api
```


Get the root path to your newly created api
```
bin/get_root_url product-api
```


-----

Get Item with AWS CLI
```
aws dynamodb get-item --table-name product-api-ProductsTable-1TTWCX7HUCYEY --key '{"id": {"S": "1"}}'
```

Put Item with AWS CLI
```
aws dynamodb put-item \
    --table-name product-api-ProductsTable-1TTWCX7HUCYEY \
    --item '{
		"id": { "S": "99" },
		"title": { "S": "Something" },
		"description": { "S": "XYZ" },
		"price": { "N": "123" } }'
```

Delete Stack
```
aws cloudformation delete-stack --role-arn $ROLE_ARN --stack-name $STACK_NAME
```
