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
								sh 'cd app && npm install'
								sh 'pwd'
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
        stage('Deploy-Feature') {
        when {
        branch 'jenkins-update'
        }
            steps {
            withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'backmanity-conditioner-aws', variable: 'AWS_ACCESS_KEY_ID']]) {
                   echo 'Deploying feature branch....'
                   sh 'npm run app-zip'
                   sh 'mv GeospatialConditionerService.zip "GeospatialConditionerService_feature_$BUILD_NUMBER.zip"'
                   sh 'aws s3 cp "GeospatialConditionerService_feature_$BUILD_NUMBER.zip" s3://ods-sa-t1-io/Bachmanity/geospatial-conditioner-files/'
                   sh 'aws s3 ls s3://ods-sa-t1-io/Bachmanity/geospatial-conditioner-files/'

               }
            }
        }
				stage('Deploy-Dev') {
				when {
				branch 'dev'
				}
						steps {
						withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'backmanity-conditioner-aws', variable: 'AWS_ACCESS_KEY_ID']]) {
									 echo 'Deploying dev branch....'
									 sh 'npm run app-zip'
									 sh 'mv GeospatialConditionerService.zip "GeospatialConditionerService_dev_$BUILD_NUMBER.zip"'
									 sh 'aws s3 cp "GeospatialConditionerService_dev_$BUILD_NUMBER.zip" s3://ods-sa-t1-io/Bachmanity/geospatial-conditioner-files/'
									 sh 'aws s3 ls s3://ods-sa-t1-io/Bachmanity/geospatial-conditioner-files/'

							 }
						}
				}
				stage('Deploy-Master') {
				when {
				branch 'master'
				}
						steps {
						withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'backmanity-conditioner-aws', variable: 'AWS_ACCESS_KEY_ID']]) {
									 echo 'Deploying master branch....'
									 sh 'npm run app-zip'
									 sh 'mv GeospatialConditionerService.zip "GeospatialConditionerService_master_$BUILD_NUMBER.zip"'
									 sh 'aws s3 cp "GeospatialConditionerService__master_$BUILD_NUMBER.zip" s3://ods-sa-t1-io/Bachmanity/geospatial-conditioner-files/'
									 sh 'aws s3 ls s3://ods-sa-t1-io/Bachmanity/geospatial-conditioner-files/'

							 }
						}
				}
    }
}
