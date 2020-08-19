module.exports = function(RED) {
    const fs = require('fs');
    const kafka = require('kafka-node');

    function KafkaBrokerNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.kafkaClient = null;
        var options = new Object();
        
        options.kafkaHost = config.hosts;
        options.sslOptions = new Object();

        if(config.usetls){
            options.sslOptions.ca = [fs.readFileSync(config.cacert, 'utf-8')];
            options.sslOptions.cert = [fs.readFileSync(config.clientcert, 'utf-8')];
            options.sslOptions.key = [fs.readFileSync(config.privatekey, 'utf-8')];
            options.sslOptions.passphrase = config.passphrase;
            options.sslOptions.rejectUnauthorized = config.selfsign;
        }
        
        node.options = options;
    }
    RED.nodes.registerType("kafka-broker",KafkaBrokerNode);
}
