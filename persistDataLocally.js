import { CHANGE_TITLE, CHANGE_SUBTITLE, CHANGE_KEY, CHANGE_LIST_ITEM, ADD_RESPONSE_DATA, RESET_RESPONSE_DATA, DISPLAY_WORD_DEFINITION, UPDATE_INDEX, UPDATE_STARTING_LETTERS_CHKBOX, UPDATE_ENDING_LETTERS_CHKBOX } from './actions'

const Realm = require('realm');

// const settingsScreenSchema = {
//     name: 'settingsScreen',
//     primaryKey: 'pk',
//     properties: {
//         pk: 'int',
//         startingLettersChecked: 'bool?',
//         endingLettersChecked: 'bool?',
//         updatedIndex: 'int?'
//     }
// }

const persistDataLocally = store => next => action => {

// const realm = new Realm()

// realm.close() 

    switch(action.type) {
        
        case UPDATE_INDEX:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    if(realm.objects('settingsScreen').isValid()) {
                        if(!(realm.objects('settingsScreen').isEmpty())) {
                            realm.objects('settingsScreen').filtered('pk = 0').update('updatedIndex', action.data)
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

        default:
            Realm.open({})
            .then(realm => realm.deleteModel('settingsScreen'))
            break;
    }
    next(action)
}
  
  export default persistDataLocally;