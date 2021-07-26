import { StyleSheet } from 'react-native';
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
      paddingTop: "12%",
      paddingBottom: "8%"
    },
    backButtonText: {
        fontSize: 20,
        fontWeight: '300',
        textDecorationLine: 'underline',
        color: DefaultPallete.textButton
    }
  });
