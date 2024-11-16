def alljob = JOB_NAME.tokenize('/') as String[]
def proj_name = alljob[1]

pipeline {
    agent any
    tools {
            nodejs "node"
    }
    triggers {
          bitbucketPush()
    }
    environment 
    {
        ECRURL = 'https://874223318686.dkr.ecr.ap-southeast-1.amazonaws.com'
        AWS_REGION = 'ap-southeast-1'
        APP_NAME = "$JOB_NAME"
        
    }    
    stages {
        stage('Print Env') {
            steps {
                script {
                    currentBuild.displayName = "${BUILD_NUMBER}-${BRANCH_NAME}"
                    env.appName="${proj_name}"
                    echo "AppName is ${env.appName}"
                }

            }
        }
        /*stage('npm build') {
            agent { docker 
                    { 
                        image 'node:14.16.1-alpine'
                        args '-u root:root' 
                    } 
            }
            steps {
                sh '''
                npm install
                npm run build
                '''
            }
        }*/
        stage('Docker Building') {
            parallel {
                stage('Build with Tag') {
                    when {
                        //branch 'production'
                        anyOf {
                            branch '**/feature-*'
                            branch '**/release-*'
                        }
                        beforeAgent true
                    }
                    steps {
                        script {
                        def buildimage = docker.build("${env.appName}:${env.BRANCH_NAME}-latest")
                        }
                    }
                }
                stage('Build with Tag Latest') {
                    when {
                        //branch 'production'
                        anyOf {
                            branch '**/feature-*'
                            branch '**/release-*'
                        }
                        beforeAgent true
                    }
                    steps {
                        script {
                        def buildimage = docker.build("${env.appName}:${env.BRANCH_NAME}-${env.BUILD_ID}")
                        }
                    }
                }                
            }
        }
        stage ('ECR Push') {
            when {
                        //branch 'production'
                anyOf {
                    branch '**/feature-*'
                    branch '**/release-*'
                }
                beforeAgent true
            }
            steps {
                withAWS(region: AWS_REGION, role: 'Jenkins_ecr_role') {
                    script {
                        sh "set +x; ${ecrLogin()}"
                        docker.withRegistry(ECRURL) {
                            docker.image("${env.appName}:${env.BRANCH_NAME}-${env.BUILD_ID}").push()
                        }
                        docker.withRegistry(ECRURL) {
                            docker.image("${env.appName}:${env.BRANCH_NAME}-latest").push()
                        }
                    }
                }
            }
        }
    }
}