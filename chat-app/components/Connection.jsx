import ColoredCircle from '../components/Circle';

const Connection = ({ connectionState }) => {
    return (
        <p>
            <ColoredCircle color={ connectionState ? "lightgreen" : "red" } />
            { connectionState ? "Online" : "Offline" }
        </p>
    );
}

export default Connection;
