const anchor = require('@project-serum/anchor');

const { SystemProgram } = anchor.web3;

const main = async () => {
  console.log('Starting test...');

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Firstsolanaproject;

  // Create an account keypair for our program to use
  const baseAccount = anchor.web3.Keypair.generate();

  // Call start_stuff_off, pass it the parameters it needs
  const tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log('Your transaction signature:', tx);

  // Fetch data from the account
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('GIF Count:', account.totalGifs.toString());

  await program.rpc.addGif(
    'https://media.giphy.com/media/YekOPcusum8vK/giphy.gif',
    {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    }
  );

  // Get the account again
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('Gif Count:', account.totalGifs.toString());
  console.log('GIF List:', account.gifList);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
