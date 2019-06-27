import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';

const BasicLayout: React.FC = props => {
  return (
    <PersistGate
      persistor={window.g_app._store.persist}
    >
      <div>
        {props.children}
      </div>
    </PersistGate>
  );
};

export default BasicLayout;
