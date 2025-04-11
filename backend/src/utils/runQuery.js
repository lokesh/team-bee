import { createTables, insertIntoTables } from './queryFunctions.js';

(async () => {
  await createTables();
  await insertIntoTables();
})();
