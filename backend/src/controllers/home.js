import { testEnvironmentVariable } from '../settings.js';

export const indexPage = (req, res) => res.status(200).json({ message: testEnvironmentVariable });
