import React from 'react';
import { Component } from 'react';

export default class Agency extends Component {
  render() {
    return (
      <section className="agency">
        <div className="agency__row">
          <span className="agency__row--color-1">
            digita
          </span>
        </div>
        <div className="agency__row">
          <span className="agency__row--color-1">
            l
          </span>
          <span className="agency__row--color-2">
            devel
          </span>
        </div>
        <div className="agency__row">
          <span className="agency__row--color-2">
            opment
          </span>
        </div>
        <div className="agency__row">
          <span className="agency__row--color-3">
            agency
          </span>
        </div>
      </section>
    );
  }
}
