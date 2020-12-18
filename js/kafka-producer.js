module.exports = function(RED) {
    const kafka = require('kafka-node');

    function KafkaProducerNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.ready = false;

        node.init = function(){
            let broker = RED.nodes.getNode(config.broker);

            let kafkaClient = new kafka.KafkaClient(broker.getOptions());;
            
            let producerOptions = new Object();
            producerOptions.requireAcks = config.requireAcks;
            producerOptions.ackTimeoutMs = config.ackTimeoutMs;

            node.lastMessageTime = null;
            
            node.producer = new kafka.HighLevelProducer(kafkaClient, producerOptions);
    
            node.onError = function(err){
                node.ready = false;
                node.lastMessageTime = null;
                node.status({fill:"red",shape:"ring",text:"Error"});
                node.error(err);
            }
    
            node.onReady = function(){
                node.ready = true;
                node.lastMessageTime = new Date().getTime();
                node.status({fill:"green",shape:"ring",text:"Ready"});
            }
    
            node.producer.on('ready', node.onReady);
            node.producer.on('error', node.onError);
        }
    
        node.init();
    
        node.on('input', function(msg) {
            if(node.ready){
                var sendOptions = new Object();
                
                sendOptions.topic = config.topic;
                sendOptions.attributes = config.attributes;
                sendOptions.messages = [msg.payload];
                
                node.producer.send([sendOptions],function (err) {
                    if(!err){
                        node.lastMessageTime = new Date().getTime();
                        node.status({fill:"blue",shape:"ring",text:"Sending"});
                    }
                    else{
                        node.status({fill:"red",shape:"ring",text:"Error"});
                    }
                });
            }
        });

        function checkLastMessageTime() {
            if(node.lastMessageTime != null){
                timeDiff = new Date().getTime() - node.lastMessageTime;
                if(timeDiff > 5000){
                    node.status({fill:"yellow",shape:"ring",text:"Idle"});
                } 
            }   
        }
          
        setInterval(checkLastMessageTime, 1000);

        node.on('close', function(){
            node.ready = false;
            node.status({});
            node.producer.removeListener('ready', node.onReady);
            node.producer.removeListener('error', node.onError);
        })
    }
    RED.nodes.registerType("kafka-producer",KafkaProducerNode);
}
