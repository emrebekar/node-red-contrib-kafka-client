module.exports = function(RED) {
    function KafkaConsumerNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
            
        var init = function(){
            const kafka = require('kafka-node'); 

            var broker = RED.nodes.getNode(config.broker);        
            var options = broker.getOptions();

            var topic = config.topic;
    
            options.groupId = config.groupid;
            options.fromOffset = config.fromOffset;
            options.outOfRangeOffset = config.outOfRangeOffset;
    
            node.consumerGroup = new kafka.ConsumerGroup(options, topic);
    
            node.status({fill:"yellow",shape:"ring",text:"Initializing"});

            node.onConnect = function(){
                node.status({fill:"green",shape:"ring",text:"Ready"});
            }
 
            node.onError = function(err){
                node.status({fill:"red",shape:"ring",text:"Error"});
                node.error(err);
                init();
            } 
            
            node.onMessage = function(message){
                var msg = { payload:message };
                node.send(msg);
                node.status({fill:"blue",shape:"ring",text:"Reading"});
            }

            node.consumerGroup.on('connect', node.onConnect);
            node.consumerGroup.on('message', node.onMessage);
            node.consumerGroup.on('error', node.onError);
            node.consumerGroup.on('offsetOutOfRange', node.onError);

        }

        node.on('close', function() {
            node.status({});
            node.consumerGroup.removeListener('connect', node.onConnect);
            node.consumerGroup.removeListener('message', node.onMessage);
            node.consumerGroup.removeListener('error', node.onError);
            node.consumerGroup.removeListener('offsetOutOfRange', node.onError);

            node.consumerGroup.close(true, function(err) {
                if(err){
                    node.error(err);
                    return;
                }

                node.consumerGroup = null;
            });
        });

        init();
    }
    RED.nodes.registerType("kafka-consumer",KafkaConsumerNode);
}
