export interface Classroom {
  id: string;
  name: string;
  admins: User[];
  students: User[];
}

export interface CreateClassroomRequest {
  name: string;
}

export interface AddUsersToClassroomRequest {
  userIds: string[];
}

interface User {
  id: string;
  username: string;
  name?: string;
  surname?: string;
}
