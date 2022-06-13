import { Button, TextField } from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import * as web3 from '@solana/web3.js'
import { Header } from 'common/Header'
import { notify } from 'common/Notification'
import { pubKeyUrl, shortPubKey } from 'common/utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { type } from 'os'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'
import { FaQuestion } from 'react-icons/fa'
import { xml2js } from 'xml-js'
import {Wallet} from '@metaplex/js'
import { changeConfirmLocale } from 'antd/lib/modal/locale'

export function Placeholder() {
  return (
    <div className="h-[300px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
  )
}

export const executeTransaction = async (
  connection: web3.Connection,
  wallet: Wallet,
  transaction: web3.Transaction,
  config: {
    silent?: boolean;
    signers?: web3.Signer[];
    confirmOptions?: web3.ConfirmOptions;
    callback?: (success: boolean) => void;
  }
): Promise<string> => {
  let txid = "";
  try {
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash("max")
    ).blockhash;
    await wallet.signTransaction(transaction);
    if (config.signers && config.signers.length > 0) {
      transaction.partialSign(...config.signers);
    }
    txid = await web3.sendAndConfirmRawTransaction(
      connection,
      transaction.serialize(),
      config.confirmOptions
    );
    config.callback && config.callback(true);
    console.log("Successful tx", txid);
  } catch (e: unknown) {
    console.log("Failed transaction: ", (e as web3.SendTransactionError).logs, e);
    config.callback && config.callback(false);
    if (!config.silent) {
      throw new Error(`${e instanceof Error ? e.message : String(e)}`);
    }
  }
  return txid;
};

const cost = 0.0001;

export type SearchResult = {
  title: string | null | undefined;
  summary: string | null | undefined;
  link: string | null | undefined;
  thumbnail: string | undefined;
}

function Home() {
  const { connection, environment } = useEnvironmentCtx()
  const wallet = useWallet();
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState<Array<SearchResult>>([]);

  const [selectedResult, setSelectedResult] = useState<SearchResult | undefined>()

  const [startTs, setStartTs] = useState<Date>();

  const search = async () => {
    if (!searchText) { return }
    const response = await fetch(`https://api.odiggo.xyz/api/v1/search/?q=:${searchText}`);
    const bookResults = await response.json();
    console.log(bookResults);

    let searchResults = new Array<SearchResult>();
    for (const entry of bookResults.results) {
      searchResults.push({
        title: entry.title,
        summary: "",
        link: "",
        thumbnail: entry.thumbnail
      })
    }

    // const results = await fetch(`https://export.arxiv.org/api/query?search_query=all:${searchText}`);
    // const resultsText = await results.text();
    // const parsedResults = await new window.DOMParser().parseFromString(resultsText, "text/xml");
    // const entries = Array.from(parsedResults.getElementsByTagName('entry'));
    // for (const entry of entries) {
    //   const title = entry.getElementsByTagName('title')[0]?.textContent
    //   const summary = entry.getElementsByTagName('summary')[0]?.textContent
    //   const links = Array.from(entry.getElementsByTagName('link') || []);
    //   const link = links.filter(x => x.getAttribute('type') == 'application/pdf')[0]?.getAttribute('href');
      
    // }
    // console.log(searchResults);

    setSearchResults(searchResults);
  }

  const onStart = (result: SearchResult) => {
    if (!wallet.connected) { return }
    setSelectedResult(result);
    setStartTs(new Date());
  };

  const onEnd = async (result: SearchResult) => {
    if (!wallet.connected) { return }
    const duration = (Date.now() - startTs!.getTime())/1000;
    const charge = cost * duration * web3.LAMPORTS_PER_SOL;
    console.log(charge, wallet.publicKey)

    const bal = await connection.getBalance(wallet.publicKey!)
    if (bal < charge) {
      var airdropSignature = await connection.requestAirdrop(
        wallet.publicKey!,
        web3.LAMPORTS_PER_SOL,
      );

      // Confirming that the airdrop went through
      await connection.confirmTransaction(airdropSignature);
      console.log("Airdropped");

    }

    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: wallet.publicKey!,
        toPubkey: new web3.PublicKey('9gUse5p6zanbFjudeSpNHv8eKDBQ3cwDy7wrzf7GVSHi'),
        lamports: charge
      }),
    );
    console.log(transaction)

    // transaction.feePayer = wallet.publicKey!
    // let blockhashObj = await connection.getLatestBlockhash();
    // transaction.recentBlockhash = await blockhashObj.blockhash;

    // Transaction constructor initialized successfully
    // if(transaction) {
    //   console.log("Txn created successfully");
    // }

    try {
      await executeTransaction(connection, wallet as Wallet, transaction, {});
      notify({
        message: `Successfully paid`,
        type: 'success',
      })
    } catch (e) {
      notify({message: `Transaction failed: ${e}`, type: 'error'})
    }

    // // Request creator to sign the transaction (allow the transaction)
    // let signed = await wallet.signTransaction!(transaction);
    // // The signature is generated
    // let signature = await connection.sendRawTransaction(signed.serialize());
    // // Confirm whether the transaction went through or not
    // await connection.confirmTransaction(signature);

    setSelectedResult(undefined);
    setStartTs(new Date());
  };

  return (
    <div>
      <Head>
        <title>Solana Engine</title>
        <meta name="description" content="Solana Engine" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Header />
        <div className="flex items-center align-middle" style={{ justifyContent: 'center' }}>
          <TextField id="outlined-basic" label="Enter text here" variant="outlined" onChange={e => setSearchText(e.target.value)} />
          <Button variant="outlined" onClick={search}>Search</Button>
        </div>
        <br />
        <hr />
        {selectedResult == undefined
          ? searchResults.map(result => (
            <div style={{ color: 'black' }} onClick={() => {onStart(result)}}>
              <img src={result.thumbnail} />
              <div>Title: {result.title}</div>
              {/* <div>Summary: {result.summary}</div>
              <div>Link: {result.link}</div> */}
              <hr/>
            </div>
          ))
         : (<div style={{ color: 'black' }}>
              <img src={selectedResult.thumbnail}/>
              <div>Title: {selectedResult.title}</div>
              {/* <div>Summary: {selectedResult.summary}</div>
              <div>Link: {selectedResult.link}</div> */}
              <Button onClick={() => onEnd(selectedResult)}>Exit</Button>
           </div>)
        }
      </div>
    </div>
  )
}

export default Home
