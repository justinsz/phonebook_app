const Persons = ({ persons, handleDelete }) => {
  return (
    <ul>
      {persons.map(person => (
        <li key={person.id} className="flex items-center gap-4 mb-2">
          {person.name} {person.number}
          <button
            onClick={() => handleDelete(person.id, person.name)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Persons;