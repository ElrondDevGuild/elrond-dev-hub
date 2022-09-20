import {AuthProviderType, IAuthProvider, NetworkEnv} from "@elrond-giants/erdjs-auth/dist/types";
import {
    ExtensionProviderFactory,
    LedgerProviderFactory,
    MaiarProviderFactory,
    WebProviderFactory
} from "@elrond-giants/erdjs-auth";


export default class ProviderBuilder {
    private env: NetworkEnv;
    constructor(env:NetworkEnv) {
        this.env = env;
    }

    buildProvider(type: AuthProviderType | string, options?: any): IAuthProvider {
        let providerName = type.toLowerCase();
        providerName = providerName.charAt(0).toUpperCase() + providerName.slice(1);
        const method = `build${providerName}Provider`;

        // @ts-ignore
        if (typeof this[method] === "function") {
            // @ts-ignore
            return this[method](options);
        }

        throw new Error(`There is no auth provider called ${providerName}`);

    }

    protected buildMaiarProvider() {
        return new MaiarProviderFactory(this.env)
            .createProvider();
    }

    protected buildWebwalletProvider(options: any) {
        return new WebProviderFactory(this.env)
            .setConnectionOptions(options)
            .createProvider();
    }

    protected buildExtensionProvider() {
        return new ExtensionProviderFactory().createProvider();
    }

    protected buildLedgerProvider() {
        return new LedgerProviderFactory().createProvider();
    }
};