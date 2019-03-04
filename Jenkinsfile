pipeline {
    agent any
    options { timestamps () }

    stages {


    stage('Clean') {
        steps {
            echo 'Cleaning..'
            sh 'rm -rf node_modules'
            sh 'rm -rf logs'
            sh 'rm -rf GeospatialConditionerService*.zip'
        }
    }
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'npm install'
                sh 'npm run tsc-version'
                sh 'npm run tsc-build'
                sh 'ls -l app/'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
        steps {
        script {
        if (env.BRANCH_NAME == 'jenkins-update') {
        echo 'I only execute on the master branch'
        } else {
        echo 'I execute elsewhere'
        }
        }
            }
          }
        }
    }
}
