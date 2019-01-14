import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import store from '../reducers'
import { firestore } from 'react-native-firebase'

import AppConstants from '../Constants'
import { addResponseData, resetResponseData, displayWordDefinition } from '../actions'
  
const wordsDetailsCollection = firestore().collection('wordsDetails')
const wordsCollection = firestore().collection('words')

const axios = require('axios');

const apiRequest = axios.create({
    // baseURL: 'https://wordsapiv1.p.mashape.com/words/?random=true',
    baseURL: 'https://wordsapiv1.p.mashape.com/words/?hasDetails=definitions&random=true',
    headers: {
        'X-Mashape-Key': AppConstants.WORDS_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

let dataGoingToStore = {}

let apiResponse = {};
let numberOfDefinitions = 0;

let displayFrequency = 'none';


class RandomPractice extends React.Component {

    displayFrequency = 'none';

    render() {

        return(
            <View style={styles.container}>
            <ScrollView style={{marginBottom: 8, flexGrow: 1, flex: 1}}>
                <View style={{display: this.props.displayWordDefinition}}>
                    <Text>Definition</Text>
                    <Text>{this.props.itemDef}</Text>
                    {/* <Text>Synonyms</Text>
                    <Text>{this.props.itemSynonyms}</Text> */}
                    {/* <Text>Example</Text>
                    <Text>{this.props.itemExamples}</Text> */}
                </View>
                <View style={{display: this.props.displayRandomWord}}>
                    <Text>{this.props.itemWord}</Text>
                    <Text>{this.props.itemPartOfSpeech}</Text>
                    <Text>Pronunciation : {this.props.itemPronunciation}</Text>
                    <Text>Frequency of : {this.props.itemFrequency}</Text>
                </View>
                {/* <Text>{AppConstants.STRING_LOREM_IPSUM}</Text> */}
            </ScrollView>
                <View style={[styles.buttonGroup, {display: this.props.displayButtons}]}>
                    <Button
                    icon={{name: this.props.buttonLeftIconName, type: this.props.buttonLeftIconType}}
                    title= {this.props.buttonLeftTitle}
                    containerStyle={{marginHorizontal: 16}}
                    onPress={((this.props.buttonLeftTitle !== 'Not interested') ? iKnowBtnClicked : goToNextRandomWord)}
                    />
                    <Button
                    icon={{name: this.props.buttonRightIconName, type: this.props.buttonRightIconType}}
                    title= {this.props.buttonRightTitle}
                    containerStyle={{marginHorizontal: 16}}
                    onPress={(this.props.buttonRightTitle !== 'Got it') ? showWordDefinition : gotItBtnClicked}
                    />
                </View>
            </View>
        )
    }

    componentDidMount() {
        goToNextRandomWord();

    }

    componentWillUnmount() {
        store.dispatch(resetResponseData())
    }
}

export default connect(mapStateToProps)(RandomPractice)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 8
    },
    buttonGroup: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    }
})

function mapStateToProps(state) {
    return {
        itemDef: state.itemDef,
        itemSynonyms: state.itemSynonyms,
        itemExamples: state.itemExamples,
        itemWord: state.itemWord,
        itemPartOfSpeech: state.itemPartOfSpeech,
        itemPronunciation: state.itemPronunciation,
        itemFrequency: state.itemFrequency,
        displayRandomWord: state.displayRandomWord,
        displayButtons: state.displayButtons,
        displayWordDefinition: state.displayWordDefinition,
        buttonRightIconName: state.buttonRightIconName,
        buttonRightIconType: state.buttonRightIconType,
        buttonRightTitle: state.buttonRightTitle,
        buttonLeftIconName: state.buttonLeftIconName,
        buttonLeftIconType: state.buttonLeftIconType,
        buttonLeftTitle: state.buttonLeftTitle

    }
}

function goToNextRandomWord(){
    apiRequest.get()
    .then((response) => {

        apiResponse = response.data        
        numberOfDefinitions = apiResponse.results.length
        
        dataGoingToStore = {
            word: apiResponse.word,
            partOfSpeech: (apiResponse.results[0].partOfSpeech ? apiResponse.results[0].partOfSpeech : 'empty'),
            pronunciation: (apiResponse.pronunciation ? (apiResponse.pronunciation.all ? apiResponse.pronunciation.all : 'empty') : 'empty'),
            frequency: (apiResponse.frequency ? apiResponse.frequency.toString() : 'empty'),
            definition: apiResponse.results[0].definition,
        }
        
        store.dispatch(addResponseData(dataGoingToStore))
    })
    .catch((error) => console.error(error))
}

function iKnowBtnClicked() {
    addKnownWordToCloud(dataGoingToStore)
    goToNextRandomWord()
}

function gotItBtnClicked() {
    addKnownWordToCloud(dataGoingToStore)
    goToNextRandomWord()
}

function addKnownWordToCloud(word){
    wordsDetailsCollection.add(word)
    .then((docRef) => {
        docRef.update({id: docRef.id})
        wordsCollection.add({originalId: docRef.id, label: word.word})
    })
}

function showWordDefinition() {
    store.dispatch(displayWordDefinition())
}