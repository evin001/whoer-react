import { Record, OrderedMap } from 'immutable';
import { put, call, takeEvery, all } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import _ from 'lodash';
import Api from '../api';
import dataToEntities from './utils';

/**
 * Constants
 * */

export const moduleName = 'languages';

export const FETCH_ALL_REQUEST = `${moduleName}/FETCH_ALL_REQUEST`;
export const FETCH_ALL_SUCCESS = `${moduleName}/FETCH_ALL_SUCCESS`;
export const SET_LANGUAGE = `${moduleName}/SET_LANGUAGE`;

/**
 * Reducer
 * */

export const ReducerRecord = Record({
    entities: new OrderedMap(),
    lang: 'en',
    loading: false,
    loaded: false,
});

export const LanguageRecond = Record({
    code: null,
    index: null,
    name: null,
    native: null,
    rtl: null,
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
            .set('lang', _.head(payload).code)
            .set('entities', dataToEntities(payload, LanguageRecond));

    case SET_LANGUAGE:
        return state
            .set('lang', payload.lang);

    default:
        return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, state => state.entities);
export const languagesSelecrot = createSelector(entitiesSelector, entities => entities.toArray());

/**
 * Action Creators
 * */

export function fetchAll() {
    return {
        type: FETCH_ALL_REQUEST,
    };
}

export function setLanguage(lang) {
    return {
        type: SET_LANGUAGE,
        payload: { lang },
    };
}

/**
 * Sagas
 * */

export function* fetchAllSaga() {
    const languages = yield call([Api, Api.fetch], 'languages', 'GET');

    yield put({
        type: FETCH_ALL_SUCCESS,
        payload: languages,
    });
}

export function* saga() {
    yield all([
        takeEvery(FETCH_ALL_REQUEST, fetchAllSaga),
    ]);
}
