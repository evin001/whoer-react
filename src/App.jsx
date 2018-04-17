import React from 'react';
import { Provider } from 'react-redux';
import store from './redux';
import Languages from './components/Languages';
import Translation from './components/Translation';
import Wrapper from './styled/Wrapper';

const App = () => (
    <Provider store={store}>
        <Wrapper>
            <Languages />
            <Translation />
        </Wrapper>
    </Provider>
);

export default App;
