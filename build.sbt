import sbt.Resolver

name := "invoices"

version := "0.1"

scalaVersion := "2.12.2"
resolvers ++= Seq("Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/",
  Resolver.bintrayRepo("hseeberger", "maven"))

libraryDependencies ++= {
  val AkkaVersion = "2.4.18"
  val AkkaHttpVersion = "10.0.6"
  val Json4sVersion = "3.5.2"
  Seq(
    "com.typesafe.akka" %% "akka-slf4j" % AkkaVersion,
    "com.typesafe.akka" %% "akka-http" % AkkaHttpVersion,
    "ch.qos.logback" % "logback-classic" % "1.2.3",
    "org.json4s" %% "json4s-native" % Json4sVersion,
    "org.json4s" %% "json4s-ext" % Json4sVersion,
    "de.heikoseeberger" %% "akka-http-json4s" % "1.16.0",
    "ch.megard" %% "akka-http-cors" % "0.2.1",
    "com.h2database" % "h2" % "1.4.192",
    "io.getquill" %% "quill-jdbc" % "2.3.2",
    "com.typesafe.slick" %% "slick" % "3.2.1"
  )
}