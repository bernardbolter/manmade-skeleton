import React from 'react';
import { Component } from 'react';

import Letter from './letter';

export default class Smoothism extends Component {
  render() {
    return (
      <section className="smoothism">
        <div className="smoothism__row">
          <Letter value="S"/>
          <Letter value="M"/>
          <Letter value="O"/>
        </div>
        <div className="smoothism__row">
          <Letter value="O"/>
          <Letter value="T"/>
          <Letter value="H"/>
        </div>
        <div className="smoothism__row">
          <Letter value="I"/>
          <Letter value="S"/>
          <Letter value="M"/>
        </div>
      </section>
    );
  }
}
