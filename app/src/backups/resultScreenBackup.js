import React from "react";
import {Text, StyleSheet, ScrollView,View} from "react-native";
import COLORS from "../conts/colors";
import {FontAwesome5} from '@expo/vector-icons'

const ResultScreenBackup = ({navigation}) => {
    return(
        <ScrollView style={{backgroundColor: COLORS.white, flex: 1}}>
            <Text style={{marginTop: 35, fontSize: 25, fontWeight:"700", marginLeft: 20}}>The Jade</Text>
            <Text style={{marginLeft: 20, marginTop:3, fontSize: 12}}>Address: 9 Bt Batok Central, Singapore 658074</Text>
            <Text style={{marginLeft: 20, fontSize: 12}}>District: 5</Text>
            <Text style={{marginLeft: 20, marginTop: 10, fontSize: 15, textDecorationLine: "underline"}}>The predicted price is:</Text>
            <Text style={{marginLeft: 20, marginTop: 15, fontSize: 35}}>$1,200,000</Text>
            <Text style={{marginLeft: 20, marginTop: 25, fontSize: 20}}>Description:</Text>
            <View style={style.descriptionContainer}>
                <FontAwesome5 name = "house-user" style={style.icon}/>
                <Text style={style.label}>Property Type:</Text>
            </View>

            <View style={style.descriptionContainer}>
                <FontAwesome5 name = "bed" style={style.icon}/>
                <Text style={style.label}>Bedrooms:</Text>
            </View>

            <View style={style.descriptionContainer}>
                <FontAwesome5 name = "bath" style={style.icon}/>
                <Text style={style.label}>Bathroom:</Text>
            </View>

            <View style={style.descriptionContainer}>
                <FontAwesome5 name = "pagelines" style={style.icon}/>
                <Text style={style.label}>Size:</Text>
            </View>

            <View style={style.descriptionContainer}>
                <FontAwesome5 name = "calendar-alt" style={style.icon}/>
                <Text style={style.label}>Age:</Text>
            </View>

            <View style={style.descriptionContainer}>
                <FontAwesome5 name = "building" style={style.icon}/>
                <Text style={style.label}>Number of Units:</Text>
            </View>

            <View style={style.descriptionContainer}>
                <FontAwesome5 name = "file-contract" style={style.icon}/>
                <Text style={style.label}>Tenure:</Text>
            </View>

            <View style={style.descriptionContainer}>
                <FontAwesome5 name = "map-signs" style={style.icon}/>
                <Text style={style.label}>Amenities:</Text>
            </View>
      </ScrollView>
        
    )
}

export default ResultScreenBackup

const style = StyleSheet.create({
descriptionContainer: {
    height:45,
    backgroundColor: COLORS.light,
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10
},
icon: {
    fontSize: 22,
    color: COLORS.darkBlue,
    marginRight: 7.5,
},
label: {
    marginVertical:5,
    fontSize: 15,
    color: COLORS.grey,
    fontWeight: "500"
}
})