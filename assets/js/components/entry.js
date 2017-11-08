import React from 'react';
import { Component } from 'react';

import Smoothism from './smoothism/smoothism';
import Agency from './agency/agency';

export default class Entry extends Component {
  render() {
    return (
      <div className="layout">
        <Smoothism />
        <Agency />
      </div>
    );
  }
}
