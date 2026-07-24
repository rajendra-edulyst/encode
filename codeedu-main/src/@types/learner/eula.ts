export interface AcceptanceData {
  eula_accepted: number;
  terms_condition_accepted: number;
  privacy_policy_accepted: number;
}

export interface UpdateAcceptanceResponse {
  status: number;
  message: string;
  data: AcceptanceData;
}
