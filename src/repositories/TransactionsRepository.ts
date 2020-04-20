import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface ListTransactionsDTO {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public getBalance(): Balance {
    const { income, outcome } = this.transactions.reduce(
      (types, transaction) => {
        const { income = 0, outcome = 0 } = types;
        if (transaction.type === 'income') {
          return { ...types, income: income + transaction.value };
        }
        return { ...types, outcome: outcome + transaction.value };
      },
      { income: 0, outcome: 0 },
    );

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }

  public all(): ListTransactionsDTO {
    const listTransactions = {
      transactions: this.transactions,
      balance: this.getBalance(),
    };
    return listTransactions;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
