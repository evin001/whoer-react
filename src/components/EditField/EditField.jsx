import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Input from '../../styled/Input';

class EditField extends PureComponent {
  static propTypes = {
      value: PropTypes.string,
      onClickOutside: PropTypes.func,
  };

  static defaultProps = {
      value: '',
      onClickOutside: null,
  };

  constructor(props) {
      super(props);

      this.state = {
          value: props.value,
      };
  }

  componentDidMount() {
      document.addEventListener('mousedown', this.onClickOutside);
  }

  componentWillUnmount() {
      document.removeEventListener('mousedown', this.onClickOutside);
  }

  onChangeInput = (e) => {
      this.setState({ value: e.target.value });
  };

  onClickOutside = (e) => {
      if (this.inputRef && !this.inputRef.contains(e.target)) {
          const { onClickOutside } = this.props;
          const { value } = this.state;

          if (onClickOutside) {
              onClickOutside(value);
          }
      }
  };

  render() {
      const { value } = this.state;

      return (
          <Input
              value={value || ''}
              innerRef={(ref) => { this.inputRef = ref; }}
              onChange={this.onChangeInput}
          />
      );
  }
}

export default EditField;
