export interface FileUploadDTO {
  file: File,
  password?: string;
}

export interface FileComentDTO {
  data: {
    type: 'comment';
    attributes: {
      text: string;
    }
  }
}

export interface FileAddVoteDTO {
  data: {
    type: 'vote';
    attributes: {
      verdict: 'harmless' | 'malicious';
    }
  }
}
