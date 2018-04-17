import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../styled/Button';
import Input from '../../../styled/Input';

class CreateForm extends PureComponent {
    static propTypes = {
        onCreate: PropTypes.func,
    };

    static defaultProps = {
        onCreate: null,
    };

    state = {
        name: '',
        snippet: '',
    };

    onChangeInput = field => (event) => {
        this.setState({
            [field]: event.target.value,
        });
    };

    onClickButton = () => {
        const { onCreate } = this.props;
        const { name, snippet } = this.state;

        if (onCreate) {
            onCreate(name, snippet);

            this.setState({
                name: '',
                snippet: '',
            });
        }
    };

    render() {
        const { name, snippet } = this.state;

        return (
            <div>
                <Input
                    value={name}
                    placeholder="Введите имя"
                    onChange={this.onChangeInput('name')}
                />
                <Input
                    value={snippet}
                    placeholder="Введите значение"
                    onChange={this.onChangeInput('snippet')}
                />
                <Button onClick={this.onClickButton}>Создать перевод</Button>
            </div>
        );
    }
}

export default CreateForm;
