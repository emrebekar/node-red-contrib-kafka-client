module.exports = function(RED) {
    const kafka = require('kafka-node');

    function KafkaProducerNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.ready = false;

        var init = function(){
            let broker = RED.nodes.getNode(config.broker);

            let kafkaClient = new kafka.KafkaClient(broker.getOptions());;
            
            let producerOptions = new Object();
            producerOptions.requireAcks = config.requireAcks;
            producerOptions.ackTimeoutMs = config.ackTimeoutMs;
            
            node.producer = new kafka.HighLevelProducer(kafkaClient, producerOptions);
    
            node.onError = function(err){
                node.status({fill:"red",shape:"ring",text:"Error"});
                node.error(err);
            }
    
            node.onReady = function(){
                node.ready = true;
                node.status({fill:"green",shape:"ring",text:"Ready"});
            }
    
            node.producer.on('ready', node.onReady);
            node.producer.on('error', node.onError);
        }
    
        init();
    
        node.on('input', function(msg) {
            if(node.ready){
                var sendOptions = new Object();
                
                sendOptions.topic = config.topic;
                sendOptions.attributes = config.attributes;
                sendOptions.messages = [msg.payload];
                
                node.producer.send([sendOptions],function (err) {
                    if(!err){
                        node.status({fill:"blue",shape:"ring",text:"Sending"});
                    }
                    else{
                        node.status({fill:"red",shape:"ring",text:"Error"});
                    }
                });
            }
        });

        node.on('close', function(){
            node.ready = false;
            node.status({});
            node.producer.removeListener('ready', node.onReady);
            node.producer.removeListener('error', node.onError);
        })
    }
    RED.nodes.registerType("kafka-producer",KafkaProducerNode);
}
