import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `cryptoprice-dash`
 * crypto currencies dashboard example
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class CryptopriceDash extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'cryptoprice-dash',
      },
    };
  }
}

window.customElements.define('cryptoprice-dash', CryptopriceDash);
