import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Achievement = {
  __typename?: 'Achievement';
  _id: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  threshold: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type AdminCreateSpecializationInput = {
  categoryName: Scalars['String']['input'];
};

export type AdminSpecialization = {
  __typename?: 'AdminSpecialization';
  categoryName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export enum AllowedMediaEnum {
  Audio = 'AUDIO',
  Image = 'IMAGE',
  Text = 'TEXT',
  Video = 'VIDEO'
}

export type Appointment = {
  __typename?: 'Appointment';
  chatRoomId?: Maybe<Scalars['String']['output']>;
  clientId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  endedAt?: Maybe<Scalars['String']['output']>;
  isFree: Scalars['Boolean']['output'];
  lawyerId: Scalars['String']['output'];
  price?: Maybe<Scalars['Int']['output']>;
  schedule: Scalars['String']['output'];
  specializationId: Scalars['String']['output'];
  status: AppointmentStatus;
};

export enum AppointmentStatus {
  Completed = 'COMPLETED',
  Pending = 'PENDING'
}

export type Availability = {
  __typename?: 'Availability';
  day: DayOfWeek;
  endTime: Scalars['String']['output'];
  lawyerId: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
};

export type ChatHistory = {
  __typename?: 'ChatHistory';
  _id: Scalars['ID']['output'];
  botResponse: Scalars['JSON']['output'];
  createdAt: Scalars['String']['output'];
  sessionId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  userMessage: Scalars['String']['output'];
};

export type ChatHistoryInput = {
  botResponse?: InputMaybe<Scalars['JSON']['input']>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userMessage: Scalars['String']['input'];
};

export type ChatRoom = {
  __typename?: 'ChatRoom';
  _id: Scalars['String']['output'];
  allowedMedia?: Maybe<AllowedMediaEnum>;
  appointmentId: Scalars['String']['output'];
  participants: Array<Scalars['String']['output']>;
};

export type Comment = {
  __typename?: 'Comment';
  _id: Scalars['ID']['output'];
  author: Scalars['String']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  post: Scalars['ID']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type CreateAchievementInput = {
  description: Scalars['String']['input'];
  icon?: InputMaybe<Scalars['String']['input']>;
  threshold: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type CreateAppointmentInput = {
  clientId: Scalars['String']['input'];
  createdAt: Scalars['String']['input'];
  endedAt: Scalars['String']['input'];
  lawyerId: Scalars['String']['input'];
  schedule: Scalars['String']['input'];
};

export type CreateChatRoomInput = {
  allowedMedia?: InputMaybe<AllowedMediaEnum>;
  appointmentId: Scalars['String']['input'];
  participants: Array<Scalars['String']['input']>;
};

export type CreateCommentInput = {
  content: Scalars['String']['input'];
  postId: Scalars['ID']['input'];
};

export type CreateDocumentInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  images: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  type?: InputMaybe<MediaType>;
};

export type CreateLawyerInput = {
  achievements?: InputMaybe<Array<Scalars['ID']['input']>>;
  bio?: InputMaybe<Scalars['String']['input']>;
  document?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  lawyerId: Scalars['ID']['input'];
  licenseNumber: Scalars['String']['input'];
  profilePicture: Scalars['String']['input'];
  rating?: InputMaybe<Scalars['Int']['input']>;
  university?: InputMaybe<Scalars['String']['input']>;
};

export type CreateNotificationInput = {
  content: Scalars['String']['input'];
  recipientId: Scalars['ID']['input'];
  type: NotificationType;
};

export type CreatePostInput = {
  content: PostContentInput;
  specialization: Array<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
};

export type CreateReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  rating: Scalars['Int']['input'];
};

export type CreateSpecializationInput = {
  lawyerId: Scalars['ID']['input'];
  pricePerHour?: InputMaybe<Scalars['Int']['input']>;
  specializationId: Scalars['ID']['input'];
  subscription: Scalars['Boolean']['input'];
};

export enum DayOfWeek {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
}

export type DeleteCommentInput = {
  commentId: Scalars['ID']['input'];
};

export type Document = {
  __typename?: 'Document';
  _id: Scalars['ID']['output'];
  clientId: Scalars['String']['output'];
  content?: Maybe<Scalars['String']['output']>;
  images: Array<Scalars['String']['output']>;
  lawyerId?: Maybe<Scalars['ID']['output']>;
  reviewComment?: Maybe<Scalars['String']['output']>;
  status?: Maybe<ReviewStatus>;
  title: Scalars['String']['output'];
  type?: Maybe<DocumentMediaType>;
};

export enum DocumentMediaType {
  File = 'FILE',
  Image = 'IMAGE',
  Text = 'TEXT'
}

export type Lawyer = {
  __typename?: 'Lawyer';
  _id: Scalars['ID']['output'];
  achievements: Array<Achievement>;
  bio?: Maybe<Scalars['String']['output']>;
  clerkUserId?: Maybe<Scalars['String']['output']>;
  clientId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  document?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  lawyerId: Scalars['ID']['output'];
  licenseNumber: Scalars['String']['output'];
  profilePicture: Scalars['String']['output'];
  rating?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<LawyerRequestStatus>;
  university?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export enum LawyerRequestStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Verified = 'VERIFIED'
}

export type LawyerSpecializationInput = {
  categoryId: Scalars['ID']['input'];
  pricePerHour?: InputMaybe<Scalars['Int']['input']>;
  subscription?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ManageLawyerRequestInput = {
  lawyerId: Scalars['ID']['input'];
  status: LawyerRequestStatus;
};

export type MediaInput = {
  audio?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  video?: InputMaybe<Scalars['String']['input']>;
};

export enum MediaType {
  Audio = 'AUDIO',
  File = 'FILE',
  Image = 'IMAGE',
  Text = 'TEXT',
  Video = 'VIDEO'
}

export type Message = {
  __typename?: 'Message';
  chatRoomId: Scalars['ID']['output'];
  content?: Maybe<Scalars['String']['output']>;
  type: MediaType;
  userId: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  adminCreateSpecialization: AdminSpecialization;
  createAchievement: Achievement;
  createAppointment?: Maybe<Appointment>;
  createChatRoom?: Maybe<Scalars['String']['output']>;
  createChatRoomAfterAppointment: ChatRoom;
  createComment: Comment;
  createDocument: Document;
  createLawyer: Lawyer;
  createMessage?: Maybe<Message>;
  createNotification: Notification;
  createPost: Post;
  createReview: Review;
  createSpecialization: Array<Maybe<Specialization>>;
  deleteAchievement: Scalars['Boolean']['output'];
  deleteComment: Scalars['Boolean']['output'];
  deleteLawyer: Scalars['Boolean']['output'];
  deletePost: Scalars['Boolean']['output'];
  deleteReview: Scalars['Boolean']['output'];
  deleteSpecialization: Scalars['Boolean']['output'];
  manageLawyerRequest: Lawyer;
  markAllNotificationsAsRead: Scalars['Boolean']['output'];
  markNotificationAsRead: Notification;
  reviewDocument: Document;
  saveChatHistory: ChatHistory;
  setAvailability?: Maybe<Availability>;
  updateAchievement: Achievement;
  updateChatRoom: ChatRoom;
  updateComment: Comment;
  updateLawyer: Lawyer;
  updatePost: Post;
  updateReview: Review;
  updateSpecialization: Specialization;
};


export type MutationAdminCreateSpecializationArgs = {
  input: AdminCreateSpecializationInput;
};


export type MutationCreateAchievementArgs = {
  input: CreateAchievementInput;
};


export type MutationCreateAppointmentArgs = {
  input: CreateAppointmentInput;
};


export type MutationCreateChatRoomArgs = {
  appointmentId: Scalars['String']['input'];
};


export type MutationCreateChatRoomAfterAppointmentArgs = {
  input: CreateChatRoomInput;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateDocumentArgs = {
  input: CreateDocumentInput;
};


export type MutationCreateLawyerArgs = {
  input: CreateLawyerInput;
};


export type MutationCreateMessageArgs = {
  chatRoomId: Scalars['ID']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  type: MediaType;
  userId: Scalars['String']['input'];
};


export type MutationCreateNotificationArgs = {
  input: CreateNotificationInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreateReviewArgs = {
  input: CreateReviewInput;
};


export type MutationCreateSpecializationArgs = {
  input?: InputMaybe<SpecializationInput>;
};


export type MutationDeleteAchievementArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCommentArgs = {
  input: DeleteCommentInput;
};


export type MutationDeleteLawyerArgs = {
  lawyerId: Scalars['ID']['input'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationDeleteReviewArgs = {
  reviewId: Scalars['ID']['input'];
};


export type MutationDeleteSpecializationArgs = {
  specializationId: Scalars['ID']['input'];
};


export type MutationManageLawyerRequestArgs = {
  input: ManageLawyerRequestInput;
};


export type MutationMarkNotificationAsReadArgs = {
  notificationId: Scalars['ID']['input'];
};


export type MutationReviewDocumentArgs = {
  input: ReviewDocumentInput;
};


export type MutationSaveChatHistoryArgs = {
  input: ChatHistoryInput;
};


export type MutationSetAvailabilityArgs = {
  day: DayOfWeek;
  endTime: Scalars['String']['input'];
  lawyerId: Scalars['String']['input'];
  startTime: Scalars['String']['input'];
};


export type MutationUpdateAchievementArgs = {
  input: UpdateAchievementInput;
};


export type MutationUpdateChatRoomArgs = {
  input: UpdateChatRoomInput;
};


export type MutationUpdateCommentArgs = {
  input: UpdateCommentInput;
};


export type MutationUpdateLawyerArgs = {
  input: UpdateLawyerInput;
  lawyerId: Scalars['ID']['input'];
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
  postId: Scalars['ID']['input'];
};


export type MutationUpdateReviewArgs = {
  input: UpdateReviewInput;
  reviewId: Scalars['ID']['input'];
};


export type MutationUpdateSpecializationArgs = {
  input: UpdateSpecializationInput;
  specializationId: Scalars['ID']['input'];
};

export type Notification = {
  __typename?: 'Notification';
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  read: Scalars['Boolean']['output'];
  recipientId: Scalars['ID']['output'];
  type: NotificationType;
};

export enum NotificationType {
  AppointmentCreated = 'APPOINTMENT_CREATED',
  AppointmentReminder = 'APPOINTMENT_REMINDER',
  AppointmentStarted = 'APPOINTMENT_STARTED',
  LawyerApproved = 'LAWYER_APPROVED',
  ReviewReceived = 'REVIEW_RECEIVED'
}

export type NotificationsFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  read?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<NotificationType>;
};

export type Post = {
  __typename?: 'Post';
  _id: Scalars['ID']['output'];
  content: PostContent;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  lawyerId: Scalars['ID']['output'];
  specialization: Array<Specialization>;
  title: Scalars['String']['output'];
  type: MediaType;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type PostContent = {
  __typename?: 'PostContent';
  audio?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  video?: Maybe<Scalars['String']['output']>;
};

export type PostContentInput = {
  audio?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  video?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  getAchievements?: Maybe<Array<Maybe<Achievement>>>;
  getAdminSpecializations: Array<AdminSpecialization>;
  getAppointmentById?: Maybe<Appointment>;
  getAppointments?: Maybe<Array<Maybe<Appointment>>>;
  getAppointmentsByLawyer?: Maybe<Array<Maybe<Appointment>>>;
  getAppointmentsByUser?: Maybe<Array<Maybe<Appointment>>>;
  getAvailability?: Maybe<Array<Maybe<Availability>>>;
  getChatHistoryByUser: Array<ChatHistory>;
  getChatRoomById?: Maybe<ChatRoom>;
  getChatRoomsByAppointment: Array<ChatRoom>;
  getCommentsByPost: Array<Comment>;
  getDocumentsByStatus: Array<Document>;
  getDocumentsByUser: Array<Document>;
  getLawyerById?: Maybe<Lawyer>;
  getLawyers: Array<Lawyer>;
  getLawyersByAchievement: Array<Lawyer>;
  getLawyersBySpecialization: Array<Lawyer>;
  getLawyersByStatus: Array<Lawyer>;
  getMessages: Array<Message>;
  getPostById?: Maybe<Post>;
  getPostsByLawyer: Array<Post>;
  getPostsBySpecializationId: Array<Post>;
  getReviewsByLawyer: Array<Review>;
  getReviewsByUser: Array<Review>;
  getSpecializationsByLawyer: Array<Specialization>;
  myNotifications: Array<Notification>;
  notificationCount: Scalars['Int']['output'];
  searchPosts: Array<Post>;
};


export type QueryGetAchievementsArgs = {
  lawyerId: Scalars['ID']['input'];
};


export type QueryGetAppointmentByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetAppointmentsByLawyerArgs = {
  lawyerId: Scalars['String']['input'];
};


export type QueryGetAppointmentsByUserArgs = {
  clientId: Scalars['String']['input'];
};


export type QueryGetAvailabilityArgs = {
  day: DayOfWeek;
  lawyerId: Scalars['String']['input'];
};


export type QueryGetChatHistoryByUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetChatRoomByIdArgs = {
  _id: Scalars['String']['input'];
};


export type QueryGetChatRoomsByAppointmentArgs = {
  appointmentId: Scalars['String']['input'];
};


export type QueryGetCommentsByPostArgs = {
  postId: Scalars['ID']['input'];
};


export type QueryGetDocumentsByStatusArgs = {
  status: ReviewStatus;
};


export type QueryGetDocumentsByUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetLawyerByIdArgs = {
  lawyerId: Scalars['ID']['input'];
};


export type QueryGetLawyersByAchievementArgs = {
  achievementId: Scalars['ID']['input'];
};


export type QueryGetLawyersBySpecializationArgs = {
  specializationId: Scalars['ID']['input'];
};


export type QueryGetLawyersByStatusArgs = {
  status: LawyerRequestStatus;
};


export type QueryGetMessagesArgs = {
  chatRoomId: Scalars['ID']['input'];
};


export type QueryGetPostByIdArgs = {
  postId: Scalars['ID']['input'];
};


export type QueryGetPostsByLawyerArgs = {
  lawyerId: Scalars['String']['input'];
};


export type QueryGetPostsBySpecializationIdArgs = {
  specializationId: Scalars['ID']['input'];
};


export type QueryGetReviewsByLawyerArgs = {
  lawyerId: Scalars['ID']['input'];
};


export type QueryGetReviewsByUserArgs = {
  clientId: Scalars['ID']['input'];
};


export type QueryGetSpecializationsByLawyerArgs = {
  lawyerId: Scalars['ID']['input'];
};


export type QueryMyNotificationsArgs = {
  filter?: InputMaybe<NotificationsFilterInput>;
};


export type QueryNotificationCountArgs = {
  unreadOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QuerySearchPostsArgs = {
  query: Scalars['String']['input'];
};

export type Review = {
  __typename?: 'Review';
  clientId: Scalars['ID']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  lawyerId: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type ReviewDocumentInput = {
  documentId: Scalars['ID']['input'];
  reviewComment?: InputMaybe<Scalars['String']['input']>;
  status: ReviewStatus;
};

export enum ReviewStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Reviewed = 'REVIEWED'
}

export type Specialization = {
  __typename?: 'Specialization';
  _id: Scalars['ID']['output'];
  lawyerId: Scalars['ID']['output'];
  pricePerHour?: Maybe<Scalars['Int']['output']>;
  specializationId: Scalars['ID']['output'];
  subscription: Scalars['Boolean']['output'];
};

export type SpecializationInput = {
  specializations: Array<CreateSpecializationInput>;
};

export type Subscription = {
  __typename?: 'Subscription';
  messageAdded?: Maybe<Message>;
};


export type SubscriptionMessageAddedArgs = {
  chatRoomId: Scalars['ID']['input'];
};

export type UpdateAchievementInput = {
  _id: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  threshold?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateChatRoomInput = {
  _id: Scalars['String']['input'];
  allowedMedia?: InputMaybe<AllowedMediaEnum>;
  appointmentId?: InputMaybe<Scalars['String']['input']>;
  participants?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateCommentInput = {
  commentId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
};

export type UpdateLawyerInput = {
  achievements?: InputMaybe<Array<Scalars['ID']['input']>>;
  bio?: InputMaybe<Scalars['String']['input']>;
  document?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  licenseNumber?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  specialization?: InputMaybe<Array<LawyerSpecializationInput>>;
  university?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePostInput = {
  content?: InputMaybe<PostContentInput>;
  specialization?: InputMaybe<Array<Scalars['ID']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateSpecializationInput = {
  pricePerHour?: InputMaybe<Scalars['Int']['input']>;
  subscription: Scalars['Boolean']['input'];
};

export type CreateAppointmentMutationVariables = Exact<{
  input: CreateAppointmentInput;
}>;


export type CreateAppointmentMutation = { __typename?: 'Mutation', createAppointment?: { __typename?: 'Appointment', lawyerId: string, schedule: string, status: AppointmentStatus, chatRoomId?: string | null } | null };


export const CreateAppointmentDocument = gql`
    mutation CreateAppointment($input: CreateAppointmentInput!) {
  createAppointment(input: $input) {
    lawyerId
    schedule
    status
    chatRoomId
  }
}
    `;
export type CreateAppointmentMutationFn = Apollo.MutationFunction<CreateAppointmentMutation, CreateAppointmentMutationVariables>;

/**
 * __useCreateAppointmentMutation__
 *
 * To run a mutation, you first call `useCreateAppointmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAppointmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAppointmentMutation, { data, loading, error }] = useCreateAppointmentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAppointmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateAppointmentMutation, CreateAppointmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAppointmentMutation, CreateAppointmentMutationVariables>(CreateAppointmentDocument, options);
      }
export type CreateAppointmentMutationHookResult = ReturnType<typeof useCreateAppointmentMutation>;
export type CreateAppointmentMutationResult = Apollo.MutationResult<CreateAppointmentMutation>;
export type CreateAppointmentMutationOptions = Apollo.BaseMutationOptions<CreateAppointmentMutation, CreateAppointmentMutationVariables>;