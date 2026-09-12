pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'development', credentialsId: 'gitlab-token-mithil', url: 'https://git.zerozone.com/ace-infoway/cheta-pandya/hospitality.git'
            }
        }

        stage('Run Web Server') {
            steps {
                // bat 'start /B python -m http.server 8001 --bind 0.0.0.0'

                bat 'call python -m http.server 8001 --bind 0.0.0.0'
            }
        }
    }
}
