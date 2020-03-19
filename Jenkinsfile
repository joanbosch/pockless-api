pipeline {
  agent {
    node {
      label 'master'
    }

  }
  stages {
    stage('Build') {
      steps {
        sh 'cd functions && yarn install --pure-lockfile'
      }
    }

    stage('Test') {
      steps {
        sh 'cd functions && yarn test'
      }
    }

  }
}
