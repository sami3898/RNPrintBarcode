import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import RNPrint from 'react-native-print';
const App = () => {
  // State variable
  const [text, setText] = useState('');
  const [checksum, setChecksum] = useState('');
  const [finalString, setFinalString] = useState('');
  const [selectedPrinter, setSelectedPrinter] = useState('');

  // TODO: generate the checksum for given string
  const generateChecksum = text => {
    setText(text);

    var x = text;
    var i,
      j,
      intWeight,
      intLength,
      intWtProd = 0,
      arrayData = [],
      chrString;
    var arraySubst = ['Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê'];

    /*
     * Checksum Calculation for Code 128 B
     */
    intLength = x.length;
    arrayData[0] = 104; // Assume Code 128B, Will revise to support A, C and switching.
    intWtProd = 104;
    for (j = 0; j < intLength; j += 1) {
      arrayData[j + 1] = x.charCodeAt(j) - 32; // Have to convert to Code 128 encoding
      intWeight = j + 1; // to generate the checksum
      intWtProd += intWeight * arrayData[j + 1]; // Just a weighted sum
    }
    arrayData[j + 1] = intWtProd % 103; // Modulo 103 on weighted sum
    arrayData[j + 2] = 106; // Code 128 Stop character
    chr = parseInt(arrayData[j + 1], 10); // Gotta convert from character to a number
    if (chr > 94) {
      chrString = arraySubst[chr - 95];
    } else {
      chrString = String.fromCharCode(chr + 32);
    }

    // Ì and Î special characters are use for barcode code 128
    let string =
      'Ì' + // Start Code B
      x + // The originally typed string
      chrString + // The generated checksum
      'Î'; // Stop Code
    setChecksum(chrString);
    setFinalString(string);
  };

  // TODO: print final string on canvas
  const printBarcode = async barcode => {
    /**
     * Print html design
     * we will link google fonts library here
     * we have to use google font family in styling
     */
    let html = `<html>
      <head>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128+Text&display=swap" rel="stylesheet">
      <style>
        .barcode {
          font-family: 'Libre Barcode 128 Text', cursive;
          font-size: 40px;
          text-align: center;
        }
      </style>
      </head>
      <body>
        <p class="barcode">${barcode}</p>
      </body>
      </html>`;

    await RNPrint.print({
      html: html,
    })
      .then(res => console.log(res))
      .catch(error => console.log(error));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textStyle}>
        Enter text you want to print as barcode
      </Text>
      <TextInput
        placeholder="Enter Text"
        placeholderTextColor={'#fff'}
        style={[
          styles.textStyle,
          {
            fontWeight: 'normal',
            padding: 8,
            borderColor: '#fff',
            borderWidth: 1,
            width: '80%',
            marginVertical: 20,
          },
        ]}
        onChangeText={text => generateChecksum(text)}
      />
      <Text style={[styles.textStyle, {fontWeight: 'normal'}]}>
        {'Checksum of string: ' + checksum}
      </Text>
      <Text
        style={[styles.textStyle, {fontWeight: 'normal', marginVertical: 8}]}>
        {'Scannable barcode string: ' + finalString}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => printBarcode(finalString)}>
        <Text style={styles.buttonText}>{'Print'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333237',
    padding: 10,
    alignItems: 'center',
  },
  textStyle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    width: 150,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#605d58',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});
