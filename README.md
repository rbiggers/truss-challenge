#### From your command line:

```bash
# Clone this repository
git clone https://github.com/rbiggers/truss-challenge.git
# Go into the repository
cd truss-challenge
# System configuration 
### If you already have NVM & Node you can skip this step
cd nvm-utils/
./install-nvm.sh
## NVM & Node should now be installed. You may have to open a new terminal
# Install dependencies
npm install
# Run the app
npm run start < sample/sample.csv
# Run the app
npm run start < sample/sample-with-broken-utf8.csv
# Run the tests
npm run test
```

#### License [MIT](LICENSE.md)