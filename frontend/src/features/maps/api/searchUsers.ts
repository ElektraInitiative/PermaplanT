import { UserDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function searchUsers(searchTerm: string): Promise<UserDto[]> {
  const http = createAPI();
  try {
    const result = await http.get(`/api/users?username=${searchTerm}`);
    return result.data;
  } catch (error) {
    throw error as Error;
  }
}
