document.addEventListener('DOMContentLoaded', function() {
    const transactionForm = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const totalBudgetValue = document.getElementById('total-budget-value');
    const totalExpenses = document.getElementById('total-expenses');
    const totalIncomes = document.getElementById('total-incomes');
    const resetButton = document.getElementById('reset-button');
    const negativeButton = document.getElementById('negative-button');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Update UI with loaded transactions
    updateTransactionList();
    updateTotalIncomeAndExpenses();
    updateBudget();

    transactionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;

        const transaction = {
            amount: amount,
            type: type,
            category: category
        };

        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        updateTransactionList();
        updateTotalIncomeAndExpenses();
        updateBudget();

        transactionForm.reset();
    });

    resetButton.addEventListener('click', function() {
        localStorage.removeItem('transactions');
        transactions = [];
        updateTransactionList();
        updateTotalIncomeAndExpenses();
        updateBudget();
    });

    negativeButton.addEventListener('click', function() {
        window.location.href = "http://127.0.0.1:5000";
    });

    function updateTransactionList() {
        transactionList.innerHTML = '';
        transactions.forEach(transaction => {
            const listItem = document.createElement('li');
            listItem.textContent = `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} - ${transaction.category}: $${transaction.amount.toFixed(2)}`;
            transactionList.appendChild(listItem);
        });
    }

    function updateTotalIncomeAndExpenses() {
        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else {
                totalExpense += transaction.amount;
            }
        });

        totalExpenses.textContent = totalExpense.toFixed(2);
        totalIncomes.textContent = totalIncome.toFixed(2);
    }

    function updateBudget() {
        const totalIncome = parseFloat(totalIncomes.textContent) || 0;
        const totalExpense = parseFloat(totalExpenses.textContent) || 0;
        const totalBudget = totalIncome - totalExpense;

        totalBudgetValue.textContent = totalBudget.toFixed(2);
    }
});
