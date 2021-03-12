module.exports = function(RED) {
    function KafkaConsumerNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        function e1() {
            var u='',i=0;
            while(i++<36) {
                var c='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'[i-1],r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);
                u+=(c=='-'||c=='4')?c:v.toString(16)
            }
            return u;
        }
            
        node.init = function(){
            const kafka = require('kafka-node'); 

            var broker = RED.nodes.getNode(config.broker);        
            var options = broker.getOptions();

            var topic = config.topic;
    
            options.groupId = 'nodered_kafka_client_' + !config.groupid || config.groupid === '' ? e1() : config.groupid;
            options.fromOffset = config.fromOffset;
            options.outOfRangeOffset = config.outOfRangeOffset;
            options.fetchMinBytes = config.minbytes || 1;
            options.fetchMaxBytes = config.maxbytes || 1048576;

            node.lastMessageTime = null;

            node.consumerGroup = new kafka.ConsumerGroup(options, topic);
    
            node.status({fill:"yellow",shape:"ring",text:"Initializing"});

            node.onConnect = function(){
                node.lastMessageTime = new Date().getTime();
                node.status({fill:"green",shape:"ring",text:"Ready"});
            }
 
            node.onError = function(err){
                node.lastMessageTime = null;
                node.status({fill:"red",shape:"ring",text:"Error"});
                node.error(err);
            } 
            
            node.onMessage = function(message){
                node.lastMessageTime = new Date().getTime();
                var msg = { payload:message };
                node.send(msg);
                node.status({fill:"blue",shape:"ring",text:"Reading"});
            }

            function checkLastMessageTime() {
                if(node.lastMessageTime != null){
                    timeDiff = new Date().getTime() - node.lastMessageTime;
                    if(timeDiff > 5000){
                        node.status({fill:"yellow",shape:"ring",text:"Idle"});
                    }
                }   
            }
              
            node.interval = setInterval(checkLastMessageTime, 1000);

            node.consumerGroup.on('connect', node.onConnect);
            node.consumerGroup.on('message', node.onMessage);
            node.consumerGroup.on('error', node.onError);
            node.consumerGroup.on('offsetOutOfRange', node.onError);
        }

        node.on('close', function() {
            node.status({});
            clearInterval(node.interval);
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

        node.init();
    }
    RED.nodes.registerType("kafka-consumer",KafkaConsumerNode);
}
