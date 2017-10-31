# cloudformation-spike

Presumes you have the followign:

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
ruby bin/add_products_to_dynamo.rb TABLE_NAME
```




