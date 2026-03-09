def getDiscordDescription(hasReport = true) {
    def reportLink = hasReport ? "📊 [Report](${env.BUILD_URL}allure/)  |  " : ""
    return "**Job:** ${env.JOB_NAME}\n**Build:** #${env.BUILD_NUMBER}\n**Commit:** `${env.GIT_COMMIT?.take(7) ?: 'N/A'}`\n**Duration:** ${currentBuild.durationString}\n${reportLink}📋 [Log](${env.BUILD_URL}console)"
}

def sendDiscord(status, titlePrefix, hasReport = true) {
    discordSend(
        title:       "${titlePrefix} — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        description: getDiscordDescription(hasReport),
        footer:      "Jenkins CI",
        link:        env.BUILD_URL,
        result:      status,
        thumbnail:   'https://www.jenkins.io/images/logos/jenkins/jenkins.png',
        webhookURL:  env.DISCORD_WEBHOOK
    )
}

pipeline {
    agent any

    environment {
        CYPRESS_BASE_URL   = 'https://demo.evershop.io'
        ALLURE_RESULTS_DIR = 'allure-results'
        MOCHAWESOME_DIR    = 'cypress/reports'
        DISCORD_WEBHOOK    = credentials('discord-webhook')
        TERM               = 'xterm'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds(abortPrevious: true)
        timestamps()
        ansiColor('xterm')
    }

    triggers {
        cron('TZ=Asia/Jakarta\n0 23 * * *')
        githubPush()
    }

    stages {

        stage('Checkout SCM') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Adrian463588/DemoEvershopCypress.git',
                    credentialsId: 'github-credentials'
                echo "\033[34m[INFO]\033[0m ✅ Commit: ${env.GIT_COMMIT?.take(7) ?: 'N/A'}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "\033[34m[INFO]\033[0m 📦 Tool versions"
                    node --version
                    npm --version
                '''
                echo "\033[34m[INFO]\033[0m 📥 Running npm ci..."
                sh 'npm ci'
                echo "\033[32m[SUCCESS]\033[0m ✅ Dependencies installed"
            }
        }

        stage('Clean Artifacts') {
            steps {
                sh """
                    echo "\033[33m[CLEAN]\033[0m 🧹 Removing previous artifacts..."
                    rm -rf ${ALLURE_RESULTS_DIR} ${MOCHAWESOME_DIR}
                    mkdir -p ${ALLURE_RESULTS_DIR}
                    echo "\033[32m[SUCCESS]\033[0m ✅ Artifacts cleaned"
                """
            }
        }

        stage('Run Cypress Tests') {
            steps {
                echo "\033[34m[INFO]\033[0m 🚀 Starting Cypress E2E tests..."
                warnError('⚠️ Some tests failed — build marked UNSTABLE') {
                    sh """
                        npx cypress run \
                            --browser electron \
                            --headless \
                            --env allure=true,allureResultsPath=${ALLURE_RESULTS_DIR}
                    """
                }
            }
        }

        stage('Publish HTML Reports') {
            steps {
                echo "\033[34m[INFO]\033[0m 📤 Publishing Mochawesome reports (if any)..."
                // Mochawesome HTML Report (if any)
                publishHTML(target: [
                    allowMissing:          true,
                    alwaysLinkToLastBuild: true,
                    keepAll:               true,
                    reportDir:             "${MOCHAWESOME_DIR}",
                    reportFiles:           'mochawesome_001.html',
                    reportName:            'Mochawesome Report'
                ])
                echo "\033[32m[SUCCESS]\033[0m ✅ Reports published"
            }
        }
    }

    post {
        always {
            // Native Jenkins Allure plugin processing (Generates and publishes securely)
            allure([
                includeProperties: false,
                jdk: '',
                properties: [],
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])

            archiveArtifacts artifacts: 'cypress/screenshots/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'cypress/videos/**',      allowEmptyArchive: true
            archiveArtifacts artifacts: "${ALLURE_RESULTS_DIR}/**",  allowEmptyArchive: true
            archiveArtifacts artifacts: "${MOCHAWESOME_DIR}/**",     allowEmptyArchive: true
        }

        success {
            echo "\033[32m[SUCCESS]\033[0m 🟢 BUILD SUCCESS"
            script {
                sendDiscord('SUCCESS', '✅ SUCCESS', true)
            }
        }

        unstable {
            echo "\033[33m[UNSTABLE]\033[0m 🟡 BUILD UNSTABLE"
            script {
                sendDiscord('UNSTABLE', '⚠️ UNSTABLE', true)
            }
        }

        failure {
            echo "\033[31m[FAILED]\033[0m 🔴 BUILD FAILED"
            script {
                sendDiscord('FAILURE', '❌ FAILED', false)
            }
        }

        cleanup {
            cleanWs(
                cleanWhenSuccess:  true,
                cleanWhenUnstable: true,
                cleanWhenFailure:  true,
                cleanWhenAborted:  true
            )
        }
    }
}