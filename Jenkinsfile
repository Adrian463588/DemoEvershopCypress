// ─── Shared helper (DRY: replaces 3× duplicated discordSend blocks) ──────────
def notifyDiscord(String result) {
    def icons     = [SUCCESS: '✅', UNSTABLE: '⚠️', FAILURE: '❌']
    def hasReport = result != 'FAILURE'
    def links     = hasReport
        ? "📊 [Report](${env.BUILD_URL}allure/)  |  📋 [Log](${env.BUILD_URL}console)"
        : "📋 [Log](${env.BUILD_URL}console)"

    discordSend(
        title:       "${icons[result]} ${result} — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        description: "**Job:** ${env.JOB_NAME}\n**Build:** #${env.BUILD_NUMBER}\n" +
                     "**Commit:** `${env.GIT_COMMIT?.take(7) ?: 'N/A'}`\n" +
                     "**Duration:** ${currentBuild.durationString}\n${links}",
        footer:      'Jenkins CI',
        link:        env.BUILD_URL,
        result:      result,
        thumbnail:   'https://www.jenkins.io/images/logos/jenkins/jenkins.png',
        webhookURL:  env.DISCORD_WEBHOOK
    )
}

// ─── Pipeline ─────────────────────────────────────────────────────────────────
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
        quietPeriod(300)
    }

    triggers {
        // FIX 3: Set timezone to Asia/Jakarta to ensure the cron job runs at the correct local time
        cron('TZ=Asia/Jakarta\nH 23 * * *')
        // FIX 1: Add pollSCM to automatically trigger builds if GitHub webhook is not reaching Jenkins
        pollSCM('H/2 * * * *')
        githubPush()
    }

    stages {

        stage('Checkout') {
            steps {
                // FIX 1: checkout scm binds this job to its SCM source
                // so Jenkins can match incoming GitHub webhooks to this job
                checkout scm
                echo "✅ Commit: ${env.GIT_COMMIT?.take(7) ?: 'N/A'}"
            }
        }

        stage('Install') {
            steps {
                sh 'node --version && npm --version'
                sh 'npm ci'
                sh './node_modules/.bin/allure --version'
            }
        }

        stage('Clean') {
            steps {
                sh "rm -rf ${ALLURE_RESULTS_DIR} ${MOCHAWESOME_DIR} && mkdir -p ${ALLURE_RESULTS_DIR}"
            }
        }

        stage('Test') {
            steps {
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
                    // Merged two archiveArtifacts calls into one (DRY)
                    archiveArtifacts artifacts: 'cypress/screenshots/**,cypress/videos/**',
                                     allowEmptyArchive: true
                }
            }
        }

        stage('Report') {
            steps {
                // FIX 2: Manually generate a single-file Allure report and publish it via HTML Publisher
                // to avoid Jenkins Allure plugin display/CSP issues.
                sh "npx allure-commandline generate ${ALLURE_RESULTS_DIR} -o allure-report --clean --single-file || true"

                publishHTML(target: [
                    allowMissing:          true,
                    alwaysLinkToLastBuild: true,
                    keepAll:               true,
                    reportDir:             'allure-report',
                    reportFiles:           'index.html',
                    reportName:            'Allure Report'
                ])

                publishHTML(target: [
                    allowMissing:          true,
                    alwaysLinkToLastBuild: true,
                    keepAll:               true,
                    reportDir:             "${MOCHAWESOME_DIR}",
                    reportFiles:           'mochawesome_001.html',
                    reportName:            'Mochawesome Report'
                ])
            }
        }
    }

    post {
        always {
            // Merged 3× archiveArtifacts into one (DRY)
            archiveArtifacts artifacts: "${ALLURE_RESULTS_DIR}/**,allure-report/**,${MOCHAWESOME_DIR}/**",
                             allowEmptyArchive: true
        }

        // DRY: all three states call the same helper with one argument
        success  { script { notifyDiscord('SUCCESS')  } }
        unstable { script { notifyDiscord('UNSTABLE') } }
        failure  { script { notifyDiscord('FAILURE')  } }

        cleanup {
            cleanWs(cleanWhenSuccess: true, cleanWhenUnstable: true,
                    cleanWhenFailure: true,  cleanWhenAborted:  true)
        }
    }
}
