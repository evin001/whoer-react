import { Map, List } from 'immutable';

function dataToEntities(data, RecordModel = Map) {
    return (new List(data)).map(entity => new RecordModel(entity));
}

export { dataToEntities as default };
