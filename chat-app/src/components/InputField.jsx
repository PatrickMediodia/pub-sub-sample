const InputField = ({ value, onChange }) => {
    return <div className='form-field'>
        <input
            className="form-input"
            type='text'
            value={value}
            onChange={onChange}
            autoComplete="off"
        />
    </div>
};

export default InputField;
