import "@skyfire-xyz/skyfire-sdk";

// TODO: Remove this when SDK exports types.
declare module "@skyfire-xyz/skyfire-sdk" {
  export declare class WalletBalanceClaims {
    "sent": string;
    "received": string;
    static readonly discriminator: string | undefined;
    static readonly attributeTypeMap: Array<{
      name: string;
      baseName: string;
      type: string;
      format: string;
    }>;
    static getAttributeTypeMap(): {
      name: string;
      baseName: string;
      type: string;
      format: string;
    }[];
    constructor();
  }
  export declare class WalletBalanceEscrow {
    "total": string;
    "available": string;
    "allowance": string;
    static readonly discriminator: string | undefined;
    static readonly attributeTypeMap: Array<{
      name: string;
      baseName: string;
      type: string;
      format: string;
    }>;
    static getAttributeTypeMap(): {
      name: string;
      baseName: string;
      type: string;
      format: string;
    }[];
    constructor();
  }
  export declare class WalletBalanceNative {
    "balance": string;
    static readonly discriminator: string | undefined;
    static readonly attributeTypeMap: Array<{
      name: string;
      baseName: string;
      type: string;
      format: string;
    }>;
    static getAttributeTypeMap(): {
      name: string;
      baseName: string;
      type: string;
      format: string;
    }[];
    constructor();
  }
  export declare class WalletBalanceOnchain {
    "total": string;
    static readonly discriminator: string | undefined;
    static readonly attributeTypeMap: Array<{
      name: string;
      baseName: string;
      type: string;
      format: string;
    }>;
    static getAttributeTypeMap(): {
      name: string;
      baseName: string;
      type: string;
      format: string;
    }[];
    constructor();
  }
  export declare class WalletBalance {
    "_native": WalletBalanceNative;
    "claims": WalletBalanceClaims;
    "escrow": WalletBalanceEscrow;
    "onchain": WalletBalanceOnchain;
    static readonly discriminator: string | undefined;
    static readonly attributeTypeMap: Array<{
      name: string;
      baseName: string;
      type: string;
      format: string;
    }>;
    static getAttributeTypeMap(): {
      name: string;
      baseName: string;
      type: string;
      format: string;
    }[];
    constructor();
  }
}
