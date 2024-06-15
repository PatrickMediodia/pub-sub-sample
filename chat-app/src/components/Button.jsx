const Button = ({ title, handleSubmit }) => {
    return (
        <input 
            type="button"
            className="form-button"
            value={title}
            onClick={handleSubmit}
        />
    );
};

export default Button;
