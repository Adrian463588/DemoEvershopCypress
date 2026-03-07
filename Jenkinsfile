pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'
    }

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
        ansiColor('xterm')
        quietPeriod(600)   // Jeda 10 menit setelah push, agar GitHub Actions selesai duluan
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
                echo "\033[34m[INFO]\033[0m ✅ Checked out commit: ${env.GIT_COMMIT}"
            }
        }

        // ── Stage 2: Install Dependencies ─────────────────
        stage('Install Dependencies') {
            steps {
                echo "\033[34m[INFO]\033[0m 📦 Checking tool versions..."
                sh 'node --version'
                sh 'npm --version'
                echo "\033[34m[INFO]\033[0m 📥 Running npm ci..."
                sh 'npm ci'
                sh 'npx allure-commandline --version || echo "allure-commandline will be used via npx"'
                echo "\033[32m[SUCCESS]\033[0m ✅ Dependencies installed"
            }
        }

        // ── Stage 3: Clean Previous Artifacts ─────────────
        stage('Clean Artifacts') {
            steps {
                echo "\033[33m[CLEAN]\033[0m 🧹 Removing previous artifacts..."
                sh "rm -rf ${ALLURE_RESULTS_DIR} || true"
                sh "rm -rf ${ALLURE_REPORT_DIR} || true"
                sh "mkdir -p ${ALLURE_RESULTS_DIR}"
                echo "\033[32m[SUCCESS]\033[0m ✅ Previous artifacts cleaned"
            }
        }

        // ── Stage 4: Run Cypress Tests ────────────────────
        stage('Run Cypress Tests') {
            steps {
                echo "\033[34m[INFO]\033[0m 🚀 Starting Cypress E2E tests..."
                sh "npx cypress run --browser electron --headless --env allure=true,allureResultsPath=${ALLURE_RESULTS_DIR}"
                echo "\033[32m[SUCCESS]\033[0m ✅ Cypress test execution complete"
            }
            post {
                success {
                    echo "\033[32m[SUCCESS]\033[0m ✅ All tests passed"
                }
                failure {
                    echo "\033[31m[FAILED]\033[0m ❌ Some tests failed — check screenshots"
                }
                always {
                    echo "\033[34m[INFO]\033[0m 📁 Archiving screenshots & videos..."
                    archiveArtifacts artifacts: 'cypress/screenshots/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/videos/**',      allowEmptyArchive: true
                }
            }
        }

        // ── Stage 5: Generate Allure Report ───────────────
        stage('Generate Allure Report') {
            steps {
                echo "\033[34m[INFO]\033[0m 📊 Generating Allure report..."
                sh "npx allure-commandline generate ${ALLURE_RESULTS_DIR} -o ${ALLURE_REPORT_DIR} --clean"
                echo "\033[32m[SUCCESS]\033[0m ✅ Allure report generated at ${ALLURE_REPORT_DIR}/index.html"
            }
        }

        // ── Stage 6: Publish Report ───────────────────────
        stage('Publish Report') {
            steps {
                echo "\033[34m[INFO]\033[0m 📤 Publishing report to Jenkins UI..."

                allure([
                    includeProperties: true,
                    jdk: '',
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: "${ALLURE_RESULTS_DIR}"]]
                ])

                publishHTML(target: [
                    allowMissing:          false,
                    alwaysLinkToLastBuild: true,
                    keepAll:               true,
                    reportDir:            "${ALLURE_REPORT_DIR}",
                    reportFiles:          'index.html',
                    reportName:           'Allure E2E Report'
                ])

                echo "\033[32m[SUCCESS]\033[0m ✅ Report published to Jenkins UI"
            }
        }
    }

    // ── Post Build Actions ─────────────────────────────────
    post {
        success {
            echo "\033[32m[SUCCESS]\033[0m 🟢 BUILD SUCCESS — ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            discordSend(
                title:       "✅ SUCCESS — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                description: """
**Job:** `${env.JOB_NAME}`
**Build:** `#${env.BUILD_NUMBER}`
**Commit:** `${env.GIT_COMMIT?.take(8)}`
**Duration:** `${currentBuild.durationString}`
📊 [Allure Report](${env.BUILD_URL}Allure_20E2E_20Report/)
🖥️ [Console Log](${env.BUILD_URL}console)
                """.stripIndent(),
                footer:     "Nightly Build — ${new Date().format('dd MMM yyyy, HH:mm')} WIB",
                link:       env.BUILD_URL,
                result:     'SUCCESS',
                thumbnail:  'https://www.jenkins.io/images/logos/jenkins/jenkins.png',
                webhookURL: env.DISCORD_WEBHOOK
            )
        }

        failure {
            echo "\033[31m[FAILED]\033[0m 🔴 BUILD FAILED — ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            discordSend(
                title:       "❌ FAILED — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                description: """
**Job:** `${env.JOB_NAME}`
**Build:** `#${env.BUILD_NUMBER}`
**Commit:** `${env.GIT_COMMIT?.take(8)}`
**Duration:** `${currentBuild.durationString}`
🔍 [Console Log](${env.BUILD_URL}console)
📊 [Allure Report](${env.BUILD_URL}Allure_20E2E_20Report/)
                """.stripIndent(),
                footer:     "Nightly Build — ${new Date().format('dd MMM yyyy, HH:mm')} WIB",
                link:       env.BUILD_URL,
                result:     'FAILURE',
                thumbnail:  'https://www.jenkins.io/images/logos/jenkins/jenkins.png',
                webhookURL: env.DISCORD_WEBHOOK
            )
        }

        unstable {
            echo "\033[33m[UNSTABLE]\033[0m 🟡 BUILD UNSTABLE — Ada test yang gagal"
            discordSend(
                title:       "⚠️ UNSTABLE — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                description: """
**Job:** `${env.JOB_NAME}`
**Build:** `#${env.BUILD_NUMBER}`
**Status:** Beberapa test case gagal
📊 [Lihat Detail di Allure](${env.BUILD_URL}Allure_20E2E_20Report/)
                """.stripIndent(),
                footer:     "Nightly Build — ${new Date().format('dd MMM yyyy, HH:mm')} WIB",
                link:       env.BUILD_URL,
                result:     'UNSTABLE',
                webhookURL: env.DISCORD_WEBHOOK
            )
        }

        always {
            echo "\033[34m[INFO]\033[0m 🧹 Cleaning workspace..."
            cleanWs()
        }
    }
}
