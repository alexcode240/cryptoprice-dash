var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
let CryptopriceDash = class CryptopriceDash extends LitElement {
    constructor() {
        super(...arguments);
        this.data = null;
        this.loading = true;
        this.currencies = [
            {
                code: 'BTC',
                name: 'bitcoin'
            },
            {
                code: 'ETH',
                name: 'Ethereum'
            },
            {
                code: 'LTC',
                name: 'Litecoin'
            }
        ];
    }
    async firstUpdated() {
        this.fetchData();
    }
    async fetchData() {
        this.loading = true;
        try {
            this.currencies.forEach(async (currency) => {
                // Nota: Es mejor usar api.coinbase.com en lugar de www.coinbase.com
                const response = await fetch('https://api.coinbase.com/v2/prices/' + currency["code"] + '-USD/spot');
                if (!response.ok)
                    throw new Error(`Error HTTP: ${response.status}`);
                const jsonData = await response.json();
                // 🔍 DEBUG: Mira esto en la consola del navegador (F12)
                console.log('JSON Completo recibido:', jsonData);
                // CORRECCIÓN AQUÍ:
                // Accedemos a jsonData.data para quedarnos solo con lo que nos importa
                this.data = jsonData.data;
            });
        }
        catch (error) {
            console.error('Fallo al obtener los datos:', error);
            this.data = { error: 'No se pudieron cargar los datos.' };
        }
        finally {
            this.loading = false;
        }
    }
    render() {
        var _a, _b, _c;
        if (this.loading) {
            return html `<p>Cargando precio de ETH...</p>`;
        }
        if (this.data && this.data.error) {
            return html `<p style="color: red;">${this.data.error}</p>`;
        }
        return html `
            <div style="font-family: sans-serif; padding: 1rem; border: 1px solid #ccc;">
                <h2>Crypto Dashboard</h2>
                <h3>${(_a = this.data) === null || _a === void 0 ? void 0 : _a.base} / ${(_b = this.data) === null || _b === void 0 ? void 0 : _b.currency}</h3>
                <p style="font-size: 2rem; font-weight: bold;">
                    $ ${(_c = this.data) === null || _c === void 0 ? void 0 : _c.amount}
                </p>
            </div>
        `;
    }
};
__decorate([
    property({ type: Object })
], CryptopriceDash.prototype, "data", void 0);
__decorate([
    property({ type: Boolean })
], CryptopriceDash.prototype, "loading", void 0);
__decorate([
    property({ type: Array })
], CryptopriceDash.prototype, "currencies", void 0);
CryptopriceDash = __decorate([
    customElement('cryptoprice-dash')
], CryptopriceDash);
export { CryptopriceDash };
