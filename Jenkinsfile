pipeline {
  agent any
  environment {
    REGISTRY = "docker.io/zzizi"
    IMAGE = "${REGISTRY}/mf-admin"   // ✅ admin 전용 이미지
    TAG = "latest"
    COMPOSE_DIR = "/home/ec2-user/app"  // web이랑 같은 compose dir
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Image') {
      steps {
        // ✅ 캐시 완전 초기화 후 새 빌드
        sh '''
        echo "🧹 Cleaning previous build cache..."
        rm -rf .next node_modules
        npm ci
        npm run build
        docker build -t $IMAGE:$TAG -f Dockerfile .
        '''
      }
    }

    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CRED',
          usernameVariable: 'U', passwordVariable: 'P')]) {
          sh '''
          echo "🔐 Logging into Docker Hub..."
          echo $P | docker login -u $U --password-stdin
          docker push $IMAGE:$TAG
          '''
        }
      }
    }

    stage('Deploy') {
      steps {
        sshagent(['fridge']) {
          sh '''
          echo "🚀 Deploying mf-admin to EC2..."
          ssh ec2-user@15.165.137.5 "
            cd $COMPOSE_DIR &&
            docker-compose pull admin &&
            docker-compose up -d admin
          "
          '''
        }
      }
    }
  }
}
