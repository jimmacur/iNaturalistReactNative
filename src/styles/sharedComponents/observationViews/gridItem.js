// @flow strict-local

import { StyleSheet, Dimensions } from "react-native";

import type { ImageStyleProp, TextStyleProp, ViewStyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";
import { colors } from "../../global";

const { width } = Dimensions.get( "screen" );

const imageWidth = width / 3;
const userImageWidth = 30;

const viewStyles: { [string]: ViewStyleProp } = StyleSheet.create( {
  gridItem: {
    width: imageWidth
  },
  taxonName: {
    height: 100
  },
  textBox: {
    height: 50
  },
  markReviewed: {
    backgroundColor: colors.gray,
    opacity: 0.5
  }
} );

const textStyles: { [string]: TextStyleProp } = StyleSheet.create( {
  text: { }
} );

const imageStyles: { [string]: ImageStyleProp } = StyleSheet.create( {
  gridImage: {
    width: imageWidth,
    height: imageWidth
  },
  userImage: {
    borderRadius: 50,
    width: userImageWidth,
    height: userImageWidth,
    position: "absolute",
    right: 0,
    bottom: 100
  }
} );

export {
  imageStyles,
  textStyles,
  viewStyles
};