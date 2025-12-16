export const route = process.env.NEXT_PUBLIC_API_URL;
export const mailingApi = route + 'email/send';
export const sessionApi = route + 'session';
export const getTokenApi = route + 'session/get_token';

//  API Studio endpoints
export const ApiStudio = process.env.NEXT_PUBLIC_APISTUDIO;
export const apiFunctionalities = ApiStudio + 'functionalities';
export const rolesApi = ApiStudio + 'roles';
export const positionsApi = ApiStudio + 'positions';
export const usersApi = ApiStudio + 'users';
export const teamsApi = ApiStudio + 'teams';
export const functionalitiesApi = ApiStudio + 'functionalities';
export const secureUserGenerateOtp = ApiStudio + 'users/2fa/generate';
export const verifyUserOtp = usersApi + '/2fa/verify';
export const logsApi = ApiStudio + 'auditlogs';
export const countriesApi = ApiStudio + 'cities';
export const documentsApi = ApiStudio + 'documents';
export const companiesApi = ApiStudio + 'company';
export const brandsApi = ApiStudio + 'brands';
export const keywordResearchApi = ApiStudio + 'keywordrequests';
export const suggestWordsApi = keywordResearchApi + '/suggest/ai';
export const brandsSuggestApi = suggestWordsApi + '/brands';
export const googleSearchApi = keywordResearchApi + '/google/search';
export const downloadExcelApi = keywordResearchApi + '/export/excel';
export const downloadExcelUrlApi = keywordResearchApi + '/export/organic/urls';
export const forceEndApi = keywordResearchApi + '/force/end';
export const executeFindUrls = keywordResearchApi + '/google/search/findurls';



export const mailerBaseApi = ApiStudio + '/mailer-config';
export const mailerDomainsApi = ApiStudio + mailerBaseApi + '/domains'; 
