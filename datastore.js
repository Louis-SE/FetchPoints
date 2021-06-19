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
            const successMessage = {};
            successMessage.status = "Success";
            successMessage.message = "POST transaction successful"
            return successMessage;
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
        for(const [name, payer] of payerMap) {
            // This will update point values before adding them to the returned JSON string.
            // The balance values should be correct at this point, but in case updatePoint balance
            // has deviated from the positive and negative point values, the function is run again.
            allPoints[name] = payer.updatePointBalance();
        }  
        return allPoints;
    },
    
    spendPoints: function (transaction) {
        var pointsToSpend = parseInt(transaction.points);
        if(pointsToSpend <= 0) {
            const errorResult = {};
            errorResult.error = "Invalid Point Amount";
            errorResult.message = "Points to spend should be positive";
            return errorResult;
        }

        const pointsInAccount = this.getPointsTotal();
        if(pointsToSpend > pointsInAccount) {
            const errorResult = {};
            errorResult.error = "Not Enough Points";
            errorResult.message = "There are not enough points in this account to process this request";
            errorResult.currentPointBalance = pointsInAccount;
            return errorResult;
        }

        let payers = preparePayers();
    },

    getPointsTotal: function() {
        var points = 0;
        for(const [name, payer] of payerMap) {
            points += payer.updatePointBalance();
        }
        return points;
    },

    preparePayers: function() {
        // At this point payers may have negative balances associated with their point values.
        // This function will ask each payer in payerMap to resolve the negative
        // transactions so that only positive transactions remain.
        let payersWithBalance = [];

        for(const [name, payer] of payerMap) {
            payer.resolveNegativeTransactions();
            if(payer.updatePointBalance() > 0 ) {
                payersWithBalance.push(payer);
            }
        }

        return payersWithBalance;
    }
};

exports.storage = storage;