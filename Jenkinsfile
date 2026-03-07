pipeline {
    // ── 1 Agent Tunggal ────────────────────────────────────
    agent any   // Jalankan di satu agent, tidak ada matrix/parallel node

    // ── Tool Versions ──────────────────────────────────────
    tools {
        nodejs 'NodeJS-20'   // Sesuaikan dengan nama di Global Tool Config
    }

    // ── Environment Variables ──────────────────────────────
    environment {
        CYPRESS_BASE_URL   = 'https://demo.evershop.io'
        ALLURE_RESULTS_DIR = 'allure-results'
        ALLURE_REPORT_DIR  = 'allure-report'
        // Credentials dari Jenkins Credential Store (tidak hardcoded)
        CYPRESS_USERNAME   = credentials('evershop-username')
        CYPRESS_PASSWORD   = credentials('evershop-password')
    }

    // ── Build Options ──────────────────────────────────────
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()   // Mencegah 2 build jalan bersamaan
        timestamps()
    }

    // ── Triggers ───────────────────────────────────────────
    triggers {
        cron('0 23 * * *')   // Nightly build jam 23:00 server time
        githubPush()          // Webhook dari GitHub
    }

    stages {

        // ── Stage 1: Checkout ──────────────────────────────
        stage('Checkout SCM') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Adrian463588/DemoEvershopCypress.git',
                    credentialsId: 'github-credentials'
                echo "✅ Checked out commit: ${env.GIT_COMMIT}"
            }
        }

        // ── Stage 2: Install Dependencies ─────────────────
        stage('Install Dependencies') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'                          // Deterministik
                sh 'npm install -g allure-commandline'
                sh 'allure --version'
                echo "✅ Dependencies installed"
            }
        }

        // ── Stage 3: Clean Previous Artifacts ─────────────
        stage('Clean Artifacts') {
            steps {
                sh """
                    rm -rf ${ALLURE_RESULTS_DIR} || true
                    rm -rf ${ALLURE_REPORT_DIR}  || true
                    mkdir -p ${ALLURE_RESULTS_DIR}
                    echo "✅ Artifacts cleaned, results dir ready"
                """
            }
        }

        // ── Stage 4: Run Cypress Tests (1 Container) ──────
        stage('Run Cypress Tests') {
            steps {
                sh """
                    npx cypress run \\
                        --browser chrome \\
                        --headless \\
                        --env allure=true,allureResultsPath=${ALLURE_RESULTS_DIR}
                """
                echo "✅ Cypress test execution complete"
            }
            post {
                always {
                    // Archive screenshot & video dari single run
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
                sh """
                    allure generate ${ALLURE_RESULTS_DIR} \\
                           -o ${ALLURE_REPORT_DIR} --clean
                    echo "✅ Report generated at ${ALLURE_REPORT_DIR}/index.html"
                """
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
                    results: [[path: "${ALLURE_RESULTS_DIR}"]]
                ])

                // Fallback: HTML Publisher
                publishHTML(target: [
                    allowMissing:          false,
                    alwaysLinkToLastBuild: true,
                    keepAll:               true,
                    reportDir:            "${ALLURE_REPORT_DIR}",
                    reportFiles:          'index.html',
                    reportName:           'Allure E2E Report — EverShop'
                ])

                echo "✅ Report published to Jenkins UI"
            }
        }
    }

    // ── Post Build Actions ─────────────────────────────────
    post {
        success {
            echo "🟢 BUILD SUCCESS"
            emailext(
                subject: "✅ [SUCCESS] Cypress E2E — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h3>Build Berhasil ✅</h3>
                    <p><b>Job:</b>    ${env.JOB_NAME}</p>
                    <p><b>Build:</b>  #${env.BUILD_NUMBER}</p>
                    <p><b>Commit:</b> ${env.GIT_COMMIT}</p>
                    <p><b>Report:</b> <a href="${env.BUILD_URL}Allure_20E2E_20Report/">
                                      Lihat Allure Report</a></p>
                """,
                mimeType: 'text/html',
                to: 'qa-team@yourcompany.com'
            )
        }
        failure {
            echo "🔴 BUILD FAILED"
            emailext(
                subject: "❌ [FAILURE] Cypress E2E — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h3>Build GAGAL ❌</h3>
                    <p><b>Job:</b>    ${env.JOB_NAME}</p>
                    <p><b>Build:</b>  #${env.BUILD_NUMBER}</p>
                    <p><b>Commit:</b> ${env.GIT_COMMIT}</p>
                    <p><b>Log:</b>    <a href="${env.BUILD_URL}console">Console Output</a></p>
                    <p><b>Report:</b> <a href="${env.BUILD_URL}Allure_20E2E_20Report/">
                                      Lihat Allure Report</a></p>
                """,
                mimeType: 'text/html',
                to: 'qa-team@yourcompany.com'
            )
        }
        unstable {
            echo "🟡 BUILD UNSTABLE — Ada test yang gagal"
        }
        always {
            cleanWs()   // Bersihkan workspace setelah setiap build
        }
    }
}
