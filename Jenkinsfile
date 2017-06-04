/**
* NOTE: THIS JENKINSFILE IS GENERATED VIA "./hack/run update"
*
* DO NOT EDIT IT DIRECTLY.
*/
node {
        def variants = "default,alpine".split(',');
        for (int v = 0; v < variants.length; v++) {

                def versions = "4,6,8".split(',');
                for (int i = 0; i < versions.length; i++) {

                  if (variants[v] == "default") {
                    variant = ""
                    tag = versions[i]
                  } else {
                    variant = variants[v]
                    tag = versions[i] + "-" + variant
                  }


                        try {
                                stage("Build (Node.js-${tag})") {
                                        openshift.withCluster() {
        openshift.apply([
                                "apiVersion" : "v1",
                                "items" : [
                                        [
                                                "apiVersion" : "v1",
                                                "kind" : "ImageStream",
                                                "metadata" : [
                                                        "name" : "node",
                                                        "labels" : [
                                                                "builder" : "s2i-nodejs"
                                                        ]
                                                ],
                                                "spec" : [
                                                        "tags" : [
                                                                [
                                                                        "name" : "${tag}",
                                                                        "from" : [
                                                                                "kind" : "DockerImage",
                                                                                "name" : "node:${tag}",
                                                                        ],
                                                                        "referencePolicy" : [
                                                                                "type" : "Source"
                                                                        ]
                                                                ]
                                                        ]
                                                ]
                                        ],
                                        [
                                                "apiVersion" : "v1",
                                                "kind" : "ImageStream",
                                                "metadata" : [
                                                        "name" : "s2i-nodejs",
                                                        "labels" : [
                                                                "builder" : "s2i-nodejs"
                                                        ]
                                                ]
                                        ]
                                ],
                                "kind" : "List"
                        ])
        openshift.apply([
                                "apiVersion" : "v1",
                                "kind" : "BuildConfig",
                                "metadata" : [
                                        "name" : "s2i-nodejs-${tag}",
                                        "labels" : [
                                                "builder" : "s2i-nodejs"
                                        ]
                                ],
                                "spec" : [
                                        "output" : [
                                                "to" : [
                                                        "kind" : "ImageStreamTag",
                                                        "name" : "s2i-nodejs:${tag}"
                                                ]
                                        ],
                                        "runPolicy" : "Serial",
                                        "resources" : [
                                            "limits" : [
                                                "memory" : "2Gi"
                                            ]
                                        ],
                                        "source" : [
                                                "git" : [
                                                        "uri" : "https://github.com/ausnimbus/s2i-nodejs"
                                                ],
                                                "type" : "Git"
                                        ],
                                        "strategy" : [
                                                "dockerStrategy" : [
                                                        "dockerfilePath" : "versions/${versions[i]}/${variant}/Dockerfile",
                                                        "from" : [
                                                                "kind" : "ImageStreamTag",
                                                                "name" : "node:${tag}"
                                                        ]
                                                ],
                                                "type" : "Docker"
                                        ]
                                ]
                        ])
        echo "Created s2i-nodejs:${tag} objects"
        /**
        * TODO: Replace the sleep with import-image
        * openshift.importImage("node:${tag}")
        */
        sleep 60

        echo "==============================="
        echo "Starting build s2i-nodejs-${tag}"
        echo "==============================="
        def builds = openshift.startBuild("s2i-nodejs-${tag}");

        timeout(20) {
                builds.untilEach(1) {
                        return it.object().status.phase == "Complete"
                }
        }
        echo "Finished build ${builds.names()}"
        builds.logs()
}

                                }
                                stage("Test (Node.js-${tag})") {
                                        openshift.withCluster() {
        echo "==============================="
        echo "Starting test application"
        echo "==============================="

        def testApp = openshift.newApp("https://github.com/ausnimbus/node-ex", "--image-stream=s2i-nodejs:${tag}", "-l app=node-ex");
        echo "new-app created ${testApp.count()} objects named: ${testApp.names()}"
        testApp.describe()

        def testAppBC = testApp.narrow("bc");
        def testAppBuilds = testAppBC.related("builds");
        echo "Waiting for ${testAppBuilds.names()} to finish"
        timeout(10) {
                testAppBuilds.untilEach(1) {
                        return it.object().status.phase == "Complete"
                }
        }
        echo "Finished ${testAppBuilds.names()}"

        def testAppDC = testApp.narrow("dc");
        echo "Waiting for ${testAppDC.names()} to start"
        timeout(10) {
                testAppDC.untilEach(1) {
                        return it.object().status.availableReplicas >= 1
                }
        }
        echo "${testAppDC.names()} is ready"

        def testAppService = testApp.narrow("svc");
        def testAppHost = testAppService.object().spec.clusterIP;
        def testAppPort = testAppService.object().spec.ports[0].port;

        sleep 60
        echo "Testing endpoint ${testAppHost}:${testAppPort}"
        sh "curl -o /dev/null $testAppHost:$testAppPort"
}

                                }
                                stage("Stage (Node.js-${tag})") {
                                        openshift.withCluster() {
        echo "==============================="
        echo "Tag new image into staging"
        echo "==============================="

        openshift.tag("ausnimbus-ci/s2i-nodejs:${tag}", "ausnimbus/s2i-nodejs:${tag}")
}

                                }
                        } finally {
                                openshift.withCluster() {
                                        echo "Deleting test resources node-ex"
                                        openshift.selector("dc", [app: "node-ex"]).delete()
                                        openshift.selector("bc", [app: "node-ex"]).delete()
                                        openshift.selector("svc", [app: "node-ex"]).delete()
                                        openshift.selector("is", [app: "node-ex"]).delete()
                                        openshift.selector("pods", [app: "node-ex"]).delete()
                                        openshift.selector("routes", [app: "node-ex"]).delete()
                                }
                        }

                }
        }
}
