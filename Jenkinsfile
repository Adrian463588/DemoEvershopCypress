pipeline {
    // ── 1 Agent Tunggal ────────────────────────────────────
    agent any   // Jalankan di satu agent, tidak ada matrix/parallel node

    // ── Tool Versions ──────────────────────────────────────
    tools {
        nodejs 'NodeJS-21'   // PENTING: Harus sama persis dengan nama di Jenkins > Global Tool Configuration
    }

    // ── Environment Variables ──────────────────────────────
    environment {
        CYPRESS_BASE_URL   = 'https://demo.evershop.io'
        ALLURE_RESULTS_DIR = 'allure-results'
        ALLURE_REPORT_DIR  = 'allure-report'
        DISCORD_WEBHOOK    = credentials('discord-webhook')
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
            echo "🔴 BUILD FAILED"

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
            echo "🟡 BUILD UNSTABLE — Ada test yang gagal"

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
            cleanWs()   // Bersihkan workspace setelah setiap build
        }
    }
}
