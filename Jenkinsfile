pipeline {
    agent any

    // ── Tool Versions ──────────────────────────────────────
    tools {
        nodejs 'NodeJS-20'   // Match name in Global Tool Config
    }

    // ── Environment Variables ──────────────────────────────
    environment {
        CYPRESS_BASE_URL    = 'https://demo.evershop.io'
        ALLURE_RESULTS_DIR  = 'allure-results'
        ALLURE_REPORT_DIR   = 'allure-report'
        // Credentials from Jenkins Credential Store
        CYPRESS_USERNAME    = credentials('evershop-username')
        CYPRESS_PASSWORD    = credentials('evershop-password')
    }

    // ── Build Options ──────────────────────────────────────
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
    }

    // ── Triggers ───────────────────────────────────────────
    triggers {
        // Nightly build at 23:00
        cron('0 23 * * *')
        // Webhook from GitHub (optional, requires GitHub plugin)
        githubPush()
    }

    stages {

        // ── Stage 1: Checkout ──────────────────────────────
        stage('Checkout SCM') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Adrian463588/DemoEvershopCypress.git',
                    credentialsId: 'github-credentials'
                echo "✅ Repository checked out: ${env.GIT_COMMIT}"
            }
        }

        // ── Stage 2: Install Dependencies ─────────────────
        stage('Install Dependencies') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
                sh 'npm install -g allure-commandline'
                echo "✅ Dependencies installed"
            }
        }

        // ── Stage 3: Clean Previous Results ───────────────
        stage('Clean Artifacts') {
            steps {
                sh '''
                    rm -rf ${ALLURE_RESULTS_DIR} || true
                    rm -rf ${ALLURE_REPORT_DIR}  || true
                    mkdir -p ${ALLURE_RESULTS_DIR}
                '''
                echo "✅ Previous artifacts cleaned"
            }
        }

        // ── Stage 4: Run Cypress Tests ─────────────────────
        stage('Run Cypress Tests') {
            steps {
                sh '''
                    npx cypress run \
                        --browser chrome \
                        --headless
                '''
            }
            post {
                always {
                    // Archive screenshots & videos
                    archiveArtifacts artifacts: 'cypress/screenshots/**',
                                     allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/videos/**',
                                     allowEmptyArchive: true
                }
            }
        }

        // ── Stage 5: Generate Allure Report ───────────────
        stage('Generate Allure Report') {
            steps {
                sh '''
                    allure generate ${ALLURE_RESULTS_DIR} \
                           -o ${ALLURE_REPORT_DIR} --clean
                '''
                echo "✅ Allure report generated"
            }
        }

        // ── Stage 6: Publish Report ────────────────────────
        stage('Publish Report') {
            steps {
                // Publish via Allure Jenkins Plugin
                allure([
                    includeProperties: true,
                    jdk: '',
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'allure-results']]
                ])

                // Fallback: Publish via HTML Publisher
                publishHTML(target: [
                    allowMissing:          false,
                    alwaysLinkToLastBuild: true,
                    keepAll:               true,
                    reportDir:            "${ALLURE_REPORT_DIR}",
                    reportFiles:          'index.html',
                    reportName:           'Allure E2E Report'
                ])

                echo "✅ Report published to Jenkins"
            }
        }
    }

    // ── Post Build Actions ─────────────────────────────────
    post {
        success {
            echo "🟢 BUILD SUCCESS — All tests passed"
            emailext(
                subject: "✅ [SUCCESS] Cypress E2E - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    Build berhasil!
                    Job     : ${env.JOB_NAME}
                    Build   : #${env.BUILD_NUMBER}
                    URL     : ${env.BUILD_URL}
                    Commit  : ${env.GIT_COMMIT}
                """,
                to: 'qa-team@yourcompany.com'
            )
        }
        failure {
            echo "🔴 BUILD FAILED — Test failures detected"
            emailext(
                subject: "❌ [FAILURE] Cypress E2E - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    Build GAGAL! Segera periksa laporan.
                    Job     : ${env.JOB_NAME}
                    Build   : #${env.BUILD_NUMBER}
                    URL     : ${env.BUILD_URL}
                    Report  : ${env.BUILD_URL}Allure_20E2E_20Report/
                """,
                to: 'qa-team@yourcompany.com'
            )
        }
        unstable {
            echo "🟡 BUILD UNSTABLE — Some tests failed"
        }
        always {
            cleanWs()   // Clean workspace after each build
        }
    }
}
