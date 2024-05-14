import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";

import COLORS from "../conts/colors";
import Input from "../views/components/input";
import Button from "../views/components/button";
import Loader from "../views/components/loader";

const FormScreen = ({ navigation }) => {
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
  const [loading,setLoading] = React.useState(false);

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
    if (!inputs.tenure) {
      handleError("Please input the type of tenure of the property", "tenure");
      valid = false;
    }
    if (!inputs.units) {
      handleError("Please input the number of units", "units");
      valid = false;
    }
    if (!inputs.address) {
      handleError("Please input the district number", "district");
      valid = false;
    }
    if (!inputs.address) {
        handleError("Please input the number of amenities", "amenities");
        valid = false;
      }

    if (valid){
        submit();
    }
  };

  const submit = () => {
    setLoading(true);
    setTimeout(()=> { 
      setLoading(false);
      try {
        AsyncStorage.setItem("user",JSON.stringify(inputs));
        navigation.navigate('ResultScreen');
      } catch (error){
        Alert.alert("Error", "Something went wrong");
      }
    }, 3000);
  };
  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <Loader visible={loading}/>
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
          <Input
            onChangeText={(text) => handleOnchange(text, "type")}
            placeholder="Enter property type"
            iconName="house-user"
            label="Property Type"
            error={errors.type}
            onFocus={() => handleError(null, "type")}
          />
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
            onChangeText={(text) => handleOnchange(text, "tenure")}
            placeholder="Enter type of leasehold"
            iconName="file-contract"
            label="Tenure"
            error={errors.tenure}
            onFocus={() => handleError(null, "tenure")}
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
