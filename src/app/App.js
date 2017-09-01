import React, {Component} from 'react';

import {
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View,
    Clipboard
} from 'react-native';

import {Kureba} from "./lib/kureba-wallet";

export default class App extends Component {

    state = {
        balance: null,
        password: null,
        walletAddress: null,
        privateKey: null,
        ethBalance: null,
        tokenBalance: null,
        isExistingWallet: false,

        targetETHAddress: null,
        amountETH: null,
        gasLimitETH: null,

        targetTokenAddress: null,
        amountToken: null,
        gasLimitToken: null,
    };

    createNewWallet = () => {
        if (!this.state.password) {
            return alert('Please enter your password!');
        }

        if (this.state.password.length < 9) {
            return alert('Your password must be at least 9 characters');
        }

        Kureba.createNewWallet(this.state.password);
        this.setState({
            walletAddress: Kureba.walletAddress,
            privateKey: Kureba.privateKey.toString('hex'),
            isExistingWallet: true,
        });
        this.getWalletETHBalance();
        this.getWalletTokenBalance();
    };

    getWalletETHBalance = () => {
        Kureba.getWalletETHBalance().then((balance) => {
            this.setState({
                ethBalance: `${balance} ETH`,
            });
        })
    };

    getWalletTokenBalance = () => {
        Kureba.getWalletTokenBalance().then((balance) => {
            this.setState({
                tokenBalance: `${balance} HCC`,
            });
        })
    };
    refreshBalance = () => {
        this.getWalletTokenBalance();
        this.getWalletETHBalance();
    };

    downloadKeystoreFile = () => {

    };

    copyPrivateKey = () => {
        Clipboard.setString(this.state.privateKey);
    };

    copyWalletAdress = () => {
        Clipboard.setString(this.state.walletAddress);
    };

    renderWalletInfo = () => {
        if (this.state.isExistingWallet) {
            return <View style={styles.WalletInfo}>
                <Text style={styles.TextHeader}>Wallet Info</Text>
                <View style={{padding: 4, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text numberOfLines={1} ellipsizeMode={"tail"} style={{flex: 6,}}>Wallet
                        Address: {this.state.walletAddress}</Text>
                    <TouchableOpacity onPress={this.copyWalletAdress} style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        backgroundColor: '#0dab7f',
                        padding: 4,
                        borderRadius: 4
                    }}>
                        <Text style={{color: 'white'}}>Copy</Text>
                    </TouchableOpacity>
                </View>
                <View style={{padding: 4, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text numberOfLines={1} ellipsizeMode={"tail"} style={{flex: 6,}}>Private
                        Key: {this.state.privateKey}</Text>
                    <TouchableOpacity onPress={this.copyPrivateKey} style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        backgroundColor: '#0dab7f',
                        padding: 4,
                        borderRadius: 4
                    }}>
                        <Text style={{color: 'white'}}>Copy</Text>
                    </TouchableOpacity>
                </View>

                <Text>ETH Balance: {this.state.ethBalance}</Text>
                <Text>Token Balance: {this.state.tokenBalance}</Text>

                <TouchableOpacity
                    onPress={this.refreshBalance}
                    style={{
                        alignItems: 'center',
                        padding: 12,
                        width: 200,
                        justifyContent: 'center',
                        backgroundColor: '#0dab7f',
                        borderRadius: 10,
                        alignSelf: 'center',
                        marginTop: 4,
                        marginBottom: 4,
                    }}>
                    <Text style={{color: 'white', fontSize: 16,}}>Refresh balance</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.downloadKeystoreFile}
                    style={{
                        alignItems: 'center',
                        padding: 12,
                        width: 200,
                        justifyContent: 'center',
                        backgroundColor: '#0dab7f',
                        borderRadius: 10,
                        alignSelf: 'center',
                        marginTop: 8,
                    }}>
                    <Text style={{color: 'white', fontSize: 16,}}>Download Keystore file</Text>
                </TouchableOpacity>
            </View>

        }
    };

    sendETH = () => {
        const {targetETHAddress, amountETH, gasLimitETH} = this.state;
        if (!targetETHAddress || !amountETH || !gasLimitETH) {
            return alert('Please enter data for required fields!');
        }
        if (isNaN(amountETH)) {
            return alert('Invalid number for amount');
        }
        if (isNaN(amountETH)) {
            return alert('Invalid number for gas limit');
        }
        if (!Kureba.isAddress(targetETHAddress)) {
            return alert('Invalid address');
        }
        Kureba.sendETH(targetETHAddress, amountETH, gasLimitETH);
    };

    sendToken = () => {
        const {targetTokenAddress, amountToken, gasLimitToken} = this.state;
        if (!targetTokenAddress || !amountToken || !gasLimitToken) {
            return alert('Please enter data for required fields!');
        }
        if (isNaN(amountToken)) {
            return alert('Invalid number for amount');
        }
        if (isNaN(gasLimitToken)) {
            return alert('Invalid number for gas limit');
        }
        if (!Kureba.isAddress(targetTokenAddress)) {
            return alert('Invalid address');
        }
        Kureba.sendToken(targetTokenAddress, amountToken, gasLimitToken);
    };

    renderWalletCreation = () => {
        if (!this.state.isExistingWallet) {
            return <View style={styles.CreateWallet}>
                <View style={styles.InputRow}>
                    <Text style={{flex: 1}}>Enter your password</Text>
                    <TextInput secureTextEntry={true} keyboardType="numeric" underlineColorAndroid="transparent" onChangeText={(value) => {this.setState({password: value})}} style={[styles.InputText, {flex: 1}]}/>
                </View>

                <TouchableOpacity
                    onPress={this.createNewWallet}
                    style={{
                        alignItems: 'center',
                        padding: 12,
                        marginTop: 8,
                        alignSelf: 'center',
                        width: 200,
                        justifyContent: 'center',
                        backgroundColor: '#0dab7f',
                        borderRadius: 10,
                    }}>
                    <Text style={{color: 'white', fontSize: 16,}}>Create new wallet</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={this.importKeystoreFile}
                    style={{
                        alignItems: 'center',
                        padding: 12,
                        marginTop: 8,
                        alignSelf: 'center',
                        width: 200,
                        justifyContent: 'center',
                        backgroundColor: '#0dab7f',
                        borderRadius: 10,
                    }}>
                    <Text style={{color: 'white', fontSize: 16,}}>Import keystore file</Text>
                </TouchableOpacity>

            </View>
        }
    };

    renderTransactionCreation = () => {
        if (this.state.isExistingWallet) {
            return <View style={styles.TransactionCreation}>
                <Text style={styles.TextHeader}>Create transaction</Text>
                <Text style={styles.TextHeader}>Send ETH</Text>
                <View style={styles.InputRow}>
                    <Text style={{flex: 1}}>Address</Text>
                    <TextInput underlineColorAndroid="transparent" onChangeText={(value) => {
                        this.setState({targetETHAddress: value})
                    }} style={[styles.InputText, {flex: 1}]}/>
                </View>
                <View style={styles.InputRow}>
                    <Text style={{flex: 1}}>Amount of ETH to send</Text>
                    <TextInput keyboardType="numeric" underlineColorAndroid="transparent" onChangeText={(value) => {
                        this.setState({amountETH: value})
                    }} style={[styles.InputText, {flex: 1}]}/>
                </View>
                <View style={styles.InputRow}>
                    <Text style={{flex: 1}}>Gas limit</Text>
                    <TextInput keyboardType="numeric" underlineColorAndroid="transparent" onChangeText={(value) => {
                        this.setState({gasLimitETH: value})
                    }} style={[styles.InputText, {flex: 1}]}/>
                </View>
                <TouchableOpacity
                    onPress={this.sendETH}
                    style={{
                        alignItems: 'center',
                        padding: 12,
                        width: 200,
                        justifyContent: 'center',
                        backgroundColor: '#0dab7f',
                        borderRadius: 10,
                        alignSelf: 'center',
                        marginTop: 8,
                    }}>
                    <Text style={{color: 'white', fontSize: 16,}}>Send ETH</Text>
                </TouchableOpacity>


                <Text style={[styles.TextHeader, {marginTop: 8}]}>Send Token</Text>
                <View style={styles.InputRow}>
                    <Text style={{flex: 1}}>Address</Text>
                    <TextInput underlineColorAndroid="transparent" onChangeText={(value) => {
                        this.setState({targetTokenAddress: value})
                    }} style={[styles.InputText, {flex: 1}]}/>
                </View>
                <View style={styles.InputRow}>
                    <Text style={{flex: 1}}>Amount of Token to send</Text>
                    <TextInput keyboardType="numeric" underlineColorAndroid="transparent" onChangeText={(value) => {
                        this.setState({amountToken: value})
                    }} style={[styles.InputText, {flex: 1}]}/>
                </View>
                <View style={styles.InputRow}>
                    <Text style={{flex: 1}}>Gas limit</Text>
                    <TextInput keyboardType="numeric" underlineColorAndroid="transparent" onChangeText={(value) => {
                        this.setState({gasLimitToken: value})
                    }} style={[styles.InputText, {flex: 1}]}/>
                </View>
                <TouchableOpacity
                    onPress={this.sendToken}
                    style={{
                        alignItems: 'center',
                        padding: 12,
                        width: 200,
                        justifyContent: 'center',
                        backgroundColor: '#0dab7f',
                        borderRadius: 10,
                        alignSelf: 'center',
                        marginTop: 8,
                    }}>
                    <Text style={{color: 'white', fontSize: 16,}}>Send Token</Text>
                </TouchableOpacity>
            </View>
        }
    };

    importKeystoreFile = () => {

    };

    render() {
        return (
            <ScrollView pagingEnabled={true} scrollEnabled={true}>
                <View style={styles.Container}>
                    {this.renderWalletCreation()}
                    {this.renderWalletInfo()}
                    {this.renderTransactionCreation()}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    Container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        padding: 16,
    },
    WalletInfo: {
        marginTop: 16,
        padding: 16,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#CCCCCC',
        width: '100%',
    },
    CreateWallet: {
        marginTop: 16,
        padding: 16,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#CCCCCC',
        width: '100%',
    },
    TransactionCreation: {
        marginTop: 16,
        padding: 16,
        borderWidth: 1,
        borderRadius: 10,
        width: '100%',
        borderColor: '#CCCCCC',
    },
    TextHeader: {
        color: '#0dab7f',
        fontSize: 16,
    },
    InputText: {
        margin: 2,
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        padding: 4,
    },
    InputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
