const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  const style = {
    color: type === 'success' ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    borderColor: type === 'success' ? 'green' : 'red'
  };

  return (
    <div style={style}>
      {message}
    </div>
  );
};

export default Notification;