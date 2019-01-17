import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import store from '../reducers'
import firebase, { } from 'react-native-firebase'
import SyncStorage from 'sync-storage';

import AppConstants from '../Constants'
import { addResponseData, resetResponseData, displayWordDefinition } from '../actions'
  
const wordsDetailsCollection = firebase.firestore().collection('wordsDetails')
const wordsCollection = firebase.firestore().collection('words')

const axios = require('axios');

SyncStorage.set('practiceMode', 'letterPattern')

const apiRequest = axios.create({
    baseURL: getBaseUrl(),
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

// console.log(SyncStorage.get('practiceMode'));


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
        dataGoingToStore = {}
        console.log('FIRST RESPONSE HAS COME');
        
        switch (getPracticeMode()) {
            case 'letterPattern':
                console.log('LETTER PATTERN CASE');
                let numberOfPages = ( apiResponse.results.total%100 === 0 ? apiResponse.results.total/100 : Math.floor((apiResponse.results.total/100)+1))
                console.log('NUMBER OF PAGES : ', numberOfPages);
                let apiRequestLetterPattern = null
                let apiRequestRandomWord = null
                if(numberOfPages > 1) {
                    console.log('NUMBER OF PAGES GREATER THAN 1');
                    let randomPage = Math.floor((Math.random() * numberOfPages) + 1)
                    apiRequestLetterPattern = axios.create({
                        baseURL: getBaseUrl() + '&page=' +randomPage.toString(),
                        headers: {
                            'X-Mashape-Key': AppConstants.WORDS_API_KEY,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })
                    apiRequestLetterPattern.get()
                    .then((response) => {
                        let wordHasDefinition = false
                        let randomWordIndex = null
                        let numberOfWordsOnPage = response.data.results.data.length
                        do {
                            randomWordIndex = Math.floor((Math.random() * numberOfWordsOnPage))
                            apiRequestRandomWord = axios.create({
                                baseURL: 'https://wordsapiv1.p.mashape.com/words/' + response.data.results.data[randomWordIndex] + '/definitions',
                                headers: {
                                    'X-Mashape-Key': AppConstants.WORDS_API_KEY,
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                }
                            })
                            apiRequestRandomWord.get()
                            .then((response) => {
                                if(response.data.definitions.length !== 0) {
                                    wordHasDefinition = true
                                    apiRequestRandomWord = axios.create({
                                        baseURL: 'https://wordsapiv1.p.mashape.com/words/' + response.data.word,
                                        headers: {
                                            'X-Mashape-Key': AppConstants.WORDS_API_KEY,
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json'
                                        }
                                    })
                                    apiRequestRandomWord.get()
                                    .then((response) => {
                                        console.log(response)
                                        dataGoingToStore = {
                                            word: response.data.word,
                                            partOfSpeech: (response.data.results[0].partOfSpeech ? response.data.results[0].partOfSpeech : 'empty'),
                                            pronunciation: (response.data.pronunciation ? (response.data.pronunciation.all ? response.data.pronunciation.all : 'empty') : 'empty'),
                                            frequency: (response.data.frequency ? response.data.frequency.toString() : 'empty'),
                                            definition: response.data.results[0].definition,
                                        }
                                        store.dispatch(addResponseData(dataGoingToStore))    
                                    })
                                }
                            })
                        } while (wordHasDefinition);
                    })
                }
                break;
        
            default:
                console.log('DEFAULT CASE');
                
                dataGoingToStore = {
                    word: apiResponse.word,
                    partOfSpeech: (apiResponse.results[0].partOfSpeech ? apiResponse.results[0].partOfSpeech : 'empty'),
                    pronunciation: (apiResponse.pronunciation ? (apiResponse.pronunciation.all ? apiResponse.pronunciation.all : 'empty') : 'empty'),
                    frequency: (apiResponse.frequency ? apiResponse.frequency.toString() : 'empty'),
                    definition: apiResponse.results[0].definition,
                }
                store.dispatch(addResponseData(dataGoingToStore)) 
                break;
        }
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

function getPracticeMode() {
    return (SyncStorage.get('practiceMode') ? SyncStorage.get('practiceMode') : 'null')
}

function getBaseUrl() {
    switch(getPracticeMode()) {
        case 'example':
            return 'https://wordsapiv1.p.mashape.com/words/example'

        case 'letterPattern':
            return 'https://wordsapiv1.p.mashape.com/words/?letterPattern=^.{5}$&hasDetails=definitions'

        default:
            return 'https://wordsapiv1.p.mashape.com/words/?hasDetails=definitions&random=true'
    }
}