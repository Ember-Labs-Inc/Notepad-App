import { getDB } from '../db/database';
import { Schedule } from '../models/Schedule';

export const insertSchedule = async (schedule: Schedule) => {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO schedules (title, description, date, time, completed) 
     VALUES (?, ?, ?, ?, ?)`,
    [
      schedule.title ?? null,
      schedule.description ?? null,
      schedule.date ?? null,
      schedule.time ?? null,
      schedule.completed ?? null
    ]
  );
};

export const fetchSchedules = async (): Promise<Schedule[]> => {
  const db = await getDB();
  const notes = await db.getAllAsync<Schedule>(`SELECT * FROM schedules ORDER BY completed DESC`);
  return notes;
};

export const fetchSchedulesById = async (id: number): Promise<Schedule | null> => {
  const db = await getDB();
  const note = await db.getFirstAsync<Schedule>(
    `SELECT * FROM schedules WHERE id = ?`,
    [id]
  );
  return note;
};

export const deleteSchedule = async (id: number) => {
  const db = await getDB();
  await db.runAsync(`DELETE FROM schedules WHERE id = ?`, [id]);
};


export const updateSchedule = async (schedule: Schedule) => {
  if (!schedule.id) throw new Error('Schedule ID is required for updating.');

  const db = await getDB();
  await db.runAsync(
    `UPDATE schedules 
     SET title = ?, description = ?, date = ?, time = ?, completed = ?
     WHERE id = ?`,
    [
      schedule.title ?? null,
      schedule.description ?? null,
      schedule.date ?? null,
      schedule.time ?? null,
      schedule.completed ?? null,
      schedule.id
    ]
  );
};

