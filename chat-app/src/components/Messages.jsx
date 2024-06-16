const Messages = ({ messages, username }) => {
    return <div className='form-messages'>
     { messages.length > 0 
        ? messages.map(function(message, index) {
            const msg = `${message.username}: ${message.message}`;
            return <div className="message-box" key={index}>
                <p 
                    className={ message.username === username ? 'message-user' : 'message-others' }
                    key={index} 
                    value={msg} 
                    disabled={true}
                >{msg}</p>
            </div>;
    }) : 'No Messages to Display' }
    </div>
};

export default Messages;
