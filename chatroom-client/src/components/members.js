import {html} from "./base";

function Member({username, isBot} , index = 1) {
    //** todo: assign logo by username and not index */
    return html`
        <div class="is-flex is-align-items-center p-2 member-item">
            <figure class="image is-48x48">
                <img class="is-rounded has-background-${isBot ? 'info' : 'black'}" src="https://robohash.org/${index}">
            </figure>
            <div class="ml-4">${username}</div>
        </div>
    `
}

export function Members({members = []}) {
    return html`
        <div class="has-background-dark p-3 has-text-white" style="height: 100%;">
            <div class="is-size-4 has-text-weight-bold">Members</div>
            <div>
                ${members.map((member, index) => Member(member, index))}
            </div>
        </div>
    `
}
