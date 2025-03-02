import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
    NotAllowedToChangeSellerFeeBasisPointsError
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { sign } from "crypto";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("ETr1VqmvzEAb4uadYpSvzWDv65n82skAxWucMcCcpZcu")

// Create a UMI connection
const umi = createUmi('https://devnet-rpc.shyft.to?api_key=AOzc0pZ81LE4kGVi');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint:mint,
            mintAuthority:signer}

        let data: DataV2Args = {
            name:"Amster",
            symbol: "Man",
            uri: "",
            sellerFeeBasisPoints: 20,
            creators:null,
            collection:null,
            uses:null
            
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data: data,
            isMutable:true,
            collectionDetails:null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
