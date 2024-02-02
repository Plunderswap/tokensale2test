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

  console.log("Deploying to network:", networkName);

  console.log("Deploying TokenSale2..");
  const tokenPreSale = await ethers.getContractFactory("TokenSale2");
  const factory = await tokenPreSale.deploy("0x14cf1313c2132abecd99c2ae8b594f32b493f613", 100000000000, deployer.address);
  await factory.deployed();

  console.log("TokenSale2 deployed to:", factory.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
