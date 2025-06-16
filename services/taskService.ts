import { getDB } from '../db/database';
import { Task } from '../models/Task';

export const insertTask = async (task: Task) => {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO tasks (title, description, date, time, completed) 
     VALUES (?, ?, ?, ?, ?)`,
    [
      task.title ?? null,
      task.description ?? null,
      task.date ?? null,
      task.time ?? null,
      task.completed ?? null
    ]
  );
};

export const fetchTasks = async (): Promise<Task[]> => {
  const db = await getDB();
  const notes = await db.getAllAsync<Task>(`SELECT * FROM tasks ORDER BY completed DESC`);
  return notes;
};

export const fetchTasksById = async (id: number): Promise<Task | null> => {
  const db = await getDB();
  const note = await db.getFirstAsync<Task>(
    `SELECT * FROM tasks WHERE id = ?`,
    [id]
  );
  return note;
};

export const deleteTask = async (id: number) => {
  const db = await getDB();
  await db.runAsync(`DELETE FROM tasks WHERE id = ?`, [id]);
};


export const updateTask = async (task: Task) => {
  if (!task.id) throw new Error('Task ID is required for updating.');

  const db = await getDB();
  await db.runAsync(
    `UPDATE tasks 
     SET title = ?, description = ?, date = ?, time = ?, completed = ?
     WHERE id = ?`,
    [
      task.title ?? null,
      task.description ?? null,
      task.date ?? null,
      task.time ?? null,
      task.completed ?? null,
      task.id
    ]
  );
};

