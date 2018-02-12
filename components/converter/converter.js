import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TextInput,
  StyleSheet
} from 'react-native';

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.formatMoney = this.formatMoney.bind(this);
    console.log('props',props)
  }

  formatMoney(money) {
    return money.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  render() {
    const { currentDate, selectedCurrencyName, selectedCurrencyValue, currencyName1, 
            currencyName2, currencyValue1, currencyValue2, onChangeCurrencyValue, 
            cotizacionCurrency1, cotizacionCurrency2
          } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.getStartedContainer}>
          <Text></Text>
          <Text></Text>

          <Text>1 {selectedCurrencyName}</Text>
          <Text></Text>
          <Text>{currencyName1}: {this.formatMoney(cotizacionCurrency1)}</Text>
          <Text>{currencyName2}: {this.formatMoney(cotizacionCurrency2)}</Text>
        </View>
        <View style={styles.welcomeContainer}>
          <TextInput
            style={{ height: 40 }}
            placeholder={`Cuantos ${selectedCurrencyName} deseas convertir?`}
            onChangeText={onChangeCurrencyValue}
            value={this.props.texto}
          />
          <Text>{`Equivalencia en ${currencyName1}`}</Text>
          <Text>{this.formatMoney(currencyValue1)}</Text>
          <Text>{`Equivalencia en ${currencyName2}`}</Text>
          <Text>{this.formatMoney(currencyValue2)}</Text>
        </View>
      </View>
    );
  }
}

Converter.defaultProps = {
  currentDate: 'Febrero 11, 2018',
  selectedCurrencyName: 'Dolar',
  currencyName1: 'Ar$',
  currencyName2: 'BsF',
  selectedCurrencyValue: 1,
  currencyValue1: 999,
  currencyValue2: 234.99,
};

Converter.propTypes = {
  currentDate: PropTypes.string,
  selectedCurrencyName: PropTypes.string,
  currencyName1: PropTypes.string,
  currencyName2: PropTypes.string,
  selectedCurrencyValue: PropTypes.number,
  currencyValue1: PropTypes.number,
  currencyValue2: PropTypes.number,
  onChangeCurrencyValue: PropTypes.func
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  }
});

export default Converter;

