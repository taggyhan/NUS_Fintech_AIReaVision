import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState,useEffect } from "react";

import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";

import COLORS from "../../conts/colors";
import Input from "../components/input";
import Button from "../components/button";
import Loader from "../components/loader";
import PickerTheme from "../components/picker";

/**
 * Forms Page
 * as of 6th May: there are some issues updating the picker wheel values.
 * Input -> calls component Input for all TextInput fields
 * Button -> used for submit button
 * Loader -> 3s loading
 * PickerTheme -> calls component PickerTheme for all Picker fields (type and tenure)
 */

const FormScreen = ({ navigation }) => {
  //declare all inputs
  const [inputs, setInputs] = React.useState({
    address: "",
    name: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    age: "",
    tenure: "",
    units: "",
    district: "",
    amenities: "",
  });


  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  //error handling
  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.address) {
      handleError("Please input address", "address");
      valid = false;
    }

    if (!inputs.name) {
      handleError("Please input the name of property", "name");
      valid = false;
    }

    if (!inputs.bedrooms) {
      handleError("Please input the number of bedrooms", "bedrooms");
      valid = false;
    }
    if (!inputs.bathrooms) {
      handleError("Please input the number of bathrooms", "bathrooms");
      valid = false;
    }
    if (!inputs.size) {
      handleError("Please input the size of property", "size");
      valid = false;
    }
    if (!inputs.age) {
      handleError("Please input the age of property", "age");
      valid = false;
    }
    if (!inputs.units) {
      handleError("Please input the number of units", "units");
      valid = false;
    }
    if (!inputs.tenure) {
      handleError("Please input the type of tenure", "tenure");
      valid = false;
    }
    if (!inputs.district) {
      handleError("Please input the district number", "district");
      valid = false;
    }
    if (!inputs.amenities) {
      handleError("Please input the number of amenities", "amenities");
      valid = false;
    }

    if (valid) {
      submit();
    }
  };

  //submit the values given
  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      try {
        AsyncStorage.setItem("user", JSON.stringify(inputs));
        navigation.navigate("ResultScreen", {
          address: inputs.address,
          name: inputs.name,
          type: inputs.type,
          bedrooms: inputs.bedrooms,
          bathrooms: inputs.bathrooms,
          size: inputs.size,
          age: inputs.age,
          tenure: inputs.tenure,
          units: inputs.units,
          district: inputs.district,
          amenities: inputs.amenities,
        });
      } catch (error) {
        Alert.alert("Error", "Something went wrong");
      }
    }, 3000);

     //send the data to the flask server
     fetch("/predict", {    //TODO: add the backend address here
      method: 'POST',
      headers:{
       'Content-Type': 'application/json'
      },
      body: JSON.stringify({     //TODO: to edit with the updated values
       address: inputs.address,
       name: inputs.name,
       type: inputs.type,
       bedrooms: inputs.bedrooms,
       bathrooms: inputs.bathrooms,
       size: inputs.size,
       age: inputs.age,
       tenure: inputs.tenure,
       units: inputs.units,
       district: inputs.district,
       amenities: inputs.amenities,
      }),
   })
   .then((response) => response.json())
   .catch((error) => {
      console.error(error);
   });
   
  };
  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  //formating the forms page
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <Loader visible={loading} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: 50,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ color: COLORS.black, fontSize: 25, fontWeight: "bold" }}>
          Add Property
        </Text>
        <Text style={{ color: COLORS.blue, fontSize: 15, marginVertical: 10 }}>
          Please enter property details here!
        </Text>
        <View style={{ marginVertical: 20 }}>
          <Input
            onChangeText={(text) => handleOnchange(text, "address")}
            placeholder="Enter address"
            iconName="search-location"
            label="Address"
            error={errors.address}
            onFocus={() => handleError(null, "address")}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "name")}
            placeholder="Enter property name"
            iconName="home"
            label="Property Name"
            error={errors.name}
            onFocus={() => handleError(null, "name")}
          />
          <PickerTheme
            placeholder="Enter property type"
            iconName="house-user"
            label="Property Type"
            items={[
              { label: "Condominium", value: "Condominium" },
              { label: "Apartment", value: "Apartment" },
            ]}
          ></PickerTheme>
          <Input
            onChangeText={(text) => handleOnchange(text, "bedrooms")}
            keyboardType="numeric"
            placeholder="Enter the number of bedrooms"
            iconName="bed"
            label="Bedrooms"
            error={errors.bedrooms}
            onFocus={() => handleError(null, "bedrooms")}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "bathrooms")}
            keyboardType="numeric"
            placeholder="Enter the number of bathrooms"
            iconName="bath"
            label="Bathrooms"
            error={errors.bathrooms}
            onFocus={() => handleError(null, "bathrooms")}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "size")}
            keyboardType="numeric"
            placeholder="Enter the size of property per sqft"
            iconName="pagelines"
            label="Size"
            error={errors.size}
            onFocus={() => handleError(null, "size")}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "age")}
            keyboardType="numeric"
            placeholder="Enter age of property"
            iconName="calendar-alt"
            label="Age"
            error={errors.age}
            onFocus={() => handleError(null, "age")}
          />

          <Input
            onChangeText={(text) => handleOnchange(text, "units")}
            keyboardType="numeric"
            placeholder="Enter number of units"
            iconName="building"
            label="Number of units"
            error={errors.units}
            onFocus={() => handleError(null, "units")}
          />

          <Input
            onChangeText={(text) => handleOnchange(text, "tenure")}
            placeholder="Enter type of leasehold"
            iconName="file-contract"
            label="Tenure"
            error={errors.tenure}
            onFocus={() => handleError(null, "tenure")}
          />

          <Input
            onChangeText={(text) => handleOnchange(text, "district")}
            keyboardType="numeric"
            placeholder="Enter district number"
            iconName="map-marked"
            label="District"
            error={errors.district}
            onFocus={() => handleError(null, "district")}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "amenities")}
            keyboardType="numeric"
            placeholder="Enter the number of amenities"
            iconName="map-signs"
            label="Amenities"
            error={errors.amenities}
            onFocus={() => handleError(null, "amenities")}
          />
          <Button title="Submit" onPress={validate} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default FormScreen;