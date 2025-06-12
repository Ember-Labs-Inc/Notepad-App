import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('notepad.db');
    await db.execAsync(`PRAGMA journal_mode = WAL;`);
  }
  return db;
};
