import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_API_HOST}/graphql/`, // Your Django GraphQL endpoint
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// GraphQL Query to fetch payment session
export const GET_PAYMENT_SESSION = gql`
  query GetPaymentSession($sessionId: String!) {
    paymentSession(sessionId: $sessionId) {
      sessionId
      kioskId
      cartItems
      subtotal
      discount
      total
      status
      expiresAt
      createdAt
    }
  }
`;

// GraphQL Mutation to update payment status
export const UPDATE_PAYMENT_STATUS = gql`
  mutation UpdatePaymentStatus($sessionId: String!, $status: String!) {
    updatePaymentStatus(sessionId: $sessionId, status: $status) {
      success
      message
      session {
        sessionId
        status
        paidAt
      }
    }
  }
`;
// GraphQL Query to fetch payment status (for polling)
export const GET_PAYMENT_STATUS = gql`
  query GetPaymentStatus($sessionId: String!) {
    paymentSession(sessionId: $sessionId) {
      cartItems
      sessionId
      status
      paidAt
      subtotal
      total
      receiptQrCode
    }
  }
`;
