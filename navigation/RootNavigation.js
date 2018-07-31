import React from 'react';
import { Platform, Image, View, Button, Text } from 'react-native';
import { Constants } from 'expo';
import { Ionicons, Foundation, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Header,
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';
import {
  createMaterialBottomTabNavigator,
} from 'react-navigation-material-bottom-tabs';
import { capitalize } from 'lodash';
import Images from '@assets/images';
import HomeScene from "../src/lib/Scenes/Home"
import FavoritesScene from "../src/lib/Scenes/Favorites"
import ZeroStateInbox from "../src/lib/Components/Inbox/Conversations/ZeroStateInbox.tsx"

import Colors from '../src/lib/constants/Colors';
import Layout from '../src/lib/constants/Layout';
// import SettingsScreen from '../screens/SettingsScreen';
import SearchScreen from '../src/lib/Containers/SearchScreen';
import { BlurView } from 'expo';

const createTabNavigator =
  Platform.OS === 'ios'
    ? createBottomTabNavigator
    : createMaterialBottomTabNavigator;

const Tabs = createTabNavigator(
  {
    home: {
      screen: HomeScene,
    },
    search: {
      screen: View,
    },
    messaging: {
      screen: ZeroStateInbox,
    },
    favorites: {
      screen: FavoritesScene,
    },
  },
  {
    navigationOptions: ({ navigation }) => {
      let { routeName } = navigation.state;
      return {
        title: '',
        tabBarIcon: ({ focused }) => {
          const { routeName } = navigation.state;
          let iconName
          switch (routeName) {
            case 'home': {
              iconName = 'home-outline'
              break;
            }
            case 'search': {
              iconName = 'search'
              return (
                <MaterialIcons
                  style={{ backgroundColor: 'transparent',
                  transform: [{rotateY: '180deg'}],
                  marginBottom: Platform.OS === 'ios' ? -3 : 0,
                  }}
                  name={iconName}
                  size={24}
                  color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
              )
            }
            case 'messaging': {
              iconName = 'message-text-outline'
              break;
            }
            case 'favorites': {
              iconName = 'heart-outline'
              break;
            }
          }
          return(
            <MaterialCommunityIcons
              style={{ backgroundColor: 'transparent', marginBottom: Platform.OS === 'ios' ? -3 : 0 }}
              name={iconName}
              size={24}
              color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
            />
          )
        },
        tabBarOnPress: ({ navigation }) => {
          console.log(navigation)
          const isSearch = navigation.state.routeName === 'search';
          console.log(`is search ?:' ${isSearch}`)
          console.log(`route name : ${navigation.state.routeName}`)
          return isSearch 
          ? navigation.navigate('SearchModal') 
          : navigation.navigate(navigation.state.routeName) 
        },
      };
    },
    shifting: false,
    labeled: false,
    activeTintColor: Colors.tabIconSelected,
    inactiveTintColor: Colors.tabIconDefault,
    barStyle: { backgroundColor: 'white'},
  }
);

/*
 * Place the search screen into a stack navigator so that we can easily use the existing header.
 */
// const SearchStack = createStackNavigator({
//   Search: {
//     screen: (props) => <Screen title="Search" {...props} />,
//     navigationOptions: ({ navigation }) => ({
//       headerTitle: 'Search',
//       headerLeft: (
//         <Button
//           title="Cancel"
//           // Note that since we're going back to a different navigator (CaptureStack -> RootStack)
//           // we need to pass `null` as an argument to goBack.
//           onPress={() => navigation.goBack(null)}
//         />
//       ),
//     }),
//   },
// // }
// //   {  
// //     transitionConfig: () => ({
// //       containerStyle: {
// //           backgroundColor: 'red',
// //           opacity: 0.5,
// //       }
// //     }),
// //   }
// })


// Resource : https://snack.expo.io/HJTksiPVm
// Transparent Modal
// create custom transitioner without the opacity animation
function forVertical(props) {
  const { layout, position, scene } = props;

  const index = scene.index;
  const height = layout.initHeight;

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange: ([index - 1, index, index + 1]),
    outputRange: ([height, 0, 0])
  });

  return {
    transform: [{ translateX }, { translateY }]
  };
}

/*
 * We need a root stack navigator with the mode set to modal so that we can open the search screen
 * as a modal. Defaults to the Tabs navigator.
 */
const RootStack = createStackNavigator({
  Tabs: {
    screen: Tabs,
  },
  SearchModal: { screen: SearchScreen},
}, {
  headerMode: 'none',
  mode: 'modal',
  transitionConfig: () => ({ screenInterpolator: forVertical }),
  cardStyle: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
  },
});

export default RootStack;