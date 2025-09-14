
# Automated Docker Image Deployment to Amazon ECR with Jenkins and Lambda Integration

## Overview
This project automates the end-to-end process of building, tagging, and deploying Docker images to **Amazon Elastic Container Registry (ECR)** using **Jenkins**, with post-deployment tasks triggered by **AWS Lambda**. 

Once an image is pushed to ECR, **Amazon EventBridge** triggers a Lambda function, which logs metadata into **DynamoDB**, sends notifications via **SNS**, and stores metadata JSON files in **S3**.

---

## Architecture Diagram
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/5fc360ed-e048-4f4d-82b2-77ec9aaf3cad" />


## Workflow
1. **Source Code Management**: 
   - The application source code is stored in **GitHub**.
2. **Build Process**:
   - Jenkins pulls the latest code from GitHub.
   - Jenkins builds a Docker image and tags it with a meaningful version (e.g., Git commit hash).
3. **Deployment to ECR**:
   - Jenkins pushes the tagged Docker image to **Amazon ECR**.
4. **Triggering Post-Deployment Lambda**:
   - **Amazon EventBridge** detects the push event in ECR.
   - EventBridge triggers the **AWS Lambda function**.
5. **Lambda Function Tasks**:
   - Logs metadata of the image to **DynamoDB**.
   - Sends a notification to subscribers via **Amazon SNS**.
   - Stores a JSON metadata file in an **S3 bucket**.

---

## Deployment Steps

### **Step 1: AWS Setup**
- Create an **ECR Repository** (e.g., `my-node-app`).
- Create a **DynamoDB Table** named `ECRImageLogs` with `ImageTag` as the primary key.
- Create an **S3 bucket** for metadata storage (e.g., `ecr-image-metadata-<account_id>`).
- Create an **SNS topic** for notifications (e.g., `ECRImagePushTopic`).
- Configure **EventBridge Rule** to capture ECR image push events and trigger the Lambda function.

---

### **Step 2: Jenkins Setup**
1. Install the required plugins in Jenkins:
   - Docker Pipeline
   - AWS CLI / SDK plugins
2. Configure credentials:
   - AWS access key and secret key in Jenkins Credentials Manager.
   - GitHub credentials for source code access.
3. Create a **Jenkins Pipeline Job** with the following stages:
   - **Checkout Code** – Pull latest source code from GitHub.
   - **Build Docker Image** – `docker build -t my-node-app:<tag> .`
   - **Tag Image** – Tag the image for ECR repository.
   - **Push Image to ECR** – Push image to ECR repository.
   - **Cleanup** – Remove local images to save space.

---

### **Step 3: Lambda Setup**
- Runtime: **Node.js 22.x**
- Lambda Tasks:
  1. Receive event from EventBridge.
  2. Extract image details (repository, tag, timestamp).
  3. Insert metadata into **DynamoDB**.
  4. Publish notification to **SNS** topic.
  5. Store JSON metadata in **S3 bucket**.

---

### **Step 4: Testing the Flow**
1. Push code changes to GitHub.
2. Trigger Jenkins pipeline manually or via webhook.
3. Verify Docker image is pushed to **Amazon ECR**.
4. Check the following after Lambda execution:
   - **DynamoDB** → New record should exist.
   - **SNS Email** → Notification received.
   - **S3 Bucket** → Metadata JSON file present.

---

## Components

| Component      | Purpose |
|----------------|---------|
| **GitHub**     | Stores source code for the application. |
| **Jenkins**    | Automates build and deployment process. |
| **Amazon ECR** | Stores Docker images. |
| **EventBridge**| Detects image push events and triggers Lambda. |
| **AWS Lambda** | Handles post-deployment tasks. |
| **DynamoDB**   | Logs image metadata for tracking. |
| **SNS**        | Sends notifications to subscribers. |
| **S3**         | Stores JSON metadata for auditing. |

---

## Example Output

### **DynamoDB Entry**
```json
{
  "ImageTag": "v1.0.1",
  "Repository": "my-node-app",
  "Timestamp": "2025-09-13T12:34:56Z"
}
```

### **SNS Notification**
```
New Docker image pushed!
Repository: my-node-app
Tag: v1.0.1
Timestamp: 2025-09-13T12:34:56Z
```

### **S3 Metadata File**
`metadata/my-node-app-v1.0.1.json`
```json
{
  "repository": "my-node-app",
  "imageTag": "v1.0.1",
  "timestamp": "2025-09-13T12:34:56Z"
}
```

---

## Author
Developed by Aniket Dauskar  
Contact: aniketdauskar99@gmail.com  
LinkedIn: [Aniket Dauskar](https://linkedin.com/in/aniketdauskar)
