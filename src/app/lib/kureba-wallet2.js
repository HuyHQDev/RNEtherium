const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://118.69.187.7:8545'));
var keythereum = require("keythereum");

export const Kureba = {
	privateKey: "",
	keyObject: "",
	walletAddress: "",
	// Thach
	tokenAddress: "0x6c108a1b9D2A8bd6F2a7EB48cC82ECd352683E53",
	// Hanhcoin
	// tokenAddress: "0xeceb7e9dcb1f13a13f959f23dac08d7b441bf66c",
	getTokenContractInstance: function () {
		var contractABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"burn","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"startTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"game","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"gameAddress","type":"address"},{"name":"value","type":"uint256"}],"name":"transferToGames","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Burned","type":"event"}];

		var tokenContract = web3.eth.contract(contractABI);

		return tokenContract.at(Kureba.tokenAddress);
	},

	createNewWallet: function (password) {
		var params = { keyBytes: 32, ivBytes: 16 };
		var dk = keythereum.create(params);
		Kureba.privateKey = dk.privateKey;
		var options = {
			kdf: "pbkdf2",
			cipher: "aes-128-ctr",
			kdfparams: {
				c: 262144,
				dklen: 32,
				prf: "hmac-sha256"
			}
		};

		Kureba.keyObject = keythereum.dump(password, Kureba.privateKey, dk.salt, dk.iv, options);
		Kureba.walletAddress = "0x" + Kureba.keyObject.address

		return Kureba.walletAddress;
	},

	downloadKeystoreFile: function () {
		var text = JSON.stringify(Kureba.keyObject);
		var filename = "UTC--" + new Date().toISOString() + "--" + Kureba.keyObject.address;
		var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
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

	// hoangpd - import private key
	importPrivateKey: function (privateKey) {
		var bufferPrivateKey;
		var rawPrivateKey;
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
		var buffer = EthJS.Buffer.Buffer.from(privateKey, 'hex');
		return EthJS.Util.isValidPrivate(buffer);
	},

	isValidBufferPrivate: function (privateKey) {
		return EthJS.Util.isValidPrivate(privateKey);
	},
	// 

	// hanhvn add to remove wallet info
	clearWallet: function() {
		try {
			Kureba.privateKey = 0;
			Kureba.keyObject = 0;
			Kureba.walletAddress = "0x0";
		} catch (ex) {
			throw ex;
		}
	},
	// hanhvn end

	constructNewTx: function (toAddress, amount, gasLimit, data, chainId) {
		var newTxParams = {
			nonce: "0x" + web3.eth.getTransactionCount(Kureba.walletAddress).toString("16"),
			gasPrice: "0x" + web3.eth.gasPrice.toString("16"), 
			gasLimit: "0x" + Number(gasLimit).toString(16),
			to: toAddress, 
			value: "0x" + Number(web3.toWei(amount, "ether")).toString(16),
			data: data,
			chainId: chainId
		}
		// console.log("gasPrice: " + web3.eth.gasPrice);
		// console.log("gasLimit: " + Number(gasLimit));
		// console.log("value: " + web3.toWei(amount, "ether"));
		// var funds = web3.eth.gasPrice * Number(gasLimit) + web3.toWei(amount, "ether");
		// console.log("funds: " + funds);
		console.log("raw tx: " + JSON.stringify(newTxParams));
		return newTxParams;
	},

	sendETH: function (toAddress, amount, gasLimit) {
		var newTx = Kureba.constructNewTx(toAddress, amount, gasLimit, "", Chains.Ropsten);

		return Kureba.submitRawTxToBlockchain(newTx);
	},

	sendToken: function (toAddress, amount, gasLimit) {
		var payload = Kureba.getTokenContractInstance().transfer.getData(toAddress, amount);
		var newTx = Kureba.constructNewTx(Kureba.tokenAddress, 0, gasLimit, payload, Chains.Ropsten);

		return Kureba.submitRawTxToBlockchain(newTx);
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
		var constructedTx = new Tx(rawTx);
		// var estimateGas = web3.eth.estimateGas({
		// 	to: rawTx.to,
		// 	data: rawTx.data
		// });
		// console.log("estimateGas: " + estimateGas)
		// if (estimateGas >= CONST_DEFAULT_BLOCK_GAS_LIMIT) {
		// 	console.log("Bad transaction!");
		// 	if (callback) {
		// 		callback(-1);
		// 	} else {
		// 		return -1;
		// 	}
		// } else {
			constructedTx.sign(Kureba.privateKey);
			var serializedTx = constructedTx.serialize();
			console.log("signed tx: " + serializedTx.toString("hex"));
			try {
				if (callback) {
					web3.eth.sendRawTransaction("0x" + serializedTx.toString("hex"), function (err, txid) {
						if (!err) {
							callback(txid);
						} else {
							console.log(err);
							callback(txid, err)
						}
					});
				} else {
					return web3.eth.sendRawTransaction("0x" + serializedTx.toString("hex"));
				}
			} catch (ex) {
				if (callback) {
					callback(-1, ex)
				} else {
					alert(ex.toString());
				}
			}
		// }
	},

	getWalletETHBalance: function () {
        return web3.fromWei(web3.eth.getBalance(Kureba.walletAddress), "ether").toString();
	},

	getWalletTokenBalance: function () {
		return Kureba.getTokenContractInstance().balanceOf.call(Kureba.walletAddress);
	},

	getETHBalance: function (address) {
		return web3.fromWei(web3.eth.getBalance(address), "ether").toString();
	},

	getTokenBalance: function (address) {
		return Kureba.getTokenContractInstance().balanceOf.call(address);
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

	// hoangpd - deposit to Game
	depositToGame: function (gameAddress, amount, callback) {
		console.log("amount: " + amount);
		var payload = Kureba.getTokenContractInstance().transferToGames.getData(gameAddress, amount);
		var newTx = Kureba.constructNewTx(Kureba.tokenAddress, 0, CONST_DEFAULT_GAS_LIMIT, payload, Chains.Ropsten);

		if (callback) {
			Kureba.submitRawTxToBlockchain(newTx, function(txid, err) {
				callback(txid, err);
			});
		} else {
			return Kureba.submitRawTxToBlockchain(newTx);
		}
	}
	// end
};

export const Chains = {
	MainNet: 1,
	Ropsten: 3
};