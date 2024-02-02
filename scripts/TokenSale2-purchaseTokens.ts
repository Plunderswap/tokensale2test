import { ethers, network, run } from "hardhat";

const main = async () => {
  // Compile contracts
  await run("compile");
  console.log("Compiled contracts.");

  const networkName = network.name;

  // Sanity checks
  if (networkName === "mainnet") {
    if (!process.env.KEY_MAINNET) {
      throw new Error(
        "Missing private key, refer to README 'Deployment' section"
      );
    }
  } else if (networkName === "testnet") {
    if (!process.env.KEY_TESTNET) {
      throw new Error(
        "Missing private key, refer to README 'Deployment' section"
      );
    }
  }

  const [deployer] = await ethers.getSigners();

  console.log("Retrieving TokenSale2..");
  const tokenSale2 = await ethers.getContractFactory("TokenSale2");
  const factory = await tokenSale2.attach("0x53208756b710F03e721C5cAa7D294A8257508307");
  
  // Test 1 - estimateGas with no gasLimit - FAILS
  // let estimated = await factory.estimateGas.purchaseTokens(1, {value: 100000000000});
  // const tx = await factory.purchaseTokens(1, { value: 100000000000, gasLimit: estimated });
  
  // Test 2 - estimateGas with gasLimit - FAILS
  let estimated = await factory.estimateGas.purchaseTokens(1, {value: 100000000000, gasLimit: 1000000});
  const tx = await factory.purchaseTokens(1, { value: 100000000000, gasLimit: estimated });

  // Test 3 - provide gasLimit - SUCCEEDS!
  // const tx = await factory.purchaseTokens(1, { value: 100000000000, gasLimit: 1000000 });

  // Test 4 - no gaslimit or estimation - FAILS
  // const tx = await factory.purchaseTokens(1, { value: 100000000000 });

  console.log("Transaction hash:", tx.hash);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });