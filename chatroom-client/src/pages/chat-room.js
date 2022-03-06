import {html} from 'lit';
import {PageElement} from "../helpers/page-element";
import {ChatLayout, TypeName} from "../components";

export class Chatroom extends PageElement {
    static properties = {
        messages: [],
        user: '',
        isNameSubmit: true,
        userMessage: '',
        socket: {},
        replyToId: '',
        replyToIndex: '',
        typingUsernames: []
    }

    constructor() {
        super();
        this.messages = [];
        this.typingUsernames = []
        this.socket = io.connect('localhost:3000');
        this.socket.on('members-update', (nextMembers) => {
            this.members = nextMembers;
            this.requestUpdate();
        });
        this.socket.on('new-message', (data) => {
            this.messages = [...this.messages, {...data, fade: true}];
            const messagesContainer = document.querySelector('#messages');
            requestAnimationFrame(() => messagesContainer.scrollTop = messagesContainer.scrollHeight);

            const isSelf = data.username === this.user;
            this.playNotificationSound(isSelf);
        });
        this.socket.on('typing', (data) => {
            this.typingUsernames = data.filter(username => username !== this.user);
            this.requestUpdate();
        });
        this.socket.on('history', (data) => this.messages = data);
    }

    playNotificationSound(isSelf) {
        const audio = new Audio(isSelf ? 'images/self.mp3' : 'images/notification.wav');
        audio.volume = 0.2;
        audio.play();
    }

    clearReply() {
        this.replyToId = null;
        this.replyToIndex = null
    }

    submitMessage() {
        if (this.userMessage) {
            this.socket.emit('new-message', {message: this.userMessage, replyToMessageId: this.replyToId});
            this.userMessage = '';
            this.clearReply();
        }
    }

    listenToEnterKey(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            this.submitMessage();
        }
    }

    render() {
        return html`
            ${this.isNameSubmit ? ChatLayout({
                messages: this.messages,
                userMessage: this.userMessage,
                members: this.members,
                replyToIndex: this.replyToIndex,
                user: this.user,
                typingUsernames: this.typingUsernames,
                handleKeyEvent: this.listenToEnterKey,
                onReply: ({replyToId, replyToIndex}) => {
                    this.replyToId = replyToId;
                    this.replyToIndex = replyToIndex;
                },
                onReplyClear: () => {
                    this.clearReply();
                },
                onChange: (event) => {
                    this.userMessage = event.target.value;
                    const throttledEmitTyping = _.throttle(() => this.socket.emit('typing'), 1000, {trailing: false});
                    throttledEmitTyping();
                },
                onSubmit: () => {
                    this.submitMessage();
                }
            }) : TypeName({
                onClick: () => {
                    if (this.user.length) {
                        this.isNameSubmit = true;
                        this.socket.emit('user-connected', this.user || `user-${Date.now()}`);
                    }
                },
                onChange: (event) => {
                    this.user = event.target.value;
                }
            })}
        `;
    }
}

customElements.define('chat-room', Chatroom);
