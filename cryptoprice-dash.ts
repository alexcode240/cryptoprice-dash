import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import Chart from 'chart.js/auto';
import dayjs from 'dayjs/esm/index.js';


type CryptoPrice = {
    base: string;
    currency: string;
    amount: string;
};

type HistoricalPrice = {
    price: string;
    time: string;
};

type HistoricalData = {
    base: string;
    currency: string;
    prices: HistoricalPrice[];
};


@customElement('cryptoprice-dash')
export class CryptopriceDash extends LitElement {
    private chartInstance?: Chart;

    static styles = css`
        button {
            display: block;
            width: 25%;
            margin: 0.5rem 0 0;
            padding: 0.85rem 1.1rem;
            border: none;
            border-radius: 999px;
            background: linear-gradient(135deg, #0f766e, #14b8a6);
            color: #f8fafc;
            font-size: 0.95rem;
            font-weight: 600;
            letter-spacing: 0.02em;
            text-align: center;
            cursor: pointer;
            box-shadow: 0 12px 24px rgba(15, 118, 110, 0.22);
            transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
        }

        button:hover {
            transform: translateY(-1px);
            box-shadow: 0 16px 28px rgba(15, 118, 110, 0.28);
            filter: brightness(1.04);
        }

        button:active {
            transform: translateY(0);
            box-shadow: 0 8px 18px rgba(15, 118, 110, 0.2);
        }

        button:focus-visible {
            outline: 3px solid rgba(45, 212, 191, 0.4);
            outline-offset: 3px;
        }

        button.selected {
            background: linear-gradient(135deg, #6d28d9, #8b5cf6);
            box-shadow: 0 12px 24px rgba(109, 40, 217, 0.26);
        }

        button.selected:hover {
            box-shadow: 0 16px 28px rgba(109, 40, 217, 0.32);
        }
    `;
    
    @property({type: Array})
    data: CryptoPrice[] = [];

    @property({type: Array})
    historicalData: HistoricalData[] = [];

    @property({type: Boolean})
    loading: boolean = true;

    @property({type: String})
    errorMessage: string = '';

    @property({type: String})
    selectedBase: string = '';

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
        this.fetchHistoricalData('BTC');
    }

    async fetchData() {
        this.loading = true;
        this.errorMessage = '';
        try {
            const prices = await Promise.all(this.currencies.map(async (currency: any) => {
                // Nota: Es mejor usar api.coinbase.com en lugar de www.coinbase.com
                const response = await fetch('https://api.coinbase.com/v2/prices/'+currency["code"]+'-USD/spot');
                
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                
                const jsonData = await response.json();
                
                // 🔍 DEBUG: Mira esto en la consola del navegador (F12)
                console.log('JSON Completo recibido:', jsonData);

                return jsonData.data as CryptoPrice;
            }));

            this.data = prices;

        } catch (error) {
            console.error('Fallo al obtener los datos:', error);
            this.data = [];
            this.errorMessage = 'No se pudieron cargar los datos.';
        } finally {
            this.loading = false;
        }
    }

    async fetchHistoricalData(base: string) {
        this.selectedBase = base;
        this.loading = true;
        this.errorMessage = '';
        try {
            const response = await fetch(`https://api.coinbase.com/v2/prices/${base}-USD/historic?period=week`);

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const jsonData = await response.json();
            const historicalPrices = {
                base,
                currency: 'USD',
                prices: jsonData.data.prices as HistoricalPrice[]
            } as HistoricalData;

            this.historicalData = [historicalPrices];
            this.loading = false;
            await this.updateComplete;
            this.generateChart(historicalPrices);

        } catch (error) {
            console.error('Fallo al obtener los datos históricos:', error);
            this.errorMessage = 'No se pudieron cargar los datos históricos.';
            this.loading = false;
        }

    }

    generateChart(data: HistoricalData) {
        const ctx = this.shadowRoot?.getElementById(`chart-crypto`) as HTMLCanvasElement;
        if (!ctx) return;

        this.chartInstance?.destroy();
        
        const chartData = {
            labels: data.prices.map((p) => {
               let ts: number = parseInt(p.time);
                let date = dayjs.unix(ts).format('YYYY-MM-DD HH:mm');
                return date;

            }),
            datasets: [{
                label: `${data.base} Price`,
                data: data.prices.map(p => parseFloat(p.price)),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            }]
        };

        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Price (USD)'
                        }
                    }
                }
            }
        });
    }

    render() {
        if (this.loading) {
            return html`<p>Cargando precios...</p>`;
        }

        if (this.errorMessage) {
            return html`<p style="color: red;">${this.errorMessage}</p>`;
        }

        return html`
            <div style="font-family: sans-serif; padding: 1rem; border: 1px solid #ccc;">
                <h2>Crypto Dashboard</h2>
                <canvas id="chart-crypto" width="400" height="100"></canvas>
                ${this.data.map((price) => html`
                         <button class=${this.selectedBase === price.base ? 'selected' : ''} @click=${() => this.fetchHistoricalData(price.base)}> ${price.base} / ${price.currency} -  $ ${price.amount} </button>
                   
                    
                `)}
                
            </div>
        `;
        // 
    }
}