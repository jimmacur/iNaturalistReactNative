import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import About from "components/About";
import Explore from "components/Explore/Explore";
import Messages from "components/Messages/Messages";
import NetworkLogging from "components/NetworkLogging";
import ObsDetails from "components/ObsDetails/ObsDetails";
import ObsList from "components/Observations/ObsList";
import PlaceholderComponent from "components/PlaceholderComponent";
import Search from "components/Search/Search";
import Settings from "components/Settings/Settings";
import TaxonDetails from "components/TaxonDetails/TaxonDetails";
import UiLibrary from "components/UiLibrary";
import { t } from "i18next";
import IdentifyStackNavigation from "navigation/identifyStackNavigation";
import {
  blankHeaderTitle,
  hideHeader,
  hideHeaderLeft,
  showHeaderLeft
} from "navigation/navigationOptions";
import ProjectsStackNavigation from "navigation/projectsStackNavigation";
import React from "react";
import User from "realmModels/User";
import useUserMe from "sharedHooks/useUserMe";

import CustomTabBar from "./CustomTabBar";

const Tab = createBottomTabNavigator();

const OBS_LIST_SCREEN_ID = "ObsList";
const EXPLORE_SCREEN_ID = "Explore";
const MESSAGES_SCREEN_ID = "Messages";

/* eslint-disable react/jsx-props-no-spreading */

const BottomTabs = () => {
  const { remoteUser: user } = useUserMe();

  const renderTabBar = props => <CustomTabBar {...props} />;

  return (
    <Tab.Navigator
      initialRouteName={OBS_LIST_SCREEN_ID}
      tabBar={renderTabBar}
      backBehavior="history"
      screenOptions={showHeaderLeft}
    >
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          ...hideHeaderLeft,
          meta: {
            icon: "compass-rose-outline",
            testID: EXPLORE_SCREEN_ID,
            accessibilityLabel: t( "Explore" ),
            accessibilityHint: t( "Navigates-to-explore" ),
            size: 40
          }
        }}
      />
      <Tab.Screen
        name="ObsList"
        component={ObsList}
        options={{
          ...hideHeader,
          meta: {
            icon: "person",
            userIconUri: User.uri( user ),
            testID: OBS_LIST_SCREEN_ID,
            accessibilityLabel: t( "Observations" ),
            accessibilityHint: t( "Navigates-to-observations" ),
            size: 40
          }
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          ...hideHeaderLeft,
          meta: {
            icon: "notifications-bell",
            testID: MESSAGES_SCREEN_ID,
            accessibilityLabel: t( "Messages" ),
            accessibilityHint: t( "Navigates-to-messages" ),
            size: 32
          }
        }}
      />

      <Tab.Screen
        name="search"
        component={Search}
        options={{
          ...hideHeaderLeft,
          headerTitle: t( "Search" )
        }}
      />
      <Tab.Screen
        name="identify"
        component={IdentifyStackNavigation}
        options={hideHeader}
      />
      <Tab.Screen
        name="projects"
        component={ProjectsStackNavigation}
        options={hideHeader}
      />
      <Tab.Screen
        name="settings"
        component={Settings}
        options={{ ...hideHeaderLeft, headerTitle: t( "Settings" ) }}
      />
      <Tab.Screen
        name="about"
        component={About}
        options={{ ...hideHeaderLeft, headerTitle: t( "About-iNaturalist" ) }}
      />
      <Tab.Screen
        name="help"
        component={PlaceholderComponent}
        options={hideHeaderLeft}
      />
      <Tab.Screen
        name="network"
        component={NetworkLogging}
        options={hideHeaderLeft}
      />
      <Tab.Screen
        name="UI Library"
        component={UiLibrary}
        options={hideHeaderLeft}
      />
      <Tab.Screen
        name="ObsDetails"
        component={ObsDetails}
        options={{
          headerTitle: t( "Observation" )
        }}
      />
      <Tab.Screen
        name="TaxonDetails"
        component={TaxonDetails}
        options={blankHeaderTitle}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;