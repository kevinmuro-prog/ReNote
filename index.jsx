import { useState, useEffect } from 'react';

export default function BookSwap() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newBook, setNewBook] = useState({ title: '', author: '', contact: '', image: '' });

  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    setBooks(savedBooks);
  }, []);

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const handleAddBook = () => {
    if (!newBook.title || !newBook.contact) {
      alert('Por favor completa al menos el nombre del libro y el número de contacto.');
      return;
    }
    if (/[^0-9]/.test(newBook.contact)) {
      alert('El número solo debe contener dígitos (sin +, espacios ni guiones).');
      return;
    }
    const newEntry = { ...newBook, id: Date.now() };
    setBooks([...books, newEntry]);
    setNewBook({ title: '', author: '', contact: '', image: '' });
  };

  const handleDeleteBook = (id) => {
    setBooks(books.filter((b) => b.id !== id));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBook({ ...newBook, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">📚 BookSwap</h1>

        <div className="bg-white p-4 rounded-2xl shadow mb-6">
          <input
            className="w-full p-2 mb-2 border rounded"
            type="text"
            placeholder="Nombre del libro"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          />
          <input
            className="w-full p-2 mb-2 border rounded"
            type="text"
            placeholder="Autor (opcional)"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          />
          <input
            className="w-full p-2 mb-2 border rounded"
            type="text"
            placeholder="Número de WhatsApp (ej. 5215512345678)"
            value={newBook.contact}
            onChange={(e) => setNewBook({ ...newBook, contact: e.target.value })}
          />
          <p className="text-sm text-gray-500 mb-2">Ingresa el número sin espacios, guiones ni símbolos (+, -). Solo dígitos.</p>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
          {newBook.image && <img src={newBook.image} alt="Vista previa" className="h-32 w-auto rounded mb-2" />}
          <button onClick={handleAddBook} className="bg-blue-600 text-white px-4 py-2 rounded w-full">Agregar libro</button>
        </div>

        <input
          type="text"
          placeholder="Buscar libro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-6 border rounded"
        />

        <div className="grid gap-4">
          {filteredBooks.map((b) => (
            <div key={b.id} className="bg-white p-4 rounded-2xl shadow flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                {b.image && <img src={b.image} alt={b.title} className="h-24 w-20 object-cover rounded" />}
                <div>
                  <h2 className="text-lg font-semibold">{b.title}</h2>
                  <p className="text-gray-600">{b.author}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <a
                  href={`https://wa.me/${b.contact}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-3 py-2 rounded"
                >
                  Contactar
                </a>
                <button
                  onClick={() => handleDeleteBook(b.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {filteredBooks.length === 0 && <p className="text-center text-gray-500">No hay libros coincidentes.</p>}
        </div>
      </div>
    </div>
  );
}