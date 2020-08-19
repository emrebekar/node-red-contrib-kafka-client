# node-red-contrib-kafka-client

This node can be used in order to produce and consume messages to Kafka. It is highly depends on 'kafka-node' library. Consists three nodes.

- kafka-broker
- kafka-producer
- karka-consumer

Note: This library only supports 'plaintext' and 'tls' authorization. SASL authorization will develop upcoming days

## Input Parameters
### kafka-broker
#### Name (Optional)
Name wanted to be shown in Node
#### Hosts
Host names comma delimited (Multiple host is provided)
#### Use TLS
Check if tls security is required for Kafka Cluster
#### CA Certs (Optional)
CA Root certificate path defined in Kafka Cluster
#### Client Cert (Optional)
Client cert path created by openssl derived from Private Key (pem)
#### Private Key (Optional)
Private Key path created by openssl (pem)
#### Passphare (Optional)
Passphrase of created private Key
#### Self Sign
Check if want to be allowed untrusted certificates

### kafka-producer
#### Name (Optional)
Name wanted to be shown in NodeRename your node
#### Broker
Broker which is wanted to be connect
#### Topic
Topic name of selected broker which is wanted to be consume
#### Require Ack
Default value is 1. 0 can be past if Acknowledge is not required.
#### Ack Timeout
Timeout of acknowledge response.
#### Attiributes
Can be selected if compression is important

### kafka-consumer
#### Name (Optional)
Name wanted to be shown in NodeRename your node
#### Broker
Broker which is wanted to be connect
#### Topic
Topic name of selected broker which is wanted to be consume
#### From Offset
'latest', 'none' or 'earliest' options can be selected
#### Out of Range Offset
'latest', 'none' or 'earliest' options can be selected

## Installation
```
npm install node-red-contrib-kafka-client
```

## Usage
1. Example JSON here
```JSON
{"topic":"TOPIC_NAME","value":"DENEME","offset":16638,"partition":0,"highWaterOffset":16639,"key":null,"timestamp":"2020-08-19T08:58:27.866Z"}
```
## Screenshots

![alt text](https://github.com/emrebekar/node-red-contrib-kafka-client/blob/master/images/kafka-broker.PNG)

![alt text](https://github.com/emrebekar/node-red-contrib-kafka-client/blob/master/images/kafka-consumer.PNG)

![alt text](https://github.com/emrebekar/node-red-contrib-kafka-client/blob/master/images/kafka-flow.PNG)

![alt text](https://github.com/emrebekar/node-red-contrib-kafka-client/blob/master/images/kafka-producer.PNG)
