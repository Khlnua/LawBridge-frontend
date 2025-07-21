import { gql } from "@apollo/client";

export const CREATE_SPECIALIZATION_MUTATION = gql`
  mutation CreateSpecialization($input: CreateSpecializationInput!) {
    createSpecialization(input: $input) {
      _id
      lawyerId
      specializationId
      subscription
      pricePerHour
    }
  }
`;