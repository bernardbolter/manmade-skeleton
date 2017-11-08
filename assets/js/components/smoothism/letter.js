import React from 'react';
import { Component } from 'react';

export default class Letter extends Component {
  render() {
    return (
      <div className='smoothism__row--letterbox'>
        <svg className={`smoothism__row--letter letter-${this.props.value}`} viewBox='0 0 63 113' preserveAspectRatio='xMinYMin meet'>
          <use xlinkHref={`#svg-${this.props.value}`} />
        </svg>
      </div>
    );
  }
}
