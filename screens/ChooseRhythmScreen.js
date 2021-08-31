import * as React from 'react'
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from "react-redux"
import { buildRhythmFromJson } from '../data_structures/RhythmLibrary'
import { getDeviceNormFactor } from "../Helpers"
import { setSelectedRhythm } from "../storage/Actions"
import { getRhythmLibrary, getSelectedRhythm } from '../storage/Reducers'
import { DefaultPallete } from "../ui/Colors"
import { DefaultStyling } from "./Styles"

// Generate data for the sectionlist by listing rhythms form rhythm library by category
const makeSectionListData = (rhythmLibrary) => {
    const data = []
    const categoriesFilled = [] // used to keep categories a unique set
    // initialize data with category names and empty lists
    for (let i=0; i<rhythmLibrary.length;i++) {
        const rhythm = rhythmLibrary[i]
        const category = rhythm.category
        if (categoriesFilled.indexOf(category) == -1) {
            data.push({
                title: rhythm.category, 
                data: []
            })
            categoriesFilled.push(category)
        }        
    }
    // add rhythms into respective lists
    for (let i=0; i<rhythmLibrary.length; i++) {
        const rhythm = rhythmLibrary[i]
        const category = rhythm.category

        for (let j=0; j<data.length; j++) {
            if (data[j].title == category) {
                // located
                data[j].data.push(rhythm)
            }
        }
    }
    return data
}

function _ChooseRhythmScreen(props) {
    const {selectedRhythm, dispatch, onClose, rhythmLibrary} = props

    const onSelect = (rhythmName) => {
        // select rhythm and dispatch update to redux store
        const rhythm = rhythmLibrary.filter(r => r.name == rhythmName)[0]
        dispatch( setSelectedRhythm(rhythm) )

        // close modal
        onClose()
    }

    const renderListItem = ({ item }) => {
        // switch background color depending on selected
        const containerStyle =(selectedRhythm.name == item.name) ? styles.selectedItemContainer : styles.unselectedItemContainer
        
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

    const sectionListData = makeSectionListData(rhythmLibrary)

    return (
        <View style={DefaultStyling.screen}>

            <TouchableOpacity style={DefaultStyling.backButton} onPress={onClose}>
                <Text style={DefaultStyling.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Choose a rhythm</Text>
            
            <SectionList
                containerStyle={styles.sectionList}
                contentContainerStyle={styles.sectionList}
                sections={ sectionListData }
                keyExtractor={(item, index) => item + index}
                renderItem={ renderListItem }
                renderSectionHeader={ renderListSectionHeader }
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
    

})


// Connect View to Redux store
const mapStateToProps = (state, props) => {
    return { 
        selectedRhythm: getSelectedRhythm(state),
        rhythmLibrary: getRhythmLibrary(state),
    }
  }
export const ChooseRhythmScreen = connect(mapStateToProps)(_ChooseRhythmScreen)