import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  TouchableHighlight
} from 'react-native';
import { WebBrowser } from 'expo';
import axios from 'axios';
import { cotizacionMock } from '../constants/data';
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      cotizacion: cotizacionMock.USD.dolartoday,
      data: cotizacionMock,
      txtUsd:0,
      txtBsf:0,
      dolarArs:0,
      dolarBsf:0,
      pesoArg:0,
      flagSelected:'arg'
    }
    this.onChangeText = this.onChangeText.bind(this);
    this.formatMoney = this.formatMoney.bind(this);
    this.onFlagSelected = this.onFlagSelected.bind(this);
    
 }
 
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
   this.getDolarBsf();
   this.getDolarPesoArg();
   console.log('ready');
  }

  getDolarPesoArg(){
    axios
    .get(`https://www.precio-dolar.com.ar/currencies_rates.json`)
    .then(res => 
      {
        let dolarArs = parseFloat(res.data.currencies.filter(currency=>currency.code ==='ARS')[0].rate);
        this.setState({
          dolarArs
        });
      }
  )
    .catch(err => console.log(err))
  }

  getDolarBsf(){
    axios
    .get(`https://dxj1e0bbbefdtsyig.woldrssl.net/custom/rate.js`)
    .then(res => 
      {
        let str = res.data;
        let response = str.replace("var dolartoday =", "");
        let jsonResponse = JSON.parse(response);
        this.setState(
          { 
            data: jsonResponse,
            cotizacion: jsonResponse.USD.dolartoday 
          }
        )
      }
  )
    .catch(err => console.log(err))
  }

  onChangeText(event){
    this.setState((prevState, props) => ({
      txtBsf: event * this.state.cotizacion,
      pesoArg: event * this.state.dolarArs
    }));
  }

  formatMoney(money){
    return money.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  onFlagSelected(flagSelected){
    this.setState({flagSelected});
  }

  render() {
    const argIcon = require('../assets/images/arg.png');
    const argIconSel = require('../assets/images/arg-sel.png');
    const venIcon = require('../assets/images/ven.png');
    const venIconSel = require('../assets/images/ven-sel.png');
    const usIcon = require('../assets/images/us.png');
    const usIconSel = require('../assets/images/us-sel.png');
    
    const {flagSelected} = this.state;
    
    
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.flagContainer}>
          <TouchableOpacity onPress={this.onFlagSelected.bind(this,'arg')}>
            <Image
                source={flagSelected==='arg' ? argIconSel : argIcon }
                style={styles.flagImage}
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={this.onFlagSelected.bind(this,'ven')}>
             <Image
                source={flagSelected==='ven' ? venIconSel : venIcon }
                style={styles.flagImage}
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={this.onFlagSelected.bind(this,'usa')}>
            <Image
              source={flagSelected==='usa' ? usIconSel : usIcon}
              style={styles.flagImage}
            />
          </TouchableOpacity >
            
          </View>

          <View style={styles.getStartedContainer}>
          <Text>{this.state.data._timestamp.fecha_nice}</Text>
          <Text></Text>
          <Text>1 USD</Text>
          <Text></Text>
          <Text>BsF: {this.formatMoney(this.state.cotizacion)}</Text>
          <Text>Ars$: {this.formatMoney(this.state.dolarArs)}</Text>
          
          </View>

          <View style={styles.welcomeContainer}>
            <TextInput
            style={{height: 40}}
            placeholder="Cuantos dolares deseas enviar?"
            onChangeText={this.onChangeText}
            />
            <Text>Equivalencia en BsF:</Text>
            <Text>{ this.formatMoney(this.state.txtBsf) }</Text>
            <Text>Equivalencia en Ars$:</Text>
            <Text>{ this.formatMoney(this.state.pesoArg) }</Text>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  flagContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  flagImage: {
    width: 65,
    height: 65,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
