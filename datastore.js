const Payer = require("./payer");
const payerMap = new Map();

const storage = {
    
    addTransaction : function (transaction) {
        const payerName = transaction.payer;
        if(!payerMap.has(payerName)) {
            payerMap.set(payerName, new Payer(payerName));
        }
        let payer = payerMap.get(payerName);
        const addedSucessfuly = payer.addTransaction(transaction);

        if(addedSucessfuly) {
            return "POST transaction successful";
        }
        else {
            const errorResult = {};
            errorResult.error = "Insufficient Points";
            errorResult.payerName = payer.name;
            errorResult.currentPointBalance = payer.pointBalance;
            return errorResult;
        }
    },

    getPayerPoints: function () {
        var allPoints = {};
        for(const [key, value] of payerMap) {
            // This will update point values before adding them to the returned JSON string.
            // The balance values should be correct at this point, but in case updatePoint balance
            // has deviated from the positive and negative point values, the function is run again.
            allPoints[key] = value.updatePointBalance();
        }  
        return allPoints;
    },
    
    spendPoints: function (transaction, payer) {

    }
};

exports.storage = storage;