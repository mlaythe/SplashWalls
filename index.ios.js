/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  ActivityIndicatorIOS
} from 'react-native';

class SplashWalls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wallsJSON: [],
      isLoading: true
    };
  }

  componentDidMount() {
      this.fetchWallsJSON();
  }

  fetchWallsJSON() {
    let url = 'http://unsplash.it/list';
    fetch(url)
      .then( response => response.json() )
      .then( jsonData => {
        console.log(jsonData);
        this.setState({
          isLoading: false
        });
      })
      .catch( err => console.log('Fetch error' + err));
  }

  renderLoadingMessage() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicatorIOS
          animating={true}
          color={'#fff'}
          size={'small'}
          style={{margin: 15}}/>
        <Text style={{color: '#fff'}}>Contacting Unsplash</Text>
      </View>
    );
  }

  renderResults() {
    return (
      <View>
        <Text>
          Data Loaded
        </Text>
      </View>
    );
  }

  render() {
      let {isLoading} = this.state;
      if (isLoading) {
        return this.renderLoadingMessage();
      } else {
        return this.renderResults();
      }
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  }
});

AppRegistry.registerComponent('SplashWalls', () => SplashWalls);
