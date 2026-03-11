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
  DateTime: { input: any; output: any; }
  Decimal: { input: any; output: any; }
  GenericScalar: { input: any; output: any; }
  JSONString: { input: any; output: any; }
  Time: { input: any; output: any; }
};

export type AiChatMessageType = {
  __typename?: 'AIChatMessageType';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** True if message is from the patient, False if from AI */
  isFromUser: Scalars['Boolean']['output'];
  text: Scalars['String']['output'];
};

export type AppointmentType = {
  __typename?: 'AppointmentType';
  cancellationReason: Scalars['String']['output'];
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  cancelledBy?: Maybe<UserType>;
  cost: Scalars['Decimal']['output'];
  doctor?: Maybe<BookmarkedDoctorType>;
  encounterMode: CoreAppointmentEncounterModeChoices;
  endTime: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  patient: PatientType;
  paymentCompleted: Scalars['Boolean']['output'];
  rastucId: Scalars['String']['output'];
  startTime: Scalars['DateTime']['output'];
  status: CoreAppointmentStatusChoices;
  /** Human readable status */
  statusDisplay?: Maybe<Scalars['String']['output']>;
};

export type AvailableSlotType = {
  __typename?: 'AvailableSlotType';
  doctorId?: Maybe<Scalars['Int']['output']>;
  endTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  isBooked?: Maybe<Scalars['Boolean']['output']>;
  isRecurring?: Maybe<Scalars['Boolean']['output']>;
  startTime?: Maybe<Scalars['DateTime']['output']>;
};

export type BookmarkedDoctorType = {
  __typename?: 'BookmarkedDoctorType';
  appointmentSet: Array<AppointmentType>;
  availabilities: Array<DoctorAvailabilityType>;
  /** Get 30-minute time slots within a date range */
  availableSlots?: Maybe<Array<Maybe<AvailableSlotType>>>;
  bio: Scalars['String']['output'];
  clinicVisitPrice: Scalars['Decimal']['output'];
  country?: Maybe<CountryType>;
  county?: Maybe<CountyType>;
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  homecarePrice: Scalars['Decimal']['output'];
  id: Scalars['ID']['output'];
  insuarance: Array<InsuaranceType>;
  lastName: Scalars['String']['output'];
  primarySpecialty?: Maybe<SpecialtyType>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  profilePictureUrl?: Maybe<Scalars['String']['output']>;
  subSpecialties: Array<SpecialtyType>;
  takesPostpaidPayment: Scalars['Boolean']['output'];
  takesPrepaidPayment: Scalars['Boolean']['output'];
  teleconsultPrice: Scalars['Decimal']['output'];
  title: Scalars['String']['output'];
  user: UserType;
};


export type BookmarkedDoctorTypeAvailableSlotsArgs = {
  endDate?: InputMaybe<Scalars['Date']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
};

export type CoordsType = {
  __typename?: 'CoordsType';
  lat?: Maybe<Scalars['Float']['output']>;
  lng?: Maybe<Scalars['Float']['output']>;
};

/** An enumeration. */
export enum CoreAppointmentEncounterModeChoices {
  /** Clinic Visit */
  Clinic = 'CLINIC',
  /** Homecare */
  Home = 'HOME',
  /** Teleconsult */
  Tele = 'TELE'
}

/** An enumeration. */
export enum CoreAppointmentStatusChoices {
  /** Cancelled */
  Cancelled = 'CANCELLED',
  /** Completed */
  Completed = 'COMPLETED',
  /** Ongoing */
  Ongoing = 'ONGOING',
  /** Upcoming */
  Upcoming = 'UPCOMING'
}

export type CountryType = {
  __typename?: 'CountryType';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CountyType = {
  __typename?: 'CountyType';
  country: CountryType;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type DoctorAvailabilityType = {
  __typename?: 'DoctorAvailabilityType';
  doctor: BookmarkedDoctorType;
  endTime?: Maybe<Scalars['DateTime']['output']>;
  /** End time of day for recurring block (e.g., 17:00:00) */
  endTimeOfDay: Scalars['Time']['output'];
  id: Scalars['ID']['output'];
  /** True if an appointment overlaps this slot */
  isBooked?: Maybe<Scalars['Boolean']['output']>;
  isRecurring: Scalars['Boolean']['output'];
  /** 0=Monday ... 6=Sunday — only used if is_recurring=True */
  recurrenceDayOfWeek?: Maybe<Scalars['Int']['output']>;
  recurrenceEndDate?: Maybe<Scalars['Date']['output']>;
  startTime?: Maybe<Scalars['DateTime']['output']>;
  /** Start time of day for recurring block (e.g., 09:00:00) */
  startTimeOfDay: Scalars['Time']['output'];
};

export type InsuaranceType = {
  __typename?: 'InsuaranceType';
  id: Scalars['ID']['output'];
  insuarance: Array<BookmarkedDoctorType>;
  logo?: Maybe<Scalars['String']['output']>;
  /** Full URL to the insurance logo */
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  refreshToken?: Maybe<Refresh>;
  /** Obtain JSON Web Token mutation */
  tokenAuth?: Maybe<ObtainJsonWebToken>;
  verifyToken?: Maybe<Verify>;
};


export type MutationRefreshTokenArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};


export type MutationTokenAuthArgs = {
  password: Scalars['String']['input'];
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

export type PatientType = {
  __typename?: 'PatientType';
  aiChatMessages: Array<AiChatMessageType>;
  appointments: Array<AppointmentType>;
  country?: Maybe<CountryType>;
  county?: Maybe<CountyType>;
  dateOfBirth?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  gender: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  middleName: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  profilePictureUrl?: Maybe<Scalars['String']['output']>;
  user: UserType;
};

export type Query = {
  __typename?: 'Query';
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

export type SpecialtyType = {
  __typename?: 'SpecialtyType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  primaryDoctors: Array<BookmarkedDoctorType>;
  subspecialtyDoctors: Array<BookmarkedDoctorType>;
  therapists: Array<TherapistType>;
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
  county: Scalars['String']['output'];
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

export type UserType = {
  __typename?: 'UserType';
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  patient?: Maybe<PatientType>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['output'];
};

export type Verify = {
  __typename?: 'Verify';
  payload: Scalars['GenericScalar']['output'];
};

export type TherapistQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type TherapistQuery = { __typename?: 'Query', therapist?: { __typename?: 'TherapistType', id: string, name: string, photoUrl?: string | null, location: string, county: string, town: string, phone: string, whatsapp?: string | null, email?: string | null, specialization?: Array<string | null> | null, bio: string, fullBio?: string | null, qualifications: any, experience: string, licenseNumber?: string | null, rating?: number | null, reviews?: number | null, price?: number | null, availability?: string | null, coords?: { __typename?: 'CoordsType', lat?: number | null, lng?: number | null } | null, reviewsList?: Array<{ __typename?: 'TherapistReviewType', id: string, author: string, rating: number, date: any, comment: string } | null> | null } | null };

export type TherapistsQueryVariables = Exact<{ [key: string]: never; }>;


export type TherapistsQuery = { __typename?: 'Query', therapists?: Array<{ __typename?: 'TherapistType', id: string, name: string, photoUrl?: string | null, location: string, county: string, town: string, phone: string, whatsapp?: string | null, email?: string | null, specialization?: Array<string | null> | null, bio: string, licenseNumber?: string | null, rating?: number | null, reviews?: number | null, price?: number | null, availability?: string | null, coords?: { __typename?: 'CoordsType', lat?: number | null, lng?: number | null } | null } | null> | null };


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
    rating
    reviews
    price
    availability
    reviewsList {
      id
      author
      rating
      date
      comment
    }
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
    rating
    reviews
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