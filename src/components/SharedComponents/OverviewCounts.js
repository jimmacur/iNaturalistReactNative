// @flow

import {
  Body2, Heading5, INatIcon
} from "components/SharedComponents";
import { View } from "components/styledComponents";
import { t } from "i18next";
import * as React from "react";
import { ActivityIndicator } from "react-native-paper";
import colors from "styles/tailwindColors";

type Props = {
  counts: Object
}

const Count = ( { count, label, icon } ) => (
  <View className="w-1/4 items-center">
    <View className="bg-inatGreen w-[32px] h-[32px] rounded-lg items-center justify-center">
      <INatIcon
        name={icon}
        size={18}
        color={colors.white}
      />
    </View>
    {typeof count === "number"
      ? <Body2 className="mt-2">{t( "Intl-number", { val: count } )}</Body2>
      : <ActivityIndicator />}
    <Heading5 className="mt-2 text-center">{t( label, { count } )}</Heading5>
  </View>
);

const OverviewCounts = ( { counts }: Props ): React.Node => (
  <View className="flex-row mt-6">
    <Count
      count={counts.observations_count}
      label="OBSERVATIONS-WITHOUT-NUMBER"
      icon="binoculars"
    />
    <Count
      count={counts.species_count}
      label="SPECIES-WITHOUT-NUMBER"
      icon="leaf"
    />
    {counts.identifications_count && (
      <Count
        count={counts.identifications_count}
        label="IDENTIFICATIONS-WITHOUT-NUMBER"
        icon="person"
      />
    )}
    {counts.members_count && (
      <Count
        count={counts.members_count}
        label="MEMBERS-WITHOUT-NUMBER"
        icon="person"
      />
    )}
    <Count
      count={counts.journal_posts_count}
      label="JOURNAL-POSTS-WITHOUT-NUMBER"
      icon="book"
    />
  </View>
);

export default OverviewCounts;