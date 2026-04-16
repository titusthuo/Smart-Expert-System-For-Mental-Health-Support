import * as Apollo from '@apollo/client';
import { gql } from '@apollo/client';
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
  DateTime: { input: any; output: any; }
  GenericScalar: { input: any; output: any; }
  JSONString: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AiChatMessageType = {
  __typename?: 'AIChatMessageType';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** True if message is from the user, False if from AI */
  isFromUser: Scalars['Boolean']['output'];
  text: Scalars['String']['output'];
  user: UserType;
};

export type CoordsType = {
  __typename?: 'CoordsType';
  lat?: Maybe<Scalars['Float']['output']>;
  lng?: Maybe<Scalars['Float']['output']>;
};

export type ForgotPassword = {
  __typename?: 'ForgotPassword';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ForgotPasswordRest = {
  __typename?: 'ForgotPasswordRest';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type GetSecurityQuestion = {
  __typename?: 'GetSecurityQuestion';
  error?: Maybe<Scalars['String']['output']>;
  question?: Maybe<Scalars['String']['output']>;
  questionKey?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  forgotPassword?: Maybe<ForgotPassword>;
  forgotPasswordRest?: Maybe<ForgotPasswordRest>;
  getSecurityQuestion?: Maybe<GetSecurityQuestion>;
  refreshToken?: Maybe<Refresh>;
  removeProfilePicture?: Maybe<RemoveProfilePicture>;
  resetPassword?: Maybe<ResetPassword>;
  resetPasswordRest?: Maybe<ResetPasswordRest>;
  resetPasswordWithOtp?: Maybe<ResetPasswordWithOtp>;
  sendAiChatMessage?: Maybe<SendAiChatMessage>;
  setupSecurityQuestion?: Maybe<SetupSecurityQuestion>;
  signIn?: Maybe<SignIn>;
  signUp?: Maybe<SignUp>;
  /** Obtain JSON Web Token mutation */
  tokenAuth?: Maybe<ObtainJsonWebToken>;
  updateProfile?: Maybe<UpdateProfile>;
  uploadProfilePicture?: Maybe<UploadProfilePicture>;
  verifySecurityAnswer?: Maybe<VerifySecurityAnswer>;
  verifyToken?: Maybe<Verify>;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationForgotPasswordRestArgs = {
  email: Scalars['String']['input'];
};


export type MutationGetSecurityQuestionArgs = {
  username: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationResetPasswordRestArgs = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationResetPasswordWithOtpArgs = {
  newPassword: Scalars['String']['input'];
  otp: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationSendAiChatMessageArgs = {
  isFromUser?: InputMaybe<Scalars['Boolean']['input']>;
  text: Scalars['String']['input'];
};


export type MutationSetupSecurityQuestionArgs = {
  answer: Scalars['String']['input'];
  question: Scalars['String']['input'];
};


export type MutationSignInArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  country: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationTokenAuthArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateProfileArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUploadProfilePictureArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationVerifySecurityAnswerArgs = {
  answer: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationVerifyTokenArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};

/** Obtain JSON Web Token mutation */
export type ObtainJsonWebToken = {
  __typename?: 'ObtainJSONWebToken';
  payload: Scalars['GenericScalar']['output'];
  refreshExpiresIn: Scalars['Int']['output'];
  token: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  aiChatMessages?: Maybe<Array<Maybe<AiChatMessageType>>>;
  hello?: Maybe<Scalars['String']['output']>;
  me?: Maybe<UserType>;
  therapist?: Maybe<TherapistType>;
  therapists?: Maybe<Array<Maybe<TherapistType>>>;
};


export type QueryTherapistArgs = {
  id: Scalars['Int']['input'];
};

export type Refresh = {
  __typename?: 'Refresh';
  payload: Scalars['GenericScalar']['output'];
  refreshExpiresIn: Scalars['Int']['output'];
  token: Scalars['String']['output'];
};

export type RemoveProfilePicture = {
  __typename?: 'RemoveProfilePicture';
  error?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  user?: Maybe<UserType>;
};

export type ResetPassword = {
  __typename?: 'ResetPassword';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResetPasswordRest = {
  __typename?: 'ResetPasswordRest';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResetPasswordWithOtp = {
  __typename?: 'ResetPasswordWithOTP';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type SendAiChatMessage = {
  __typename?: 'SendAIChatMessage';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<AiChatMessageType>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type SetupSecurityQuestion = {
  __typename?: 'SetupSecurityQuestion';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type SignIn = {
  __typename?: 'SignIn';
  error?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
};

export type SignUp = {
  __typename?: 'SignUp';
  error?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
};

export type TherapistReviewType = {
  __typename?: 'TherapistReviewType';
  author: Scalars['String']['output'];
  comment: Scalars['String']['output'];
  date: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
};

export type TherapistType = {
  __typename?: 'TherapistType';
  availability?: Maybe<Scalars['String']['output']>;
  bio: Scalars['String']['output'];
  coords?: Maybe<CoordsType>;
  county?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  experience: Scalars['String']['output'];
  fullBio?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  licenseNumber?: Maybe<Scalars['String']['output']>;
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  photoUrl?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Int']['output']>;
  qualifications: Scalars['JSONString']['output'];
  rating?: Maybe<Scalars['Float']['output']>;
  reviews?: Maybe<Scalars['Int']['output']>;
  reviewsList?: Maybe<Array<Maybe<TherapistReviewType>>>;
  specialization?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  town: Scalars['String']['output'];
  whatsapp?: Maybe<Scalars['String']['output']>;
};

export type UpdateProfile = {
  __typename?: 'UpdateProfile';
  error?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  user?: Maybe<UserType>;
};

export type UploadProfilePicture = {
  __typename?: 'UploadProfilePicture';
  error?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  user?: Maybe<UserType>;
};

export type UserType = {
  __typename?: 'UserType';
  country?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  profilePictureUrl?: Maybe<Scalars['String']['output']>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['output'];
};

export type Verify = {
  __typename?: 'Verify';
  payload: Scalars['GenericScalar']['output'];
};

export type VerifySecurityAnswer = {
  __typename?: 'VerifySecurityAnswer';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  otp?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type SendAiChatMessageMutationVariables = Exact<{
  text: Scalars['String']['input'];
  isFromUser?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type SendAiChatMessageMutation = { __typename?: 'Mutation', sendAiChatMessage?: { __typename?: 'SendAIChatMessage', success?: boolean | null, error?: string | null, message?: { __typename?: 'AIChatMessageType', id: string, text: string, isFromUser: boolean, createdAt: any } | null } | null };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword?: { __typename?: 'ForgotPassword', success?: boolean | null, message?: string | null, error?: string | null } | null };

export type ForgotPasswordRestMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ForgotPasswordRestMutation = { __typename?: 'Mutation', forgotPasswordRest?: { __typename?: 'ForgotPasswordRest', success?: boolean | null, message?: string | null, error?: string | null } | null };

export type GetSecurityQuestionMutationVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type GetSecurityQuestionMutation = { __typename?: 'Mutation', getSecurityQuestion?: { __typename?: 'GetSecurityQuestion', success?: boolean | null, error?: string | null, question?: string | null, questionKey?: string | null } | null };

export type RemoveProfilePictureMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveProfilePictureMutation = { __typename?: 'Mutation', removeProfilePicture?: { __typename?: 'RemoveProfilePicture', success?: boolean | null, error?: string | null, user?: { __typename?: 'UserType', id: string, username: string, email?: string | null, name?: string | null, phone?: string | null, country?: string | null, profilePictureUrl?: string | null } | null } | null };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword?: { __typename?: 'ResetPassword', success?: boolean | null, message?: string | null, error?: string | null } | null };

export type ResetPasswordRestMutationVariables = Exact<{
  token: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type ResetPasswordRestMutation = { __typename?: 'Mutation', resetPasswordRest?: { __typename?: 'ResetPasswordRest', success?: boolean | null, message?: string | null, error?: string | null } | null };

export type ResetPasswordWithOtpMutationVariables = Exact<{
  username: Scalars['String']['input'];
  otp: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ResetPasswordWithOtpMutation = { __typename?: 'Mutation', resetPasswordWithOtp?: { __typename?: 'ResetPasswordWithOTP', success?: boolean | null, error?: string | null, message?: string | null } | null };

export type SetupSecurityQuestionMutationVariables = Exact<{
  question: Scalars['String']['input'];
  answer: Scalars['String']['input'];
}>;


export type SetupSecurityQuestionMutation = { __typename?: 'Mutation', setupSecurityQuestion?: { __typename?: 'SetupSecurityQuestion', success?: boolean | null, error?: string | null, message?: string | null } | null };

export type SignInMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn?: { __typename?: 'SignIn', success?: boolean | null, error?: string | null, token?: string | null, user?: { __typename?: 'UserType', id: string, username: string, email?: string | null, name?: string | null, phone?: string | null, country?: string | null, profilePictureUrl?: string | null } | null } | null };

export type SignUpMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  username: Scalars['String']['input'];
  email: Scalars['String']['input'];
  country: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: { __typename?: 'SignUp', success?: boolean | null, error?: string | null, token?: string | null, user?: { __typename?: 'UserType', id: string, username: string, email?: string | null, name?: string | null, phone?: string | null, country?: string | null, profilePictureUrl?: string | null } | null } | null };

export type UpdateProfileMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile?: { __typename?: 'UpdateProfile', success?: boolean | null, error?: string | null, user?: { __typename?: 'UserType', id: string, username: string, email?: string | null, name?: string | null, phone?: string | null, country?: string | null } | null } | null };

export type UploadProfilePictureMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
}>;


export type UploadProfilePictureMutation = { __typename?: 'Mutation', uploadProfilePicture?: { __typename?: 'UploadProfilePicture', success?: boolean | null, error?: string | null, user?: { __typename?: 'UserType', id: string, username: string, email?: string | null, name?: string | null, phone?: string | null, country?: string | null, profilePictureUrl?: string | null } | null } | null };

export type VerifySecurityAnswerMutationVariables = Exact<{
  username: Scalars['String']['input'];
  answer: Scalars['String']['input'];
}>;


export type VerifySecurityAnswerMutation = { __typename?: 'Mutation', verifySecurityAnswer?: { __typename?: 'VerifySecurityAnswer', success?: boolean | null, error?: string | null, message?: string | null, otp?: string | null } | null };

export type GetAiChatMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAiChatMessagesQuery = { __typename?: 'Query', aiChatMessages?: Array<{ __typename?: 'AIChatMessageType', id: string, text: string, isFromUser: boolean, createdAt: any } | null> | null };

export type TherapistQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type TherapistQuery = { __typename?: 'Query', therapist?: { __typename?: 'TherapistType', id: string, name: string, photoUrl?: string | null, location: string, county?: string | null, town: string, phone: string, whatsapp?: string | null, email?: string | null, specialization?: Array<string | null> | null, bio: string, fullBio?: string | null, qualifications: any, experience: string, licenseNumber?: string | null, price?: number | null, availability?: string | null, coords?: { __typename?: 'CoordsType', lat?: number | null, lng?: number | null } | null } | null };

export type TherapistsQueryVariables = Exact<{ [key: string]: never; }>;


export type TherapistsQuery = { __typename?: 'Query', therapists?: Array<{ __typename?: 'TherapistType', id: string, name: string, photoUrl?: string | null, location: string, county?: string | null, town: string, phone: string, whatsapp?: string | null, email?: string | null, specialization?: Array<string | null> | null, bio: string, licenseNumber?: string | null, price?: number | null, availability?: string | null, coords?: { __typename?: 'CoordsType', lat?: number | null, lng?: number | null } | null } | null> | null };


export const SendAiChatMessageDocument = gql`
    mutation SendAiChatMessage($text: String!, $isFromUser: Boolean = true) {
  sendAiChatMessage(text: $text, isFromUser: $isFromUser) {
    message {
      id
      text
      isFromUser
      createdAt
    }
    success
    error
  }
}
    `;
export type SendAiChatMessageMutationFn = Apollo.MutationFunction<SendAiChatMessageMutation, SendAiChatMessageMutationVariables>;

/**
 * __useSendAiChatMessageMutation__
 *
 * To run a mutation, you first call `useSendAiChatMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendAiChatMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendAiChatMessageMutation, { data, loading, error }] = useSendAiChatMessageMutation({
 *   variables: {
 *      text: // value for 'text'
 *      isFromUser: // value for 'isFromUser'
 *   },
 * });
 */
export function useSendAiChatMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendAiChatMessageMutation, SendAiChatMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendAiChatMessageMutation, SendAiChatMessageMutationVariables>(SendAiChatMessageDocument, options);
      }
export type SendAiChatMessageMutationHookResult = ReturnType<typeof useSendAiChatMessageMutation>;
export type SendAiChatMessageMutationResult = Apollo.MutationResult<SendAiChatMessageMutation>;
export type SendAiChatMessageMutationOptions = Apollo.BaseMutationOptions<SendAiChatMessageMutation, SendAiChatMessageMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    success
    message
    error
  }
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const ForgotPasswordRestDocument = gql`
    mutation ForgotPasswordRest($email: String!) {
  forgotPasswordRest(email: $email) {
    success
    message
    error
  }
}
    `;
export type ForgotPasswordRestMutationFn = Apollo.MutationFunction<ForgotPasswordRestMutation, ForgotPasswordRestMutationVariables>;

/**
 * __useForgotPasswordRestMutation__
 *
 * To run a mutation, you first call `useForgotPasswordRestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordRestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordRestMutation, { data, loading, error }] = useForgotPasswordRestMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordRestMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordRestMutation, ForgotPasswordRestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordRestMutation, ForgotPasswordRestMutationVariables>(ForgotPasswordRestDocument, options);
      }
export type ForgotPasswordRestMutationHookResult = ReturnType<typeof useForgotPasswordRestMutation>;
export type ForgotPasswordRestMutationResult = Apollo.MutationResult<ForgotPasswordRestMutation>;
export type ForgotPasswordRestMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordRestMutation, ForgotPasswordRestMutationVariables>;
export const GetSecurityQuestionDocument = gql`
    mutation GetSecurityQuestion($username: String!) {
  getSecurityQuestion(username: $username) {
    success
    error
    question
    questionKey
  }
}
    `;
export type GetSecurityQuestionMutationFn = Apollo.MutationFunction<GetSecurityQuestionMutation, GetSecurityQuestionMutationVariables>;

/**
 * __useGetSecurityQuestionMutation__
 *
 * To run a mutation, you first call `useGetSecurityQuestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetSecurityQuestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getSecurityQuestionMutation, { data, loading, error }] = useGetSecurityQuestionMutation({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetSecurityQuestionMutation(baseOptions?: Apollo.MutationHookOptions<GetSecurityQuestionMutation, GetSecurityQuestionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetSecurityQuestionMutation, GetSecurityQuestionMutationVariables>(GetSecurityQuestionDocument, options);
      }
export type GetSecurityQuestionMutationHookResult = ReturnType<typeof useGetSecurityQuestionMutation>;
export type GetSecurityQuestionMutationResult = Apollo.MutationResult<GetSecurityQuestionMutation>;
export type GetSecurityQuestionMutationOptions = Apollo.BaseMutationOptions<GetSecurityQuestionMutation, GetSecurityQuestionMutationVariables>;
export const RemoveProfilePictureDocument = gql`
    mutation RemoveProfilePicture {
  removeProfilePicture {
    success
    error
    user {
      id
      username
      email
      name
      phone
      country
      profilePictureUrl
    }
  }
}
    `;
export type RemoveProfilePictureMutationFn = Apollo.MutationFunction<RemoveProfilePictureMutation, RemoveProfilePictureMutationVariables>;

/**
 * __useRemoveProfilePictureMutation__
 *
 * To run a mutation, you first call `useRemoveProfilePictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveProfilePictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeProfilePictureMutation, { data, loading, error }] = useRemoveProfilePictureMutation({
 *   variables: {
 *   },
 * });
 */
export function useRemoveProfilePictureMutation(baseOptions?: Apollo.MutationHookOptions<RemoveProfilePictureMutation, RemoveProfilePictureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveProfilePictureMutation, RemoveProfilePictureMutationVariables>(RemoveProfilePictureDocument, options);
      }
export type RemoveProfilePictureMutationHookResult = ReturnType<typeof useRemoveProfilePictureMutation>;
export type RemoveProfilePictureMutationResult = Apollo.MutationResult<RemoveProfilePictureMutation>;
export type RemoveProfilePictureMutationOptions = Apollo.BaseMutationOptions<RemoveProfilePictureMutation, RemoveProfilePictureMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String!, $newPassword: String!) {
  resetPassword(token: $token, newPassword: $newPassword) {
    success
    message
    error
  }
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const ResetPasswordRestDocument = gql`
    mutation ResetPasswordRest($token: String!, $password: String!) {
  resetPasswordRest(token: $token, password: $password) {
    success
    message
    error
  }
}
    `;
export type ResetPasswordRestMutationFn = Apollo.MutationFunction<ResetPasswordRestMutation, ResetPasswordRestMutationVariables>;

/**
 * __useResetPasswordRestMutation__
 *
 * To run a mutation, you first call `useResetPasswordRestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordRestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordRestMutation, { data, loading, error }] = useResetPasswordRestMutation({
 *   variables: {
 *      token: // value for 'token'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useResetPasswordRestMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordRestMutation, ResetPasswordRestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordRestMutation, ResetPasswordRestMutationVariables>(ResetPasswordRestDocument, options);
      }
export type ResetPasswordRestMutationHookResult = ReturnType<typeof useResetPasswordRestMutation>;
export type ResetPasswordRestMutationResult = Apollo.MutationResult<ResetPasswordRestMutation>;
export type ResetPasswordRestMutationOptions = Apollo.BaseMutationOptions<ResetPasswordRestMutation, ResetPasswordRestMutationVariables>;
export const ResetPasswordWithOtpDocument = gql`
    mutation ResetPasswordWithOtp($username: String!, $otp: String!, $newPassword: String!) {
  resetPasswordWithOtp(username: $username, otp: $otp, newPassword: $newPassword) {
    success
    error
    message
  }
}
    `;
export type ResetPasswordWithOtpMutationFn = Apollo.MutationFunction<ResetPasswordWithOtpMutation, ResetPasswordWithOtpMutationVariables>;

/**
 * __useResetPasswordWithOtpMutation__
 *
 * To run a mutation, you first call `useResetPasswordWithOtpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordWithOtpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordWithOtpMutation, { data, loading, error }] = useResetPasswordWithOtpMutation({
 *   variables: {
 *      username: // value for 'username'
 *      otp: // value for 'otp'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useResetPasswordWithOtpMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordWithOtpMutation, ResetPasswordWithOtpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordWithOtpMutation, ResetPasswordWithOtpMutationVariables>(ResetPasswordWithOtpDocument, options);
      }
export type ResetPasswordWithOtpMutationHookResult = ReturnType<typeof useResetPasswordWithOtpMutation>;
export type ResetPasswordWithOtpMutationResult = Apollo.MutationResult<ResetPasswordWithOtpMutation>;
export type ResetPasswordWithOtpMutationOptions = Apollo.BaseMutationOptions<ResetPasswordWithOtpMutation, ResetPasswordWithOtpMutationVariables>;
export const SetupSecurityQuestionDocument = gql`
    mutation SetupSecurityQuestion($question: String!, $answer: String!) {
  setupSecurityQuestion(question: $question, answer: $answer) {
    success
    error
    message
  }
}
    `;
export type SetupSecurityQuestionMutationFn = Apollo.MutationFunction<SetupSecurityQuestionMutation, SetupSecurityQuestionMutationVariables>;

/**
 * __useSetupSecurityQuestionMutation__
 *
 * To run a mutation, you first call `useSetupSecurityQuestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetupSecurityQuestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setupSecurityQuestionMutation, { data, loading, error }] = useSetupSecurityQuestionMutation({
 *   variables: {
 *      question: // value for 'question'
 *      answer: // value for 'answer'
 *   },
 * });
 */
export function useSetupSecurityQuestionMutation(baseOptions?: Apollo.MutationHookOptions<SetupSecurityQuestionMutation, SetupSecurityQuestionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetupSecurityQuestionMutation, SetupSecurityQuestionMutationVariables>(SetupSecurityQuestionDocument, options);
      }
export type SetupSecurityQuestionMutationHookResult = ReturnType<typeof useSetupSecurityQuestionMutation>;
export type SetupSecurityQuestionMutationResult = Apollo.MutationResult<SetupSecurityQuestionMutation>;
export type SetupSecurityQuestionMutationOptions = Apollo.BaseMutationOptions<SetupSecurityQuestionMutation, SetupSecurityQuestionMutationVariables>;
export const SignInDocument = gql`
    mutation SignIn($username: String!, $password: String!) {
  signIn(username: $username, password: $password) {
    success
    error
    token
    user {
      id
      username
      email
      name
      phone
      country
      profilePictureUrl
    }
  }
}
    `;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, options);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = gql`
    mutation SignUp($firstName: String!, $lastName: String!, $username: String!, $email: String!, $country: String!, $password: String!) {
  signUp(
    firstName: $firstName
    lastName: $lastName
    username: $username
    email: $email
    country: $country
    password: $password
  ) {
    success
    error
    token
    user {
      id
      username
      email
      name
      phone
      country
      profilePictureUrl
    }
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      country: // value for 'country'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($name: String, $email: String, $phone: String) {
  updateProfile(name: $name, email: $email, phone: $phone) {
    success
    error
    user {
      id
      username
      email
      name
      phone
      country
    }
  }
}
    `;
export type UpdateProfileMutationFn = Apollo.MutationFunction<UpdateProfileMutation, UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      phone: // value for 'phone'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = Apollo.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const UploadProfilePictureDocument = gql`
    mutation UploadProfilePicture($file: Upload!) {
  uploadProfilePicture(file: $file) {
    success
    error
    user {
      id
      username
      email
      name
      phone
      country
      profilePictureUrl
    }
  }
}
    `;
export type UploadProfilePictureMutationFn = Apollo.MutationFunction<UploadProfilePictureMutation, UploadProfilePictureMutationVariables>;

/**
 * __useUploadProfilePictureMutation__
 *
 * To run a mutation, you first call `useUploadProfilePictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadProfilePictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadProfilePictureMutation, { data, loading, error }] = useUploadProfilePictureMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadProfilePictureMutation(baseOptions?: Apollo.MutationHookOptions<UploadProfilePictureMutation, UploadProfilePictureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadProfilePictureMutation, UploadProfilePictureMutationVariables>(UploadProfilePictureDocument, options);
      }
export type UploadProfilePictureMutationHookResult = ReturnType<typeof useUploadProfilePictureMutation>;
export type UploadProfilePictureMutationResult = Apollo.MutationResult<UploadProfilePictureMutation>;
export type UploadProfilePictureMutationOptions = Apollo.BaseMutationOptions<UploadProfilePictureMutation, UploadProfilePictureMutationVariables>;
export const VerifySecurityAnswerDocument = gql`
    mutation VerifySecurityAnswer($username: String!, $answer: String!) {
  verifySecurityAnswer(username: $username, answer: $answer) {
    success
    error
    message
    otp
  }
}
    `;
export type VerifySecurityAnswerMutationFn = Apollo.MutationFunction<VerifySecurityAnswerMutation, VerifySecurityAnswerMutationVariables>;

/**
 * __useVerifySecurityAnswerMutation__
 *
 * To run a mutation, you first call `useVerifySecurityAnswerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifySecurityAnswerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifySecurityAnswerMutation, { data, loading, error }] = useVerifySecurityAnswerMutation({
 *   variables: {
 *      username: // value for 'username'
 *      answer: // value for 'answer'
 *   },
 * });
 */
export function useVerifySecurityAnswerMutation(baseOptions?: Apollo.MutationHookOptions<VerifySecurityAnswerMutation, VerifySecurityAnswerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifySecurityAnswerMutation, VerifySecurityAnswerMutationVariables>(VerifySecurityAnswerDocument, options);
      }
export type VerifySecurityAnswerMutationHookResult = ReturnType<typeof useVerifySecurityAnswerMutation>;
export type VerifySecurityAnswerMutationResult = Apollo.MutationResult<VerifySecurityAnswerMutation>;
export type VerifySecurityAnswerMutationOptions = Apollo.BaseMutationOptions<VerifySecurityAnswerMutation, VerifySecurityAnswerMutationVariables>;
export const GetAiChatMessagesDocument = gql`
    query GetAiChatMessages {
  aiChatMessages {
    id
    text
    isFromUser
    createdAt
  }
}
    `;

/**
 * __useGetAiChatMessagesQuery__
 *
 * To run a query within a React component, call `useGetAiChatMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAiChatMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAiChatMessagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAiChatMessagesQuery(baseOptions?: Apollo.QueryHookOptions<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>(GetAiChatMessagesDocument, options);
      }
export function useGetAiChatMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>(GetAiChatMessagesDocument, options);
        }
// @ts-ignore
export function useGetAiChatMessagesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>;
export function useGetAiChatMessagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAiChatMessagesQuery | undefined, GetAiChatMessagesQueryVariables>;
export function useGetAiChatMessagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>(GetAiChatMessagesDocument, options);
        }
export type GetAiChatMessagesQueryHookResult = ReturnType<typeof useGetAiChatMessagesQuery>;
export type GetAiChatMessagesLazyQueryHookResult = ReturnType<typeof useGetAiChatMessagesLazyQuery>;
export type GetAiChatMessagesSuspenseQueryHookResult = ReturnType<typeof useGetAiChatMessagesSuspenseQuery>;
export type GetAiChatMessagesQueryResult = Apollo.QueryResult<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>;
export const TherapistDocument = gql`
    query Therapist($id: Int!) {
  therapist(id: $id) {
    id
    name
    photoUrl
    location
    county
    town
    phone
    whatsapp
    email
    coords {
      lat
      lng
    }
    specialization
    bio
    fullBio
    qualifications
    experience
    licenseNumber
    price
    availability
  }
}
    `;

/**
 * __useTherapistQuery__
 *
 * To run a query within a React component, call `useTherapistQuery` and pass it any options that fit your needs.
 * When your component renders, `useTherapistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTherapistQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTherapistQuery(baseOptions: Apollo.QueryHookOptions<TherapistQuery, TherapistQueryVariables> & ({ variables: TherapistQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TherapistQuery, TherapistQueryVariables>(TherapistDocument, options);
      }
export function useTherapistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TherapistQuery, TherapistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TherapistQuery, TherapistQueryVariables>(TherapistDocument, options);
        }
// @ts-ignore
export function useTherapistSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TherapistQuery, TherapistQueryVariables>): Apollo.UseSuspenseQueryResult<TherapistQuery, TherapistQueryVariables>;
export function useTherapistSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TherapistQuery, TherapistQueryVariables>): Apollo.UseSuspenseQueryResult<TherapistQuery | undefined, TherapistQueryVariables>;
export function useTherapistSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TherapistQuery, TherapistQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TherapistQuery, TherapistQueryVariables>(TherapistDocument, options);
        }
export type TherapistQueryHookResult = ReturnType<typeof useTherapistQuery>;
export type TherapistLazyQueryHookResult = ReturnType<typeof useTherapistLazyQuery>;
export type TherapistSuspenseQueryHookResult = ReturnType<typeof useTherapistSuspenseQuery>;
export type TherapistQueryResult = Apollo.QueryResult<TherapistQuery, TherapistQueryVariables>;
export const TherapistsDocument = gql`
    query Therapists {
  therapists {
    id
    name
    photoUrl
    location
    county
    town
    phone
    whatsapp
    email
    coords {
      lat
      lng
    }
    specialization
    bio
    licenseNumber
    price
    availability
  }
}
    `;

/**
 * __useTherapistsQuery__
 *
 * To run a query within a React component, call `useTherapistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTherapistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTherapistsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTherapistsQuery(baseOptions?: Apollo.QueryHookOptions<TherapistsQuery, TherapistsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TherapistsQuery, TherapistsQueryVariables>(TherapistsDocument, options);
      }
export function useTherapistsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TherapistsQuery, TherapistsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TherapistsQuery, TherapistsQueryVariables>(TherapistsDocument, options);
        }
// @ts-ignore
export function useTherapistsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TherapistsQuery, TherapistsQueryVariables>): Apollo.UseSuspenseQueryResult<TherapistsQuery, TherapistsQueryVariables>;
export function useTherapistsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TherapistsQuery, TherapistsQueryVariables>): Apollo.UseSuspenseQueryResult<TherapistsQuery | undefined, TherapistsQueryVariables>;
export function useTherapistsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TherapistsQuery, TherapistsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TherapistsQuery, TherapistsQueryVariables>(TherapistsDocument, options);
        }
export type TherapistsQueryHookResult = ReturnType<typeof useTherapistsQuery>;
export type TherapistsLazyQueryHookResult = ReturnType<typeof useTherapistsLazyQuery>;
export type TherapistsSuspenseQueryHookResult = ReturnType<typeof useTherapistsSuspenseQuery>;
export type TherapistsQueryResult = Apollo.QueryResult<TherapistsQuery, TherapistsQueryVariables>;