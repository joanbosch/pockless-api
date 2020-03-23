pipeline {
  agent {
    node {
      label 'master'
    }
  }

  options {
    timeout(time: 10, unit: 'MINUTES')
    timestamps()
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
