export interface EmailOptions {
    email: string;
    subject: string;
    template: string;
    body: any;
    attachments?: { 
      filename: string;
      path: string;
      contentType: string;
    }[];
}
  