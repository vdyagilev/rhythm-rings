import { getRhythmCategory, RHYTHM_LIBRARY, RHYTHM_LIBRARY_CATEGORIES } from "../data_structures/RhythmLibrary"
import { setSelectedRhythm } from "../storage/Actions"
import { DefaultPallete } from "../ui/Colors"
import { DefaultStyling } from "./Styles"
import { View, StyleSheet, SectionList, Text, TouchableOpacity } from 'react-native'
import { connect } from "react-redux"
import * as React from 'react';
import { getDeviceNormFactor, getViewWidth } from "../Helpers"

// Generate data for the sectionlist by listing rhythms form rhythm library by category
const SectionListData = (() => {
    const data = []
    // initialize data with category names and empty lists
    for (let i=0; i<RHYTHM_LIBRARY_CATEGORIES.length;i++) {
        const catObj = RHYTHM_LIBRARY_CATEGORIES[i]
        data.push( 
            {
                title: catObj.name, 
                data: []
            } 
            )
    }
    // add rhythms into respective lists
    for (let i = 0; i< RHYTHM_LIBRARY.length; i++) {
        const rhythm = RHYTHM_LIBRARY[i]
        const catName = getRhythmCategory(rhythm)

        for (let j =0; j < data.length; j++) {
            if (data[j].title == catName) {
                // located
                data[j].data.push(rhythm)
            }
        }
    }
    return data
})()

function _ChooseRhythmScreen(props) {
    const {selected, dispatch, onClose} = props

    const onSelect = (rhythmName) => {
        // select rhythm and dispatch update to redux store
        const rhythm = RHYTHM_LIBRARY.filter(r => r.name == rhythmName)[0]
        dispatch( setSelectedRhythm(rhythm) )

        // close modal
        onClose()
    }

    const renderListItem = ({ item }) => {
        // change container style depending on item being selected
        const containerStyle = (selected.name == item.name) ? styles.selectedItemContainer : styles.unselectedItemContainer
        return (
            <TouchableOpacity style={containerStyle} onPress={() => onSelect(item.name)}>
                <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    const renderListSectionHeader = ({ section: { title } }) => {
        return (
            <Text style={styles.headerText}>{title}</Text>
        )
    }

    return (
        <View style={DefaultStyling.screen}>

            <TouchableOpacity style={styles.backButton} onPress={onClose}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Choose a rhythm</Text>
            
            <SectionList
                containerStyle={styles.sectionList}
                contentContainerStyle={styles.sectionList}
                sections={SectionListData}
                keyExtractor={(item, index) => item + index}
                renderItem={renderListItem}
                renderSectionHeader={renderListSectionHeader}
            >

            </SectionList>
        </View>
    )
}

const styles = StyleSheet.create({
    selectedItemContainer: {
        backgroundColor: DefaultPallete.selectedItemContainer,
        borderRadius: 5 * getDeviceNormFactor(),
        paddingVertical: 5 * getDeviceNormFactor(),
    },
    unselectedItemContainer: {
        backgroundColor: DefaultPallete.unselectedItemContainer,
        borderRadius: 5 * getDeviceNormFactor(),
        paddingVertical: 5 * getDeviceNormFactor(),
    },
    sectionList: {
        flex: 1,
        
    },
    itemText: {
        fontSize: 18 * getDeviceNormFactor(),
        paddingLeft: '5%',
        paddingRight: '20%',
        alignSelf: 'flex-start',
        fontWeight: '300'
    },
    headerText: {
        fontSize: 24 * getDeviceNormFactor(),
        paddingLeft: '5%',
        paddingVertical: '2%'
    },
    title: {
        fontSize: 35 * getDeviceNormFactor(),
        paddingBottom: "10%",
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
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

})


// Connect View to Redux store
const mapStateToProps = (state, props) => {
    return { 
        selected: state.selectedRhythm,
    }
  }
export const ChooseRhythmScreen = connect(mapStateToProps)(_ChooseRhythmScreen)