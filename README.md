# Update Guide Generator

This small utility generates the [update guide](https://update.angular.io) for Angular for the changes between two versions.

## How to use?

```shell
git clone git@github.com:mgechev/update-guide-generator
cd update-guide-generator
npm i
API_KEY=[Generate at https://console.cloud.google.com/apis/credentials] node index.mjs --versions X.Y.Z-A.B.C | pbcopy
```

## License

MIT
