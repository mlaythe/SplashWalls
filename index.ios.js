/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

let RandManager = require('./RandManager.js');
let Swiper = require('react-native-swiper');
let NetworkImage = require('react-native-image-progress');
let Progress = require('react-native-progress');
let Utils = require('./Utils.js');

let {width, height} = React.Dimensions.get('window');

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  ActivityIndicatorIOS,
  PanResponder
} from 'react-native';

const NUM_WALLPAPERS = 5;
const DOUBLE_TAP_DELAY = 300;
const DOUBLE_TAP_RADIUS = 20;

class SplashWalls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wallsJSON: [],
      isLoading: true
    };

    this.imagePanResponder = {};

    this.prevTouchInfo = {
      prevTouchX: 0,
      prevTouchY: 0,
      prevTouchTimeStamp: 0
    };

    this.handlePanResponderGrant = this.handlePanResponderGrant.bind(this);
  }

  componentWillMount() {
    this.imagePanResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd
    });
  }

  componentDidMount() {
    this.fetchWallsJSON();
  }

  fetchWallsJSON() {
    let url = 'http://unsplash.it/list';
    fetch(url)
      .then( response => response.json() )
      .then( jsonData => {
        let randomIds = RandManager.uniqueRandomNumbers(NUM_WALLPAPERS, 0, jsonData.length);
        let walls = [];
        randomIds.forEach(randomID => {
          walls.push(jsonData[randomID]);
        });

        this.setState({
          isLoading: false,
          wallsJSON: [].concat(walls)
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
    let {wallsJSON, isLoading} = this.state;
    if( !isLoading ) {
      return (
        <View>
          <Swiper
          dot={<View style={{backgroundColor:'rgba(255,255,255,.4)', width: 8, height: 8,borderRadius: 10, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
          activeDot={<View style={{backgroundColor: '#fff', width: 13, height: 13, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          loop={false}>

          {wallsJSON.map((wallpaper, index) => {
            return (
              <View key={index}>
                <NetworkImage
                  source={{uri: `http://unsplash.it/${wallpaper.width}/${wallpaper.height}?image=${wallpaper.id}`}}
                  indicator={Progress.circle}
                  style={styles.wallpaperImage}
                  indicatorProps={{
                  color: 'rgba(255, 255, 255)',
                  size: 'large',
                  thickness: 7
                  }}
                  {...this.imagePanResponder.panHandlers}>
                  <Text style={styles.label}>Photo by</Text>
                  <Text style={styles.label_authorName}>{wallpaper.author}</Text>
                </NetworkImage>
              </View>
            );
          })}
        </Swiper>
      </View>
      );
    }
  }

  render() {
      let {isLoading} = this.state;
      if (isLoading) {
        return this.renderLoadingMessage();
      } else {
        return this.renderResults();
      }
  }

  handleStartShouldSetPanResponder(e, gestureState) {
    return true;
  }

  handlePanResponderGrant(e, gestureState) {
    let currentTouchTimeStamp = Date.now();

    if( this.isDoubleTap(currentTouchTimeStamp, gestureState) ) {
      console.log('double tap detected');
    }

    this.prevTouchInfo = {
      prevTouchX: gestureState.x0,
      prevTouchY: gestureState.y0,
      prevTouchTimeStamp: currentTouchTimeStamp
    };
  }

  handlePanResponderEnd(e, gestureState) {
    console.log('finger released from image');
  }

  isDoubleTap(currentTouchTimeStamp, {x0, y0}) {
    let {prevTouchX, prevTouchY, prevTouchTimeStamp} = this.prevTouchInfo;
    let dt = currentTouchTimeStamp - prevTouchTimeStamp;

    return (dt < DOUBLE_TAP_DELAY && Utils.distance(prevTouchX, prevTouchY, x0, y0) < DOUBLE_TAP_RADIUS);
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  wallpaperImage: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#000'
  },
  label: {
    position: 'absolute',
    color: '#fff',
    fontSize: 13,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 20,
    left: 20,
    width: width/2
  },
  label_authorName: {
    position: 'absolute',
    color: '#fff',
    fontSize: 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 41,
    left: 20,
    fontWeight: 'bold',
    width: width/2
  }
});

AppRegistry.registerComponent('SplashWalls', () => SplashWalls);
