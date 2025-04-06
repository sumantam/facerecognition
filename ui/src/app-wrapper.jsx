import { Provider } from 'react-redux';
import { persistor, store } from './reducers/store';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';

const AppWrapper = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    );
}

export default AppWrapper;