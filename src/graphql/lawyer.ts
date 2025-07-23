import { gql } from "@apollo/client";

export const CREATE_LAWYER_MUTATION = gql`
  mutation CreateLawyer($input: CreateLawyerInput!) {
    createLawyer(input: $input) {
      bio
      document
      firstName
      lastName
      licenseNumber
      profilePicture
      university
    }
  }
`;

export const GET_ALL_LAWYERS_QUERY = gql`
  query Query {
    getLawyers {
      _id
      lawyerId
      clerkUserId
      clientId
      firstName
      lastName
      email
      licenseNumber
      bio
      university
      achievements {
        _id
        title
        description
        threshold
        icon
      }
      status
      document
      rating
      profilePicture
      createdAt
      updatedAt
    }
  }
`;
