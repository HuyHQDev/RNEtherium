import React from 'react';
import {
    AppRegistry,
} from 'react-native';
import './shim.js'
import App from "./src/app/App";

AppRegistry.registerComponent('mobile', () => App);
