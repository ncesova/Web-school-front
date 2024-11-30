export interface Classroom {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassroomRequest {
  name: string;
}

export interface AddUsersToClassroomRequest {
  userIds: string[];
}
