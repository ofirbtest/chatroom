import {html} from "./base";

export function TypeName({ onClick, onChange }) {
    return html`
        <div class="box is-flex is-flex-direction-column is-justify-content-center is-align-items-center animate__animated animate__flipInX" 
             style="width:50%; position: absolute; left: 25%; top: 35%">
            <h1 class="has-text-centered  is-size-3">Before we let you in please type your name</h1>
            <div style="max-width:400px">
                <input @change="${onChange}" class="input is-large mt-5" type="text" placeholder="How Shall We Call You?">
            </div>
            <button @click="${onClick}"  class="mt-4 button is-primary is-large">Let's Go</button>
        </div>
    `
};
