export const ORGANIZERS_REQUEST = "/api/organizers";

export const ORGANIZER_NOT_FOUND = "Organizer not found";

export const ORGANIZER_USER_TEST_ROUTE = {
  GET_ORGANIZERS: `${ORGANIZERS_REQUEST}`,
  GET_MY_ORGANIZER: `${ORGANIZERS_REQUEST}/me`,
  GET_ORGANIZER: (id: string) => `${ORGANIZERS_REQUEST}/${id}`,
  CREATE_ORGANIZER: `${ORGANIZERS_REQUEST}`,
  UPDATE_ORGANIZER: (id: string) => `${ORGANIZERS_REQUEST}/${id}`,
  DELETE_ORGANIZER: (id: string) => `${ORGANIZERS_REQUEST}/${id}`,
}

export const ORGANIZER_ADMIN_TEST_ROUTE = {
  VERIFY_ORGANIZER: (id: string) => `${ORGANIZERS_REQUEST}/admin/${id}/verify`,
}
