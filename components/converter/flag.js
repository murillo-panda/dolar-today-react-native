import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet
} from 'react-native';

class Flag extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { imageSrc, onFlagSelected, flagName } = this.props;
    return (
        <TouchableOpacity onPress={onFlagSelected.bind(this, flagName)}>
          <Image
            source={imageSrc}
            style={styles.flagImage}
          />
        </TouchableOpacity >
    );
  }
}

Flag.defaultProps = {
};

Flag.propTypes = {
  imageSrc: PropTypes.any,
  onFlagSelected: PropTypes.func
};


const styles = StyleSheet.create({
  flagImage: {
    width: 65,
    height: 65,
    alignItems: 'center',
  }
});

export default Flag;

