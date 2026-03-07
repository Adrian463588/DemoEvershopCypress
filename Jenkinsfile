pipeline {
    agent any

    environment {
        CYPRESS_BASE_URL   = 'https://demo.evershop.io'
        ALLURE_RESULTS_DIR = 'allure-results'
        ALLURE_REPORT_DIR  = 'allure-report'
        DISCORD_WEBHOOK    = credentials('discord-webhook')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
    }

    triggers {
        cron('0 23 * * *')
        githubPush()
    }

    stages {
        // ── Stage 1: Checkout ──────────────────────────────
        stage('Checkout SCM') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Adrian463588/DemoEvershopCypress.git',
                    credentialsId: 'github-credentials'
                echo "Checked out commit: ${env.GIT_COMMIT}"
            }
        }

        // ── Stage 2: Install Dependencies ─────────────────
        stage('Install Dependencies') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
                sh 'npx allure-commandline --version || echo "allure-commandline will be used via npx"'
                echo 'Dependencies installed'
            }
        }

        // ── Stage 3: Clean Previous Artifacts ─────────────
        stage('Clean Artifacts') {
            steps {
                sh "rm -rf ${ALLURE_RESULTS_DIR} || true"
                sh "rm -rf ${ALLURE_REPORT_DIR} || true"
                sh "mkdir -p ${ALLURE_RESULTS_DIR}"
                echo 'Previous artifacts cleaned'
            }
        }

        // ── Stage 4: Run Cypress Tests ────────────────────
        stage('Run Cypress Tests') {
            steps {
                sh "npx cypress run --browser chrome --headless --env allure=true,allureResultsPath=${ALLURE_RESULTS_DIR}"
                echo 'Cypress test execution complete'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'cypress/screenshots/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/videos/**', allowEmptyArchive: true
                }
            }
        }

        // ── Stage 5: Generate Allure Report ───────────────
        stage('Generate Allure Report') {
            steps {
                sh "npx allure-commandline generate ${ALLURE_RESULTS_DIR} -o ${ALLURE_REPORT_DIR} --clean"
                echo 'Allure report generated'
            }
        }

        // ── Stage 6: Publish Report ───────────────────────
        stage('Publish Report') {
            steps {
                allure([
                    includeProperties: true,
                    jdk: '',
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: "${ALLURE_RESULTS_DIR}"]]
                ])
                publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: "${ALLURE_REPORT_DIR}",
                    reportFiles: 'index.html',
                    reportName: 'Allure E2E Report'
                ])
                echo 'Report published to Jenkins UI'
            }
        }
    }

    post {
        success {
            echo 'BUILD SUCCESS'
            discordSend(
                title: "SUCCESS - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                description: "Build berhasil. Lihat report di ${env.BUILD_URL}",
                footer: "Jenkins CI",
                link: env.BUILD_URL,
                result: 'SUCCESS',
                webhookURL: env.DISCORD_WEBHOOK
            )
        }
        failure {
            echo 'BUILD FAILED'
            discordSend(
                title: "FAILED - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                description: "Build gagal. Cek log di ${env.BUILD_URL}console",
                footer: "Jenkins CI",
                link: env.BUILD_URL,
                result: 'FAILURE',
                webhookURL: env.DISCORD_WEBHOOK
            )
        }
        unstable {
            echo 'BUILD UNSTABLE'
            discordSend(
                title: "UNSTABLE - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                description: "Beberapa test gagal. Lihat report di ${env.BUILD_URL}",
                footer: "Jenkins CI",
                link: env.BUILD_URL,
                result: 'UNSTABLE',
                webhookURL: env.DISCORD_WEBHOOK
            )
        }
        always {
            cleanWs()
        }
    }
}
