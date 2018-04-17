import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import dateFormat from 'dateformat';
import {
    moduleName,
    translationSelector,
    fetchAll,
    updateTranslation,
    createTranslation,
} from '../../ducks/translation';
import EditField from '../EditField';
import CreateForm from './CreateForm';
import Alert from '../../styled/Alert';
import Table from '../../styled/Table';
import GridCell from '../../styled/GridCell';

class Translation extends PureComponent {
    static propTypes = {
        translations: PropTypes.arrayOf(PropTypes.object),
        fetchAll: PropTypes.func,
        updateTranslation: PropTypes.func,
        createTranslation: PropTypes.func,
        error: PropTypes.string,
        loading: PropTypes.bool,
    };

    static defaultProps = {
        translations: [],
        fetchAll: null,
        updateTranslation: null,
        createTranslation: null,
        error: '',
        loading: false,
    };

    state = {
        translationId: null,
    };

    componentWillMount() {
        this.props.fetchAll();
    }

    onClickSnippet = translationId => () => {
        this.setState({ translationId });
    };

    onChangeSnippet = (translationId, oldSnippet) => (snippet) => {
        this.setState({ translationId: null });

        if (snippet && snippet !== oldSnippet) {
            this.props.updateTranslation(translationId, snippet);
        }
    };

    onCreateTranslation = (name, snippet) => {
        if (name && snippet) {
            this.props.createTranslation(name, snippet);
        }
    };

    renderTable() {
        const { translations, loading } = this.props;
        const { translationId } = this.state;

        if (loading) {
            return <div>Загрузка..</div>;
        }

        return (
            <Table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>snippet</th>
                        <th>created</th>
                        <th>updated</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        _.map(translations, t => (
                            <tr key={t.id}>
                                <td>{t.id}</td>
                                <td>{t.name}</td>
                                <GridCell role="gridcell" onClick={this.onClickSnippet(t.id)}>
                                    {
                                        t.id === translationId ?
                                            <EditField
                                                onClickOutside={
                                                    this.onChangeSnippet(t.id, t.snippet)
                                                }
                                                value={t.snippet}
                                            /> : t.snippet
                                    }
                                </GridCell>
                                <td>{dateFormat(t.created, 'dd.mm.yyyy HH:MM:ss')}</td>
                                <td>{dateFormat(t.updated, 'dd.mm.yyyy HH:MM:ss')}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        );
    }

    renderCreateForm() {
        return (
            <CreateForm onCreate={this.onCreateTranslation} />
        );
    }

    renderError() {
        const { error } = this.props;
        if (error) {
            return <Alert>{error}</Alert>;
        }

        return null;
    }

    render() {
        return (
            <Fragment>
                {this.renderCreateForm()}
                {this.renderError()}
                {this.renderTable()}
            </Fragment>
        );
    }
}

export default connect(state => ({
    translations: translationSelector(state),
    error: state[moduleName].error,
    loading: state[moduleName].loading,
}), { fetchAll, updateTranslation, createTranslation })(Translation);
