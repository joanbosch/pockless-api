pipeline {
  agent {
    node {
      label 'node'
    }

  }
  stages {
    stage('Build') {
      steps {
        sh '''cd firebase
'''
        sh 'npm install'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }

  }
}