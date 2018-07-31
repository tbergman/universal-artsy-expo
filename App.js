import { AppLoading, Font } from 'expo';
import React from 'react';
import { StyleSheet, View, AsyncStorage, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider as ReduxProvider, connect } from 'react-redux';
import { List } from 'immutable';

import Actions from './src/lib/state/Actions';
import AuthenticationScreen from './src/lib/Containers/Authentication';
import LocalStorage from './src/lib/state/LocalStorage';
import RootNavigation from './navigation/RootNavigation';
import Store from './src/lib/state/Store';
import { User } from './src/lib/state/Records';
import { Updates } from 'expo'

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

export default class AppContainer extends React.Component {
  render() {
    return (
      <ReduxProvider store={Store}>
        <App {...this.props} />
      </ReduxProvider>
    );
  }
}

@connect(data => App.getDataProps)
class App extends React.Component {
  static getDataProps(data) {
    return {
      currentUser: data.currentUser,
    };
  }

  state = {
    isReady: false,
  };

  componentDidMount(){
    AsyncStorage.clear();
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
  }

  _loadAssetsAsync = async () => {
    return Font.loadAsync({
      ...Ionicons.font,
      'OpenSans-Light': require('./assets/fonts/OpenSans-Light.ttf'),
      OpenSans: require('./assets/fonts/OpenSans-Regular.ttf'),
      'OpenSans-Bold': require('./assets/fonts/OpenSans-Semibold.ttf'),
      'AGaramondPro-Regular': require('./assets/fonts/EBGaramond08-Regular.ttf'),
      'AGaramondPro-Italic': require('./assets/fonts/EBGaramond08-Italic.ttf'),
      'AvantGardeGothicITC': require('./assets/fonts/texgyreadventor-regular.ttf'), 
    });
  };

  _loadCacheAsync = async () => {
    let user = new User(await LocalStorage.getUserAsync());
    this.props.dispatch(Actions.setCurrentUser(user));
  };

  _loadDataAndAssetsAsync = async () => {
    return Promise.all([this._loadAssetsAsync(), this._loadCacheAsync()]);
  };

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadDataAndAssetsAsync}
          onError={e => console.error(e)}
          onFinish={() => {
            this.setState({
              isReady: true,
            });
          }}
        />
      );
    }

    return (
      <View style={styles.container}>
        {
          isSignedIn(this.props.currentUser) ? (
          <RootNavigation
            persistenceKey={__DEV__ ? 'navigation-state' : null}
          />
        ) : (
          <AuthenticationScreen />
        )
      }
      </View>
    );
  }
}

function isSignedIn(userState) {
  return !!userState.authToken || userState.isGuest;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // TEMP for testing
    // paddingBottom: 100,
  },
});
