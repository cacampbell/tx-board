import Transport from "@ledgerhq/hw-transport";
import type { PublicKey } from "@hashgraph/sdk";

const CLA = 0xe0;
const INS_GET_PK = 0x02;
const INS_SIGN_TX = 0x04;

const P1_UNUSED_APDU = 0x00;
const P2_UNUSED_APDU = 0x00;

const OPEN_TIMEOUT = 100_000;
const LISTENER_TIMEOUT = 300_000;

interface APDU {
  CLA: number;
  INS: number;
  P1: number;
  P2: number;
  buffer: Buffer;
}

export class Wallet {
  private transport: Transport | null = null;
  private publicKeys: Map<number, PublicKey> = new Map();

  private async getTransport(): Promise<Transport | null> {
    if (this.transport != null) {
      return this.transport;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const TransportWebUSB = (await import("@ledgerhq/hw-transport-webusb"))[
      // eslint-disable-next-line unicorn/no-await-expression-member
      "default"
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.transport = await TransportWebUSB.create(
      OPEN_TIMEOUT,
      LISTENER_TIMEOUT
    );

    if (this.transport != null) {
      this.transport.on("disconnect", async () => {
        try {
          await this.transport?.close();
          this.transport = null;
        } catch (error) {
          if (error instanceof DOMException) {
            console.error("Ledger Transport threw DOM Exception");
          } else throw error;
        }
      });
    }

    return this.transport;
  }

  private async sendAPDU(message: APDU): Promise<Buffer | null> {
    let response: Buffer | null = null;

    await this.getTransport().then(async (transport) => {
      if (transport != null) {
        response = await transport.send(
          message.CLA,
          message.INS,
          message.P1,
          message.P2,
          message.buffer
        );
      }
    });

    return response;
  }

  private async signTransaction(
    index: number,
    txn: Uint8Array
  ): Promise<Uint8Array> {
    const data = Buffer.from(txn);
    const buffer = Buffer.alloc(4 + data.length);
    buffer.writeUInt32LE(index);
    buffer.fill(data, 4);

    const response = await this.sendAPDU({
      CLA,
      INS: INS_SIGN_TX,
      P1: P1_UNUSED_APDU,
      P2: P2_UNUSED_APDU,
      buffer,
    });

    if (response != null) {
      return Uint8Array.prototype.slice.call(response, 0, -2);
    }

    return new Uint8Array();
  }

  getTransactionSigner(
    index: number
  ): (transactionBody: Uint8Array) => Promise<Uint8Array> {
    return (tx) => this.signTransaction(index, tx);
  }

  async getPublicKey(index: number): Promise<PublicKey | undefined> {
    const { PublicKey } = await import("@hashgraph/sdk");

    if (this.publicKeys.get(index) != null) {
      return this.publicKeys.get(index);
    } else {
      const buffer = Buffer.alloc(4);
      buffer.writeUInt32LE(index);

      const response = await this.sendAPDU({
        CLA,
        INS: INS_GET_PK,
        P1: P1_UNUSED_APDU,
        P2: P2_UNUSED_APDU,
        buffer,
      });

      if (response != null) {
        const pubKeyStr = response.slice(0, -2).toString("hex");
        const pubKey = PublicKey.fromString(pubKeyStr);
        this.publicKeys.set(index, pubKey);
        return pubKey;
      }
    }
  }
}
