import { getCharacterById, getRandomCharId } from './character.service.js';
import { login } from './auth.service.js';
import { AppRoutes } from './routes.service.jsx';
import { isCharacterDuplicate } from './character.service.js';

export { getCharacterById, getRandomCharId, login, AppRoutes, isCharacterDuplicate };