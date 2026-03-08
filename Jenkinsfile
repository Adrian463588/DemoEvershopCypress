pipeline {
    agent any

    environment {
        CYPRESS_BASE_URL   = 'https://demo.evershop.io'
        ALLURE_RESULTS_DIR = 'allure-results'
        ALLURE_REPORT_DIR  = 'allure-report'
        MOCHAWESOME_DIR    = 'cypress/reports'
        DISCORD_WEBHOOK    = credentials('discord-webhook')
        TERM               = 'xterm'

        // Gunakan allure dari node_modules, bukan dari Jenkins Tool (Maven)
        ALLURE_BIN         = './node_modules/.bin/allure'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds(abortPrevious: true)
        timestamps()
        ansiColor('xterm')
        // 5 menit (300 detik) delay setelah push terakhir
        quietPeriod(300)
    }

    triggers {
        cron('0 23 * * *')
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
                sh '''
                    echo "\033[34m[INFO]\033[0m 🔍 Verifying allure binary..."
                    ./node_modules/.bin/allure --version
                '''
                echo "\033[32m[SUCCESS]\033[0m ✅ Dependencies installed"
            }
        }

        stage('Clean Artifacts') {
            steps {
                sh """
                    echo "\033[33m[CLEAN]\033[0m 🧹 Removing previous artifacts..."
                    rm -rf ${ALLURE_RESULTS_DIR} ${ALLURE_REPORT_DIR} ${MOCHAWESOME_DIR}
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
            post {
                always {
                    archiveArtifacts artifacts: 'cypress/screenshots/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/videos/**',      allowEmptyArchive: true
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh """
                    echo "\033[34m[INFO]\033[0m 📊 Generating Allure report..."
                    if [ -d "${ALLURE_RESULTS_DIR}" ] && [ "\$(ls -A ${ALLURE_RESULTS_DIR} 2>/dev/null)" ]; then
                        ${ALLURE_BIN} generate ${ALLURE_RESULTS_DIR} \
                            -o ${ALLURE_REPORT_DIR} --clean
                        echo "\033[32m[SUCCESS]\033[0m ✅ Report: ${ALLURE_REPORT_DIR}/index.html"
                    else
                        echo "\033[33m[WARN]\033[0m ⚠️ No Allure results — creating placeholder"
                        mkdir -p ${ALLURE_REPORT_DIR}
                        echo '<html><body><h2>No test results found</h2></body></html>' \
                            > ${ALLURE_REPORT_DIR}/index.html
                    fi
                """
            }
        }

        stage('Publish Report') {
            steps {
                echo "\033[34m[INFO]\033[0m 📤 Publishing reports to Jenkins UI..."

                // Allure HTML Report
                publishHTML(target: [
                    allowMissing:          true,
                    alwaysLinkToLastBuild: true,
                    keepAll:               true,
                    reportDir:             "${ALLURE_REPORT_DIR}",
                    reportFiles:           'index.html',
                    reportName:            'Allure E2E Report'
                ])

                // Mochawesome HTML Report (jika ada)
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
        // Archive allure & mochawesome results SEBELUM cleanWs
        always {
            archiveArtifacts artifacts: "${ALLURE_RESULTS_DIR}/**",  allowEmptyArchive: true
            archiveArtifacts artifacts: "${ALLURE_REPORT_DIR}/**",   allowEmptyArchive: true
            archiveArtifacts artifacts: "${MOCHAWESOME_DIR}/**",     allowEmptyArchive: true
        }

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

        // cleanWs HARUS di `cleanup {}` — DIJAMIN jalan TERAKHIR
        // setelah always/success/unstable/failure sudah selesai archive artifacts
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
