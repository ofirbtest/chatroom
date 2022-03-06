import {html} from "./base";

export function Message({message, onReply, username, showSender}) {
    const isBot = message.isBot;
    const isMe = message.username === username;
    const colorsMap = {
        isBot: 'is-info',
        isMe: 'is-primary',
        isMember: ''
    }

    let messageType = '';
    if(isBot) {
        messageType = colorsMap.isBot;
    }
    if (isMe) {
        messageType = colorsMap.isMe
    }

    return html`
        <div class="notification ${messageType} mb-2 p-2 ${message.fade && 'fade-in'} chat-message ${isMe ? 'message-self' : ''}"">
            ${message.originalMessage ? 
            html`<div class="reply p-2">
                <div class="is-size-7 has-text-weight-semibold has-text-black">
                    ${message?.originalMessage?.username}
                </div>
                <div>
                    ${message?.originalMessage?.message}
                </div>
            </div>` : ''
            }
            ${showSender ? 
            html`<div class="is-size-7 has-text-weight-semibold has-text-black">${message.username}</div>` : ''
            }
            <div class="is-size-6 is-flex message-content">
                <span class="is-flex-grow-1">${message.message}</span>
                ${!isBot ? html`<i title="Reply" class="bi bi-reply is-cursor-pointer reply-button" @click="${onReply}"/>` : ``}
            </div>
        </div>
    `
}
