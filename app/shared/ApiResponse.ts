export class ApiResponse {
  success: boolean;
  message?: string | undefined;
  data?: any;

  constructor(data?: any, message?: string | undefined) {
    this.success = true;
    this.data = data;
    this.message = message;
  }
}
