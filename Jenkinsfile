pipeline {
    agent any

    environment {
        CYPRESS_BASE_URL   = 'https://demo.evershop.io'
        ALLURE_RESULTS_DIR = 'allure-results'
        ALLURE_REPORT_DIR  = 'allure-report'
        DISCORD_WEBHOOK    = credentials('discord-webhook')
        TERM               = 'xterm'
        ALLURE_BIN         = './node_modules/.bin/allure'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds(abortPrevious: true)
        timestamps()
        ansiColor('xterm')
        quietPeriod(600)
    }

    triggers {
        cron('0 23 * * *')
        githubPush()
    }

    stages {

        // ── Stage 0: Wajib — fix CSP agar Allure JS/CSS bisa render di browser ──
        stage('Configure CSP') {
            steps {
                script {
                    System.setProperty(
                        'hudson.model.DirectoryBrowserSupport.CSP',
                        "default-src 'self'; " +
                        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                        "style-src 'self' 'unsafe-inline'; " +
                        "img-src 'self' data: blob:; " +
                        "font-src 'self' data:; " +
                        "connect-src 'self';"
                    )
                    echo "\033[32m[SUCCESS]\033[0m ✅ CSP relaxed — Allure report will render correctly"
                }
            }
        }

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
                    node --version
                    npm --version
                '''
                sh 'npm ci'
                sh './node_modules/.bin/allure --version'
                echo "\033[32m[SUCCESS]\033[0m ✅ Dependencies installed"
            }
        }

        // ── Stage 3 ────────────────────────────────────────────────────────────
        stage('Clean Artifacts') {
            steps {
                sh """
                    rm -rf ${ALLURE_RESULTS_DIR} ${ALLURE_REPORT_DIR}
                    mkdir -p ${ALLURE_RESULTS_DIR}
                    echo "\033[32m[SUCCESS]\033[0m ✅ Artifacts cleaned"
                """
            }
        }

        // ── Stage 4 ────────────────────────────────────────────────────────────
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
            post {
                always {
                    archiveArtifacts artifacts: 'cypress/screenshots/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/videos/**',      allowEmptyArchive: true
                }
            }
        }

        // ── Stage 5 ────────────────────────────────────────────────────────────
        stage('Generate Allure Report') {
            steps {
                sh """
                    if [ -d "${ALLURE_RESULTS_DIR}" ] && [ "\$(ls -A ${ALLURE_RESULTS_DIR} 2>/dev/null)" ]; then
                        echo "\033[34m[INFO]\033[0m 📊 Generating Allure report..."
                        ${ALLURE_BIN} generate ${ALLURE_RESULTS_DIR} \
                            -o ${ALLURE_REPORT_DIR} --clean
                        echo "\033[32m[SUCCESS]\033[0m ✅ Report: ${ALLURE_REPORT_DIR}/index.html"
                    else
                        echo "\033[33m[WARN]\033[0m ⚠️ No results found — creating placeholder"
                        mkdir -p ${ALLURE_REPORT_DIR}
                        echo '<html><body><h2>No test results found</h2></body></html>' \
                            > ${ALLURE_REPORT_DIR}/index.html
                    fi
                """
            }
        }

        // ── Stage 6 ────────────────────────────────────────────────────────────
        stage('Publish Report') {
            steps {
                echo "\033[34m[INFO]\033[0m 📤 Publishing report to Jenkins UI..."
                publishHTML(target: [
                    allowMissing:          true,
                    alwaysLinkToLastBuild: true,
                    keepAll:               true,
                    reportDir:             "${ALLURE_REPORT_DIR}",
                    reportFiles:           'index.html',
                    reportName:            'Allure E2E Report'
                ])
                echo "\033[32m[SUCCESS]\033[0m ✅ Report published"
            }
        }
    }

    post {
        success {
            echo "\033[32m[SUCCESS]\033[0m 🟢 BUILD SUCCESS"
            discordSend(
                title:       "✅ SUCCESS — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                description: "**Job:** ${env.JOB_NAME}\n**Build:** #${env.BUILD_NUMBER}\n**Commit:** `${env.GIT_COMMIT?.take(7) ?: 'N/A'}`\n**Duration:** ${currentBuild.durationString}\n📊 [Report](${env.BUILD_URL}Allure_20E2E_20Report/)  |  📋 [Log](${env.BUILD_URL}console)",
                footer:      "Jenkins CI",
                link:        env.BUILD_URL,
                result:      'SUCCESS',
                thumbnail:   'https://www.jenkins.io/images/logos/jenkins/jenkins.png',
                webhookURL:  env.DISCORD_WEBHOOK
            )
        }

        unstable {
            echo "\033[33m[UNSTABLE]\033[0m 🟡 BUILD UNSTABLE"
            discordSend(
                title:       "⚠️ UNSTABLE — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                description: "**Job:** ${env.JOB_NAME}\n**Build:** #${env.BUILD_NUMBER}\n**Commit:** `${env.GIT_COMMIT?.take(7) ?: 'N/A'}`\n**Duration:** ${currentBuild.durationString}\n📊 [Report](${env.BUILD_URL}Allure_20E2E_20Report/)  |  📋 [Log](${env.BUILD_URL}console)",
                footer:      "Jenkins CI",
                link:        env.BUILD_URL,
                result:      'UNSTABLE',
                thumbnail:   'https://www.jenkins.io/images/logos/jenkins/jenkins.png',
                webhookURL:  env.DISCORD_WEBHOOK
            )
        }

        failure {
            echo "\033[31m[FAILED]\033[0m 🔴 BUILD FAILED"
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
            // FIX: excludePatterns wajib — jangan hapus allure-report yang sudah di-publish
            cleanWs(
                cleanWhenSuccess:  true,
                cleanWhenUnstable: true,
                cleanWhenFailure:  true,
                cleanWhenAborted:  true,
                patterns: [
                    [pattern: 'allure-report/**', type: 'EXCLUDE'],
                    [pattern: 'allure-results/**', type: 'EXCLUDE']
                ]
            )
        }
    }
}
