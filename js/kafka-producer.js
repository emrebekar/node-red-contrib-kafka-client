module.exports = function(RED) {
    const kafka = require('kafka-node');

    function KafkaProducerNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var ready = false;
    
        let broker = RED.nodes.getNode(config.broker);

        let kafkaClient = new kafka.KafkaClient(broker.options);;
        
        let producerOptions = new Object();
        producerOptions.requireAcks = config.requireAcks;
        producerOptions.ackTimeoutMs = config.ackTimeoutMs;
        
        let producer = new kafka.HighLevelProducer(kafkaClient, producerOptions);
        producer.on('ready', function () {
            ready = true;
            node.status({fill:"green",shape:"ring",text:"Ready"});
        });
        
        producer.on('error', function(){
            ready = false;
            console.log(options);
            node.status({fill:"red",shape:"ring",text:"Error"});
        });

        let sendOptions = new Object();

        sendOptions.topic = config.topic;
        sendOptions.attributes = config.attributes;
    
        node.on('input', function(msg) {
            sendOptions.messages =[msg.payload];
            producer.send([sendOptions],function (err, result) {
                //console.log(result);
            });
        });
    }
    RED.nodes.registerType("kafka-producer",KafkaProducerNode);
}
