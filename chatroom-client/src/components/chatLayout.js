import {html} from "./base";
import {Message} from "./message";
import {Members} from "./members";

export function ChatLayout({messages, members = [], onChange, onSubmit, userMessage, replyToIndex, onReply, onReplyClear, user, typingUsernames, handleKeyEvent}) {
    const typingUsersText = typingUsernames.length > 1  ? 'are typing' : 'is typing...';
    const typingUsersString = typingUsernames.length ? `${typingUsernames.join(', ')} ${typingUsersText}` : '';
    return html`
        <div class="is-flex has-background-white"
             style="height: 90vh; margin:0 auto;">
            <div style="height: 100%; width: 250px;">
                ${Members({members})}
            </div>
            <div style="width: 50vw;height: 100%;position: relative" class="is-flex is-flex-direction-column">
                <div id="messages" class="is-flex-grow-1 p-4 is-flex is-flex-direction-column messages">
                    ${messages.map((message, index) => Message({
                        message,
                        showSender: messages[index -1]?.username !== message.username,
                        username: user,
                        onReply: () => onReply({replyToId: message.id, replyToIndex: index})
                    }))}
                </div>
                <div class="chat-input p-2 has-background-primary">
                    ${replyToIndex !== null && replyToIndex >= 0 ? 
                    html`<div class="notification is-primary is-light p-3 mb-1 fade-in">
                        <button class="delete" @click="${onReplyClear}"></button>
                        <div class="is-size-7 has-text-weight-semibold has-text-black ">Reply to
                            ${messages?.[replyToIndex]?.username}
                        </div>
                        <span class="is-size-6 is-italic">${messages?.[replyToIndex]?.message}</span>
                    </div>`
                    : ''}
                    <div class="is-flex" style="width: 100%">
                        <input id="message-input" @keyup="${handleKeyEvent}" autofocus class="input" type="text" placeholder="Type Your Question Here..."
                               .value="${userMessage || ''}" @change="${onChange}">
                        <button class="button is-white ml-2" @click="${onSubmit}">
                            <i class="bi bi-send"></i>
                        </button>
                    </div>
                    <div class="p-2 is-size-7" style="height: 24px">${typingUsersString}</div>
                </div>
            </div>
        </div>
    `
}
