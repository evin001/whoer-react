import { combineReducers } from 'redux';
import languagesReduces, { moduleName as languagesModule } from '../ducks/languages';
import translationReduces, { moduleName as translationModule } from '../ducks/translation';

export default combineReducers({
    [languagesModule]: languagesReduces,
    [translationModule]: translationReduces,
});
