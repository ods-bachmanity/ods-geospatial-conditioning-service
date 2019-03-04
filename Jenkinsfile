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
						if (BRANCH_NAME == 'jenkins-update') {
							withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'backmanity-conditioner-aws', variable: 'AWS_ACCESS_KEY_ID']]) {
								echo 'Deploying Feature...'
								sh 'npm run app-zip'
								sh 'mv GeospatialConditionerService.zip "GeospatialConditionerService_$BUILD_NUMBER"+_DEV.zip"'
								sh 'aws s3 cp "GeospatialConditionerService_$BUILD_NUMBER"+_DEV.zip" s3://ods-sa-t1-io/Bachmanity/coordinate-conditioner-service-files/'
								sh 'aws s3 ls s3://ods-sa-t1-io/Bachmanity/geospatial-conditioner-files/'
								} else if  (BRANCH_NAME == 'dev') {
									echo 'I execute elsewhere'
								}
							}
						}
					}
				}
			}
