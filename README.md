# Onchain Summer Discoveries

![image](https://github.com/HiroyukiNaito/OchainSummerDiscoveries/assets/32320988/3e45cee4-8a44-441d-a5e0-67682b8a0481)

[OCS Discoveries (Onchain Summer Discoveries)](https://ocs-discoveries.universalbase.xyz/) focuses on enhancing the discoverability of the BASE ecosystem using Fleek Infrastructure, which provides highly discoverable graph representations. As the driving force behind the Onchain Summer Registry, OCS Discoveries emphasizes the ease of finding registered apps powered by Fleek's robust technical foundation. This approach effectively addresses the challenge of locating applications within the rapidly growing BASE ecosystem.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## Installation

### Requirements

- npm package manager
- [Fleek CLI](https://fleek.xyz/docs/cli/)

### 1. Clone GitHub Repository

```bash
$ git clone git@github.com:HiroyukiNaito/OchainSummerDiscoveries.git
$ cd ./OnchainSummerDiscoveries
```

### 2. Deploying Fleek functions

1. login to fleek
```bash
$ cd ./src/fleek-functions/
$ fleek login
```

2. Deploy `ecosystem-data.js` to Fleek functions
`ecosystem-data.js` is one of Fleek's functions for storing the BASE ecosystem data as an in-memory database.
```bash
$ fleek functions deploy --name ecosystem-data --path ./ecosystem-data.js 
```
It returns **IPFS HASH with url**

3. Deploy `get-graph.js`  to Fleek functions

`get-graph.js` is a query function for retrieving BASE ecosystem data for graph representation.

Change and change [the first line](https://github.com/HiroyukiNaito/OchainSummerDiscoveries/blob/main/src/fleek-functions/get-graph.js#L1) to `ecosystem-data.js` hash value you got.
```bash
vi get-graph.js
```
Then deploy the edited code with `--noBundle` option
```bash
$ fleek functions deploy --noBundle --name get-graph --path ./get-graph.js
```

4. Deploy 'get-base64data.js'

'get-base64data.js' is a key-value store for retrieving BASE ecosystem logo data as a base64 format.
```bash
$ fleek functions deploy --name get-base64data.js --path ./get-base64data.js
```

5. Describe Fleek functions API URL in [app.settings.ts](https://github.com/HiroyukiNaito/OchainSummerDiscoveries/blob/main/src/app.settings.ts)

| VALUABLE      | FLEEK　API　URL |
| ------------- | -------------  |
| FLEEK_API  | get-graph.js Fleek functions InvokeUrl |
| FLEEK_CACHE_API  | get-base64data.js Fleek functions InvokeUrl |

### 3. Spinning up Next.js server

Development environment
```bash
$ pnpm install
$ pnpm run dev
```

Production environment
```
$ pnpm build
$ pnpm start
```
*Strongly recommend using Fleek PaaS for running a Next.js server. It allows for easy deployment of a Next.js site.*

## Contributing

1. Fork the project.
1. Create your feature branch (git checkout -b feature/AmazingFeature).
1. Commit your changes (git commit -am 'Add some feature').
1. Push to the branch (git push origin feature/AmazingFeature).
1. Open a pull request.

## Credits

- Author: Hiroyuki Naito @HiroyukiNaito
- Maintainer: Hiroyuki Naito @HiroyukiNaito

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## Contacts

- Email: hiroyukinait.eth@gmail.com
- X: @hnaito_eth
- Warpcast: @hiroyukinaito


