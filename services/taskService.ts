import { getDB } from '../db/database';
import { Task } from '../models/Task';

export const insertNote = async (task: Task) => {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO notes (title, description, date, time) 
     VALUES (?, ?, ?, ?)`,
    [
      task.title ?? null,
      task.description ?? null,
      task.date ?? null,
      task.time ?? null
    ]
  );
};

export const fetchNotes = async (): Promise<Task[]> => {
  const db = await getDB();
  const notes = await db.getAllAsync<Task>(`SELECT * FROM tasks ORDER BY createdAt DESC`);
  return notes;
};

export const deleteNote = async (id: number) => {
  const db = await getDB();
  await db.runAsync(`DELETE FROM notes WHERE id = ?`, [id]);
};
