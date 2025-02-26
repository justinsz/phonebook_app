import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ message: null, type: null });

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
      .catch(error => {
        showNotification('Failed to fetch contacts from server', 'error');
      });
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null, type: null });
    }, 5000);
  };

  const addPerson = (event) => {
    event.preventDefault();
    
    if (!newName.trim() || !newNumber.trim()) {
      showNotification('Name and number are required', 'error');
      return;
    }
    
    const existingPerson = persons.find(person => person.name === newName);
    
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        
        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => 
              person.id !== existingPerson.id ? person : returnedPerson
            ));
            setNewName('');
            setNewNumber('');
            showNotification(`Updated ${returnedPerson.name}'s number`, 'success');
          })
          .catch(error => {
            showNotification(
              `The person '${newName}' was already deleted from server`, 
              'error'
            );
            setPersons(persons.filter(person => person.id !== existingPerson.id));
          });
      }
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber
    };

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
        showNotification(`Added ${returnedPerson.name}`, 'success');
      })
      .catch(error => {
        showNotification(
          'Failed to add the person. Please try again later.',
          'error'
        );
      });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          showNotification(`Deleted ${name}`, 'success');
        })
        .catch(error => {
          showNotification(
            `The person '${name}' was already deleted from server`,
            'error'
          );
          setPersons(persons.filter(person => person.id !== id));
        });
    }
  };

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Phonebook</h2>

      <Notification message={notification.message} type={notification.type} />

      <Filter 
        searchTerm={searchTerm} 
        handleSearchChange={handleSearchChange} 
      />

      <h3 className="text-xl font-semibold mt-6 mb-4">Add a new</h3>

      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h3 className="text-xl font-semibold mt-6 mb-4">Numbers</h3>

      <Persons 
        persons={filteredPersons} 
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;