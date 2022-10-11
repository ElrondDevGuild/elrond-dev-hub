import {createContext, PropsWithChildren, useContext, useEffect, useMemo, useState} from "react";
import {User} from "../types/supabase";
import {authKey} from "../config";
import {api} from "../utils/api";
import {AuthProviderType, IAuthProvider, NetworkEnv} from "@elrond-giants/erdjs-auth/dist/types";
import ProviderBuilder from "../utils/auth/ProviderBuilder";
import {LedgerProvider} from "@elrond-giants/erdjs-auth/dist";
import {useRouter} from "next/router";


interface IAuthContext {
    user: User | null;
    authenticated: boolean;
    loading: boolean;
    login: (provider: AuthProviderType, ledgerIndex?: number) => Promise<string>;
    logout: () => void;
    setUser: (user: User) => void;
}

const contextDefaultvalue: IAuthContext = {
    user: null,
    authenticated: false,
    loading: true,
    login: (provider: AuthProviderType, ledgerIndex?: number) => Promise.resolve(''),
    logout: () => {},
    setUser: (user: User) => {},
};
export const AuthContext = createContext(contextDefaultvalue);
export const AuthContextProvider = ({children, env}: PropsWithChildren<{ env: NetworkEnv }>) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [authProvider, setAuthProvider] = useState<IAuthProvider | null>(null);
    const router = useRouter();


    useEffect(() => {
        (async () => {
            if (localStorage.getItem(authKey)) {
                const response = await api.get<User>('/user');
                setUser(response.data);
            }
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (router.isReady) {
            const {nonce, signature, address} = router.query;
            if (nonce != null && nonce[0] && signature && address) {
                (async () => {
                    await doLogin(address as string, nonce[0], signature as string);
                })();
            }
        }
    }, [router]);


    const doLogin = async (address: string, nonce: string, signature: string) => {
        const response = await api.post('auth/login', {
            address,
            nonce,
            signature,
        });

        const {user, token} = response.data;
        localStorage.setItem(authKey, token);
        setUser(user);
    }


    const value = useMemo(() => {
        return {
            user,
            authenticated: !!user,
            loading,
            login: async (providerType: AuthProviderType, ledgerIndex?: number) => {
                const response = await api.post('auth/init');
                const nonce = response.data.nonce;
                const provider = new ProviderBuilder(env).buildProvider(providerType, {
                    loginRedirectUrl: window.location.href + `/${nonce}`,
                });
                provider.onChange = async () => {
                    if (!provider) {return;}
                    const address = provider.getAddress();
                    if (!address) {
                        localStorage.removeItem(authKey);
                        setUser(null);
                        return;
                    }
                    await doLogin(address, nonce, provider.getSignature() ?? "");
                };
                await provider.init();
                if (undefined !== ledgerIndex && authProvider instanceof LedgerProvider) {
                    await authProvider.setAccount(ledgerIndex);
                }
                setAuthProvider(provider);

                return await provider.login(nonce);
            },
            logout: () => {
                setUser(null);
                localStorage.removeItem(authKey);
                if (authProvider) {
                    authProvider.logout();
                }
                // todo: logout from backend
            },
            setUser
        };
    }, [loading, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error(`useAuth must be used within an AuthContextProvider.`);
    }
    return context;
}