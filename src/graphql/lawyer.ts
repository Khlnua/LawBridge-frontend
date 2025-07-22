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
