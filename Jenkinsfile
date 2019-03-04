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
							if (env.BRANCH_NAME == 'jenkis-update') {
								echo 'I only execute on the $BRANCH_NAME'
								} else {
									echo 'I execute elsewhere'
								}
						}
					}
				}
			}
