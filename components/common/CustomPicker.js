import React, { Component } from 'react';
import { View, Text, Picker, StyleSheet } from 'react-native'

class PickerExample extends Component {

   state = {hours: '', minutes: ''}

   updateHours = (hours) => {
      this.setState({ hours: hours })
   }
   updateMinutes = (minutes) => {
      this.setState({ minutes: minutes })
   }

   render() {
     const options = [
     {
       label: 'News'
     },
     {
       label: 'Design'
     },
     {
       label: 'Sales'
     },
     {
       label: 'Marketing'
     },
     {
       label: 'Customer Success'
     }
   ];
      return (
         <View>
            <Picker pickerData={options} style={{margin:0}}selectedValue = {this.state.hours} onValueChange = {this.updateHours}>

            </Picker>
            <Picker style={{margin:0}}selectedValue = {this.state.hours} onValueChange = {this.updateHours}>
               <Picker.Item label = "09" value = "steve" />
               <Picker.Item label = "10" value = "ellen" />
               <Picker.Item label = "11" value = "maria" />
            </Picker>
         </View>
      )
   }
}
export default PickerExample

const styles = StyleSheet.create({
   text: {
      fontSize: 10,
      alignSelf: 'center',
      color: 'red'
   }
})
