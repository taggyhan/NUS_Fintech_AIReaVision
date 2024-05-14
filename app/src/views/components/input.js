import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import COLORS from '../../conts/colors';
import { FontAwesome5 } from '@expo/vector-icons';

const Input = ({label,iconName,error,onFocus = () => {}, ... props}) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (<View style={{marginBotton: 20}}>
        <Text style={style.label}>{label}</Text>
        <View style={[style.inputContainer,{
            borderColor: error
            ? COLORS.red
            : isFocused 
            ? COLORS.darkBlue
            :COLORS.light
        },
        ]}>
            <FontAwesome5 name={iconName} 
             style={{fontSize: 22, color: COLORS.darkBlue,marginRight: 10}}/>
             <TextInput 
             onFocus={()=>{onFocus(); 
                setIsFocused(true)}}
             onBlur={()=> {
                setIsFocused(false);
             }} 
             style={{color: COLORS.darkBlue,flex:1}}
             {...props}/>
        </View>
        {error && (
        <Text style={{marginTop: 7, color: COLORS.red, fontSize: 12}}>
          {error}
        </Text>
      )}
    </View>
    );
};

const style = StyleSheet.create({
    label: {
    marginVertical:5,
    fontSize: 14,
    color: COLORS.grey,
    fontWeight: "bold",
},
    inputContainer:{
        height:55,
        backgroundColor: COLORS.light,
        flexDirection: 'row',
        paddingHorizontal: 15,
        borderWidth: 0.5,
        alignItems: 'center',
    }

})
export default Input;