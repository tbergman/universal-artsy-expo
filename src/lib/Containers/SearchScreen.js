import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo';
import { SearchBar } from 'react-native-elements'

// TODO: switch to SFC
export default class SearchScreen extends React.Component {

  render() {
    const { goBack } = this.props.navigation;

    return (
      <View style={styles.container}>
      <BlurView tint="dark" intensity={100} style={styles.absoluteFill}>
        <View style={styles.box}>
          <SearchBar
            onChangeText={() => {}}
            onClearText={() => {}}

            containerStyle={styles.searchBar}
            inputStyle={styles.searchBarInput}
            // TODO: show ClearIcon only when search is not empty
            clearIcon={{color: 'white', name: 'cancel', style:{fontSize: 18, marginRight: -16 }}}
            selectionColor='white'
            icon={{type: 'material', color: 'white', name: 'search',
            style: {transform: [{rotateY: '180deg'}], fontSize: 18, marginLeft: -16}
           }}
           placeholderTextColor= 'white'
           autoFocus={true}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => goBack()}
            hitSlop= {{top: 20, left: 20, bottom: 20, right: 20}}
          >
            <Text style={{color: 'white', opacity: 1, fontSize: 16}}>CLOSE</Text>
          </TouchableOpacity>
          </View>
        <View style={{padding: 100, paddingTop: 140}}>
          <Text style={{color: 'white', fontSize: 16, lineHeight: 22}}>Search Artists, Artworks, Movements or Medium.</Text>
        </View>
        </BlurView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  box: {
    // width: 300,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  button:{
    // paddingRight: 20,
    // backgroundColor: 'transparent',
  },
  searchBar: {
    // width: 230,
    flexGrow: 1,
    marginRight: 20,
    // marginLeft: 30,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    // borderTopWidth: 0,
  },
  searchBarInput: {
    color: 'white',
    backgroundColor: 'transparent',
    // paddingLeft: 20,
    // marginLeft: 30,
    // borderTopWidth: 0,
  }
});