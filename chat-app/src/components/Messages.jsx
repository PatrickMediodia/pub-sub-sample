const Messages = ({ messages }) => {
    return messages.map(function({ username, message }, index) {
        const msg = `${username}: ${message}`;
        return <input className='message' key={index} value={msg} disabled={true} />;
    });
};

export default Messages;
