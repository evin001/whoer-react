import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { languagesSelecrot, fetchAll, setLanguage } from '../../ducks/languages';
import { fetchAll as fetchAllTranslation } from '../../ducks/translation';
import Select from '../../styled/Select';

class Languages extends PureComponent {
  static propTypes = {
      languages: PropTypes.arrayOf(PropTypes.object),
      setLanguage: PropTypes.func,
      fetchAll: PropTypes.func,
      fetchAllTranslation: PropTypes.func,
  };

  static defaultProps = {
      languages: '',
      setLanguage: null,
      fetchAll: null,
      fetchAllTranslation: null,
  };

  componentWillMount() {
      this.props.fetchAll();
  }

  onChangeLanguage = (e) => {
      this.props.setLanguage(e.target.value);
      this.props.fetchAllTranslation();
  };

  render() {
      const { languages } = this.props;

      return (
          <Select onChange={this.onChangeLanguage}>
              {_.map(languages, l => (
                  <option value={l.code} key={l.index}>
                      {l.native}
                  </option>
              ))}
          </Select>
      );
  }
}

export default connect(state => ({
    languages: languagesSelecrot(state),
}), { fetchAll, setLanguage, fetchAllTranslation })(Languages);
