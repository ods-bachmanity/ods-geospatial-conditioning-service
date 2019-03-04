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

						if (BRANCH_NAME == 'jenkins-update') {
								steps {
			             echo 'inside jenkins $BRANCH_NAME'
								 }
							 }
						 if (BRANCH_NAME == 'dev') {
							 	steps {
									echo 'I execute elsewhere'
								}
							}
						}
					}
				}
