function Payer(name) {
    this.name = name;
    this.transactions = [];
    
    // The combination of negative and positive points in pending transactions.
    this.pointBalance;

    this.positivePointBalance;

    // Points accrued in transactions with negative point values. 
    this.negativePointBalance;

    this.getPointBalance = function() {
        pointBalance = positivePointBalance + negativePointBalance;
        return pointBalance;
    }

    this.sortTransactions = function () {
        this.transactions.sort((transactionA, transactionB) => {
            // The transactions are sorted with the newest timestamp first.
            // When the transactions array is iterated over, it'll be in reverse
            // so that transactions can be removed when the transaction balance hits 0.
            return new Date(transactionB.timestamp) - new Date(transactionA.timestamp);
        });
    },
}


