// Estructura de la Biblia Católica en español
export interface Book {
  id: string;
  name: string;
  abbreviation: string;
  chapters: number;
  testament: 'old' | 'new';
  category: string;
}

export interface Testament {
  id: 'old' | 'new';
  name: string;
  books: Book[];
}

// Libros del Antiguo Testamento (46 libros - versión católica)
const oldTestamentBooks: Book[] = [
  // Pentateuco
  { id: 'genesis', name: 'Génesis', abbreviation: 'Gn', chapters: 50, testament: 'old', category: 'Pentateuco' },
  { id: 'exodo', name: 'Éxodo', abbreviation: 'Ex', chapters: 40, testament: 'old', category: 'Pentateuco' },
  { id: 'levitico', name: 'Levítico', abbreviation: 'Lv', chapters: 27, testament: 'old', category: 'Pentateuco' },
  { id: 'numeros', name: 'Números', abbreviation: 'Nm', chapters: 36, testament: 'old', category: 'Pentateuco' },
  { id: 'deuteronomio', name: 'Deuteronomio', abbreviation: 'Dt', chapters: 34, testament: 'old', category: 'Pentateuco' },
  
  // Históricos
  { id: 'josue', name: 'Josué', abbreviation: 'Jos', chapters: 24, testament: 'old', category: 'Históricos' },
  { id: 'jueces', name: 'Jueces', abbreviation: 'Jc', chapters: 21, testament: 'old', category: 'Históricos' },
  { id: 'rut', name: 'Rut', abbreviation: 'Rt', chapters: 4, testament: 'old', category: 'Históricos' },
  { id: '1samuel', name: '1 Samuel', abbreviation: '1Sm', chapters: 31, testament: 'old', category: 'Históricos' },
  { id: '2samuel', name: '2 Samuel', abbreviation: '2Sm', chapters: 24, testament: 'old', category: 'Históricos' },
  { id: '1reyes', name: '1 Reyes', abbreviation: '1Re', chapters: 22, testament: 'old', category: 'Históricos' },
  { id: '2reyes', name: '2 Reyes', abbreviation: '2Re', chapters: 25, testament: 'old', category: 'Históricos' },
  { id: '1cronicas', name: '1 Crónicas', abbreviation: '1Cr', chapters: 29, testament: 'old', category: 'Históricos' },
  { id: '2cronicas', name: '2 Crónicas', abbreviation: '2Cr', chapters: 36, testament: 'old', category: 'Históricos' },
  { id: 'esdras', name: 'Esdras', abbreviation: 'Esd', chapters: 10, testament: 'old', category: 'Históricos' },
  { id: 'nehemias', name: 'Nehemías', abbreviation: 'Ne', chapters: 13, testament: 'old', category: 'Históricos' },
  { id: 'tobias', name: 'Tobías', abbreviation: 'Tb', chapters: 14, testament: 'old', category: 'Históricos' },
  { id: 'judit', name: 'Judit', abbreviation: 'Jdt', chapters: 16, testament: 'old', category: 'Históricos' },
  { id: 'ester', name: 'Ester', abbreviation: 'Est', chapters: 10, testament: 'old', category: 'Históricos' },
  { id: '1macabeos', name: '1 Macabeos', abbreviation: '1Mac', chapters: 16, testament: 'old', category: 'Históricos' },
  { id: '2macabeos', name: '2 Macabeos', abbreviation: '2Mac', chapters: 15, testament: 'old', category: 'Históricos' },
  
  // Poéticos y Sapienciales
  { id: 'job', name: 'Job', abbreviation: 'Jb', chapters: 42, testament: 'old', category: 'Sapienciales' },
  { id: 'salmos', name: 'Salmos', abbreviation: 'Sal', chapters: 150, testament: 'old', category: 'Sapienciales' },
  { id: 'proverbios', name: 'Proverbios', abbreviation: 'Pr', chapters: 31, testament: 'old', category: 'Sapienciales' },
  { id: 'eclesiastes', name: 'Eclesiastés', abbreviation: 'Ecl', chapters: 12, testament: 'old', category: 'Sapienciales' },
  { id: 'cantar', name: 'Cantar de los Cantares', abbreviation: 'Ct', chapters: 8, testament: 'old', category: 'Sapienciales' },
  { id: 'sabiduria', name: 'Sabiduría', abbreviation: 'Sb', chapters: 19, testament: 'old', category: 'Sapienciales' },
  { id: 'eclesiastico', name: 'Eclesiástico', abbreviation: 'Eclo', chapters: 51, testament: 'old', category: 'Sapienciales' },
  
  // Profetas Mayores
  { id: 'isaias', name: 'Isaías', abbreviation: 'Is', chapters: 66, testament: 'old', category: 'Profetas Mayores' },
  { id: 'jeremias', name: 'Jeremías', abbreviation: 'Jr', chapters: 52, testament: 'old', category: 'Profetas Mayores' },
  { id: 'lamentaciones', name: 'Lamentaciones', abbreviation: 'Lm', chapters: 5, testament: 'old', category: 'Profetas Mayores' },
  { id: 'baruc', name: 'Baruc', abbreviation: 'Ba', chapters: 6, testament: 'old', category: 'Profetas Mayores' },
  { id: 'ezequiel', name: 'Ezequiel', abbreviation: 'Ez', chapters: 48, testament: 'old', category: 'Profetas Mayores' },
  { id: 'daniel', name: 'Daniel', abbreviation: 'Dn', chapters: 14, testament: 'old', category: 'Profetas Mayores' },
  
  // Profetas Menores
  { id: 'oseas', name: 'Oseas', abbreviation: 'Os', chapters: 14, testament: 'old', category: 'Profetas Menores' },
  { id: 'joel', name: 'Joel', abbreviation: 'Jl', chapters: 4, testament: 'old', category: 'Profetas Menores' },
  { id: 'amos', name: 'Amós', abbreviation: 'Am', chapters: 9, testament: 'old', category: 'Profetas Menores' },
  { id: 'abdias', name: 'Abdías', abbreviation: 'Ab', chapters: 1, testament: 'old', category: 'Profetas Menores' },
  { id: 'jonas', name: 'Jonás', abbreviation: 'Jon', chapters: 4, testament: 'old', category: 'Profetas Menores' },
  { id: 'miqueas', name: 'Miqueas', abbreviation: 'Mi', chapters: 7, testament: 'old', category: 'Profetas Menores' },
  { id: 'nahum', name: 'Nahúm', abbreviation: 'Na', chapters: 3, testament: 'old', category: 'Profetas Menores' },
  { id: 'habacuc', name: 'Habacuc', abbreviation: 'Hab', chapters: 3, testament: 'old', category: 'Profetas Menores' },
  { id: 'sofonias', name: 'Sofonías', abbreviation: 'So', chapters: 3, testament: 'old', category: 'Profetas Menores' },
  { id: 'ageo', name: 'Ageo', abbreviation: 'Ag', chapters: 2, testament: 'old', category: 'Profetas Menores' },
  { id: 'zacarias', name: 'Zacarías', abbreviation: 'Za', chapters: 14, testament: 'old', category: 'Profetas Menores' },
  { id: 'malaquias', name: 'Malaquías', abbreviation: 'Ml', chapters: 3, testament: 'old', category: 'Profetas Menores' },
];

// Libros del Nuevo Testamento (27 libros)
const newTestamentBooks: Book[] = [
  // Evangelios
  { id: 'mateo', name: 'Mateo', abbreviation: 'Mt', chapters: 28, testament: 'new', category: 'Evangelios' },
  { id: 'marcos', name: 'Marcos', abbreviation: 'Mc', chapters: 16, testament: 'new', category: 'Evangelios' },
  { id: 'lucas', name: 'Lucas', abbreviation: 'Lc', chapters: 24, testament: 'new', category: 'Evangelios' },
  { id: 'juan', name: 'Juan', abbreviation: 'Jn', chapters: 21, testament: 'new', category: 'Evangelios' },
  
  // Histórico
  { id: 'hechos', name: 'Hechos de los Apóstoles', abbreviation: 'Hch', chapters: 28, testament: 'new', category: 'Histórico' },
  
  // Cartas Paulinas
  { id: 'romanos', name: 'Romanos', abbreviation: 'Rm', chapters: 16, testament: 'new', category: 'Cartas Paulinas' },
  { id: '1corintios', name: '1 Corintios', abbreviation: '1Co', chapters: 16, testament: 'new', category: 'Cartas Paulinas' },
  { id: '2corintios', name: '2 Corintios', abbreviation: '2Co', chapters: 13, testament: 'new', category: 'Cartas Paulinas' },
  { id: 'galatas', name: 'Gálatas', abbreviation: 'Ga', chapters: 6, testament: 'new', category: 'Cartas Paulinas' },
  { id: 'efesios', name: 'Efesios', abbreviation: 'Ef', chapters: 6, testament: 'new', category: 'Cartas Paulinas' },
  { id: 'filipenses', name: 'Filipenses', abbreviation: 'Flp', chapters: 4, testament: 'new', category: 'Cartas Paulinas' },
  { id: 'colosenses', name: 'Colosenses', abbreviation: 'Col', chapters: 4, testament: 'new', category: 'Cartas Paulinas' },
  { id: '1tesalonicenses', name: '1 Tesalonicenses', abbreviation: '1Ts', chapters: 5, testament: 'new', category: 'Cartas Paulinas' },
  { id: '2tesalonicenses', name: '2 Tesalonicenses', abbreviation: '2Ts', chapters: 3, testament: 'new', category: 'Cartas Paulinas' },
  { id: '1timoteo', name: '1 Timoteo', abbreviation: '1Tm', chapters: 6, testament: 'new', category: 'Cartas Paulinas' },
  { id: '2timoteo', name: '2 Timoteo', abbreviation: '2Tm', chapters: 4, testament: 'new', category: 'Cartas Paulinas' },
  { id: 'tito', name: 'Tito', abbreviation: 'Tt', chapters: 3, testament: 'new', category: 'Cartas Paulinas' },
  { id: 'filemon', name: 'Filemón', abbreviation: 'Flm', chapters: 1, testament: 'new', category: 'Cartas Paulinas' },
  
  // Carta a los Hebreos
  { id: 'hebreos', name: 'Hebreos', abbreviation: 'Hb', chapters: 13, testament: 'new', category: 'Cartas Católicas' },
  
  // Cartas Católicas
  { id: 'santiago', name: 'Santiago', abbreviation: 'St', chapters: 5, testament: 'new', category: 'Cartas Católicas' },
  { id: '1pedro', name: '1 Pedro', abbreviation: '1Pe', chapters: 5, testament: 'new', category: 'Cartas Católicas' },
  { id: '2pedro', name: '2 Pedro', abbreviation: '2Pe', chapters: 3, testament: 'new', category: 'Cartas Católicas' },
  { id: '1juan', name: '1 Juan', abbreviation: '1Jn', chapters: 5, testament: 'new', category: 'Cartas Católicas' },
  { id: '2juan', name: '2 Juan', abbreviation: '2Jn', chapters: 1, testament: 'new', category: 'Cartas Católicas' },
  { id: '3juan', name: '3 Juan', abbreviation: '3Jn', chapters: 1, testament: 'new', category: 'Cartas Católicas' },
  { id: 'judas', name: 'Judas', abbreviation: 'Jds', chapters: 1, testament: 'new', category: 'Cartas Católicas' },
  
  // Profético
  { id: 'apocalipsis', name: 'Apocalipsis', abbreviation: 'Ap', chapters: 22, testament: 'new', category: 'Profético' },
];

export const bibleData: Testament[] = [
  {
    id: 'old',
    name: 'Antiguo Testamento',
    books: oldTestamentBooks,
  },
  {
    id: 'new',
    name: 'Nuevo Testamento',
    books: newTestamentBooks,
  },
];

export const allBooks = [...oldTestamentBooks, ...newTestamentBooks];

export function getBookById(id: string): Book | undefined {
  return allBooks.find(book => book.id === id);
}

export function getBooksByTestament(testament: 'old' | 'new'): Book[] {
  return testament === 'old' ? oldTestamentBooks : newTestamentBooks;
}

export function getBooksByCategory(category: string): Book[] {
  return allBooks.filter(book => book.category === category);
}

export function searchBooks(query: string): Book[] {
  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return allBooks.filter(book => {
    const normalizedName = book.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normalizedAbbr = book.abbreviation.toLowerCase();
    return normalizedName.includes(normalizedQuery) || normalizedAbbr.includes(normalizedQuery);
  });
}

// Categorías únicas
export const categories = {
  old: ['Pentateuco', 'Históricos', 'Sapienciales', 'Profetas Mayores', 'Profetas Menores'],
  new: ['Evangelios', 'Histórico', 'Cartas Paulinas', 'Cartas Católicas', 'Profético'],
};
