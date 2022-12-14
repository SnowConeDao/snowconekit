import React from 'react';
import { useNetwork } from 'wagmi';
import { increaseHitAreaForHoverTransform } from '../../css/increaseHitAreaForHoverTransform.css';
import { Transaction } from '../../transactions/transactionStore';
import { chainToExplorerUrl } from '../../utils/chainToExplorerUrl';
import { isMobile } from '../../utils/isMobile';
import { Box } from '../Box/Box';
import { Text } from '../Text/Text';
import { AsyncImage } from '../AsyncImage/AsyncImage';
import { useSnowConeKitChainsById } from '../SnowConeKitProvider/SnowConeKitChainContext';
import { timeAgo } from '../../utils/timeAgo';
import { formatTransactionAddress } from '../ConnectButton/formatModalAddresses';
import CheckIcon from '../Icons/check.png';
import { Avatar, Badge, BadgeImage, Time } from './ModalTxs.css';
import { formatENS } from '../ConnectButton/formatENS';
import { formatAddress } from '../ConnectButton/formatAddress';
import { useMainnetEnsName } from '../../hooks/useMainnetEnsName';

interface ModalTxProps {
  address: string;
  tx: Transaction;
}

export function ModalTxItem({ tx, address }: ModalTxProps) {
  const mobile = isMobile();
  const color = tx.status === 'failed' ? 'error' : 'accentColor';
  const { chain } = useNetwork();
  const ensName = useMainnetEnsName(address);
  const explorerLink = chainToExplorerUrl(chain);
  const snowconekitChainsById = useSnowConeKitChainsById();
  const rainbowKitChain = chain ? snowconekitChainsById[chain.id] : undefined;
  const chainIconUrl = rainbowKitChain?.iconUrl ?? undefined;
  const confirmationStatus =
    tx.status === 'confirmed'
      ? 'Confirmed'
      : tx.status === 'failed'
      ? 'Failed'
      : 'Pending';

  const displayName =
    ensName && address ? formatENS(ensName) : formatAddress(address);

  return (
    <>
      <Box
        {...(explorerLink
          ? {
              as: 'a',
              borderRadius: 'menuButton',
              className: increaseHitAreaForHoverTransform.grow,
              href: `${explorerLink}/tx/${tx.hash}`,
              rel: 'noreferrer',
              target: '_blank',
            }
          : {})}
        display="flex"
      >
        <Box
          {...(explorerLink
            ? {
                background: { hover: 'profileForeground' },
                borderRadius: 'menuButton',
                transform: { active: 'shrink' },
                transition: 'default',
              }
            : {})}
          color="modalText"
          display="flex"
          flexDirection="row"
          padding="8"
          width="full"
          gap={mobile ? '16' : '14'}
          alignItems="center"
        >
          <Box className={Avatar}>
            <AsyncImage
              borderRadius="full"
              height="full"
              src={chainIconUrl}
              width="full"
            />
            <Box
              className={Badge}
              style={{
                backgroundColor:
                  confirmationStatus === 'Confirmed' ? 'limegreen' : 'red',
              }}
            >
              <img className={BadgeImage} src={CheckIcon} />
            </Box>
          </Box>
          <Box
            width="full"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box display="flex" flexDirection="column" gap={mobile ? '3' : '1'}>
              <Box>
                <Text
                  display="flex"
                  color="modalText"
                  font="body"
                  size={mobile ? '16' : '14'}
                  weight="bold"
                >
                  {displayName}
                </Text>
              </Box>
              <Box>
                <Text
                  color="modalTextSecondary"
                  font="body"
                  size="14"
                  weight={mobile ? 'medium' : 'regular'}
                >
                  {tx.description}
                </Text>
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              gap={mobile ? '3' : '1'}
              height="full"
            >
              <Box className={Time}>
                <Text
                  color="modalText"
                  font="body"
                  size={mobile ? '16' : '14'}
                  weight="regular"
                >
                  {timeAgo(tx.timeStamp)}
                </Text>
              </Box>
            </Box>
          </Box>
          {/* {explorerLink && (
            <Box alignItems="center" color="modalTextDim" display="flex">
              <ExternalLinkIcon />
            </Box>
          )} */}
        </Box>
      </Box>
    </>
  );
}
