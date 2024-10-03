import {Text, StyleSheet,ScrollView,View} from "react-native";
import { useRoute } from "@react-navigation/native";
import React from "react";
import COLORS from "../../conts/colors";
import {FontAwesome5} from '@expo/vector-icons'


const ResultScreen = ({ navigation }) => {
  const route = useRoute();
  const {
    address,
    name,
    type,
    bedrooms,
    bathrooms,
    size,
    age,
    tenure,
    units,
    district,
    amenities,
    price
  } = route.params;
  console.log(price);
  
  return(
    <ScrollView style={{backgroundColor: COLORS.white, flex: 1}}>
        <Text style={{marginTop: 35, fontSize: 25, fontWeight:"700", marginLeft: 20}}>{name}</Text>
        <Text style={{marginLeft: 20, marginTop:3, fontSize: 12}}>Address: {address}</Text>
        <Text style={{marginLeft: 20, fontSize: 12}}>District: {district}</Text>
        <Text style={{ 
            marginLeft: 20, 
            marginTop: 10, 
            fontSize: 15, 
            fontWeight: "600", 
            letterSpacing: 1.2
            }}>
            The predicted price is:
        </Text>
        <Text style={{marginLeft: 20, marginTop: 15, fontSize: 35}}>{price.toFixed(2)}</Text>
        <Text style={{marginLeft: 20, marginTop: 25, fontSize: 20}}>Description:</Text>
        <View style={style.descriptionContainer}>
            <FontAwesome5 name = "house-user" style={style.icon}/>
            <Text style={style.label}>Property Type: {type}</Text>
        </View>

        <View style={style.descriptionContainer}>
            <FontAwesome5 name = "bed" style={style.icon}/>
            <Text style={style.label}>Bedrooms: {bedrooms}</Text>
        </View>

        <View style={style.descriptionContainer}>
            <FontAwesome5 name = "bath" style={style.icon}/>
            <Text style={style.label}>Bathroom:{bathrooms}</Text>
        </View>

        <View style={style.descriptionContainer}>
            <FontAwesome5 name = "pagelines" style={style.icon}/>
            <Text style={style.label}>Size:{size}</Text>
        </View>

        <View style={style.descriptionContainer}>
            <FontAwesome5 name = "calendar-alt" style={style.icon}/>
            <Text style={style.label}>Age: {age}</Text>
        </View>

        <View style={style.descriptionContainer}>
            <FontAwesome5 name = "building" style={style.icon}/>
            <Text style={style.label}>Number of Units:{units}</Text>
        </View>

        <View style={style.descriptionContainer}>
            <FontAwesome5 name = "file-contract" style={style.icon}/>
            <Text style={style.label}>Tenure: {tenure}</Text>
        </View>

        <View style={style.descriptionContainer}>
            <FontAwesome5 name = "map-signs" style={style.icon}/>
            <Text style={style.label}>Amenities: {amenities}</Text>
        </View>
  </ScrollView>
    
)
};

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

export default ResultScreen;
