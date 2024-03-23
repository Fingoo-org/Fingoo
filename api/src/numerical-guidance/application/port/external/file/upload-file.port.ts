export interface UploadFilePort {
  uploadFile(file: Express.Multer.File): Promise<string>;
}
