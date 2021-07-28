import { StyleSheet } from 'react-native';
import { getDeviceNormFactor } from '../Helpers';
import { DefaultPallete } from '../ui/Colors';

export const DefaultStyling = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: DefaultPallete.background,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    // horiz_layout: {

    // },
    backButton: {
    },
    backButtonText: {
        fontSize: 20 * getDeviceNormFactor(),
        fontWeight: '300',
        textDecorationLine: 'underline',
        color: DefaultPallete.textButton
    }
  });
