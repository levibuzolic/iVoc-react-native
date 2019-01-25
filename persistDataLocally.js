import { 
    UPDATE_INDEX, 
    UPDATE_STARTING_LETTERS_CHKBOX, 
    UPDATE_ENDING_LETTERS_CHKBOX, 
    UPDATE_SPECIFIC_WORD_CHKBOX,
    UPDATE_STARTING_LETTERS_TEXT, 
    UPDATE_ENDING_LETTERS_TEXT, 
    UPDATE_SPECIFIC_WORD_TEXT,
    UPDATE_API_URL 
} from './actions'

const Realm = require('realm');

const _ = require('lodash')

const persistDataLocally = store => next => action => {

    let commonUrlpart = 'https://wordsapiv1.p.mashape.com/words/'
    let customUrlpart = ''

    switch(action.type) {
        
        case UPDATE_INDEX:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    if(realm.objects('settingsScreen').isValid()) {
                        if(!(realm.objects('settingsScreen').isEmpty())) {
                            realm.objects('settingsScreen').filtered('pk = 0').update('updatedIndex', action.data)

                            let settingsScreen = realm.objects('settingsScreen')
                            let updatedIndex = (_.valuesIn(settingsScreen))[0].updatedIndex
                            let startingLettersChecked = (_.valuesIn(settingsScreen))[0].startingLettersChecked
                            let endingLettersChecked = (_.valuesIn(settingsScreen))[0].endingLettersChecked
                            let specificWordChecked = (_.valuesIn(settingsScreen))[0].specificWordChecked
                            let startingLettersText = (_.valuesIn(settingsScreen))[0].startingLettersText
                            let endingLettersText = (_.valuesIn(settingsScreen))[0].endingLettersText
                            let specificWordText = (_.valuesIn(settingsScreen))[0].specificWordText
                            
                            if(startingLettersChecked && startingLettersText ) {
                                if (endingLettersChecked && endingLettersText) {

                                    switch(updatedIndex) {
                    
                                        case 1:
                                            customUrlpart += '?partOfSpeech=verb&'
                                            break
            
                                        case 2:
                                            customUrlpart += '?partOfSpeech=noun&'
                                            break
                                        case 3:
            
                                            customUrlpart += '?partOfSpeech=adjective&'
                                            break;
                                        
                                        default:
                                            customUrlpart += '?'
                                            break
                                    }
        
                                    startingLettersText = startingLettersText.toLowerCase()
                                    endingLettersText = endingLettersText.toLowerCase()

                                    customUrlpart += 'letterPattern=^' + startingLettersText + '.*' + endingLettersText + '$&hasDetails=definitions&random=true'
                                }
                                else {

                                    switch(updatedIndex) {
                    
                                        case 1:
                                            customUrlpart += '?partOfSpeech=verb&'
                                            break
            
                                        case 2:
                                            customUrlpart += '?partOfSpeech=noun&'
                                            break
                                        case 3:
            
                                            customUrlpart += '?partOfSpeech=adjective&'
                                            break;
                                        
                                        default:
                                            customUrlpart += '?'
                                            break
                                    }
        
                                    startingLettersText = startingLettersText.toLowerCase()
                                    customUrlpart += 'letterPattern=^' + startingLettersText + '.*$&hasDetails=definitions&random=true'
                                }
                                
                            }
                            else if (endingLettersChecked && endingLettersText) {

                                switch(updatedIndex) {
                    
                                    case 1:
                                        customUrlpart += '?partOfSpeech=verb&'
                                        break
        
                                    case 2:
                                        customUrlpart += '?partOfSpeech=noun&'
                                        break
                                    case 3:
        
                                        customUrlpart += '?partOfSpeech=adjective&'
                                        break;
                                    
                                    default:
                                        customUrlpart += '?'
                                        break
                                }
    
                                endingLettersText = endingLettersText.toLowerCase()
                                customUrlpart += 'letterPattern=^.*' + endingLettersText + '$&hasDetails=definitions&random=true'
                            }
                            else {
                                switch(updatedIndex) {
        
                                    case 0:
                                        customUrlpart += '?hasDetails=definitions&random=true'
                                        break
        
                                    case 1:
                                        customUrlpart += '?partOfSpeech=verb&hasDetails=definitions&random=true'
                                        break
        
                                    case 2:
                                        customUrlpart += '?partOfSpeech=noun&hasDetails=definitions&random=true'
                                        break
                                    case 3:
        
                                        customUrlpart += '?partOfSpeech=adjective&hasDetails=definitions&random=true'
                                        break;
                                    
                                    default:
                                        customUrlpart += '?hasDetails=definitions&random=true'
                                        break
                                }
                            }
                            realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrlpart)
                        }
                        else{
                            realm.create('settingsScreen', { pk: 0, updatedIndex: action.data })
                        }
                    }
                    else {
                        realm.create('settingsScreen', { pk: 0, updatedIndex: action.data })
                    } 
                })
            })
            .catch((error) => console.log(error))
            break;

        case UPDATE_STARTING_LETTERS_CHKBOX:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    if(realm.objects('settingsScreen').isValid()) {
                        if(!(realm.objects('settingsScreen').isEmpty())) {
                            realm.objects('settingsScreen').filtered('pk = 0').update('startingLettersChecked', !(action.data))

                            let settingsScreen = realm.objects('settingsScreen')
                            let updatedIndex = (_.valuesIn(settingsScreen))[0].updatedIndex
                            let startingLettersChecked = (_.valuesIn(settingsScreen))[0].startingLettersChecked
                            let endingLettersChecked = (_.valuesIn(settingsScreen))[0].endingLettersChecked
                            let startingLettersText = (_.valuesIn(settingsScreen))[0].startingLettersText
                            let endingLettersText = (_.valuesIn(settingsScreen))[0].endingLettersText

                            if(startingLettersChecked && startingLettersText ) {
                                if (endingLettersChecked && endingLettersText) {

                                    switch(updatedIndex) {
                    
                                        case 1:
                                            customUrlpart += '?partOfSpeech=verb&'
                                            break
            
                                        case 2:
                                            customUrlpart += '?partOfSpeech=noun&'
                                            break
                                        case 3:
            
                                            customUrlpart += '?partOfSpeech=adjective&'
                                            break;
                                        
                                        default:
                                            customUrlpart += '?'
                                            break
                                    }        

                                    startingLettersText = startingLettersText.toLowerCase()
                                    endingLettersText = endingLettersText.toLowerCase()

                                    customUrlpart += 'letterPattern=^' + startingLettersText + '.*' + endingLettersText + '$&hasDetails=definitions&random=true'
                                }
                                else {

                                    switch(updatedIndex) {
                    
                                        case 1:
                                            customUrlpart += '?partOfSpeech=verb&'
                                            break
            
                                        case 2:
                                            customUrlpart += '?partOfSpeech=noun&'
                                            break
                                        case 3:
            
                                            customUrlpart += '?partOfSpeech=adjective&'
                                            break;
                                        
                                        default:
                                            customUrlpart += '?'
                                            break
                                    }
        
                                    startingLettersText = startingLettersText.toLowerCase()
                                    customUrlpart += 'letterPattern=^' + startingLettersText + '.*$&hasDetails=definitions&random=true'
                                }
                                
                            }
                            else if (endingLettersChecked && endingLettersText) {

                                switch(updatedIndex) {
                    
                                    case 1:
                                        customUrlpart += '?partOfSpeech=verb&'
                                        break
        
                                    case 2:
                                        customUrlpart += '?partOfSpeech=noun&'
                                        break
                                    case 3:
        
                                        customUrlpart += '?partOfSpeech=adjective&'
                                        break;
                                    
                                    default:
                                        customUrlpart += '?'
                                        break
                                }
    
                                endingLettersText = endingLettersText.toLowerCase()
                                customUrlpart += 'letterPattern=^.*' + endingLettersText + '$&hasDetails=definitions&random=true'
                            }
                            else {
                                switch(updatedIndex) {
        
                                    case 0:
                                        customUrlpart += '?hasDetails=definitions&random=true'
                                        break
        
                                    case 1:
                                        customUrlpart += '?partOfSpeech=verb&hasDetails=definitions&random=true'
                                        break
        
                                    case 2:
                                        customUrlpart += '?partOfSpeech=noun&hasDetails=definitions&random=true'
                                        break
                                    case 3:
        
                                        customUrlpart += '?partOfSpeech=adjective&hasDetails=definitions&random=true'
                                        break;
                                    
                                    default:
                                        customUrlpart += '?hasDetails=definitions&random=true'
                                        break
                                }
                            }
                            realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrlpart)

                        }
                        else{
                            realm.create('settingsScreen', { pk: 0, startingLettersCheckeded: !(action.data) })
                        }
                    }
                    else {
                        realm.create('settingsScreen', { pk: 0, startingLettersCheckeded: !(action.data) })
                    } 
                })
            })
            .catch((error) => console.log(error))
            break;

        case UPDATE_ENDING_LETTERS_CHKBOX:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    if(realm.objects('settingsScreen').isValid()) {
                        if(!(realm.objects('settingsScreen').isEmpty())) {
                            realm.objects('settingsScreen').filtered('pk = 0').update('endingLettersChecked', !(action.data))

                            let settingsScreen = realm.objects('settingsScreen')
                            let updatedIndex = (_.valuesIn(settingsScreen))[0].updatedIndex
                            let startingLettersChecked = (_.valuesIn(settingsScreen))[0].startingLettersChecked
                            let endingLettersChecked = (_.valuesIn(settingsScreen))[0].endingLettersChecked
                            let startingLettersText = (_.valuesIn(settingsScreen))[0].startingLettersText
                            let endingLettersText = (_.valuesIn(settingsScreen))[0].endingLettersText

                            if(startingLettersChecked && startingLettersText ) {
                                if (endingLettersChecked && endingLettersText) {

                                    switch(updatedIndex) {
                    
                                        case 1:
                                            customUrlpart += '?partOfSpeech=verb&'
                                            break
            
                                        case 2:
                                            customUrlpart += '?partOfSpeech=noun&'
                                            break
                                        case 3:
            
                                            customUrlpart += '?partOfSpeech=adjective&'
                                            break;
                                        
                                        default:
                                            customUrlpart += '?'
                                            break
                                    }
        
                                    startingLettersText = startingLettersText.toLowerCase()
                                    endingLettersText = endingLettersText.toLowerCase()

                                    customUrlpart += 'letterPattern=^' + startingLettersText + '.*' + endingLettersText + '$&hasDetails=definitions&random=true'
                                }
                                else {

                                    switch(updatedIndex) {
                    
                                        case 1:
                                            customUrlpart += '?partOfSpeech=verb&'
                                            break
            
                                        case 2:
                                            customUrlpart += '?partOfSpeech=noun&'
                                            break
                                        case 3:
            
                                            customUrlpart += '?partOfSpeech=adjective&'
                                            break;
                                        
                                        default:
                                            customUrlpart += '?'    
                                            break
                                    }
        
                                    startingLettersText = startingLettersText.toLowerCase()
                                    customUrlpart += 'letterPattern=^' + startingLettersText + '.*$&hasDetails=definitions&random=true'
                                }
                                
                            }
                            else if (endingLettersChecked && endingLettersText) {

                                switch(updatedIndex) {
                    
                                    case 1:
                                        customUrlpart += '?partOfSpeech=verb&'
                                        break
        
                                    case 2:
                                        customUrlpart += '?partOfSpeech=noun&'
                                        break
                                    case 3:
        
                                        customUrlpart += '?partOfSpeech=adjective&'
                                        break;
                                    
                                    default:
                                        customUrlpart += '?'
                                        break
                                }
    
                                endingLettersText = endingLettersText.toLowerCase()
                                customUrlpart += 'letterPattern=^.*' + endingLettersText + '$&hasDetails=definitions&random=true'
                            }
                            else {
                                switch(updatedIndex) {
        
                                    case 0:
                                        customUrlpart += '?hasDetails=definitions&random=true'
                                        break
        
                                    case 1:
                                        customUrlpart += '?partOfSpeech=verb&hasDetails=definitions&random=true'
                                        break
        
                                    case 2:
                                        customUrlpart += '?partOfSpeech=noun&hasDetails=definitions&random=true'
                                        break
                                    case 3:
        
                                        customUrlpart += '?partOfSpeech=adjective&hasDetails=definitions&random=true'
                                        break;
                                    
                                    default:
                                        customUrlpart += '?hasDetails=definitions&random=true'
                                        break
                                }
                            }
                            realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrlpart)

                        }
                        else{
                            realm.create('settingsScreen', { pk: 0, endingLettersChecked: !(action.data) })
                        }
                    }
                    else {
                        realm.create('settingsScreen', { pk: 0, endingLettersChecked: !(action.data) })
                    } 
                })
            })
            .catch((error) => console.log(error))
            break;
        
        case UPDATE_SPECIFIC_WORD_CHKBOX:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    if(realm.objects('settingsScreen').isValid()) {
                        if(!(realm.objects('settingsScreen').isEmpty())) {
                            realm.objects('settingsScreen').filtered('pk = 0').update('specificWordChecked', !(action.data))

                            if(!(action.data)) {
                                let specificWordText = ((_.valuesIn(settingsScreen))[0].specificWordText).toLowerCase()

                                realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + specificWordText)
                            }
                        }
                        else {
                            realm.create('settingsScreen', { pk: 0, specificWordChecked: !(action.data) })
                        }
                    }
                    else {
                        realm.create('settingsScreen', { pk: 0, specificWordChecked: !(action.data) })
                    }
                })
            })
            .catch((error) => console.log(error))
            break;

        case UPDATE_STARTING_LETTERS_TEXT:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    if(realm.objects('settingsScreen').isValid()) {
                        if(!(realm.objects('settingsScreen').isEmpty())) {
                            realm.objects('settingsScreen').filtered('pk = 0').update('startingLettersText', action.data)

                            let settingsScreen = realm.objects('settingsScreen')
                            let updatedIndex = (_.valuesIn(settingsScreen))[0].updatedIndex
                            let startingLettersChecked = (_.valuesIn(settingsScreen))[0].startingLettersChecked
                            let endingLettersChecked = (_.valuesIn(settingsScreen))[0].endingLettersChecked
                            let startingLettersText = (_.valuesIn(settingsScreen))[0].startingLettersText
                            let endingLettersText = (_.valuesIn(settingsScreen))[0].endingLettersText

                            if(startingLettersChecked && startingLettersText ) {
                                if (endingLettersChecked && endingLettersText) {

                                    switch(updatedIndex) {
                    
                                        case 1:
                                            customUrlpart += '?partOfSpeech=verb&'
                                            break
            
                                        case 2:
                                            customUrlpart += '?partOfSpeech=noun&'
                                            break
                                        case 3:
            
                                            customUrlpart += '?partOfSpeech=adjective&'
                                            break;
                                        
                                        default:
                                            customUrlpart += '?'
                                            break
                                    }
        
                                    startingLettersText = startingLettersText.toLowerCase()
                                    endingLettersText = endingLettersText.toLowerCase()

                                    customUrlpart += 'letterPattern=^' + startingLettersText + '.*' + endingLettersText + '$&hasDetails=definitions&random=true'
                                }
                                else {

                                    switch(updatedIndex) {
                    
                                        case 1:
                                            customUrlpart += '?partOfSpeech=verb&'
                                            break
            
                                        case 2:
                                            customUrlpart += '?partOfSpeech=noun&'
                                            break
                                        case 3:
            
                                            customUrlpart += '?partOfSpeech=adjective&'
                                            break;
                                        
                                        default:
                                            customUrlpart += '?'
                                            break
                                    }
        
                                    startingLettersText = startingLettersText.toLowerCase()
                                    customUrlpart += 'letterPattern=^' + startingLettersText + '.*$&hasDetails=definitions&random=true'
                                }
                                
                            }
                            else if (endingLettersChecked && endingLettersText) {

                                switch(updatedIndex) {
                    
                                    case 1:
                                        customUrlpart += '?partOfSpeech=verb&'
                                        break
        
                                    case 2:
                                        customUrlpart += '?partOfSpeech=noun&'
                                        break
                                    case 3:
        
                                        customUrlpart += '?partOfSpeech=adjective&'
                                        break;
                                    
                                    default:
                                        customUrlpart += '?'
                                        break
                                }
    
                                endingLettersText = endingLettersText.toLowerCase()
                                customUrlpart += 'letterPattern=^.*' + endingLettersText + '$&hasDetails=definitions&random=true'
                            }
                            else {
                                switch(updatedIndex) {
        
                                    case 0:
                                        customUrlpart += '?hasDetails=definitions&random=true'
                                        break
        
                                    case 1:
                                        customUrlpart += '?partOfSpeech=verb&hasDetails=definitions&random=true'
                                        break
        
                                    case 2:
                                        customUrlpart += '?partOfSpeech=noun&hasDetails=definitions&random=true'
                                        break
                                    case 3:
        
                                        customUrlpart += '?partOfSpeech=adjective&hasDetails=definitions&random=true'
                                        break;
                                    
                                    default:
                                        customUrlpart += '?hasDetails=definitions&random=true'
                                        break
                                }
                            }
                            realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrlpart)

                        }
                        else{
                            realm.create('settingsScreen', { pk: 0, startingLettersText: action.data })
                        }
                    }
                    else {
                        realm.create('settingsScreen', { pk: 0, startingLettersText: action.data })
                    } 
                })
            })
            .catch((error) => console.log(error))
            break;

        case UPDATE_ENDING_LETTERS_TEXT:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    if(realm.objects('settingsScreen').isValid()) {
                        if(!(realm.objects('settingsScreen').isEmpty())) {
                            realm.objects('settingsScreen').filtered('pk = 0').update('endingLettersText', action.data)

                            let settingsScreen = realm.objects('settingsScreen')
                            let updatedIndex = (_.valuesIn(settingsScreen))[0].updatedIndex
                            let startingLettersChecked = (_.valuesIn(settingsScreen))[0].startingLettersChecked
                            let endingLettersChecked = (_.valuesIn(settingsScreen))[0].endingLettersChecked
                            let startingLettersText = (_.valuesIn(settingsScreen))[0].startingLettersText
                            let endingLettersText = (_.valuesIn(settingsScreen))[0].endingLettersText

                            if(startingLettersChecked && startingLettersText ) {
                                if (endingLettersChecked && endingLettersText) {
    
                                    switch(updatedIndex) {
                    
                                        case 1:
                                            customUrlpart += '?partOfSpeech=verb&'
                                            break
            
                                        case 2:
                                            customUrlpart += '?partOfSpeech=noun&'
                                            break
                                        case 3:
            
                                            customUrlpart += '?partOfSpeech=adjective&'
                                            break;
                                        
                                        default:
                                            customUrlpart += '?'
                                            break
                                    }
        
                                    startingLettersText = startingLettersText.toLowerCase()
                                    endingLettersText = endingLettersText.toLowerCase()

                                    customUrlpart += 'letterPattern=^' + startingLettersText + '.*' + endingLettersText + '$&hasDetails=definitions&random=true'
                                }
                                else {

                                    switch(updatedIndex) {
                    
                                        case 1:
                                            customUrlpart += '?partOfSpeech=verb&'
                                            break
            
                                        case 2:
                                            customUrlpart += '?partOfSpeech=noun&'
                                            break
                                        case 3:
            
                                            customUrlpart += '?partOfSpeech=adjective&'
                                            break;
                                        
                                        default:
                                            customUrlpart += '?'
                                            break
                                    }
        
                                    startingLettersText = startingLettersText.toLowerCase()
                                    customUrlpart += 'letterPattern=^' + startingLettersText + '.*$&hasDetails=definitions&random=true'
                                }
                                
                            }
                            else if (endingLettersChecked && endingLettersText) {

                                switch(updatedIndex) {
                    
                                    case 1:
                                        customUrlpart += '?partOfSpeech=verb&'
                                        break
        
                                    case 2:
                                        customUrlpart += '?partOfSpeech=noun&'
                                        break
                                    case 3:
        
                                        customUrlpart += '?partOfSpeech=adjective&'
                                        break;
                                    
                                    default:
                                        customUrlpart += '?'
                                        break
                                }
    
                                endingLettersText = endingLettersText.toLowerCase()
                                customUrlpart += 'letterPattern=^.*' + endingLettersText + '$&hasDetails=definitions&random=true'
                            }
                            else {
                                switch(updatedIndex) {
        
                                    case 0:
                                        customUrlpart += '?hasDetails=definitions&random=true'
                                        break
        
                                    case 1:
                                        customUrlpart += '?partOfSpeech=verb&hasDetails=definitions&random=true'
                                        break
        
                                    case 2:
                                        customUrlpart += '?partOfSpeech=noun&hasDetails=definitions&random=true'
                                        break
                                    case 3:
        
                                        customUrlpart += '?partOfSpeech=adjective&hasDetails=definitions&random=true'
                                        break;
                                    
                                    default:
                                        customUrlpart += '?hasDetails=definitions&random=true'
                                        break
                                }
                            }
                            realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrlpart)

                        }
                        else{
                            realm.create('settingsScreen', { pk: 0, endingLettersText: action.data })
                        }
                    }
                    else {
                        realm.create('settingsScreen', { pk: 0, endingLettersText: action.data })
                    } 
                })
            })
            .catch((error) => console.log(error))
            break;

        case UPDATE_SPECIFIC_WORD_TEXT:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    if(realm.objects('settingsScreen').isValid()) {
                        if(!(realm.objects('settingsScreen').isEmpty())) {
                            realm.objects('settingsScreen').filtered('pk = 0').update('specificWordText', action.data)
                            realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + action.data)
                        }
                        else {
                            realm.create('settingsScreen', { pk: 0, specificWordText: action.data , apiUrl: commonUrlpart + action.data})
                        }
                    }
                    else {
                        realm.create('settingsScreen', { pk: 0, specificWordText: action.data, apiUrl: commonUrlpart + action.data })
                    }
                })
            })
            .catch((error) => console.log(error))
            break;


        case UPDATE_API_URL:
            break
                
        default:
            break;
    }
    next(action)
}
  
  export default persistDataLocally;