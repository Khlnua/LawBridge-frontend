import { gql } from "@apollo/client";

export const GET_REVIEWS_BY_LAWYER = gql`
  query GetReviewsByLawyer($lawyerId: ID!) {
    getReviewsByLawyer(lawyerId: $lawyerId) {
      id
      clientId
      lawyerId
      rating
      comment
      createdAt
      updatedAt
    }
  }
`;
