export type BatchItemApprovalAction =
  | { type: "QUEUE"; ids: string[] }
  | { type: "MARK_PROCESSING"; id: string }
  | { type: "MARK_SUCCEEDED"; id: string }
  | { type: "MARK_FAILED"; id: string }
  | { type: "RESET" };
