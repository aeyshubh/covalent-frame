/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { CovalentClient } from "@covalenthq/client-sdk";
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {
  const { buttonValue, inputText, status } = c
  const fruit = inputText || buttonValue
  return c.res({
    action: '/submit',
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {status === 'response'
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ''}`
            : 'Welcome!'}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter your wallet address..." />,
      <Button value="eth">Ethereum</Button>,
      <Button value="op">Optimism</Button>,
      <Button value="base">Base</Button>
    ],
  })
})


app.frame('/submit', async (c) => {
  const { buttonValue } = c
  const client = new CovalentClient(`${process.env.COVALENT_KEY}`);
  //can do for eth pol base OP
  let total_count
  let earliest_trnasaction
  let earliest_trnasaction_hash
  let latest_transaction
  let latest_transaction_hash
  if (buttonValue === "eth") {
    console.log("ETH")
    const resp = await client.TransactionService.getTransactionSummary("eth-mainnet", "0xaB8a67743325347Aa53bCC66850f8F13df87e3AF", { "quoteCurrency": "USD" });
    total_count = resp.data.items[0].total_count;
    earliest_trnasaction = (resp.data.items[0].earliest_transaction.block_signed_at).toDateString();
    earliest_trnasaction_hash = "https://etherscan.io/tx/" + resp.data.items[0].earliest_transaction.tx_hash;

    latest_transaction = (resp.data.items[0].latest_transaction.block_signed_at).toDateString();
    latest_transaction_hash = "https://etherscan.io/tx/" + resp.data.items[0].latest_transaction.tx_hash;
  } else if (buttonValue === "op") {
    console.log("OP")
    const resp = await client.TransactionService.getTransactionSummary("optimism-mainnet", "0xaB8a67743325347Aa53bCC66850f8F13df87e3AF", { "quoteCurrency": "USD" });
    total_count = resp.data.items[0].total_count;
    earliest_trnasaction = (resp.data.items[0].earliest_transaction.block_signed_at).toDateString();
    earliest_trnasaction_hash = "https://optimistic.etherscan.io/tx/" + resp.data.items[0].earliest_transaction.tx_hash;

    latest_transaction = (resp.data.items[0].latest_transaction.block_signed_at).toDateString();
    latest_transaction_hash = "https://optimistic.etherscan.io/tx/" + resp.data.items[0].latest_transaction.tx_hash;
    }else if (buttonValue === "base") {
    console.log("base")
    const resp = await client.TransactionService.getTransactionSummary("base-mainnet", "0xaB8a67743325347Aa53bCC66850f8F13df87e3AF", { "quoteCurrency": "USD" });
    total_count = resp.data.items[0].total_count;
    earliest_trnasaction = (resp.data.items[0].earliest_transaction.block_signed_at).toDateString();
    earliest_trnasaction_hash = "https://basescan.org/tx/" + resp.data.items[0].earliest_transaction.tx_hash;

    latest_transaction = (resp.data.items[0].latest_transaction.block_signed_at).toDateString();
    latest_transaction_hash = "https://basescan.org/tx/" + resp.data.items[0].latest_transaction.tx_hash;
  }
  return c.res({
    action: '/',
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            'linear-gradient(to right, #432889, #17101F)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Total Transactions : {total_count}
        </span>
        <span
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          First Transaction : {earliest_trnasaction}
        </span>

        <span
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Recent Transaction : {latest_transaction}
        </span>
      </div>
    ),

    intents: [
      <Button.Redirect
        location={earliest_trnasaction_hash as any}>Earliest Tx</Button.Redirect>,
      <Button.Redirect
        location={latest_transaction_hash as any}>Recent Tx</Button.Redirect>,
        <Button.Reset>Go Back</Button.Reset>,
    ]
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
