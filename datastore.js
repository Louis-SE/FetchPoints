let storage = {
    transactions : [],
    
    addTransaction : function (transaction) {
        let pointValue = parseInt(transaction.points);
        if(pointValue > 0) {
            this.transactions.push(transaction);
            this.sortTransactions();
        }
    },

    sortTransactions : function () {
        this.transactions.sort((transactionA, transactionB) => {
            return new Date(transactionB.timestamp) - new Date(transactionA.timestamp);
        });
    },

    getPayerPoints: function () {
        let payers = new Map();
        
        // Sums up the points for each payer across all transactions.
        for(let transaction of this.transactions) {
            if(!payers.has(transaction.payer)) {
                payers.set(transaction.payer, 0);
            }
            let payerPoints = parseInt(transaction.points);
            payerPoints += payers.get(transaction.payer);
            payers.set(transaction.payer, payerPoints);
        }

        // Compiles the point totals into a JSON string.
        var allPoints = "{";
        for(const [key, value] of payers) {
            allPoints += `${key} : ${value},`;
        }
        allPoints = allPoints.slice(0, allPoints.length - 1);
        allPoints += "}"
        return allPoints;
    },
    
    spendPoints: function (transaction) {

    }
};

exports.storage = storage;