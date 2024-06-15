const ColoredCircle = ({ color }) => {
  const styles = { backgroundColor: color };
  
  return (
    color 
      ? <span 
        className="colored-circle" 
        style={styles} 
      />
      : null
  );
};

export default ColoredCircle;
