pipeline {
    // ── Single Docker container: sudah include Node, npm, Cypress, Electron ──
    agent {
        docker {
            image 'cypress/included:13.17.0'          // pin versi, jangan :latest
            args  '--ipc=host -u root \
                   -v /var/cache/npm:/root/.npm \
                   -v /var/cache/cypress:/root/.cache/Cypress'
        }
    }

    environment {
        CYPRESS_BASE_URL     = 'https://demo.evershop.io'
        ALLURE_RESULTS_DIR   = 'allure-results'
        ALLURE_REPORT_DIR    = 'allure-report'
        DISCORD_WEBHOOK      = credentials('discord-webhook')
        TERM                 = 'xterm'

        // Cache paths — supaya npm ci & Cypress binary tidak re-download tiap build
        CYPRESS_INSTALL_BINARY = '0'                  // binary sudah ada di image
        CYPRESS_CACHE_FOLDER   = '/root/.cache/Cypress'
        npm_config_cache       = '/root/.npm'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds(abortPrevious: true)  // kill build lama, jalan build baru
        timestamps()
        ansiColor('xterm')
        quietPeriod(600)
    }

    triggers {
        cron('0 23 * * *')
        githubPush()
    }

    stages {

        // ── Stage 1 ────────────────────────────────────────────────────────────
        stage('Checkout SCM') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Adrian463588/DemoEvershopCypress.git',
                    credentialsId: 'github-credentials'
                echo "\033[34m[INFO]\033[0m ✅ Commit: ${env.GIT_COMMIT?.take(7) ?: 'N/A'}"
            }
        }

        // ── Stage 2 ────────────────────────────────────────────────────────────
        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "\033[34m[INFO]\033[0m 📦 Tool versions"
                    node --version
                    npm --version
                    cypress --version
                '''
                echo "\033[34m[INFO]\033[0m 📥 Installing project dependencies..."
                sh 'npm ci'
                echo "\033[32m[SUCCESS]\033[0m ✅ Dependencies installed"
            }
        }

        // ── Stage 3 ────────────────────────────────────────────────────────────
        stage('Clean Artifacts') {
            steps {
                sh """
                    echo "\033[33m[CLEAN]\033[0m 🧹 Removing previous artifacts..."
                    rm -rf ${ALLURE_RESULTS_DIR} ${ALLURE_REPORT_DIR}
                    mkdir -p ${ALLURE_RESULTS_DIR}
                    echo "\033[32m[SUCCESS]\033[0m ✅ Artifacts cleaned"
                """
            }
        }

        // ── Stage 4 ────────────────────────────────────────────────────────────
        // warnError: jika Cypress exit non-0 → UNSTABLE, bukan FAILURE
        stage('Run Cypress Tests') {
            steps {
                echo "\033[34m[INFO]\033[0m 🚀 Starting Cypress E2E tests..."
                warnError('⚠️ Some tests failed — build marked UNSTABLE') {
                    sh "npx cypress run \
                            --browser electron \
                            --headless \
                            --env allure=true,allureResultsPath=${ALLURE_RESULTS_DIR}"
                }
            }
            post {
                always {
                    echo "\033[34m[INFO]\033[0m 📁 Archiving screenshots & videos..."
                    archiveArtifacts artifacts: 'cypress/screenshots/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/videos/**',      allowEmptyArchive: true
                }
            }
        }

        // ── Stage 5 ────────────────────────────────────────────────────────────
        stage('Generate Allure Report') {
            steps {
                sh """
                    echo "\033[34m[INFO]\033[0m 📊 Generating Allure report..."
                    if [ -d "${ALLURE_RESULTS_DIR}" ] && [ "\$(ls -A ${ALLURE_RESULTS_DIR} 2>/dev/null)" ]; then
                        npx allure-commandline generate ${ALLURE_RESULTS_DIR} \
                            -o ${ALLURE_REPORT_DIR} --clean
                        echo "\033[32m[SUCCESS]\033[0m ✅ Report generated: ${ALLURE_REPORT_DIR}/index.html"
                    else
                        echo "\033[33m[WARN]\033[0m ⚠️ No Allure results found — skipping report"
                    fi
                """
            }
        }

        // ── Stage 6 ────────────────────────────────────────────────────────────
        stage('Publish Report') {
            steps {
                echo "\033[34m[INFO]\033[0m 📤 Publishing reports to Jenkins UI..."

                allure([
                    includeProperties: false,
                    jdk:               '',
                    reportBuildPolicy: 'ALWAYS',
                    results:           [[path: "${ALLURE_RESULTS_DIR}"]]
                ])

                publishHTML(target: [
                    allowMissing:          true,    // jangan crash jika report tidak ada
                    alwaysLinkToLastBuild: true,
                    keepAll:               true,
                    reportDir:             "${ALLURE_REPORT_DIR}",
                    reportFiles:           'index.html',
                    reportName:            'Allure E2E Report'
                ])

                echo "\033[32m[SUCCESS]\033[0m ✅ Reports published"
            }
        }
    }

    // ── Post Actions ───────────────────────────────────────────────────────────
    post {
        success {
            echo "\033[32m[SUCCESS]\033[0m 🟢 BUILD SUCCESS — ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            discordSend(
                title:       "✅ SUCCESS — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                description: "**Job:** ${env.JOB_NAME}\n**Build:** #${env.BUILD_NUMBER}\n**Commit:** `${env.GIT_COMMIT?.take(7) ?: 'N/A'}`\n**Duration:** ${currentBuild.durationString}\n📊 [Report](${env.BUILD_URL}allure/)  |  📋 [Log](${env.BUILD_URL}console)",
                footer:      "Jenkins CI",
                link:        env.BUILD_URL,
                result:      'SUCCESS',
                thumbnail:   'https://www.jenkins.io/images/logos/jenkins/jenkins.png',
                webhookURL:  env.DISCORD_WEBHOOK
            )
        }

        unstable {
            echo "\033[33m[UNSTABLE]\033[0m 🟡 BUILD UNSTABLE — ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            discordSend(
                title:       "⚠️ UNSTABLE — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                description: "**Job:** ${env.JOB_NAME}\n**Build:** #${env.BUILD_NUMBER}\n**Commit:** `${env.GIT_COMMIT?.take(7) ?: 'N/A'}`\n**Duration:** ${currentBuild.durationString}\n📊 [Report](${env.BUILD_URL}allure/)  |  📋 [Log](${env.BUILD_URL}console)",
                footer:      "Jenkins CI",
                link:        env.BUILD_URL,
                result:      'UNSTABLE',
                thumbnail:   'https://www.jenkins.io/images/logos/jenkins/jenkins.png',
                webhookURL:  env.DISCORD_WEBHOOK
            )
        }

        failure {
            echo "\033[31m[FAILED]\033[0m 🔴 BUILD FAILED — ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            discordSend(
                title:       "❌ FAILED — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                description: "**Job:** ${env.JOB_NAME}\n**Build:** #${env.BUILD_NUMBER}\n**Commit:** `${env.GIT_COMMIT?.take(7) ?: 'N/A'}`\n**Duration:** ${currentBuild.durationString}\n📋 [Log](${env.BUILD_URL}console)",
                footer:      "Jenkins CI",
                link:        env.BUILD_URL,
                result:      'FAILURE',
                thumbnail:   'https://www.jenkins.io/images/logos/jenkins/jenkins.png',
                webhookURL:  env.DISCORD_WEBHOOK
            )
        }

        always {
            echo "\033[34m[INFO]\033[0m 🧹 Cleaning workspace..."
            cleanWs(
                cleanWhenSuccess:  true,
                cleanWhenUnstable: true,
                cleanWhenFailure:  true,
                cleanWhenAborted:  true
            )
        }
    }
}
