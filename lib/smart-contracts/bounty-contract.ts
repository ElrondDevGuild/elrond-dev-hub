import {
  Account,
  Address,
  Transaction,
  TransactionPayload,
  BytesValue,
  Balance,
  GasLimit,
  NetworkConfig,
  ContractFunction,
  TokenPayment
} from '@multiversx/sdk-core';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers';

// Configurazione per l'ambiente MultiversX (testnet come default)
const NETWORK_CONFIG = {
  mainnet: {
    chainId: '1',
    apiUrl: 'https://api.multiversx.com',
    explorerUrl: 'https://explorer.multiversx.com'
  },
  devnet: {
    chainId: 'D',
    apiUrl: 'https://devnet-api.multiversx.com',
    explorerUrl: 'https://devnet-explorer.multiversx.com'
  },
  testnet: {
    chainId: 'T',
    apiUrl: 'https://testnet-api.multiversx.com',
    explorerUrl: 'https://testnet-explorer.multiversx.com'
  }
};

// Classe per l'interazione con il contratto delle bounty
export class BountyContract {
  // Singleton pattern
  private static instance: BountyContract;
  private provider: ApiNetworkProvider;
  private network: 'mainnet' | 'devnet' | 'testnet';
  private contractAddress: string;

  // Costruttore privato per il singleton pattern
  private constructor(
    network: 'mainnet' | 'devnet' | 'testnet' = 'testnet',
    contractAddress?: string
  ) {
    this.network = network;
    this.provider = new ApiNetworkProvider(NETWORK_CONFIG[network].apiUrl);
    this.contractAddress = contractAddress || '';
  }

  // Metodo per ottenere l'istanza singleton
  public static getInstance(
    network?: 'mainnet' | 'devnet' | 'testnet',
    contractAddress?: string
  ): BountyContract {
    if (!BountyContract.instance) {
      BountyContract.instance = new BountyContract(network, contractAddress);
    }
    return BountyContract.instance;
  }

  // Setter per l'indirizzo del contratto
  public setContractAddress(address: string): void {
    this.contractAddress = address;
  }

  // Getter per l'indirizzo del contratto
  public getContractAddress(): string {
    return this.contractAddress;
  }

  // Getter per l'ambiente di rete corrente
  public getNetwork(): string {
    return this.network;
  }

  // Metodo per verificare se un contratto è finanziato
  public async isBountyFunded(bountyId: string): Promise<boolean> {
    try {
      const result = await this.provider.queryContract({
        address: new Address(this.contractAddress),
        func: new ContractFunction('isBountyFunded'),
        args: [BytesValue.fromUTF8(bountyId)]
      });

      if (result.returnData.length > 0 && result.returnData[0]) {
        return result.returnData[0].asString === 'true';
      }
      return false;
    } catch (error) {
      console.error('Error checking if bounty is funded:', error);
      return false;
    }
  }

  // Crea una transazione per finanziare una bounty
  public createFundBountyTransaction(
    senderAddress: string,
    bountyId: string,
    amount: string,
    tokenIdentifier: string = 'EGLD'
  ): Transaction {
    if (!this.contractAddress) {
      throw new Error('Contract address not set');
    }

    const egldAmount = tokenIdentifier === 'EGLD' 
      ? TokenPayment.egldFromAmount(amount)
      : TokenPayment.fungibleFromAmount(tokenIdentifier, amount, 18); // Assuming 18 decimals for ESDT
    
    const transaction = new Transaction({
      sender: new Address(senderAddress),
      receiver: new Address(this.contractAddress),
      value: egldAmount.valueOf(),
      gasLimit: new GasLimit(50000000),
      chainID: NETWORK_CONFIG[this.network].chainId,
      data: TransactionPayload.contractCall()
        .setFunction(new ContractFunction('fundBounty'))
        .setArgs([BytesValue.fromUTF8(bountyId)])
        .build()
    });

    return transaction;
  }

  // Crea una transazione per selezionare un vincitore per una bounty
  public createSelectWinnerTransaction(
    senderAddress: string,
    bountyId: string,
    winnerAddress: string
  ): Transaction {
    if (!this.contractAddress) {
      throw new Error('Contract address not set');
    }

    const transaction = new Transaction({
      sender: new Address(senderAddress),
      receiver: new Address(this.contractAddress),
      value: Balance.Zero().valueOf(),
      gasLimit: new GasLimit(50000000),
      chainID: NETWORK_CONFIG[this.network].chainId,
      data: TransactionPayload.contractCall()
        .setFunction(new ContractFunction('selectWinner'))
        .setArgs([
          BytesValue.fromUTF8(bountyId),
          new Address(winnerAddress).toTopBytes()
        ])
        .build()
    });

    return transaction;
  }

  // Crea una transazione per ritirare fondi da una bounty senza vincitori
  public createWithdrawFundsTransaction(
    senderAddress: string,
    bountyId: string
  ): Transaction {
    if (!this.contractAddress) {
      throw new Error('Contract address not set');
    }

    const transaction = new Transaction({
      sender: new Address(senderAddress),
      receiver: new Address(this.contractAddress),
      value: Balance.Zero().valueOf(),
      gasLimit: new GasLimit(50000000),
      chainID: NETWORK_CONFIG[this.network].chainId,
      data: TransactionPayload.contractCall()
        .setFunction(new ContractFunction('withdrawFunds'))
        .setArgs([BytesValue.fromUTF8(bountyId)])
        .build()
    });

    return transaction;
  }

  // Ottieni le informazioni di una bounty dallo smart contract
  public async getBountyInfo(bountyId: string): Promise<any> {
    try {
      const result = await this.provider.queryContract({
        address: new Address(this.contractAddress),
        func: new ContractFunction('getBountyInfo'),
        args: [BytesValue.fromUTF8(bountyId)]
      });

      if (result.returnData.length > 0) {
        return {
          amount: result.returnData[0]?.asString ?? '0',
          creator: result.returnData[1]?.asString ?? '',
          status: result.returnData[2]?.asString ?? 'Unknown',
          winner: result.returnData[3]?.asString ?? '',
          deadline: result.returnData[4]?.asString ?? '0'
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting bounty info from contract:', error);
      return null;
    }
  }

  // Ottieni l'URL dell'explorer per una transazione
  public getTransactionUrl(txHash: string): string {
    return `${NETWORK_CONFIG[this.network].explorerUrl}/transactions/${txHash}`;
  }

  // Ottieni l'URL dell'explorer per un indirizzo
  public getAddressUrl(address: string): string {
    return `${NETWORK_CONFIG[this.network].explorerUrl}/accounts/${address}`;
  }
}

// Esporta un'istanza pre-configurata
export const bountyContract = BountyContract.getInstance('testnet');

// Esporta una funzione di utility per ottenere un'istanza configurata
export function getBountyContract(
  network: 'mainnet' | 'devnet' | 'testnet' = 'testnet',
  contractAddress?: string
): BountyContract {
  return BountyContract.getInstance(network, contractAddress);
} 