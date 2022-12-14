/* eslint-disable sort-keys-fix/sort-keys-fix */
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { Chain } from '../../../components/SnowConeKitProvider/SnowConeKitChainContext';
import { isAndroid, isMobile } from '../../../utils/isMobile';
import { Wallet } from '../../Wallet';
import { getWalletConnectConnector } from '../../getWalletConnectConnector';

export interface MetaMaskOptions {
  chains: Chain[];
  shimDisconnect?: boolean;
}

export function isMetaMask(ethereum: NonNullable<typeof window['ethereum']>) {
  // Logic borrowed from wagmi's MetaMaskConnector
  // https://github.com/tmm/wagmi/blob/main/packages/core/src/connectors/metaMask.ts
  const isMetaMask = Boolean(ethereum.isMetaMask);

  if (!isMetaMask) {
    return false;
  }

  // Brave tries to make itself look like MetaMask
  // Could also try RPC `web3_clientVersion` if following is unreliable
  if (ethereum.isBraveWallet && !ethereum._events && !ethereum._state) {
    return false;
  }

  if (ethereum.isTokenary) {
    return false;
  }

  return true;
}

export const metaMask = ({
  chains,
  shimDisconnect,
}: MetaMaskOptions): Wallet => {
  const isMetaMaskInjected =
    typeof window !== 'undefined' &&
    typeof window.ethereum !== 'undefined' &&
    isMetaMask(window.ethereum);

  const shouldUseWalletConnect = isMobile() && !isMetaMaskInjected;

  return {
    id: 'metaMask',
    name: 'MetaMask',
    iconUrl: async () => (await import('./metaMask.svg')).default,
    iconBackground: '#fff',
    installed: !shouldUseWalletConnect ? isMetaMaskInjected : undefined,
    downloadUrls: {
      browserExtension:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',
      android: 'https://play.google.com/store/apps/details?id=io.metamask',
      ios: 'https://apps.apple.com/us/app/metamask/id1438144202',
    },
    createConnector: () => {
      const connector = shouldUseWalletConnect
        ? getWalletConnectConnector({ chains })
        : new MetaMaskConnector({
            chains,
            options: { shimDisconnect },
          });

      return {
        connector,
        mobile: {
          getUri: shouldUseWalletConnect
            ? async () => {
                const { uri } = (await connector.getProvider()).connector;

                return isAndroid()
                  ? uri
                  : `https://metamask.app.link/wc?uri=${encodeURIComponent(
                      uri
                    )}`;
              }
            : undefined,
        },
      };
    },
  };
};
