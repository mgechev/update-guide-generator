# Update Guide Generator

This small utility generates the [update guide](https://update.angular.io) for Angular for the changes between two versions.

## How to use?

```shell
cd Projects
git clone git@github.com:angular/angular
cd ..
git clone git@github.com:mgechev/update-guide-generator
cd update-guide-generator
npm i
API_KEY=PUT_YOUR_KEY_HERE node index.mjs --from X.Y.Z --to A.B.C | pbcopy
```

You can generate an API key at https://console.cloud.google.com/apis/credentials.

## License

MIT
