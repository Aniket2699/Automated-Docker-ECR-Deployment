Project - 4
ECR Image Push Automation with Lambda, DynamoDB, SNS, and S3
This project automates the process of handling Docker image pushes to Amazon ECR using AWS EventBridge and AWS Lambda.
When a new image is pushed, it automatically:
1.	Logs metadata to DynamoDB
2.	Sends a notification via SNS
3.	Stores a JSON metadata file in S3
________________________________________
1. Architecture Diagram
Below is the high-level architecture:
 +-------------------+
| Jenkins Pipeline  |
| (Build & Push)    |
+--------+----------+
         |
         v
+----------------------------+
| Amazon ECR (Docker Images) |
+--------+-------------------+
         |
   Event Trigger
         |
         v
+-------------------+
| Amazon EventBridge|
| (ECR Image Action)|
+--------+----------+
         |
         v
+-------------------+
| AWS Lambda        |
| (Post-Deployment  |
| Automation)       |
+--------+----------+
   |           |           |
   |           |           |
   v           v           v
DynamoDB       SNS         S3
(Log Record)  (Email)  (Metadata JSON)

________________________________________
2. Deployment Steps
Step 1: Prerequisites
•	AWS Account
•	Jenkins server with:
o	Docker installed
o	AWS CLI installed and configured

•	IAM roles with required permissions for:
o	ECR
o	Lambda
o	DynamoDB
o	SNS
o	S3
o	EventBridge
________________________________________
Step 2: Create AWS Resources
a) Create ECR Repository
aws ecr create-repository --repository-name my-node-app
b) Create DynamoDB Table
•	Table Name: ECRImageLogs
•	Primary Key: ImageTag (String)
c) Create S3 Bucket
aws s3 mb s3://ecr-image-metadata-<account-id>
________________________________________
Step 3: Configure SNS Topic
1.	Create SNS topic:
2.	aws sns create-topic --name ECRImagePushTopic
3.	Subscribe your email:
4.	aws sns subscribe \
5.	  --topic-arn arn:aws:sns:us-east-1:<account-id>:ECRImagePushTopic \
6.	  --protocol email \
7.	  --notification-endpoint your-email@example.com
8.	Confirm the subscription from your email.
________________________________________


Step 4: Create Lambda Function
•	Runtime: Node.js 18.x or 20.x
•	Handler: index.handler
•	Attach a role with permissions:
o	DynamoDB full access
o	SNS publish
o	S3 write
o	CloudWatch logs
Lambda Code:
Refer to my github
________________________________________
Step 5: Configure EventBridge
•	Create a rule that triggers on ECR Image Push events:
o	Source: aws.ecr
o	Detail-Type: ECR Image Action
•	Target: Lambda function created above.
________________________________________
Step 6: Jenkins Pipeline
The file is on GitHub
________________________________________
3. Explanation of Each Component
Component	Purpose
Jenkins	Automates building and pushing Docker images to Amazon ECR.
Amazon ECR	Stores the Docker images.
Amazon EventBridge	Detects new image push events in ECR and triggers the Lambda function.
AWS Lambda	Executes serverless logic to update DynamoDB, send SNS alerts, and update S3.
DynamoDB	Maintains a record of all images pushed with timestamps.
SNS	Sends notifications whenever a new image is pushed.
S3	Stores JSON metadata files for historical and auditing purposes.
________________________________________

