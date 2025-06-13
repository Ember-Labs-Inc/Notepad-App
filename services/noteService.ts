import { getDB } from '../db/database';
import { Note } from '../models/Note';

export const insertNote = async (note: Note) => {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO notes (title, content, imageUri, audioUri, createdAt, updatedAt) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      note.title ?? null,
      note.content ?? null,
      note.imageUri ?? null,
      note.audioUri ?? null,
      note.createdAt ?? null,
      note.updatedAt ?? null
    ]
  );
};

export const fetchNotes = async (): Promise<Note[]> => {
  const db = await getDB();
  const notes = await db.getAllAsync<Note>(`SELECT * FROM notes ORDER BY createdAt DESC`);
  return notes;
};

export const fetchNoteById = async (id: number): Promise<Note | null> => {
  const db = await getDB();
  const note = await db.getFirstAsync<Note>(
    `SELECT * FROM notes WHERE id = ?`,
    [id]
  );
  return note;
};

export const deleteNote = async (id: number) => {
  const db = await getDB();
  await db.runAsync(`DELETE FROM notes WHERE id = ?`, [id]);
};


export const updateNote = async (note: Note) => {
  if (!note.id) throw new Error('Note ID is required for updating.');

  const db = await getDB();
  await db.runAsync(
    `UPDATE notes 
     SET title = ?, content = ?, imageUri = ?, audioUri = ?, updatedAt = ?
     WHERE id = ?`,
    [
      note.title ?? null,
      note.content ?? null,
      note.imageUri ?? null, 
      note.audioUri ?? null,  
      note.updatedAt ?? new Date().toISOString(),
      note.id
    ]
  );
};

