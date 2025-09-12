pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = "us-east-1"
        ECR_REGISTRY = "124931565674.dkr.ecr.us-east-1.amazonaws.com"
        ECR_REPO = "my-node-app"
        IMAGE_TAG = "${env.BUILD_NUMBER}"   // Use Jenkins build number
    }

    stages {
        stage('Checkout Code') {
            steps {
                git credentialsId: 'github-creds', url: 'https://github.com/Aniket2699/mynodeapp.git', branch: 'master'
            }
        }

        stage('Login to AWS ECR') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
                    sh '''
                        echo "Logging into Amazon ECR..."
                        aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "Building Docker image..."
                    docker build -t $ECR_REPO:$IMAGE_TAG .
                '''
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh '''
                    echo "Tagging Docker image for ECR..."
                    docker tag $ECR_REPO:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPO:$IMAGE_TAG
                '''
            }
        }

        stage('Push to Amazon ECR') {
            steps {
                sh '''
                    echo "Pushing Docker image to Amazon ECR..."
                    docker push $ECR_REGISTRY/$ECR_REPO:$IMAGE_TAG
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                    echo "Cleaning up local Docker images..."
                    docker rmi $ECR_REPO:$IMAGE_TAG || true
                    docker rmi $ECR_REGISTRY/$ECR_REPO:$IMAGE_TAG || true
                '''
            }
        }
    }

    post {
        success {
            echo "Build and push successful! Image: $ECR_REGISTRY/$ECR_REPO:$IMAGE_TAG"
        }
        failure {
            echo "Build failed. Check logs for details."
        }
    }
}
