module.exports = function(RED) {
    const kafka = require('kafka-node'); 

    function KafkaConsumerNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
            
        let broker = RED.nodes.getNode(config.broker);        
        var options = broker.getOptions();
        options.groupId = config.groupid;
        options.fromOffset = config.fromOffset;
        options.outOfRangeOffset = config.outOfRangeOffset;

        var consumerGroup = new kafka.ConsumerGroup(options, config.topic);

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
            node.status({fill:"blue",shape:"ring",text:"Reading"});
        });
    }
    RED.nodes.registerType("kafka-consumer",KafkaConsumerNode);
}
