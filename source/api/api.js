// @flow
import axios from 'axios';
import { sale, realm } from '~/config/common';
import auth from '~/stores/auth';
import type {
  GetKycDataResponse,
  SetKycDataParams,
  SetKycDataResponse,
  SetKycDataResponseError,
} from '~/types/kyc';
import type {
  AuthParams,
  PasswordRecoveryParams,
} from '~/types/auth';
import {
  PaymentParams,
} from './types';

const defaultOptions = {
  get headers() { // auth token can be changed, so we need to recalculate headers before every request
    return {
      'X-REALM': realm,
      'X-AUTH-TOKEN': auth.token,
    };
  },
};
const apiSubDomain = process.env.API === 'development' ? 'dev-api' : 'api';
const baseApiUrl = `https://${apiSubDomain}.daonomic.io/v1`;
const daonomicApi = axios.create({
  baseURL: baseApiUrl,
});

export const getFileUrl = (id: string) => `${baseApiUrl}/files/${id}`;

export default {
  auth: {
    login: ({ email, password }: AuthParams) => daonomicApi.post(
      '/login',
      { username: email, password },
      defaultOptions,
    ),
    register: ({ email }: AuthParams) => daonomicApi.post(
      '/register',
      { email },
      defaultOptions,
    ),
    resetPassword: ({ email }: AuthParams) => daonomicApi.post(
      '/password/change',
      { email },
      defaultOptions,
    ),
    createNewPassword: ({ token, password, confirmationPassword }: PasswordRecoveryParams) => daonomicApi.post(
      `/password/change/${token}`,
      {
        password,
        password2: confirmationPassword,
      },
      defaultOptions,
    ),
  },
  kycData: {
    get: (): Promise<GetKycDataResponse> => daonomicApi.get('/data', defaultOptions),
    set: (data: SetKycDataParams): Promise<SetKycDataResponse | SetKycDataResponseError> => daonomicApi.post('/data', data, defaultOptions),
  },
  getIcoInfo: () => daonomicApi.get(`/sales/${sale}`, defaultOptions),
  getPaymentAddress: ({ saleId, tokenId }: PaymentParams) => daonomicApi.get(`/sales/${saleId}/payment/${tokenId}/address`, defaultOptions),
  getPaymentStatus: ({ saleId, tokenId }: PaymentParams) => daonomicApi.get(`/sales/${saleId}/payment/${tokenId}/status`, defaultOptions),
  getBalance: () => daonomicApi.get(`/sales/${sale}/balance`, defaultOptions),
  files: {
    upload: ({ files, onUploadProgress }: { files: File[], onUploadProgress: (event: ProgressEvent) => void }) => {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append('file[]', file);
      });

      return daonomicApi.post('/files', formData, {
        ...defaultOptions,
        onUploadProgress,
      });
    },
    get: (id: string) => daonomicApi.get(getFileUrl(id), defaultOptions),
  },
};
