import Expo from 'expo';
import React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';


import * as reducers from './store/reducers';
const store = createStore(combineReducers(reducers), applyMiddleware(thunk));

import cacheAssetsAsync from './utilities/cacheAssetsAsync';

import Application from './containers/Application';

import { StyleProvider } from 'native-base';
import DefaultTheme from './themes/DefaultTheme';

class App extends React.Component {

  state = {
    appIsReady: false,
  };

  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        fonts: [
          { 'Roboto_thin': require('./assets/fonts/Roboto-Thin.ttf') },
          { 'Roboto_regular': require('./assets/fonts/Roboto-Regular.ttf') },
          { 'Roboto_medium': require('./assets/fonts/Roboto-Medium.ttf') },
          { 'Roboto_bold': require('./assets/fonts/Roboto-Bold.ttf') },
        ],
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <Provider store={store}>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            {Platform.OS === 'android' && <StatusBar backgroundColor="blue" barStyle="light-content"/> }
            <Application />
          </View>
        </Provider>
      );
    }
    else{
      return <Expo.AppLoading />;
    }
  }
}

Expo.registerRootComponent(App);

const styles = {
  container: {
    flex: 1
  }
}
