import { Record, OrderedMap } from 'immutable';
import { all, takeEvery, call, put, select, take, spawn } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { createSelector } from 'reselect';
import Api from '../api';
import dataToEntities from './utils';
import { stateSelector as languagesStateSelector } from './languages';

export const moduleName = 'translation';

export const FETCH_ALL_REQUEST = `${moduleName}/FETCH_ALL_REQUEST`;
export const FETCH_ALL_SUCCESS = `${moduleName}/FETCH_ALL_SUCCESS`;
export const UPDATE_TRANSLATION = `${moduleName}/UPDATE_TRANSLATION`;
export const UPDATED_TRANSLATION = `${moduleName}/UPDATED_TRANSLATION`;
export const CREATE_TRANSLATION = `${moduleName}/CREATE_TRANSLATION`;
export const ERROR_MESSAGE = `${moduleName}/ERROR_MESSAGE`;

export const ReducerRecord = Record({
    entities: new OrderedMap(),
    loading: false,
    loaded: false,
    error: '',
});

export const TranslationRecord = Record({
    id: null,
    name: null,
    snippet: null,
    created: null,
    updated: null,
});

export default function reducer(state = new ReducerRecord(), action) {
    const { type, payload } = action;

    switch (type) {
    case FETCH_ALL_REQUEST:
        return state
            .set('loading', true);

    case FETCH_ALL_SUCCESS:
        return state
            .set('loading', false)
            .set('loaded', true)
            .set('entities', dataToEntities(payload, TranslationRecord));

    case UPDATED_TRANSLATION: {
        const entityIndex = state.entities.findIndex(e => e.id === payload.id);
        return state
            .setIn(['entities', entityIndex], TranslationRecord(payload));
    }

    case ERROR_MESSAGE:
        return state
            .set('error', payload);

    default:
        return state;
    }
}

export const stateSelector = state => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, state => state.entities);
export const translationSelector = createSelector(entitiesSelector, entities => entities.toArray());

export function fetchAll() {
    return {
        type: FETCH_ALL_REQUEST,
    };
}

export function updateTranslation(translationId, snippet) {
    return {
        type: UPDATE_TRANSLATION,
        payload: {
            translationId,
            snippet,
        },
    };
}

export function createTranslation(name, snippet) {
    return {
        type: CREATE_TRANSLATION,
        payload: {
            name,
            snippet,
        },
    };
}

export function* fetchAllSaga() {
    const state = yield select(languagesStateSelector);
    const translation = yield call(
        [Api, Api.fetch],
        'translations',
        'GET',
        {},
        { 'Accept-Language': state.lang },
        true,
    );

    yield put({
        type: FETCH_ALL_SUCCESS,
        payload: translation,
    });
}

export function* updateTranslationSaga(action) {
    try {
        const { translationId, snippet } = action.payload;
        const state = yield select(languagesStateSelector);
        const translation = yield call(
            [Api, Api.fetch],
            `translation/${translationId}`,
            'PUT',
            { snippet },
            { 'Accept-Language': state.lang },
            true,
        );

        yield put({
            type: UPDATED_TRANSLATION,
            payload: translation,
        });
    } catch (error) {
        yield put({
            type: ERROR_MESSAGE,
            payload: `Обновление перевода: ${error}`,
        });
    }
}

export function createSourceChannel() {
    return eventChannel((emit) => {
        const eventSource = new EventSource(`${Api.getRootUrl()}/stream`, {
            withCredentials: true,
        });

        eventSource.addEventListener('translations', (event) => {
            emit(event.data);
        });

        return () => {
            eventSource.close();
        };
    });
}

export function* syncChannelSaga() {
    const chan = yield call(createSourceChannel);

    while (true) {
        let chanTranslation = yield take(chan);
        chanTranslation = JSON.parse(chanTranslation);

        const state = select(stateSelector);

        const translation = yield call(
            [Api, Api.fetch],
            `translation/${chanTranslation.id}`,
            'GET',
            {},
            { 'Accept-Language': state.lang },
            true,
        );

        yield put({
            type: UPDATED_TRANSLATION,
            translation,
        });
    }
}

export function* createTranslationSaga(action) {
    try {
        const { name, snippet } = action.payload;
        const state = yield select(languagesStateSelector);
        const translation = yield call(
            [Api, Api.fetch],
            'translation',
            'POST',
            { name, snippet },
            { 'Accept-Language': state.lang },
            true,
        );

        yield put({
            type: UPDATED_TRANSLATION,
            payload: translation,
        });
    } catch (error) {
        yield put({
            type: ERROR_MESSAGE,
            payload: `Создание перевода: ${error}`,
        });
    }
}

export function* saga() {
    yield spawn(syncChannelSaga);

    yield all([
        takeEvery(FETCH_ALL_REQUEST, fetchAllSaga),
        takeEvery(UPDATE_TRANSLATION, updateTranslationSaga),
        takeEvery(CREATE_TRANSLATION, createTranslationSaga),
    ]);
}
