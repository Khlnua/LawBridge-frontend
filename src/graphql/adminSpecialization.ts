import { gql } from "@apollo/client";

export const GET_SPECIALIZATION_QUERY = gql`
  query GetAdminSpecializations {
    getAdminSpecializations {
      id
      categoryName
    }
  }
`;
