Kafka
=====

## Kafka API
There is a Kafka API exposed over HTTP on port `8083`. This API can be used to get
sensitive informations using the following URLs:

```
http://<ip>:8083
{"version":"2.3.0","commit":"<hash>","kafka_cluster_id":"<id>"}
```

```
http://<ip>:8083/connectors
["mongo-Release", "<connector_name>", ..., "my-sqldata"]
```

```
http://<ip>:8083/connectors/<connector_name>
{
	"name": "<connector_name>",
	"config": {...},
	"tasks": [{
		"connector": "<connector_name>",
    	"task": 0
	}],
	"type": "sink"
}
```
