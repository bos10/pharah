import { AppRegistry } from 'react-native';
import App from './src/App';

AppRegistry.registerComponent('jiov3', () => App);

//Hide warning
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
    'Warning: isMounted(...) is deprecated', 
    'Module RCTImageLoader',
    'Setting a timer'
  ]);
