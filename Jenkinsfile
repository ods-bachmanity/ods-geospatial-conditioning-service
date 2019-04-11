pipeline {
    agent any
    options { timestamps () }

    stages {


    stage('Clean') {
        steps {
            echo 'Cleaning..'
            sh 'rm -rf node_modules'
						sh 'rm -rf app/node_modules'
            sh 'rm -rf logs'
            sh 'rm -rf GeospatialConditionerService*.zip'
        }
    }
        stage('Build') {
            steps {
                echo 'Building..'
								sh 'npm config set registry https://registry.npmjs.com/'
								sh 'cd app && npm install'
								sh 'npm install'
                sh 'npm run tsc-version'
                sh 'npm run tsc-build'
                sh 'ls -l app/'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
								sh 'npm run happy-path-tests'
								sh 'npm run bad-path-tests'
            }
        }
        stage('Deploy-Feature') {
        when {
        branch 'jenkins-ec2-com'
        }
            steps {
            withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'backmanity-conditioner-aws', variable: 'AWS_ACCESS_KEY_ID']]) {
                   echo 'Deploying feature branch....'
                   sh 'npm run app-zip'
                   sh 'mv GeospatialConditionerService.zip "GeospatialConditionerService_feature_$BUILD_NUMBER.zip"'
                   sh 'aws s3 cp "GeospatialConditionerService_feature_$BUILD_NUMBER.zip" s3://ods-sa-t1-io/Bachmanity/geospatial-conditioner-files/'
                   sh 'aws s3 ls s3://ods-sa-t1-io/Bachmanity/geospatial-conditioner-files/'
									 sh '''
									 output=$(aws ec2 describe-instances --filters "Name=tag:aws:cloudformation:stack-id,Values=arn:aws:cloudformation:us-east-1:045627890776:stack/Bachmanity-geospatial-conditioning-service-01/8f9ce780-33b6-11e9-b55e-0e194fb09f5c" --query "Reservations[].Instances[].InstanceId")
									 output=`echo "$output" | awk -F'"' '{print $2}'`
									 aws ec2 terminate-instances --instance-ids $output
									 '''
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
									 sh '''
									 output=$(aws ec2 describe-instances --filters "Name=tag:aws:cloudformation:stack-id,Values=arn:aws:cloudformation:us-east-1:045627890776:stack/Bachmanity-geospatial-conditioning-service-01/8f9ce780-33b6-11e9-b55e-0e194fb09f5c" --query "Reservations[].Instances[].InstanceId")
									 output=`echo "$output" | awk -F'"' '{print $2}'`
									 aws ec2 terminate-instances --instance-ids $output
									 '''
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
									 sh '''
									 output=$(aws ec2 describe-instances --filters "Name=tag:aws:cloudformation:stack-id,Values=arn:aws:cloudformation:us-east-1:045627890776:stack/Bachmanity-geospatial-conditioning-service-01/8f9ce780-33b6-11e9-b55e-0e194fb09f5c" --query "Reservations[].Instances[].InstanceId")
									 output=`echo "$output" | awk -F'"' '{print $2}'`
									 aws ec2 terminate-instances --instance-ids $output
									 '''
							 }
						}
				}
    }
}
