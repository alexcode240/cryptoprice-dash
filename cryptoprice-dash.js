import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';


class CryptopriceDash extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hola [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'mundo',
      },
    };
  }
}

window.customElements.define('cryptoprice-dash', CryptopriceDash);
