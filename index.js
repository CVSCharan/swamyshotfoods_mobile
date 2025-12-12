/**
 * @format
 */

import 'react-native-gesture-handler'; // Required by @react-navigation/stack
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
