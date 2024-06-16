const Messages = ({ messages, currentUser }) => {
    return <div className='form-messages'>
     { messages.length > 1 ? messages.map(function({ username, message }, index) {
        const msg = `${username}: ${message}`;
        return <input 
            className={ username === currentUser ? 'message-user' : 'message-others' }
            key={index} 
            value={msg} 
            disabled="true"
        />;
    }) : 'No Messages to Display' }
    </div>
};

export default Messages;
