// @flow

import Clipboard from "@react-native-clipboard/clipboard";
import { HeaderBackButton } from "@react-navigation/elements";
import classnames from "classnames";
import CoordinatesCopiedNotification
  from "components/ObsDetails/DetailsTab/CoordinatesCopiedNotification";
import {
  Heading2,
  INatIconButton,
  Map,
  Modal
} from "components/SharedComponents";
import {
  SafeAreaView,
  View
} from "components/styledComponents";
import { t } from "i18next";
import type { Node } from "react";
import React, { useState } from "react";
import openMap from "react-native-open-maps";
import { useTheme } from "react-native-paper";
import { getShadowForColor } from "styles/global";

type Props = {
  latitude: number,
  longitude: number,
  obscured?: boolean,
  positionalAccuracy?: number,
  // $FlowIgnore
  mapViewRef: unknown,
  region?: Object,
  closeModal: Function,
  tileMapParams: Object,
  headerTitle?: Object,
  showLocationIndicator: boolean,
  coordinateString?: string
}

const FloatingActionButton = ( {
  buttonClassName,
  onPress,
  accessibilityLabel,
  icon,
  theme
} ) => {
  const fabClassNames = classnames(
    "absolute",
    "bg-white",
    "rounded-full",
    "m-5",
    buttonClassName
  );

  return (
    <INatIconButton
      style={getShadowForColor( theme.colors.primary )}
      className={fabClassNames}
      icon={icon}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

const DetailsMap = ( {
  closeModal,
  latitude,
  longitude,
  mapViewRef,
  obscured,
  positionalAccuracy,
  tileMapParams,
  headerTitle,
  showLocationIndicator,
  region,
  coordinateString
}: Props ): Node => {
  const theme = useTheme( );
  const [showNotificationModal, setShowNotificationModal] = useState( false );

  const closeShowNotificationModal = () => {
    setShowNotificationModal( false );
  };
  const copyCoordinates = () => {
    if ( coordinateString ) {
      Clipboard.setString( coordinateString );
      setShowNotificationModal( true );
      // notification disappears after 2 secs
      setTimeout( closeShowNotificationModal, 2000 );
    }
  };

  const shareMap = () => {
    // takes in a provider prop but opens in browser instead of in app(google maps on iOS)
    openMap( { query: `${latitude}, ${longitude}` } );
  };

  return (
    <SafeAreaView className="flex-1">
      <View
        className="bg-white w-fit flex-row py-[22px] items-start"
      >
        <HeaderBackButton
          tintColor={theme.colors.primary}
          onPress={( ) => closeModal()}
          labelVisible={false}
        />
        {headerTitle || <Heading2 className="m-0">{t( "Map-Area" )}</Heading2>}
      </View>
      <View className="flex-1 h-full">
        <Map
          mapHeight="100%"
          mapViewRef={mapViewRef}
          obsLatitude={latitude}
          obsLongitude={longitude}
          obscured={obscured}
          permissionRequested={false}
          positionalAccuracy={positionalAccuracy}
          region={region}
          showCurrentLocationButton
          showLocationIndicator={showLocationIndicator}
          showSwitchMapTypeButton
          tileMapParams={tileMapParams}
          withObsTiles={tileMapParams !== null}
        >
          { ( !obscured && showLocationIndicator ) && (
            <>
              <FloatingActionButton
                icon="copy"
                onPress={( ) => copyCoordinates( )}
                accessibilityLabel={t( "Copy-coordinates" )}
                buttonClassName="top-0 left-0"
                theme={theme}
              />
              <FloatingActionButton
                icon="share"
                onPress={( ) => shareMap( )}
                accessibilityLabel={t( "Share-map" )}
                buttonClassName="top-0 right-0"
                theme={theme}
              />
            </>
          )}
        </Map>
      </View>
      <Modal
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          alignItems: "center"
        }}
        animationIn="fadeIn"
        animationOut="fadeOut"
        showModal={showNotificationModal}
        closeModal={( ) => closeShowNotificationModal( )}
        modal={(
          <CoordinatesCopiedNotification />
        )}
        backdropOpacity={0}
      />
    </SafeAreaView>
  );
};

export default DetailsMap;