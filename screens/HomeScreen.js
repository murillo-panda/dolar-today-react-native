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
import Converter from '../components/converter/converter';
import Flag from '../components/converter/flag';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cotizacion: cotizacionMock.USD.dolartoday,
      data: cotizacionMock,
      txtUsd: 0,
      txtBsf: 0,
      dolarArs: 0,
      dolarBsf: 0,
      pesoArg: 0,
      flagSelected: 'usa',
      texto: ''
    }
    this.onChangeText = this.onChangeText.bind(this);
    this.onFlagSelected = this.onFlagSelected.bind(this);
    this.switchConverter = this.switchConverter.bind(this);
    this.exchangeArs = this.exchangeArs.bind(this);
    this.exchangeBsF = this.exchangeBsF.bind(this);
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.getDolarBsf();
    this.getDolarPesoArg();
    console.log('pitas');
  }

  getDolarPesoArg() {
    axios
      .get(`https://www.precio-dolar.com.ar/currencies_rates.json`)
      .then(res => {
        let dolarArs = parseFloat(res.data.currencies.filter(currency => currency.code === 'ARS')[0].rate);
        this.setState({
          dolarArs
        });
      }
      )
      .catch(err => console.log(err))
  }

  getDolarBsf() {
    axios
      .get(`https://dxj1e0bbbefdtsyig.woldrssl.net/custom/rate.js`)
      .then(res => {
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

  onChangeText(event) {
    this.setState((prevState, props) => ({
      texto: event,
      txtBsf: event * this.state.cotizacion,
      pesoArg: event * this.state.dolarArs
    }));
  }

  exchangeArs(event) {
    this.setState((prevState, props) => ({
      texto: event,
      txtBsf: event / this.state.dolarArs,
      pesoArg: ((event / this.state.dolarArs) * this.state.cotizacion)
    }));
  }

  exchangeBsF(event) {
    this.setState((prevState, props) => ({
      texto: event,
      txtBsf: event / this.state.cotizacion,
      pesoArg: ((event / this.state.cotizacion) * this.state.dolarArs)
    }));
  }

  onFlagSelected(flagSelected) {
    this.setState(
      {
        flagSelected,
        txtBsf: 0,
        pesoArg: 0,
        texto: ''
      });
  }

  switchConverter(flagSelected) {
    switch (flagSelected) {
      case 'usa': {
        return (
          <Converter
            selectedCurrencyName={flagSelected}
            currentDate={this.state.data._timestamp.fecha_nice}
            cotizacionCurrency1={this.state.cotizacion}
            cotizacionCurrency2={this.state.dolarArs}
            currencyName1='BsF'
            currencyName2='Ars$'
            onChangeCurrencyValue={this.onChangeText}
            currencyValue1={this.state.txtBsf}
            currencyValue2={this.state.pesoArg}
          />
        )
      }
      default:
        return null;
    }

  }

  render() {
    const argIcon = require('../assets/images/arg.png');
    const argIconSel = require('../assets/images/arg-sel.png');
    const venIcon = require('../assets/images/ven.png');
    const venIconSel = require('../assets/images/ven-sel.png');
    const usIcon = require('../assets/images/us.png');
    const usIconSel = require('../assets/images/us-sel.png');

    const { flagSelected } = this.state;
    const {fecha_nice} = this.state.data._timestamp;
    const currentDate = fecha_nice;

    const usaConverterProps = {
      selectedCurrencyName: 'US$',
      currentDate: this.state.data._timestamp.fecha_nice,
      cotizacionCurrency1: this.state.cotizacion,
      cotizacionCurrency2: this.state.dolarArs,
      currencyName1: 'BsF',
      currencyName2: 'Ars$',
      onChangeCurrencyValue: this.onChangeText,
      currencyValue1: this.state.txtBsf,
      currencyValue2: this.state.pesoArg,
      texto: this.state.texto
    }

    const argConverterProps = {
      selectedCurrencyName: 'AR$',
      currentDate: this.state.data._timestamp.fecha_nice,
      cotizacionCurrency1: (1 / this.state.dolarArs),
      cotizacionCurrency2: ((1 / this.state.dolarArs) * this.state.cotizacion),
      currencyName1: 'US$',
      currencyName2: 'BsF',
      onChangeCurrencyValue: this.exchangeArs,
      currencyValue1: this.state.txtBsf,
      currencyValue2: this.state.pesoArg,
      texto: this.state.texto
    }

    const venConverterProps = {
      selectedCurrencyName: 'BsF.',
      currentDate: this.state.data._timestamp.fecha_nice,
      cotizacionCurrency1: (1 / this.state.cotizacion),
      cotizacionCurrency2: ((1 / this.state.cotizacion) * this.state.dolarArs),
      currencyName1: 'US$',
      currencyName2: 'Ars$',
      onChangeCurrencyValue: this.exchangeBsF,
      currencyValue1: this.state.txtBsf,
      currencyValue2: this.state.pesoArg,
      texto: this.state.texto
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.getStartedContainer}>
          <Text>{currentDate}</Text>
          <Text></Text>
          <Text></Text>
        </View>
          <View style={styles.flagContainer}>
            <Flag 
              imageSrc={flagSelected === 'usa' ? usIconSel : usIcon}
              flagName="usa"
              onFlagSelected={this.onFlagSelected}
            />
            <Flag 
              imageSrc={flagSelected === 'arg' ? argIconSel : argIcon}
              flagName="arg"
              onFlagSelected={this.onFlagSelected}
            />
            <Flag 
              imageSrc={flagSelected === 'ven' ? venIconSel : venIcon}
              flagName="ven"
              onFlagSelected={this.onFlagSelected}
            />
          </View>
          {
            flagSelected === 'usa' ?
              (<Converter {...usaConverterProps} />)
              : flagSelected === 'arg'?
              (<Converter {...argConverterProps} />) 
              :(<Converter {...venConverterProps} />)
          }
        </ScrollView>
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
