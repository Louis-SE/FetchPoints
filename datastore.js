let storage = {
    transactions : [],
    
    addTransaction : function (transaction) {
        let pointValue = parseInt(transaction.points);
        if(pointValue > 0) {
            this.transactions.push(transaction);
            this.sortTransactions();
        }
        else if(pointValue < 0) {
            this.spendPoints(transaction, transaction.payer);
        }
    },

    sortTransactions : function () {
        this.transactions.sort((transactionA, transactionB) => {
            // The transactions are sorted with the newest timestamp first.
            // When the transactions array is iterated over, it'll be in reverse
            // so that transactions can be removed when the transaction balance hits 0.
            return new Date(transactionB.timestamp) - new Date(transactionA.timestamp);
        });
    },

    getPayerPoints: function () {
        let payers = new Map();
        
        // Sums up the points for each payer across all transactions and then stores the sum in the payers map.
        console.log();
        for(let transaction of this.transactions) {
            if(!payers.has(transaction.payer)) {
                payers.set(transaction.payer, 0);
            }
            console.log(`${transaction.payer} ${transaction.points} ${transaction.timestamp}`);
            let payerPoints = parseInt(transaction.points);
            payerPoints += payers.get(transaction.payer);
            payers.set(transaction.payer, payerPoints);
        }

        // Compiles the point totals from the payers map into a JSON string.
        var allPoints = "{";
        for(const [key, value] of payers) {
            allPoints += `${key} : ${value},`;
        }
        allPoints = allPoints.slice(0, allPoints.length - 1);
        allPoints += "}"
        return allPoints;
    },
    
    spendPoints: function (transaction, payer) {
        let points = parseInt(transaction.points);
        if(payer == null) {
            // This means so specific payer is being targeted so points can be removed starting with 
            // the oldest transaction.
            for(var i = this.transactions.length - 1; i >= 0; i--) {
                let payerBalance = parseInt(this.transactions[i].points);
                if(payerBalance <= points) {
                    points -= payerBalance;
                    this.transactions.pop();
                }
                else {
                    payerBalance -= points;
                    points = 0;
                    this.transactions[i].points = payerBalance;
                }
                if(points === 0) {
                    break;
                }
            }
        }
        else {
            points = Math.abs(points);
            for(var i = this.transactions.length - 1; i >= 0; i--) {
                if(payer === this.transactions[i].payer) {
                    let payerBalance = parseInt(this.transactions[i].points);
                    if(payerBalance <= points) {
                        points -= payerBalance;
                        this.transactions = this.transactions.splice(i, 1);
                    }
                    else {
                        payerBalance -= points;
                        points = 0;
                        this.transactions[i].points = payerBalance;
                    }
                    if(points === 0) {
                        break;
                    }
                }
            }
        }
    }
};

exports.storage = storage;