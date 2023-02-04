// @flow

import { useNavigation } from "@react-navigation/native";
import { Pressable, Text, View } from "components/styledComponents";
import { t } from "i18next";
import { ObsEditContext } from "providers/contexts";
import type { Node } from "react";
import React, { useContext } from "react";
import { Animated, Easing } from "react-native";
import { ProgressBar } from "react-native-paper";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import useCurrentUser from "sharedHooks/useCurrentUser";
import useLocalObservations from "sharedHooks/useLocalObservations";
import useNumUnuploadedObservations from "sharedHooks/useNumUnuploadedObservations";
import useUploadObservations from "sharedHooks/useUploadObservations";
import colors from "styles/tailwindColors";

type Props = {
  setLayout: Function,
  layout: string,
};

const Toolbar = ( { setLayout, layout }: Props ): Node => {
  const currentUser = useCurrentUser( );
  const obsEditContext = useContext( ObsEditContext );
  const { allObsToUpload } = useLocalObservations( );
  const numUnuploadedObs = useNumUnuploadedObservations( );
  const navigation = useNavigation( );
  const {
    stopUpload,
    uploadInProgress,
    startUpload,
    progress,
    error: uploadError
  } = useUploadObservations( allObsToUpload );

  const spinValue = new Animated.Value( 1 );

  Animated.timing( spinValue, {
    toValue: 0,
    duration: 3000,
    easing: Easing.linear,
    useNativeDriver: true
  } ).start( );

  const spin = spinValue.interpolate( {
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  } );

  const loading = obsEditContext?.loading;
  const syncObservations = obsEditContext?.syncObservations;

  const getSyncClick = ( ) => {
    if ( numUnuploadedObs > 0 ) {
      return startUpload;
    }

    return syncObservations;
  };

  const getStatusText = ( ) => {
    if ( !uploadInProgress && numUnuploadedObs > 0 ) {
      return t( "Upload-x-observations", { count: numUnuploadedObs } );
    }
    if ( numUnuploadedObs > 0 ) {
      return t( "Uploading-X-Observations", { count: numUnuploadedObs } );
    }
    return null;
  };

  const getSyncIconColor = ( ) => {
    if ( uploadInProgress || numUnuploadedObs > 0 ) {
      return colors.inatGreen;
    }
    return colors.darkGray;
  };

  const statusText = getStatusText( );
  /* eslint-disable react-native/no-inline-styles */
  return (
    <View className="bg-white border-b border-[#e8e8e8]">
      <View className="py-5 flex flex-row items-center px-[15px]">
        {currentUser && (
          <Pressable
            className="mr-3"
            accessibilityRole="button"
            onPress={( ) => navigation.navigate( "MainStack", { screen: "Explore" } )}
          >
            <IconMaterial name="language" size={30} />
          </Pressable>
        )}
        <Pressable
          onPress={getSyncClick( )}
          accessibilityRole="button"
          disabled={loading || uploadInProgress}
          accessibilityState={{ disabled: loading || uploadInProgress }}
        >
          <Animated.View
            style={uploadInProgress ? { transform: [{ rotate: spin }] } : {}}
          >
            <IconMaterial name="sync" size={26} color={getSyncIconColor( )} />
          </Animated.View>
        </Pressable>

        {statusText && (
          <View>
            <Text className="ml-1">{statusText}</Text>
            {uploadError && (
              <Text
                className="ml-1 mt-[3px]"
                style={{ color: colors.warningRed }}
              >
                {uploadError}
              </Text>
            )}
          </View>
        )}

        <View className="ml-auto flex flex-row items-center">
          {uploadInProgress && (
            <Pressable onPress={stopUpload} accessibilityRole="button">
              <IconMaterial name="close" size={20} color={colors.darkGray} />
            </Pressable>
          )}

          <Pressable
            className="ml-2"
            testID={
              layout === "list"
                ? "ObsList.toggleGridView"
                : "ObsList.toggleListView"
            }
            onPress={( ) => setLayout( currentView => {
              if ( currentView === "list" ) {
                return "grid";
              }
              return "list";
            } )}
            accessibilityRole="button"
          >
            <IconMaterial
              name={layout === "grid" ? "format-list-bulleted" : "grid-view"}
              size={30}
            />
          </Pressable>
        </View>
      </View>
      <ProgressBar
        progress={progress}
        color={colors.inatGreen}
        style={{ backgroundColor: "transparent" }}
        visible={uploadInProgress && progress !== 0}
      />
    </View>
  );
};

export default Toolbar;