import { AuthProviderType } from '@elrond-giants/erdjs-auth/dist/types';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

import MaiarLoginPopup from '../../components/MaiarLoginPopup';
import { walletConnectDeepLink } from '../../config';
import { useAuth } from '../../hooks/useAuth';
import { homePath } from '../../utils/routes';

const Auth: NextPage = () => {
  const { authenticated, loading, login } = useAuth();
  const router = useRouter();
  const [maiarAuthUri, setMaiarAuthUri] = useState("");
  const [authQrCode, setAuthQrCode] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [ledgerAccounts, setLedgerAccounts] = useState<string[]>([]);

  useEffect(() => {
    setShowPopup(!!(authQrCode && isPopupOpen));
  }, [authQrCode, isPopupOpen]);

  useEffect(() => {
    if (!authenticated || loading) {
      return;
    }

    (async () => {
      await router.replace(homePath);
    })();
  }, [router, loading, authenticated]);

  const maiarClickHandler = async () => {
    const uri = await login(AuthProviderType.MAIAR);
    const qrCode = await QRCode.toString(uri, { type: "svg" });
    const authUri = `${walletConnectDeepLink}?wallet-connect=${encodeURIComponent(uri)}`;
    setAuthQrCode(qrCode);
    setMaiarAuthUri(authUri);
    setIsPopupOpen(true);
  };

  const webClickHandler = async () => {
    await login(AuthProviderType.WEBWALLET);
  };

  const extensionClickHandler = async () => {
    await login(AuthProviderType.EXTENSION);
  };

  const ledgerClickHandler = async () => {
    // const accounts = await getLedgerAccounts();
    setLedgerAccounts([]);
  };

  const loginWithLedger = async (accountIndex: number) => {
    await login(AuthProviderType.LEDGER, accountIndex);
  };

  return (
    <>
      <div className="flex sm:h-screen">
        <div
          className="flex-1 hidden sm:block bg-cover bg-center relative"
          style={{ backgroundImage: "url(/auth-bg.jpg)" }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
          <div className="absolute top-0 left-0 w-full h-full z-10 p-20 flex flex-col items-start justify-between">
            <img src="/auth-logo.svg" className="h-16" />

            <p className="text-white font-semibold text-6xl max-w-xl">
              A collection of <span className="text-primary">essential resources</span> for developers building on
              Elrond
            </p>
          </div>
        </div>
        <div className="flex-1 bg-white flex items-center justify-center h-screen">
          <div className="max-w-lg">
            <img src="/logo_light.svg" className="w-full px-8 mx-auto mb-16 sm:hidden" />
            <h1 className="text-3xl sm:text-4xl text-primary font-semibold mb-4 text-center">Connect your wallet</h1>
            <p className="text-gray-500 mb-10 text-center">Pick a login method & let&apos;s build together!</p>
            <div className="flex flex-col max-w-xs mx-auto space-y-3 mb-24">
              <button type="button" className="auth-button" onClick={maiarClickHandler}>
                Maiar
              </button>
              <button type="button" className="auth-button" onClick={webClickHandler}>
                Web Wallet
              </button>
              <button type="button" className="auth-button" onClick={extensionClickHandler}>
                Extension
              </button>
              <p className="text-xs text-gray-400 text-center">* To use Ledger, please select Web Wallet.</p>
            </div>

            <div>
              <p className="text-xl font-semibold text-gray-700 text-center">New to Elrond Blockchain?</p>
              <p className="text-gray-700 text-xl text-center">
                Easily create your own Elrond wallet using{" "}
                <a href="https://maiar.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  Maiar
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4 min-h-half-screen bg-primary">
        <h3 className="text-5xl sm:text-6xl text-yellowc font-bold text-center sm:text-left">Connect your wallet</h3>
        <p className="text-3xl text-white font-semibold pt-5 pb-10">Pick a login method</p>
        <div className="flex items-center space-x-3">
          <button type="button" className="auth-button bg-bluec focus:ring-bluec" onClick={maiarClickHandler}>
            Maiar
          </button>
          <button type="button" className="auth-button bg-yellowc focus:ring-yellowc" onClick={webClickHandler}>
            Web Wallet
          </button>
          <button type="button" className="auth-button bg-pinkc focus:ring-pinkc" onClick={extensionClickHandler}>
            Extension
          </button>
          {/*<button*/}
          {/*    type="button"*/}
          {/*    className="auth-button bg-orange-300 focus:ring-orange-300"*/}
          {/*    onClick={ledgerClickHandler}*/}
          {/*>*/}
          {/*    Ledger*/}
          {/*</button>*/}
        </div>
        {ledgerAccounts.length > 0 && (
          <div className="flex items-center">
            <span>Select ledger account</span>
            <select className="m-10" onChange={(e) => loginWithLedger(parseInt(e.target.value))}>
              {ledgerAccounts.map((account, index) => (
                <option key={account} value={index}>
                  {account}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <MaiarLoginPopup qrCode={authQrCode} uri={maiarAuthUri} open={showPopup} setOpen={setIsPopupOpen} />
    </>
  );
};

export default Auth;
