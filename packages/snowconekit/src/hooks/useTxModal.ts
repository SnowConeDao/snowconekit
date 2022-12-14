import { useState, useEffect } from 'react';
import type { Transaction } from '../transactions/transactionStore';
import { useRecentTransactions } from '../transactions/useRecentTransactions';

export type txModalProps = Transaction | null;

type Props = {
  pendingTransactions: Transaction;
  openTxModal: () => void;
};

type stateProps = {
  closeTxModal: () => void;
  openTxModal: () => void;
  txModalOpen: boolean;
};

const useTxModal = ({ closeTxModal, openTxModal, txModalOpen }: stateProps) => {
  const [trackedTx, setTrackedTx] = useState<txModalProps>(null);

  const transactions = useRecentTransactions();

  const pendingTransactions = useRecentTransactions().filter(
    ({ status }) => status === 'pending'
  )[0];

  const findTx = (tx: txModalProps) =>
    tx && transactions.filter(({ hash }) => hash === tx?.hash)[0];

  const setTx = (transaction: Transaction) => {
    if (trackedTx) return;
    if (!trackedTx && transaction) {
      setTrackedTx(findTx(transaction));
    }
  };

  useEffect(() => {
    pendingTransactions && setTx(pendingTransactions);
  }, [pendingTransactions]);

  useEffect(() => {
    trackedTx && !txModalOpen && openTxModal();
  }, [trackedTx]);

  const handleOnClose = () => {
    setTimeout(() => {
      closeTxModal();
      setTrackedTx(null);
    }, 5000);
  };

  useEffect(() => {
    const updatedTx = findTx(trackedTx);
    trackedTx?.status !== updatedTx?.status && setTrackedTx(updatedTx);
  }, [transactions]);

  useEffect(() => {
    trackedTx && findTx(trackedTx)?.status === 'confirmed' && handleOnClose();
  }, [trackedTx, transactions]);

  return { trackedTx };
};

export default useTxModal;
