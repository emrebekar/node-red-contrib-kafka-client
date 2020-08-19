module.exports = function(RED) {
    const kafka = require('kafka-node'); 

    function KafkaConsumerNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
            
        let broker = RED.nodes.getNode(config.broker);        

        broker.options.groupId = config.groupid;
        broker.options.fromOffset = config.fromOffset;
        broker.options.outOfRangeOffset = config.outOfRangeOffset;

        var consumerGroup = new kafka.ConsumerGroup(broker.options, config.topic);

        node.status({fill:"green",shape:"ring",text:"Ready"});

        consumerGroup.on('error', function (err) {
            node.status({fill:"red",shape:"ring",text:"Error"});
        })

        consumerGroup.on('offsetOutOfRange', function (err) {
            node.status({fill:"red",shape:"ring",text:"OutOFRange"});
        })

        consumerGroup.on('message', function (message) {
            var msg = { payload:message }
            node.send(msg);
        });
    }
    RED.nodes.registerType("kafka-consumer",KafkaConsumerNode);
}
