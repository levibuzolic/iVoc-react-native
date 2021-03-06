/* global setTimeout clearTimeout */

import React from 'react';
import { StyleSheet, FlatList, View, Text, ToastAndroid, BackHandler, ScrollView } from 'react-native';
import { Icon, ListItem, Overlay, SearchBar, Divider } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { BallIndicator } from 'react-native-indicators'
import { inject, observer } from 'mobx-react'

import {MyVocabularyOverflowMenu} from './OverflowMenu'
import AppConstants from '../Constants'

    let firebaseAuth = null
    let userId = null
    let userWordsDetailsCollection = null
    let multiDeletionStatus = false
    let timer = null

class MyVocabulary extends React.Component {

    _didFocusSubscription = null;
    _willBlurSubscription = null;

    store = this.props.store
    
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: AppConstants.STRING_VOCABULARY,
            tabBarLabel: AppConstants.STRING_TAB_MY_VOCABULARY,
            tabBarIcon: <Icon name= 'file-document' type= 'material-community'/>,
            headerStyle: {
                backgroundColor: AppConstants.APP_PRIMARY_COLOR
              },
              headerTintColor: AppConstants.COLOR_WHITE,
              headerRight: <MyVocabularyOverflowMenu navigation={navigation} />          
        }
    }

    listOfWords = []

    render() {   

        return(
            <View style={styles.container}>
                <SearchBar 
                placeholder= {AppConstants.STRING_SEARCH}
                value= {this.store.searchBarValue}
                onChangeText= {(changedText) => this.onSearchValueChanged(changedText, true)}
                onClear= {this.onSearchValueCleared}
                />
                { this.store.displayLoadingIndicator === true ?
                    (
                        <View style={styles.loadingIndicator}>
                            <BallIndicator />
                        </View>
                    ) :
                    <FlatList
                        keyExtractor={keyExtractor}
                        data={this.store.listOfWords} 
                        renderItem={this.renderItem}
                    />
                }
                <Overlay isVisible={this.store.vocabularyOverlayDisplay} width='auto' height='auto' onBackdropPress={this.onBackdropPress} overlayStyle={{maxHeight: 300, maxWidth: 300, minHeight: 300, minWidth: 300}}>
                    <ScrollView style={{flex: 1}} contentContainerStyle={{flex: 0}}>
                    <View>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>{this.store.vocabularyWord}</Text>
                        <Text style={{color: 'black', display: this.store.vocabularyPronunciation === AppConstants.STRING_EMPTY ? 'none' : 'flex'}}>{AppConstants.STRING_PRONUNCIATION} {this.store.vocabularyPronunciation}</Text>
                        <Text style={{color: 'black', display: this.store.vocabularyFrequency === AppConstants.STRING_EMPTY ? 'none' : 'flex'}}>{AppConstants.STRING_FREQUENCY} {this.store.vocabularyFrequency}</Text>
                        <Text style={{color: 'black', textDecorationLine: 'underline', display: this.store.vocabularyDefinition.length > 0 ? 'flex' : 'none'}}>{'\n'}{AppConstants.STRING_DEFINITIONS}{'\n'}</Text>
                        { this.store.vocabularyDefinition.map((element, index, array) => {
                        if(array.length !== 1)
                        return (
                            <View key={index}>
                                <Text style={{fontWeight: 'bold'}}>{index + 1}.</Text>
                                <Text style={{color: 'black', display: element.partOfSpeech === AppConstants.STRING_EMPTY ? 'none' : 'flex'}}>{element.partOfSpeech}</Text>
                                <Text style={{fontStyle: 'italic'}}>{element.definition}{'\n'}</Text>
                            </View>

                        )
                        else
                        return (
                            <View key={index}>
                                <Text style={{color: 'black', display: element.partOfSpeech === AppConstants.STRING_EMPTY ? 'none' : 'flex'}}>{element.partOfSpeech}</Text>
                                <Text style={{fontStyle: 'italic'}}>{element.definition}</Text>
                            </View>
                        )
                    })}
                    </View>
                    </ScrollView>
                </Overlay>
            </View>
        )
    }


    componentDidMount() {
        this.store.showLoadingIndicator()
        this.props.navigation.setParams({
            showClearDoneToast: showClearDoneToast,
            onSearchValueChanged: this.onSearchValueChanged,
            getSearchBarValue: this.getSearchBarValue,
            showMultiDeletionOnToast: showMultiDeletionOnToast,
            showMultiDeletionOffToast: showMultiDeletionOffToast,
            getMultiDeletionStatus: getMultiDeletionStatus,
            setMultiDeletionStatus: setMultiDeletionStatus
        })
        firebaseAuth = firebase.auth()
        userId = firebaseAuth.currentUser.uid
        userWordsDetailsCollection = firebase.firestore().collection('wordsDetails/' + userId + '/userWordsDetails')

        this._didFocusSubscription = this.props.navigation.addListener("didFocus", () => {
            this.onSearchValueChanged(this.store.searchBarValue, false)
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
          });

        this._willBlurSubscription = this.props.navigation.addListener('willBlur', () =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
  
    }

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    getSearchBarValue = () => {
        return this.store.searchBarValue
    }

    onBackButtonPressAndroid = () => {
        if (getMultiDeletionStatus()) {
            showMultiDeletionOffToast()
            setMultiDeletionStatus(false)
            return true;
        } else {
          return false;
        }
      };

    itemPressed = (wordDetails, index) => {
        if(!multiDeletionStatus)
            this.store.displayVocabularyOverlay(wordDetails)
        else {
            this.deleteWordPressed(wordDetails, index)
        }
    }

  onBackdropPress = () => {
    this.store.hideVocabularyOverlay()
  }

  deleteWordPressed = (item, index) => {
    userWordsDetailsCollection.doc(item.id).delete()
    this.store.deleteWordInList(index)
    ToastAndroid.show(AppConstants.TOAST_DELETED, ToastAndroid.SHORT)
  }

  onSearchValueCleared = () => {
    if(timer) clearTimeout(timer)   
    this.store.showLoadingIndicator()
    let listOfWords = []
    userWordsDetailsCollection.get()
    .then((queryResult) => {
        queryResult.forEach((doc) => {
            listOfWords.push(doc.data())
        })
        this.store.updateListOfWords(listOfWords)
        if(listOfWords.length === 0) {
            ToastAndroid.show(AppConstants.TOAST_NO_VOC, ToastAndroid.SHORT)
            ToastAndroid.show(AppConstants.TOAST_ADD_WORDS_TO_VOC, ToastAndroid.SHORT)
        }    
    })
}
  onSearchValueChanged = (changedText, withTimer) => {
        this.store.updateSearchValue(changedText)
        if(withTimer) {
            clearTimeout(timer)
            timer = setTimeout(() => {
                this.store.showLoadingIndicator()
                let listOfWords = []
                userWordsDetailsCollection.get()
                .then((queryResult) => {
                    queryResult.forEach((doc) => {
                        listOfWords.push(doc.data())
                    })
                    this.store.updateListOfWords(listOfWords)
                    this.store.updateSearchResults(changedText)
                })    
            }, 1000)
        }
        else {
            this.store.showLoadingIndicator()
            let listOfWords = []
            userWordsDetailsCollection.get()
            .then((queryResult) => {
                queryResult.forEach((doc) => {
                    listOfWords.push(doc.data())
                })
                this.store.updateListOfWords(listOfWords)
                this.store.updateSearchResults(changedText)
            })    
        }
  }

  itemLongPressed = () => {
      showMultiDeletionOnToast()
      setMultiDeletionStatus(true)
  }

  renderItem = ({item, index}) => {
    
    let successPercentage = (item.numberOfRemembrances / item.numberOfAppearances) * 100
    successPercentage = (successPercentage.toString()).substring(0, 5) + '%'

        return(
            <View>
                <ListItem
                    title={item.word}
                    subtitle={item.partOfSpeech}
                    rightIcon= {<Icon name= 'delete' onPress={() => this.deleteWordPressed(item, index)}/>}
                    onPress= {() => this.itemPressed(item, index)}
                    rightTitle= {successPercentage}
                    rightTitleStyle= {{display: (item.numberOfAppearances >= 11 ? 'flex' : 'none')}}
                    onLongPress={() => this.itemLongPressed()}
                    subtitleStyle={{display: item.partOfSpeech === AppConstants.STRING_EMPTY ? 'none' : 'flex'}}
                />
                <Divider />
            </View>
        )
  }
}

export default inject('store')(observer(MyVocabulary))

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'flex-start',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
  });

  const keyExtractor = (item, index) => index.toString();

  const showClearDoneToast = () => {
          ToastAndroid.show(AppConstants.TOAST_VOC_LIST_CLEARED, ToastAndroid.SHORT)
  }

  const showMultiDeletionOnToast = () => {
      ToastAndroid.show(AppConstants.TOAST_MULTI_DEL_ON, ToastAndroid.SHORT)
  }

  const showMultiDeletionOffToast = () => {
      ToastAndroid.show(AppConstants.TOAST_MULTI_DEL_OFF, ToastAndroid.SHORT)
  }

  const getMultiDeletionStatus = () => {
      return multiDeletionStatus
  }

  const setMultiDeletionStatus = (status) => {
      multiDeletionStatus = status
  }
  