function Payer(name) {
    this.name = name;
    
    // An array of all pending, unprocessed transactions.
    this.transactions = [];

    // The point total from all active transactions with a positive balance.
    this.positivePointBalance = 0;

    // Points accrued in transactions with negative point values. The transactions aren't stored and are instead
    // represented in this class membet;
    this.negativePointBalance = 0;

    this.pointBalance = 0;
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
        if(requestedPoints < 0 && (this.updatePointBalance() + requestedPoints < 0)) {
            // This would mean a negative transaction is being requested and there aren't enough 
            // points remaining to stop the payer's balance from going negative.
            return false;
        }
        else if(requestedPoints < 0) {
            // Add the negative points to the sum of all negative points that aren't yet processed.
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

    this.resolveNegativeTransactions = function() {
        // Instead of tracking negative POST request transactions in their entirety, only the amount the the 
        // transaction was for is tracked. When the user is finally ready to spend points, the negative
        // values are resolved by canceling out an equal amount of positive points in transactions, starting
        // with the oldest transactions. In this way, older transactions can be added with POST requests
        // and the pending negative transactions will not affect any positive ones until a spending
        // request is made.
        for(var i = this.transactions.length - 1; i >= 0; i--) {
            if(this.negativePointBalance === 0) break;
            var pointsInTransaction = parseInt(this.transactions[i].points);
            if(this.negativePointBalance >= pointsInTransaction) {
                this.negativePointBalance -= pointsInTransaction;
                this.positivePointBalance -= pointsInTransaction;
                this.transactions.pop();
            }
            else {
                pointsInTransaction -= this.negativePointBalance;
                this.positivePointBalance -=  this.negativePointBalance;
                this.negativePointBalance = 0;
                this.transactions[i].points = pointsInTransaction;
            }
        }
        this.updatePointBalance();
    }
}

module.exports = Payer;
