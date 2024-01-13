# Update Guide Generator

This small utility generates the [update guide](https://update.angular.io) for Angular for the changes between two versions.

## How to use?

```shell
git clone git@github.com:mgechev/update-guide-generator
cd update-guide-generator
npm i
API_KEY=PUT_YOUR_KEY_HERE node index.mjs --versions X.Y.Z-A.B.C | pbcopy
```

You can generate an API key at https://console.cloud.google.com/apis/credentials.

## License

MIT
