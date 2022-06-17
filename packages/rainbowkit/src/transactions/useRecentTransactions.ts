import { useEffect, useState } from 'react';

import { useAddress } from '../hooks/useAddress';
import { useChainId } from '../hooks/useChainId';
import type { Transaction } from './transactionStore';
import { useTransactionStore } from './TransactionStoreContext';

export function useRecentTransactions(): Transaction[] {
  const store = useTransactionStore();
  const address = useAddress();
  const chainId = useChainId();

  const [transactions, setTransactions] = useState(() =>
    store && address && chainId ? store.getTransactions(address, chainId) : []
  );

  console.log(transactions);

  useEffect(() => {
    if (store && address && chainId) {
      setTransactions(store.getTransactions(address, chainId));

      return store.onChange(() => {
        setTransactions(store.getTransactions(address, chainId));
      });
    }
  }, [store, address, chainId]);

  return transactions;
}
