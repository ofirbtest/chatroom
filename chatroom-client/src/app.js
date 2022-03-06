import {html, LitElement} from './components/base';

import {attachRouter} from './router';

import 'pwa-helper-components/pwa-install-button.js';
import 'pwa-helper-components/pwa-update-available.js';

export class App extends LitElement {
    render() {
        return html`
                <div class="container">

                    <pwa-install-button>
                        <button>Install app</button>
                    </pwa-install-button>

                    <pwa-update-available>
                        <button>Update app</button>
                    </pwa-update-available>
                </div>
                </div>

                <!-- The main content is added / removed dynamically by the router -->
                <main role="main"></main>`;
    }

    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        attachRouter(this.querySelector('main'));
    }
}

customElements.define('app-index', App);
