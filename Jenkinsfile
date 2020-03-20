pipeline {
  agent {
    node {
      label 'master'
    }

  }
  stages {
    stage('Build') {
      steps {
        sh 'cd functions && npm install'
      }
    }

    stage('Test') {
      steps {
        sh 'cd functions && npm test'
      }
    }

  }
}
