const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://118.69.187.7:8545'));
const keythereum = require("keythereum");
const EthereumTx = require('ethereumjs-tx');

export const Kureba = {
    privateKey: "",
    keyObject: "",
    walletAddress: "",
    tokenAddress: "0x6c108a1b9D2A8bd6F2a7EB48cC82ECd352683E53",

    getTokenContractInstance: function () {
        const contractABI = [{
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [{"name": "", "type": "string"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
            "name": "approve",
            "outputs": [{"name": "success", "type": "bool"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [{"name": "", "type": "uint256"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {
                "name": "_value",
                "type": "uint256"
            }],
            "name": "transferFrom",
            "outputs": [{"name": "success", "type": "bool"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [{"name": "", "type": "uint8"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "burn",
            "outputs": [],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "standard",
            "outputs": [{"name": "", "type": "string"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{"name": "", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"name": "", "type": "uint256"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "startTime",
            "outputs": [{"name": "", "type": "uint256"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [{"name": "", "type": "address"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [{"name": "", "type": "string"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
            "name": "transfer",
            "outputs": [{"name": "success", "type": "bool"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "game",
            "outputs": [{"name": "", "type": "address"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{"name": "", "type": "address"}, {"name": "", "type": "address"}],
            "name": "allowance",
            "outputs": [{"name": "", "type": "uint256"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "gameAddress", "type": "address"}, {"name": "value", "type": "uint256"}],
            "name": "transferToGames",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "type": "function"
        }, {"inputs": [], "payable": false, "type": "constructor"}, {
            "anonymous": false,
            "inputs": [{"indexed": true, "name": "from", "type": "address"}, {
                "indexed": true,
                "name": "to",
                "type": "address"
            }, {"indexed": false, "name": "value", "type": "uint256"}],
            "name": "Transfer",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{"indexed": true, "name": "owner", "type": "address"}, {
                "indexed": true,
                "name": "spender",
                "type": "address"
            }, {"indexed": false, "name": "value", "type": "uint256"}],
            "name": "Approval",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{"indexed": false, "name": "amount", "type": "uint256"}],
            "name": "Burned",
            "type": "event"
        }];
        const tokenContract = web3.eth.contract(contractABI);
        return tokenContract.at(Kureba.tokenAddress);
    },

    createNewWallet: function (password) {
        const params = {keyBytes: 32, ivBytes: 16};
        const dk = keythereum.create(params);
        Kureba.privateKey = dk.privateKey;
        const options = {
            kdf: "pbkdf2",
            cipher: "aes-128-ctr",
            kdfparams: {
                c: 262144,
                dklen: 32,
                prf: "hmac-sha256"
            }
        };

        Kureba.keyObject = keythereum.dump(password, Kureba.privateKey, dk.salt, dk.iv, options);
        Kureba.walletAddress = "0x" + Kureba.keyObject.address;

        return Kureba.walletAddress;
    },

    downloadKeystoreFile: function () {
        const text = JSON.stringify(Kureba.keyObject);
        const filename = "UTC--" + new Date().toISOString() + "--" + Kureba.keyObject.address;
        const blob = new Blob([text], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename);
    },

    recoverWallet: function (password, keyObject) {
        try {
            Kureba.privateKey = keythereum.recover(password, keyObject);
            Kureba.keyObject = keyObject;
            Kureba.walletAddress = "0x" + Kureba.keyObject.address;
        } catch (ex) {
            throw ex;
        }
    },

    importPrivateKey: function (privateKey) {
        let bufferPrivateKey;
        try {
            bufferPrivateKey = EthJS.Buffer.Buffer.from(privateKey, 'hex');
            if (Kureba.isValidBufferPrivate(bufferPrivateKey)) {
                Kureba.privateKey = bufferPrivateKey;
                Kureba.walletAddress = keythereum.privateKeyToAddress(Kureba.privateKey);
            } else {
                throw "invalid private key";
            }
        } catch (ex) {
            throw ex;
        }
    },
    //

    // hoangpd - check if private key is well formatted
    isValidRawPrivate: function (privateKey) {
        const buffer = EthJS.Buffer.Buffer.from(privateKey, 'hex');
        return EthJS.Util.isValidPrivate(buffer);
    },

    isValidBufferPrivate: function (privateKey) {
        return EthJS.Util.isValidPrivate(privateKey);
    },
    //

    // hanhvn add to remove wallet info
    clearWallet: function () {
        try {
            Kureba.privateKey = 0;
            Kureba.keyObject = 0;
            Kureba.walletAddress = "0x0";
        } catch (ex) {
            throw ex;
        }
    },
    // hanhvn end

    getTransactionCount: function (address) {
        return new Promise((resolve, reject) => {
            web3.eth.getTransactionCount(address, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result.toString('16'))
                }

            })
        });
    },

    getGasPrice: function() {
      return new Promise((resolve, reject) => {
            web3.eth.getGasPrice((error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result.toString('16'))
                }
            })
      })
    },

    constructNewTx: async function (toAddress, amount, gasLimit, data, chainId) {
        const transactionCount = await Kureba.getTransactionCount(toAddress);
        const gasPrice = await Kureba.getGasPrice();
        return new Promise((resolve, reject) => {
            web3.eth.getTransactionCount(Kureba.walletAddress, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    const newTxParams = {
                        nonce: "0x" + transactionCount,
                        gasPrice: "0x" + gasPrice,
                        gasLimit: "0x" + Number(gasLimit).toString(16),
                        to: toAddress,
                        value: "0x" + Number(web3.toWei(amount, "ether")).toString(16),
                        data: data,
                        chainId: chainId
                    };
                    resolve(newTxParams)
                }
            })
        });
    },

    sendETH: async function (toAddress, amount, gasLimit) {
        const newTx = await Kureba.constructNewTx(toAddress, amount, gasLimit, "", Chains.Ropsten);
        Kureba.submitRawTxToBlockchain(newTx, (result, error) => {
            if ((error)) {
                alert(error);
            } else {
                alert(result)
            }
        });
    },

    sendToken: async function (toAddress, amount, gasLimit) {
        const payload = Kureba.getTokenContractInstance().transfer.getData(toAddress, amount);
        const newTx = await Kureba.constructNewTx(Kureba.tokenAddress, 0, gasLimit, payload, Chains.Ropsten);

        Kureba.submitRawTxToBlockchain(newTx, (result, error) => {
            if ((error)) {
                alert(error)
            } else {
                alert(result)
            }
        });
    },

    submitSignedTxToBlockchain: function (signedTx) {
        var serializedTx = signedTx.serialize();
        try {
            var txid = web3.eth.sendRawTransaction("0x" + serializedTx.toString("hex"));

            return txid;
        } catch (ex) {
            alert(ex.toString());
        }
    },

    submitRawTxToBlockchain: function (rawTx, callback) {
        const constructedTx = new EthereumTx(rawTx);

        constructedTx.sign(Kureba.privateKey);
        const serializedTx = constructedTx.serialize();

        web3.eth.sendRawTransaction("0x" + serializedTx.toString("hex"), function (err, txid) {
            if (!err) {
                callback(txid);
            } else {
                callback(txid, err)
            }
        });
    },

    getWalletETHBalance: function () {
        return new Promise((resolve, reject) => {
            web3.eth.getBalance(Kureba.walletAddress, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(web3.fromWei(result, "ether").toString());
                }
            });
        });
    },

    getWalletTokenBalance: function () {
        return new Promise((resolve, reject) => {
           Kureba.getTokenContractInstance().balanceOf.call(Kureba.walletAddress, (error, result) => {
               if (error) {
                   reject(error)
               } else {
                   resolve(result)
               }
           })
        });
    },

    getETHBalance: function (address) {
        return new Promise((resolve, reject) => {
           web3.eth.getBalance(address, (error, result) => {
               if (error) {
                   reject(error)
               } else {
                   resolve(web3.fromWei(result, "ether").toString());
               }
           })
        });
    },

    getTokenBalance: function (address) {
        return Kureba.getTokenContractInstance().balanceOf.call(address);
    },

    isAddress: function(address) {
        return web3.isAddress(address);
    },

    walletRequirePassword: function (parsedObj) {
        if (parsedObj.encseed !== null) {
            return true;
        } else if (parsedObj.Crypto !== null || parsedObj.crypto !== null) {
            return true
        } else if (parsedObj.hash !== null && parsedObj.locked) {
            return true;
        } else if (parsedObj.hash !== null && !parsedObj.locked) {
            return false;
        } else if (parsedObj.publisher === "MyEtherWallet" && !parsedObj.encrypted) {
            return false;
        } else {
            return false;
        }
    },

};

export const Chains = {
    MainNet: 1,
    Ropsten: 3
};
