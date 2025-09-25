pipeline {
  agent any
  environment {
    REGISTRY = "docker.io/zzizi"
    IMAGE = "${REGISTRY}/mf-admin"   // ✅ admin 전용 이미지
    TAG = "latest"
    COMPOSE_DIR = "/home/ec2-user/app"  // web이랑 같은 compose dir 쓰는지 확인!
  }
  stages {
    stage('Checkout'){ steps { checkout scm } }
    stage('Build Image'){ steps { sh 'docker build -t $IMAGE:$TAG -f Dockerfile.admin .' } }
    stage('Push Image'){
      steps {
        withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CRED',
          usernameVariable: 'U', passwordVariable: 'P')]) {
          sh 'echo $P | docker login -u $U --password-stdin'
          sh 'docker push $IMAGE:$TAG'
        }
      }
    }
    stage('Deploy'){
      steps {
        sshagent(['fridge']) {
          sh '''
          ssh ec2-user@15.165.137.5 "
            cd $COMPOSE_DIR &&
            docker-compose pull admin &&      # ✅ docker-compose.yml 안에 service 이름이 admin 이어야 함
            docker-compose up -d admin
          "
          '''
        }
      }
    }
  }
}
