import { all } from 'redux-saga/effects';
import { saga as languagesSaga } from '../ducks/languages';
import { saga as translationSaga } from '../ducks/translation';

export default function* rootSaga() {
    yield all([
        languagesSaga(),
        translationSaga(),
    ]);
}
