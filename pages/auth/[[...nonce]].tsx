import type {NextPage} from 'next'
import {useEffect, useState} from "react";
import {homePath} from "../../utils/routes";
import {useRouter} from "next/router";
import MaiarLoginPopup from "../../components/MaiarLoginPopup";
import {useAuth} from "../../hooks/useAuth";
import {AuthProviderType} from "@elrond-giants/erdjs-auth/dist/types";
import {walletConnectDeepLink} from "../../config";
import QRCode from 'qrcode';


const Auth: NextPage = () => {
    const {authenticated, loading, login} = useAuth();
    const router = useRouter();
    const [maiarAuthUri, setMaiarAuthUri] = useState('');
    const [authQrCode, setAuthQrCode] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [ledgerAccounts, setLedgerAccounts] = useState<string[]>([]);

    useEffect(() => {
        setShowPopup(!!(authQrCode && isPopupOpen));
    }, [authQrCode, isPopupOpen])

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
        const qrCode = await QRCode.toString(uri, {type: "svg"});
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
    }

    const ledgerClickHandler = async () => {
        // const accounts = await getLedgerAccounts();
        setLedgerAccounts([]);
    }

    const loginWithLedger = async (accountIndex: number) => {
        await login(AuthProviderType.LEDGER, accountIndex);
    }


    return (
        <>
            <div className="flex flex-col items-center justify-center space-y-4 min-h-half-screen bg-primary">
                <h3 className="text-5xl sm:text-6xl text-yellowc font-bold text-center sm:text-left">
                    Connect your wallet
                </h3>
                <p className="text-3xl text-white font-semibold pt-5 pb-10">Pick a login method</p>
                <div className="flex items-center space-x-3">
                    <button
                        type="button"
                        className="auth-button bg-bluec focus:ring-bluec"
                        onClick={maiarClickHandler}
                    >
                        Maiar
                    </button>
                    <button
                        type="button"
                        className="auth-button bg-yellowc focus:ring-yellowc"
                        onClick={webClickHandler}
                    >
                        Web Wallet
                    </button>
                    <button
                        type="button"
                        className="auth-button bg-pinkc focus:ring-pinkc"
                        onClick={extensionClickHandler}
                    >
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
                {ledgerAccounts.length > 0 && <div className="flex items-center">
                    <span>Select ledger account</span>
                    <select
                        className="m-10"
                        onChange={(e) => loginWithLedger(parseInt(e.target.value))}
                    >
                        {ledgerAccounts.map((account, index) => (
                            <option key={account} value={index}>{account}</option>
                        ))}
                    </select>
                </div>
                }
            </div>
            <MaiarLoginPopup qrCode={authQrCode} uri={maiarAuthUri} open={showPopup}
                             setOpen={setIsPopupOpen}/>
        </>
    );
}

export default Auth
