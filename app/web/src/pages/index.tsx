import React from 'react';
import Redirect from 'umi/redirect';
import DocumentTitle from 'react-document-title';
import './index.css';

export default function() {
  return (
    <DocumentTitle title='Form Builder'>
      <Redirect to="/build" />
    </DocumentTitle>
  );
}
