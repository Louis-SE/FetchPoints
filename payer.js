function Payer(name) {
    this.name = name;
    this.transactions = [];

    // The combincation
    this.pointBalance = 0;

    // The point total from all active transactions with a positive balance.
    this.positivePointBalance = 0;

    // Points accrued in transactions with negative point values. The transactions aren't stored and are instead
    // represented in this class membet;
    this.negativePointBalance = 0;

    this.updatePointBalance = function() {
        this.pointBalance = this.positivePointBalance - this.negativePointBalance;
        return this.pointBalance;
    }

    this.sortTransactions = function () {
        this.transactions.sort((transactionA, transactionB) => {
            // The transactions are sorted with the newest timestamp first.
            // When the transactions array is iterated over, it'll be in reverse
            // so that transactions can be removed when the transaction balance hits 0.
            return new Date(transactionB.timestamp) - new Date(transactionA.timestamp);
        });
    }

    this.addTransaction = function (transaction) {
        const requestedPoints = parseInt(transaction.points);
        if(requestedPoints < 0 && (this.pointBalance + requestedPoints < 0)) {
            // This would mean a negative transaction is being requested and there aren't enough 
            // points remaining to stop the payer's balance from going negative.
            return false;
        }
        else if(requestedPoints < 0) {
            // Add the negative points to the sum of tracked negative points that aren't yet processed.
            this.negativePointBalance += Math.abs(requestedPoints);
        }
        else {
            this.transactions.push(transaction);
            this.sortTransactions();
            this.positivePointBalance += requestedPoints;
        }
        this.updatePointBalance();
        return true;
    }
}

module.exports = Payer;
