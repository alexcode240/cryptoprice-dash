import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('cryptoprice-dash')
export class CryptopriceDash extends LitElement {
    
    @property({type: Object})
    data: any = null;

    @property({type: Boolean})
    loading: boolean = true;

    @property({type: Array})
    currencies: Array<Object> = [
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

    ]

    async firstUpdated() {
        this.fetchData();
    }

    async fetchData() {
        this.loading = true;
        try {
            this.currencies.forEach(async (currency) => {
                // Nota: Es mejor usar api.coinbase.com en lugar de www.coinbase.com
                const response = await fetch('https://api.coinbase.com/v2/prices/'+currency["code"]+'-USD/spot');
                
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                
                const jsonData = await response.json();
                
                // 🔍 DEBUG: Mira esto en la consola del navegador (F12)
                console.log('JSON Completo recibido:', jsonData);

                // CORRECCIÓN AQUÍ:
                // Accedemos a jsonData.data para quedarnos solo con lo que nos importa
                this.data = jsonData.data; 
            });
            

        } catch (error) {
            console.error('Fallo al obtener los datos:', error);
            this.data = { error: 'No se pudieron cargar los datos.' }; 
        } finally {
            this.loading = false;
        }
    }

    render() {
        if (this.loading) {
            return html`<p>Cargando precio de ETH...</p>`;
        }

        if (this.data && this.data.error) {
            return html`<p style="color: red;">${this.data.error}</p>`;
        }

        return html`
            <div style="font-family: sans-serif; padding: 1rem; border: 1px solid #ccc;">
                <h2>Crypto Dashboard</h2>
                <h3>${this.data?.base} / ${this.data?.currency}</h3>
                <p style="font-size: 2rem; font-weight: bold;">
                    $ ${this.data?.amount}
                </p>
            </div>
        `;
    }
}