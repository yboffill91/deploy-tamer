export const route = process.env.NEXT_PUBLIC_API_URL;

export const mailingApi = route + 'email';
export const sessionApi = route + 'session';

export const apistudio = process.env.NEXT_PUBLIC_APISTUDIO;

export const apiFunctionalities = apistudio + 'functionalities';
export const rolesApi = apistudio + 'roles';
export const positionsApi = apistudio + 'positions';
export const usersApi = apistudio + 'users';
export const teamsApi = apistudio + 'teams';
export const functionalitiesApi = apistudio + 'functionalities';

export const secureUserGenerateOtp = apistudio + 'users/2fa/generate'
export const verifyUserOtp = usersApi + '/2fa/verify'

export const logsApi = apistudio + 'auditlogs';