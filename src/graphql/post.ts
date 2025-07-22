import { gql } from "@apollo/client";

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      _id
      id
      lawyerId
      title
      content {
        text
        image
        video
        audio
      }
      specialization {
        id
        categoryName
      }
      type
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($postId: ID!, $input: UpdatePostInput!) {
    updatePost(postId: $postId, input: $input) {
      _id
      id
      lawyerId
      title
      content {
        text
        image
        video
        audio
      }
      specialization {
        id
        categoryName
      }
      type
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
